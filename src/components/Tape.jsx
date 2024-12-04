import React, { useState, useEffect } from 'react';

const Tape = ({ tapeKey, word, mode }) => {
  const [result, setResult] = useState(null);
  const [tape, setTape] = useState(['*', '*']);
  const [showAll, setShowAll] = useState(false); // Controls full step display
  const [currentStep, setCurrentStep] = useState(0); // Controls current step for "Next Step"

  useEffect(() => {
    if (tapeKey && word) {
      if (mode === 'encrypt') {
        setResult(encrypt(tapeKey, word));
      } else if (mode === 'decrypt') {
        setResult(decrypt(tapeKey, word));
      }
    }
  }, [tapeKey, word, mode]);

  const encrypt = (key, word) => {
    setTape(['*', '*']); // Reset tape for each encryption
    let encryptedWord = '';
    let steps = []; // Stores each intermediate tape state
    let lastStep = null; // Variable to store the last step for comparison

    // Step 1: Add the key and word to the tape
    addStringToTape(key);
    enterSeparatorToTape();
    addStringToTape(word);

    // Replace spaces with '-' to avoid empty spaces on the tape
    for (let i = 0; i < tape.length; i++) {
      if (tape[i] === ' ') {
        tape[i] = '-';
      }
    }

    steps.push([...tape]); // Record the initial state
    lastStep = [...tape]; // Set the initial state as the last step

    // Step 2: Encrypt the word
    let wordStartIndex = tape.indexOf(word[0]);
    for (let i = 0; i < word.length; i++) {
      const wordChar = word[i];

      if (wordChar === ' ') {
        encryptedWord += ' ';
        addStringToTape('+');
        if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
          steps.push([...tape]);
          lastStep = [...tape];
        }
        continue;
      }

      const keyChar = key[i % key.length];
      const encryptedChar = String.fromCharCode(
        ((wordChar.charCodeAt(0) - 65 + keyChar.charCodeAt(0) - 65) % 26) + 65
      );
      encryptedWord += encryptedChar;

      addStringToTape(encryptedChar);
      tape[wordStartIndex + i] = '+';

      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]);
        lastStep = [...tape];
      }
    }

    for (let i = 0; i < word.length + key.length; i++) {
      if (tape[i] !== '*') tape[i] = '+';
      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]);
        lastStep = [...tape];
      }
    }

    return { encryptedWord, steps, finalTape: tape };
  };

  const decrypt = (key, word) => {
    setTape(['*', '*']); // Reset tape for each decryption
    let decryptedWord = '';
    let steps = [];
    let lastStep = null;

    // Step 1: Add the key and encrypted word to the tape
    addStringToTape(key);
    enterSeparatorToTape();
    addStringToTape(word);

    steps.push([...tape]); // Record the initial state
    lastStep = [...tape];

    // Step 2: Decrypt the word
    let wordStartIndex = tape.indexOf(word[0]);
    for (let i = 0; i < word.length; i++) {
      const encryptedChar = word[i];

      if (encryptedChar === ' ') {
        decryptedWord += ' ';
        addStringToTape('+');
        if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
          steps.push([...tape]);
          lastStep = [...tape];
        }
        continue;
      }

      const keyChar = key[i % key.length];
      const decryptedChar = String.fromCharCode(
        ((encryptedChar.charCodeAt(0) - keyChar.charCodeAt(0) + 26) % 26) + 65
      );
      decryptedWord += decryptedChar;

      addStringToTape(decryptedChar);
      tape[wordStartIndex + i] = '+';

      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]);
        lastStep = [...tape];
      }
    }

    for (let i = 0; i < word.length + key.length; i++) {
      if (tape[i] !== '*') tape[i] = '+';
      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]);
        lastStep = [...tape];
      }
    }

    return { decryptedWord, steps, finalTape: tape };
  };

  const addStringToTape = (value) => {
    for (let i = 0; i < value.length; i++) {
      tape.splice(tape.length - 1, 0, value[i]);
    }
  };

  const enterSeparatorToTape = () => {
    tape.splice(tape.length - 1, 0, '+');
  };

  const handleShowAllSteps = () => {
    setShowAll(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < result.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!result) return null;

  return (
    <div>
      <h3>{mode === 'encrypt' ? 'Encryption' : 'Decryption'} Process:</h3>

      {showAll ? (
        result.steps.map((step, index) => (
          <div key={index} className="tape-box-container">
            <p>Step {index + 1}:</p>
            {step.map((char, i) => (
              <span
                key={i}
                className={`tape-box ${
                  i === 0 ? 'start' : i === step.length - 1 ? 'end' : ''
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        ))
      ) : (
        <div className="tape-box-container">
          <p>Step {currentStep + 1}:</p>
          {result.steps[currentStep].map((char, i) => (
            <span
              key={i}
              className={`tape-box ${
                i === 0 ? 'start' : i === result.steps[currentStep].length - 1 ? 'end' : ''
              }`}
            >
              {char}
            </span>
          ))}
        </div>
      )}

      <div className="controls">
        <button onClick={handleShowAllSteps} className='control-button'>Show All Steps</button>
        {!showAll && (
          <>
            <button onClick={handlePreviousStep} disabled={currentStep === 0}>
              Previous Step
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep === result.steps.length - 1}
            >
              Next Step
            </button>
          </>
        )}
      </div>

       <h3>{mode === 'encrypt' ? 'Encryption Complete' : 'Decryption Complete'}</h3> 
      <div className="result-summary">
        <p id={word}><strong>Original Word:</strong> {word}</p>
        <p><strong>Key:</strong> {tapeKey}</p>
        <p id="decrypted-word" className="decrypted-word"><strong>Final {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Word:</strong>{mode === 'encrypt' ? result.encryptedWord : result.decryptedWord}</p>
      </div>
    </div>
  );
};

export default Tape;
