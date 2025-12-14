import crypto from 'node:crypto'

/**
 * Cryptographically secure random number generator utilities
 * 
 * This module provides secure randomness for security-sensitive operations.
 * Uses Node.js crypto API (crypto.randomBytes / crypto.randomInt) for
 * cryptographically secure random number generation.
 * 
 * All functions are SSR-safe and deterministic in complexity (O(1)).
 * 
 * @module lib/security/secureRandom
 */

/**
 * Generate a cryptographically secure random float in the range [0, 1)
 * 
 * Uses crypto.randomBytes to generate secure randomness.
 * 
 * @returns A random float in the range [0, 1)
 */
export function secureRandomFloat(): number {
  // Generate 4 random bytes (32 bits) for sufficient precision
  const bytes = crypto.randomBytes(4)
  // Convert to 32-bit unsigned integer
  const uint32 = bytes.readUInt32BE(0)
  // Normalize to [0, 1) range
  // Divide by 2^32 (4294967296) to get value in [0, 1)
  return uint32 / 0x100000000
}

/**
 * Generate a cryptographically secure random integer in the range [min, max)
 * 
 * Uses crypto.randomInt for secure randomness.
 * 
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns A random integer in the range [min, max)
 * @throws Error if min >= max
 */
export function secureRandomInt(min: number, max: number): number {
  if (min >= max) {
    throw new Error(`secureRandomInt: min (${min}) must be less than max (${max})`)
  }
  
  // crypto.randomInt is inclusive on both ends, so we use [min, max)
  // by using [min, max) semantics
  return crypto.randomInt(min, max)
}

/**
 * Generate a cryptographically secure random boolean based on probability
 * 
 * @param probability - Probability of returning true (must be in range [0, 1])
 * @returns true with the given probability, false otherwise
 * @throws Error if probability is not in range [0, 1]
 */
export function secureRandomBool(probability: number): boolean {
  if (probability < 0 || probability > 1) {
    throw new Error(`secureRandomBool: probability (${probability}) must be in range [0, 1]`)
  }
  
  if (probability === 0) {
    return false
  }
  
  if (probability === 1) {
    return true
  }
  
  return secureRandomFloat() < probability
}
