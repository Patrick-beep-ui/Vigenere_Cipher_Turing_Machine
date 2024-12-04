import React, { useEffect, useState } from 'react';
import './App.css';
import Tape from './components/Tape';
import Table from './components/Table';
//import Decrypt from './components/Decrypt';

function App() {
  const [word, setWord] = useState('');
  const [key, setKey] = useState('');
  const [isTableSelected, setIsTableSelected] = useState(false);
  const [mode, setMode] = useState('encrypt');
  const [decryptedWord, setDecryptedWord] = useState('');
  const [buttonLayout, setButtonLayout] = useState('horizontal');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
  };

  const handleReset = () => {
    setWord(''); 
    setKey(''); 
    setIsTableSelected(false); 
    setMode('encrypt');
    setDecryptedWord('');
  };

  const getDecryptedWord = () => {
    const p = document.querySelector('.decrypted-word');
    if (p) {
      const decrypted = p.textContent.split(':').pop().trim(); // Extract the actual decrypted word
      setDecryptedWord(decrypted);
      console.log("Decrypted Word:", decrypted);
    } else {
      console.log("Decrypted word element not found.");
    }
  };
  

  return (
    <div className="form-container">
      <h2>Vigenère Cipher Encryption</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="word">Word:</label>
        <input
          type="text"
          id="word"
          name="word"
          value={word}
          onChange={(e) => setWord(e.target.value.toUpperCase())}
          required
        />

        <label htmlFor="key">Key:</label>
        <input
          type="text"
          id="key"
          name="key"
          value={key}
          onChange={(e) => setKey(e.target.value.toUpperCase())}
          required
        />

        <div className={`button-container ${buttonLayout}`}>
          <button type="submit" onClick={() => setMode('encrypt')} >Encrypt</button>
          <button type="submit" onClick={() => {setMode('decrypt'); getDecryptedWord()}} >Decrypt</button>
        </div>

        <div className='button-container vertical'>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {word && key && (
        <div id="result">
          <Tape tapeKey={key} word={word} mode={mode}/>
        </div>
      )}

      <button onClick={() => setIsTableSelected(true)} >Show table</button>

      {isTableSelected && (
        <>
        {mode === 'encrypt' && (
          <>
          <h2>Vigenère Cipher Table:</h2>
              <div id="vigenereTable">
                <Table tapeKey={key} word={word} />
              </div>
          </>
        )}

        {mode === 'decrypt' && (
          <>
            <h2>Vigenère Cipher Table:</h2>
            <div id="vigenereTable">
              <Table tapeKey={key} word={decryptedWord} />
            </div>
          </>
        )}
        </>
      )}
    </div>
  );
}

export default App;
