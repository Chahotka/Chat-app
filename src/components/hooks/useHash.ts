export const useHash = (str: string | null, saltN?: number) => {
  if (typeof str === 'string') {
    const salt = saltN || Math.ceil(Math.random() * (1000 - 0) + 0)
      
    let h1 = 0xdeadbeef ^ salt
    let h2 = 0x41c6ce57 ^ salt
    
    for(let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    
    return { 
      salt,
      hash: 4294967296 * (2097151 & h2) + (h1 >>> 0)
    }
  } else {
    return {
      salt: null,
      hash: null
    }
  }
}