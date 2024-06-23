export const keyGenerator = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
      {
          name: "ECDH",
          namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
  );

  const publicKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
  );

  const privateKeyJwk = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
  );

  return { publicKeyJwk, privateKeyJwk };
};

export const sharedKeyGenerator = async (publicKeyJwk, privateKeyJwk) => {
  const publicKey = await window.crypto.subtle.importKey(
      "jwk",
      publicKeyJwk,
      {
          name: "ECDH",
          namedCurve: "P-256",
      },
      true,
      []
  );

  const privateKey = await window.crypto.subtle.importKey(
      "jwk",
      privateKeyJwk,
      {
          name: "ECDH",
          namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
  );

  return await window.crypto.subtle.deriveKey(
      { name: "ECDH", public: publicKey },
      privateKey,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
  );
};

export const encryptData = async (text, derivedKey) => {
  const encodedText = new TextEncoder().encode(text);
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      encodedText
  );

  const uintArray = new Uint8Array(encryptedData);
  const base64Data = btoa(String.fromCharCode(...uintArray));

  // Include IV in the result
  const ivBase64 = btoa(String.fromCharCode(...iv));

  return JSON.stringify({ base64Data, iv: ivBase64 });
};

export const decryptData = async (messageJSON, derivedKey) => {
  try {
      const message = JSON.parse(messageJSON);
      const iv = Uint8Array.from(atob(message.iv), c => c.charCodeAt(0));
      const text = message.base64Data;
      const uintArray = Uint8Array.from(atob(text), c => c.charCodeAt(0));

      const decryptedData = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          derivedKey,
          uintArray
      );
      return new TextDecoder().decode(decryptedData);
  } catch (e) {
      return `error decrypting message: ${e}`;
  }
};
