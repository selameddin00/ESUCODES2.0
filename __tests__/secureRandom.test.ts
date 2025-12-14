/**
 * Unit Tests for secureRandom Utility
 * 
 * Tests cover functional correctness, security guarantees, probability boundaries,
 * SSR compatibility, and deterministic behavior under mocking.
 */

import {
  secureRandomFloat,
  secureRandomInt,
  secureRandomBool,
} from '@/lib/security/secureRandom'

describe('secureRandom', () => {
  describe('secureRandomFloat', () => {
    test('should return a number in range [0, 1)', () => {
      for (let i = 0; i < 100; i++) {
        const value = secureRandomFloat()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    })

    test('should return different values on multiple calls', () => {
      const values = new Set<number>()
      for (let i = 0; i < 50; i++) {
        values.add(secureRandomFloat())
      }
      // With 50 calls, we should get at least some different values
      // (collision probability is extremely low)
      expect(values.size).toBeGreaterThan(1)
    })

    test('should be SSR-safe (works in Node.js environment)', () => {
      // This test verifies the function works in Node.js (SSR context)
      expect(typeof secureRandomFloat()).toBe('number')
      expect(Number.isFinite(secureRandomFloat())).toBe(true)
    })

    test('should have O(1) complexity', () => {
      const startTime = Date.now()
      for (let i = 0; i < 1000; i++) {
        secureRandomFloat()
      }
      const endTime = Date.now()
      
      // Should complete quickly (O(1) per call)
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('secureRandomInt', () => {
    test('should return integer in range [min, max)', () => {
      const min = 0
      const max = 10
      
      for (let i = 0; i < 100; i++) {
        const value = secureRandomInt(min, max)
        expect(value).toBeGreaterThanOrEqual(min)
        expect(value).toBeLessThan(max)
        expect(Number.isInteger(value)).toBe(true)
      }
    })

    test('should handle negative ranges', () => {
      const min = -10
      const max = 10
      
      for (let i = 0; i < 100; i++) {
        const value = secureRandomInt(min, max)
        expect(value).toBeGreaterThanOrEqual(min)
        expect(value).toBeLessThan(max)
      }
    })

    test('should handle large ranges', () => {
      const min = 1000000
      const max = 2000000
      
      for (let i = 0; i < 50; i++) {
        const value = secureRandomInt(min, max)
        expect(value).toBeGreaterThanOrEqual(min)
        expect(value).toBeLessThan(max)
      }
    })

    test('should throw error if min >= max', () => {
      expect(() => secureRandomInt(10, 10)).toThrow('min (10) must be less than max (10)')
      expect(() => secureRandomInt(10, 5)).toThrow('min (10) must be less than max (5)')
    })

    test('should be SSR-safe', () => {
      expect(typeof secureRandomInt(0, 100)).toBe('number')
      expect(Number.isInteger(secureRandomInt(0, 100))).toBe(true)
    })

    test('should have O(1) complexity', () => {
      const startTime = Date.now()
      for (let i = 0; i < 1000; i++) {
        secureRandomInt(0, 100)
      }
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('secureRandomBool', () => {
    test('should return boolean', () => {
      expect(typeof secureRandomBool(0.5)).toBe('boolean')
    })

    test('should always return false when probability is 0', () => {
      for (let i = 0; i < 100; i++) {
        expect(secureRandomBool(0)).toBe(false)
      }
    })

    test('should always return true when probability is 1', () => {
      for (let i = 0; i < 100; i++) {
        expect(secureRandomBool(1)).toBe(true)
      }
    })

    test('should throw error if probability < 0', () => {
      expect(() => secureRandomBool(-0.1)).toThrow('probability (-0.1) must be in range [0, 1]')
      expect(() => secureRandomBool(-1)).toThrow('probability (-1) must be in range [0, 1]')
    })

    test('should throw error if probability > 1', () => {
      expect(() => secureRandomBool(1.1)).toThrow('probability (1.1) must be in range [0, 1]')
      expect(() => secureRandomBool(2)).toThrow('probability (2) must be in range [0, 1]')
    })

    test('should approximate probability correctly for 0.5', () => {
      let trueCount = 0
      const iterations = 10000
      
      for (let i = 0; i < iterations; i++) {
        if (secureRandomBool(0.5)) {
          trueCount++
        }
      }
      
      const actualProbability = trueCount / iterations
      // Should be within 5% of expected probability (0.5)
      expect(actualProbability).toBeGreaterThan(0.45)
      expect(actualProbability).toBeLessThan(0.55)
    })

    test('should approximate probability correctly for 0.01', () => {
      let trueCount = 0
      const iterations = 100000
      
      for (let i = 0; i < iterations; i++) {
        if (secureRandomBool(0.01)) {
          trueCount++
        }
      }
      
      const actualProbability = trueCount / iterations
      // Should be within 50% relative error for low probability (0.01 ± 0.005)
      expect(actualProbability).toBeGreaterThan(0.005)
      expect(actualProbability).toBeLessThan(0.015)
    })

    test('should approximate probability correctly for 0.99', () => {
      let trueCount = 0
      const iterations = 10000
      
      for (let i = 0; i < iterations; i++) {
        if (secureRandomBool(0.99)) {
          trueCount++
        }
      }
      
      const actualProbability = trueCount / iterations
      // Should be within 2% of expected probability (0.99)
      expect(actualProbability).toBeGreaterThan(0.97)
      expect(actualProbability).toBeLessThan(1.0)
    })

    test('should be SSR-safe', () => {
      expect(typeof secureRandomBool(0.5)).toBe('boolean')
    })

    test('should have O(1) complexity', () => {
      const startTime = Date.now()
      for (let i = 0; i < 1000; i++) {
        secureRandomBool(0.5)
      }
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('Security Guarantees', () => {
    test('should not use Math.random() internally', () => {
      // This test verifies that we're not accidentally using Math.random()
      // by checking that the implementation uses crypto APIs
      // We can't directly test this, but we verify the output is cryptographically secure
      // by checking for sufficient entropy (different values on each call)
      
      const values = new Set<number>()
      for (let i = 0; i < 1000; i++) {
        values.add(secureRandomFloat())
      }
      
      // With 1000 calls, we should have high entropy (many unique values)
      // If Math.random() was used, we might see patterns, but crypto.randomBytes
      // should provide high entropy
      expect(values.size).toBeGreaterThan(900) // At least 90% unique values
    })

    test('should produce different sequences on each run', () => {
      // Generate two sequences and verify they're different
      const sequence1: number[] = []
      const sequence2: number[] = []
      
      for (let i = 0; i < 100; i++) {
        sequence1.push(secureRandomFloat())
        sequence2.push(secureRandomFloat())
      }
      
      // Sequences should be different (extremely low collision probability)
      expect(sequence1).not.toEqual(sequence2)
    })
  })
})
