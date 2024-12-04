import React, { useState, useEffect } from 'react';

const Decrypt = ({ word, cipherKey }) => { // Cambié 'key' por 'cipherKey'
  const [decryptedWord, setDecryptedWord] = useState('');

  // Función de desencriptación Vigenère
  const decrypt = (word, cipherKey) => { // Cambié 'key' por 'cipherKey'
    let decryptedWord = '';

    // Recorremos cada carácter de la palabra encriptada
    for (let i = 0; i < word.length; i++) {
      // Obtener el código ASCII de los caracteres (0 para A, 1 para B, ..., 25 para Z)
      const wordChar = word.charCodeAt(i) - 65; // A = 0, B = 1, ..., Z = 25
      const keyChar = cipherKey[i % cipherKey.length].charCodeAt(0) - 65; // A = 0, B = 1, ..., Z = 25

      // Desencriptar utilizando la fórmula inversa de Vigenère
      const decryptedChar = String.fromCharCode(
        ((wordChar - keyChar + 26) % 26) + 65 // Volver al rango A-Z
      );
      decryptedWord += decryptedChar;
    }

    return decryptedWord;
  };

  // Ejecutar la desencriptación cuando cambian la palabra o la clave
  useEffect(() => {
    if (word && cipherKey) { // Cambié 'key' por 'cipherKey'
      setDecryptedWord(decrypt(word, cipherKey)); // Desencriptar palabra
    }
  }, [word, cipherKey]); // Cambié 'key' por 'cipherKey'

  return (
    <div>
      <h3>Decrypted Word:</h3>
      <p id='decrypted-word' value={decryptedWord} >{decryptedWord}</p>
    </div>
  );
};

export default Decrypt;
