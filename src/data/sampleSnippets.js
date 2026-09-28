export const SAMPLE_SNIPPETS = [
  {
    id: 'fibonacci',
    title: 'Fibonacci (Recursion & Memoization)',
    language: 'Python',
    code: `def fibonacci_memo(n, memo={}):
    # Check if value is already computed
    if n in memo:
        return memo[n]
    # Base cases
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    
    # Recursive step with memoization
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

# Example run
print([fibonacci_memo(i) for i in range(10)])`
  },
  {
    id: 'binary-search',
    title: 'Binary Search Algorithm',
    language: 'JavaScript',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Found target index
    }

    if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return -1; // Not found
}`
  },
  {
    id: 'fetch-api',
    title: 'Async API Fetch with Retry',
    language: 'JavaScript',
    code: `async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return await response.json();
    } catch (error) {
      if (attempt === retries) throw error;
      console.warn(\`Attempt \${attempt} failed. Retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`
  },
  {
    id: 'sql-join',
    title: 'Customer Orders Aggregation',
    language: 'SQL',
    code: `SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS full_name,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS lifetime_value
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.customer_id, c.first_name, c.last_name
HAVING COUNT(o.order_id) >= 3
ORDER BY lifetime_value DESC;`
  },
  {
    id: 'react-hook',
    title: 'Custom React Debounce Hook',
    language: 'TypeScript',
    code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer if value changes before timeout
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}`
  },
  {
    id: 'palindrome',
    title: 'Palindrome Number Checker',
    language: 'Java',
    code: `public class Solution {
    public static boolean isPalindrome(int x) {
        // Negative numbers or numbers ending with 0 (except 0) are not palindromes
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        int reversedHalf = 0;
        while (x > reversedHalf) {
            reversedHalf = (reversedHalf * 10) + (x % 10);
            x /= 10;
        }

        // When length is odd, we can get rid of the middle digit via reversedHalf/10
        return x == reversedHalf || x == reversedHalf / 10;
    }
}`
  }
];
