# DevPlain - AI Code Explainer Tool

Final Project for **AD-ET 101: Application Development & Emerging Technologies**  
Submitted by: **Miguel Edillor**  
Course & Year: **BSIT - 3**  
Assigned Topic: **Code Explainer Tool**  
Submission Tag: `#ADETFinals2026`  

---

## About The Project

For our final project in AD-ET 101, we were assigned individual topics using the class Wheel of Names. My assigned project is the **Code Explainer Tool**.

The goal of this web app is to help students, beginners, and junior developers understand confusing code snippets. Instead of getting stuck or searching through complicated documentation, you just paste any block of code, choose your experience level, and the app uses the Google Gemini API to break down what the code does in plain, easy-to-understand English step-by-step.

### Why I Built It This Way
When I started learning programming, reading other people's code or complex algorithms (like recursion or asynchronous functions) was always overwhelming. I wanted this app to feel like a real developer tool—clean, distraction-free, and easy to use on both laptop and mobile phones during study sessions.

---

## Key Features

- **Step-by-Step Plain English Breakdown:** Translates code into simple everyday terms and explains the logic step-by-step.
- **3 Explanation Modes:**
  - *Beginner (ELI5):* Simple words and real-world analogies.
  - *Developer:* Focuses on logic flow, variables, and built-in functions.
  - *Deep Dive:* Focuses on Big-O time/space complexity and edge cases.
- **Interactive Follow-Up Chat:** If something in the explanation isn't clear, you can type a follow-up question right below the output and Gemini answers it.
- **Mobile Responsive Design:** On mobile screens, the app switches to a neat tabbed interface (`Code Input` and `Explanation`) so you don't have to scroll endlessly.
- **Sandwich Menu (Drawer):**
  - Project and student details for quick reference during evaluation.
  - Sample snippet presets (Fibonacci, Binary Search, Async Fetch, SQL Join, React Hooks, etc.) for quick one-click testing.
  - Recent explanation history saved in the browser so you don't lose previous work.
  - API Key settings where users can input their own Gemini key.
- **Dark & Light Mode:** Toggleable theme with local storage persistence.
- **Export & Copy:** One-click copy to clipboard and Markdown file download.

---

## Tech Stack

- **Frontend:** React (Vite)
- **Styling:** Tailwind CSS + Lucide React Icons
- **AI Integration:** Google Gemini API (`gemini-2.0-flash` / `gemini-1.5-flash-8b` with automatic fallback handling)
- **Storage:** Browser `localStorage` (for history, theme preference, and custom API key storage)
- **Deployment:** Vercel

---

## How to Run Locally

If you want to clone and run this project on your machine:

### Prerequisites
Make sure you have Node.js installed (v18 or higher recommended).

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/migueledillor-bot/FinalProject_Drake.git
   ```
2. Navigate into the folder:
   ```bash
   cd FinalProject_Drake
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173`.
6. Click **"Set API Key"** in the top header and enter your free Google Gemini API key (you can grab one from Google AI Studio).

---

## Live Demo & Video Submission

- **Live Web App:** *(Paste your Vercel or Netlify live URL here)*
- **Demo Video:** *(Facebook public post link tagged with #ADETFinals2026)*

---

## Project Rubric Compliance

| Rubric Criteria | Weight | Implementation Details |
|---|---|---|
| **Functionality** | 25% | Clean code input, syntax formatting, tab indent handling, history storage, and copy/export options. |
| **AI Integration** | 25% | Real, dynamic integration with Google Gemini API processing custom user code and handling follow-up queries. |
| **UI/UX Design** | 15% | Minimalist developer UI, dark/light mode toggle, mobile-responsive layout, and slide-out sandwich drawer. |
| **Deployment** | 15% | Deployed publicly on Vercel with HTTPS enabled. |
| **Code Quality** | 10% | Modular React components, clear naming conventions, and organized services. |
| **Video Demo** | 10% | 2-4 minute walkthrough showcasing the live deployed link and real AI processing. |
