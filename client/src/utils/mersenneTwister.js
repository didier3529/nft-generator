/**
 * MersenneTwister - A pseudorandom number generator with a long period
 * (2^19937-1) and good statistical properties.
 * 
 * Based on the original implementation by Makoto Matsumoto and Takuji Nishimura.
 * 
 * This is a simplified version adapted for our NFT generator.
 */

export class MersenneTwister {
  constructor(seed = new Date().getTime()) {
    this.N = 624;  // Period parameter
    this.M = 397;  // Period parameter
    this.MATRIX_A = 0x9908b0df;  // Constant vector a
    this.UPPER_MASK = 0x80000000;  // Most significant bit: 0x80000000
    this.LOWER_MASK = 0x7fffffff;  // Least significant 31 bits: 0x7fffffff
    
    this.mt = new Array(this.N);  // The array for the state vector
    this.mti = this.N + 1;  // mti==N+1 means mt[N] is not initialized
    
    this.init(seed);
  }
  
  // Initialize the generator with a seed
  init(seed) {
    this.mt[0] = seed >>> 0;
    for (this.mti = 1; this.mti < this.N; this.mti++) {
      const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] = 
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + 
        (s & 0x0000ffff) * 1812433253 + 
        this.mti;
      this.mt[this.mti] >>>= 0;
    }
  }
  
  // Extract a random number [0, 1) with 32-bit resolution
  random() {
    let y;
    const mag01 = [0x0, this.MATRIX_A];
    
    // Generate N words at one time
    if (this.mti >= this.N) {
      let kk;
      
      // If init() has not been called, use default seed
      if (this.mti === this.N + 1) {
        this.init(5489);
      }
      
      for (kk = 0; kk < this.N - this.M; kk++) {
        y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
        this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      
      for (; kk < this.N - 1; kk++) {
        y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
        this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      
      y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
      this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
      
      this.mti = 0;
    }
    
    y = this.mt[this.mti++];
    
    // Tempering
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);
    
    return y >>> 0 * (1.0 / 4294967296.0); // Divide by 2^32
  }
  
  // Get a random integer in the range [min, max] (inclusive)
  randomInt(min, max) {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }
  
  // Get a random boolean with the given probability of being true
  randomBool(probability = 0.5) {
    return this.random() < probability;
  }
} 