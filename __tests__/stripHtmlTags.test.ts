/**
 * Unit Tests for stripHtmlTags Utility
 * 
 * Tests cover functional correctness, security edge cases, and performance guarantees.
 */

import { stripHtmlTags } from '@/lib/text/stripHtmlTags'

describe('stripHtmlTags', () => {
  describe('Functional Tests', () => {
    test('should return empty string for empty input', () => {
      expect(stripHtmlTags('')).toBe('')
      expect(stripHtmlTags(null as any)).toBe('')
      expect(stripHtmlTags(undefined as any)).toBe('')
    })

    test('should return plain text unchanged', () => {
      const input = 'Hello world'
      expect(stripHtmlTags(input)).toBe('Hello world')
    })

    test('should strip simple tags', () => {
      const input = '<p>Hello</p>'
      expect(stripHtmlTags(input)).toBe('Hello')
    })

    test('should strip nested tags', () => {
      const input = '<div><p>Hello <strong>world</strong></p></div>'
      expect(stripHtmlTags(input)).toBe('Hello world')
    })

    test('should handle multiple tags', () => {
      const input = '<h1>Title</h1><p>Content</p><span>More</span>'
      expect(stripHtmlTags(input)).toBe('TitleContentMore')
    })

    test('should preserve text between tags', () => {
      const input = 'Before <tag>middle</tag> after'
      expect(stripHtmlTags(input)).toBe('Before middle after')
    })
  })

  describe('Security / Edge Cases', () => {
    test('should handle attributes containing > character', () => {
      const input = '<a title="Click > Here">Link</a>'
      expect(stripHtmlTags(input)).toBe('Link')
    })

    test('should handle mixed quotes in attributes', () => {
      const input = '<p style="font-family: \'Mono > Type\'">Text</p>'
      expect(stripHtmlTags(input)).toBe('Text')
    })

    test('should handle double quotes in attributes', () => {
      const input = '<div class="test" data-value="value">Content</div>'
      expect(stripHtmlTags(input)).toBe('Content')
    })

    test('should handle single quotes in attributes', () => {
      const input = "<img src='image.jpg' alt='test'>Text</img>"
      expect(stripHtmlTags(input)).toBe('Text')
    })

    test('should handle unclosed tags', () => {
      const input = '<p>Hello world'
      expect(stripHtmlTags(input)).toBe('Hello world')
    })

    test('should handle malformed tags', () => {
      const input = '<p>Text</p><div>More'
      expect(stripHtmlTags(input)).toBe('TextMore')
    })

    test('should handle tags with no content', () => {
      const input = '<br/><hr/><img src="test.jpg"/>'
      expect(stripHtmlTags(input)).toBe('')
    })

    test('should handle nested quotes', () => {
      const input = '<a title=\'Say "Hello" to me\'>Link</a>'
      expect(stripHtmlTags(input)).toBe('Link')
    })

    test('should handle escaped quotes', () => {
      const input = '<div data-attr="value &quot;quoted&quot;">Text</div>'
      expect(stripHtmlTags(input)).toBe('Text')
    })

    test('should handle empty tags', () => {
      const input = '<div></div><span></span>Content'
      expect(stripHtmlTags(input)).toBe('Content')
    })
  })

  describe('Performance Tests', () => {
    test('should handle large input with early exit (DoS prevention)', () => {
      // Create ~1MB HTML string
      const largeHtml = '<p>' + 'x'.repeat(1000000) + '</p>'
      const maxLength = 50

      const startTime = Date.now()
      const result = stripHtmlTags(largeHtml, maxLength)
      const endTime = Date.now()

      // Should complete in reasonable time (< 100ms for early exit)
      expect(endTime - startTime).toBeLessThan(100)
      
      // Should respect maxLength
      expect(result.length).toBeLessThanOrEqual(maxLength)
    })

    test('should respect maxLength parameter', () => {
      const input = '<p>' + 'x'.repeat(1000) + '</p>'
      const maxLength = 100

      const result = stripHtmlTags(input, maxLength)

      expect(result.length).toBeLessThanOrEqual(maxLength)
    })

    test('should handle default maxLength', () => {
      const input = '<p>' + 'x'.repeat(500) + '</p>'
      const result = stripHtmlTags(input)

      expect(result.length).toBeLessThanOrEqual(200) // Default maxLength
    })

    test('should process normal input quickly', () => {
      const input = '<p>Normal blog post content with <strong>formatting</strong> and <em>emphasis</em>.</p>'
      
      const startTime = Date.now()
      const result = stripHtmlTags(input)
      const endTime = Date.now()

      expect(endTime - startTime).toBeLessThan(10) // Should be near-instant
      expect(result).toBe('Normal blog post content with formatting and emphasis.')
    })
  })

  describe('Real-world Scenarios', () => {
    test('should handle WordPress excerpt format', () => {
      const input = '<p>This is a WordPress excerpt with <a href="https://example.com">links</a> and <strong>formatting</strong>.</p>'
      const result = stripHtmlTags(input, 160)
      
      expect(result).toBe('This is a WordPress excerpt with links and formatting.')
      expect(result.length).toBeLessThanOrEqual(160)
    })

    test('should handle complex HTML structure', () => {
      const input = `
        <div class="post-excerpt">
          <h2>Title</h2>
          <p>Paragraph with <a href="/link" title="Click here">link</a>.</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `
      const result = stripHtmlTags(input)
      
      expect(result).toContain('Title')
      expect(result).toContain('Paragraph with link')
      expect(result).toContain('Item 1')
      expect(result).toContain('Item 2')
    })
  })
})

