/**
 * Robust Gemini API Service with v1/v1beta support, model discovery, and retry
 */

let cachedWorkingModel = null;
let cachedApiVersion = 'v1';

export function getSavedApiKey() {
  return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveApiKey(key) {
  if (key) {
    localStorage.setItem('gemini_api_key', key.trim());
    cachedWorkingModel = null;
  } else {
    localStorage.removeItem('gemini_api_key');
    cachedWorkingModel = null;
  }
}

/**
 * Discover the exact models available for this API key from Google
 */
async function getAvailableModels(apiKey) {
  const versions = ['v1beta', 'v1'];
  for (const ver of versions) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${apiKey}`);
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || [])
          .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map(m => m.name.replace(/^models\//, ''));
        if (models.length > 0) {
          console.log(`Discovered ${models.length} models on ${ver}:`, models);
          return { version: ver, models };
        }
      }
    } catch (e) {
      console.warn(`Could not list models on ${ver}:`, e);
    }
  }
  return { version: 'v1', models: [] };
}

/**
 * Fast JSON extractor
 */
function extractJSON(text) {
  if (!text) throw new Error('Empty response from AI.');

  // 1. Direct parse
  try {
    return JSON.parse(text.trim());
  } catch {}

  // 2. Fenced code block ```json ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  // 3. Substring between first '{' and last '}'
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonSubstring = text.substring(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(jsonSubstring);
    } catch (e) {
      console.error('Failed to parse extracted JSON:', jsonSubstring);
    }
  }

  throw new Error('AI response could not be parsed into structured format.');
}

/**
 * Sleep helper for retry
 */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Main code explanation function
 */
export async function explainCodeSnippet({ code, language = 'Auto-Detect', tone = 'beginner', apiKey }) {
  const activeKey = (apiKey || getSavedApiKey()).trim();

  if (!activeKey) {
    throw new Error('MISSING_API_KEY');
  }

  const toneGuidelines = {
    beginner: 'Explain in simple, conversational plain English (ELI5). Use clear real-world analogies. Avoid intimidating jargon.',
    intermediate: 'Explain clearly for a junior/mid developer. Focus on practical logic, flow of control, and built-in functions.',
    senior: 'Provide concise technical analysis. Focus on algorithmic efficiency, Big-O complexity, and potential bottlenecks.'
  };

  const systemPrompt = `You are an expert code explainer engine.
Tone: ${toneGuidelines[tone] || toneGuidelines.beginner}
Language: ${language}

Output ONLY a valid JSON object matching this schema (no conversational introduction or markdown outside JSON):
{
  "title": "Short descriptive title of what this code does",
  "language": "Identified language",
  "summary": "2-3 clear sentences in plain English explaining what this code achieves.",
  "steps": [
    {
      "step": 1,
      "title": "Short phase title",
      "explanation": "Brief plain English explanation of this step.",
      "codeHighlight": "optional line of code"
    }
  ],
  "complexity": {
    "time": "e.g. O(n)",
    "space": "e.g. O(1)",
    "analysis": "1 sentence explanation."
  },
  "keyConcepts": ["Concept 1", "Concept 2"],
  "proTips": ["1 actionable tip or edge case note"]
}`;

  const userContent = `\`\`\`${language}\n${code}\n\`\`\``;

  // Step 1: Discover models dynamically if not yet cached
  let candidateConfigs = [];

  if (cachedWorkingModel) {
    candidateConfigs.push({ version: cachedApiVersion, model: cachedWorkingModel });
  }

  // Probe available models from Google
  const { version: discoveredVer, models: discoveredList } = await getAvailableModels(activeKey);

  if (discoveredList.length > 0) {
    // Prioritize flash models
    const flashList = discoveredList.filter(m => m.includes('flash'));
    const others = discoveredList.filter(m => !m.includes('flash'));
    for (const m of [...flashList, ...others]) {
      candidateConfigs.push({ version: discoveredVer, model: m });
    }
  }

  // Always append standard fallback configurations
  candidateConfigs.push(
    { version: 'v1', model: 'gemini-1.5-flash' },
    { version: 'v1beta', model: 'gemini-1.5-flash' },
    { version: 'v1beta', model: 'gemini-2.0-flash' },
    { version: 'v1', model: 'gemini-1.5-pro' },
    { version: 'v1beta', model: 'gemini-1.5-flash-8b' }
  );

  // De-duplicate configs
  const seen = new Set();
  const uniqueConfigs = candidateConfigs.filter(cfg => {
    const key = `${cfg.version}/${cfg.model}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log('Testing model configurations in order:', uniqueConfigs);

  let attemptedErrors = [];

  for (const { version, model } of uniqueConfigs) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Attempt ${attempt}] Trying ${version}/models/${model}...`);
        const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${activeKey}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\n${userContent}` }]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1200
            }
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const rawMessage = errorData.error?.message || `HTTP ${response.status} error`;
          const lowerMsg = rawMessage.toLowerCase();

          // Invalid Key -> Stop immediately
          if (response.status === 400 && (lowerMsg.includes('api key') || lowerMsg.includes('key not valid') || lowerMsg.includes('invalid_argument'))) {
            throw new Error(`Invalid Gemini API Key: ${rawMessage}`);
          }
          if (response.status === 403) {
            throw new Error(`Access Forbidden (403): ${rawMessage}`);
          }

          // If high demand (503) or rate limit (429), wait 1s and retry once
          if (response.status === 503 || response.status === 429 || lowerMsg.includes('high demand') || lowerMsg.includes('overloaded')) {
            if (attempt === 1) {
              console.warn(`[${model}] high demand on attempt 1, retrying in 1.2s...`);
              await sleep(1200);
              continue; // retry attempt 2 for this same model
            }
          }

          attemptedErrors.push(`[${version}/${model}]: ${rawMessage}`);
          break; // break to next model
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          attemptedErrors.push(`[${version}/${model}]: Empty response text`);
          break;
        }

        // Success! Cache working model and version
        cachedWorkingModel = model;
        cachedApiVersion = version;
        console.log(`SUCCESS! Using ${version}/${model}`);
        return extractJSON(rawText);

      } catch (err) {
        if (err.name === 'AbortError') {
          attemptedErrors.push(`[${version}/${model}]: Timed out (12s)`);
          break;
        }
        if (err.message.startsWith('Invalid Gemini API Key') || err.message.startsWith('Access Forbidden')) {
          throw err;
        }
        attemptedErrors.push(`[${version}/${model}]: ${err.message}`);
        break;
      }
    }
  }

  // If all failed, provide clear diagnostic list
  throw new Error(`Gemini connection error. All models were busy or unavailable:\n\n${attemptedErrors.slice(0, 3).join('\n')}`);
}

/**
 * Follow-up question
 */
export async function askFollowUpQuestion({ code, previousExplanation, question, apiKey }) {
  const activeKey = (apiKey || getSavedApiKey()).trim();
  if (!activeKey) throw new Error('MISSING_API_KEY');

  const model = cachedWorkingModel || 'gemini-1.5-flash';
  const version = cachedApiVersion || 'v1';
  const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${activeKey}`;

  const prompt = `User's Code:
\`\`\`
${code}
\`\`\`
Context: ${previousExplanation.summary}
Question: "${question}"

Provide a concise, direct answer in plain English with markdown. Keep it under 150 words.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to get follow-up answer.');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';
}
