/**
 * Hardened HTML Tag Stripping Utility
 * 
 * Security: Regex-free, DOM-free, SSR-safe, deterministic, O(n) complexity
 * 
 * This utility uses a state machine parser to strip HTML tags without
 * using regex or DOM APIs, preventing ReDoS attacks and ensuring
 * deterministic execution with bounded CPU time.
 */

type ParseState = 'TEXT' | 'TAG' | 'QUOTE_SINGLE' | 'QUOTE_DOUBLE'

/**
 * Strips HTML tags from input string using a deterministic state machine.
 * 
 * @param input - String that may contain HTML tags
 * @param maxLength - Maximum output length before early exit (DoS prevention)
 * @returns Plain text with all HTML tags removed
 * 
 * @example
 * stripHtmlTags('<p>Hello</p>') // 'Hello'
 * stripHtmlTags('<a title="Click > Here">Link</a>') // 'Link'
 */
export function stripHtmlTags(
  input: string,
  maxLength: number = 200
): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  let state: ParseState = 'TEXT'
  let output = ''
  const inputLength = input.length

  for (let i = 0; i < inputLength; i++) {
    // Circuit breaker: Stop processing if output exceeds maxLength
    if (output.length >= maxLength) {
      break
    }

    const char = input[i]
    const nextChar = i + 1 < inputLength ? input[i + 1] : null

    switch (state) {
      case 'TEXT':
        if (char === '<') {
          // Enter tag state
          state = 'TAG'
        } else {
          // Append character to output
          output += char
        }
        break

      case 'TAG':
        if (char === '>') {
          // Exit tag state, return to text
          state = 'TEXT'
        } else if (char === "'") {
          // Enter single quote state (inside tag attribute)
          state = 'QUOTE_SINGLE'
        } else if (char === '"') {
          // Enter double quote state (inside tag attribute)
          state = 'QUOTE_DOUBLE'
        }
        // Ignore all characters inside tag (not in quotes)
        break

      case 'QUOTE_SINGLE':
        if (char === "'") {
          // Exit single quote, return to tag state
          state = 'TAG'
        }
        // Ignore all characters inside single quotes
        break

      case 'QUOTE_DOUBLE':
        if (char === '"') {
          // Exit double quote, return to tag state
          state = 'TAG'
        }
        // Ignore all characters inside double quotes
        break
    }
  }

  return output
}

