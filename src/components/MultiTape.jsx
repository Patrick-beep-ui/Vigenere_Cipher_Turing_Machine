import React, { useState, useEffect } from 'react';

const MultiTape = ({ tapeKey, word, mode }) => {
  const [result, setResult] = useState(null);
  const [tape, setTape] = useState(['*', '*']);
  const [wordTape, setWordTape] = useState(['*', '*']);
  const [keyTape, setKeyTape] = useState(['*', '*']);
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
    setTape(['*', '*']); // Reset the tape for each encryption
    setKeyTape(['*', '*']); // Reset keyTape
    setWordTape(['*', '*']); // Reset wordTape
  
    let encryptedWord = '';
    let steps = []; // Array to store each step
    let lastStep = null; // To track changes in the tape
  
    // Step 1: Add the key and word to the tapes
    addStringToTape(key, keyTape, setKeyTape);
    addStringToTape(word, wordTape, setWordTape);
  
    // Replace spaces with '-' to avoid empty spaces on the tape
    for (let i = 0; i < tape.length; i++) {
      if (tape[i] === ' ') {
        tape[i] = '-';
      }
    }
  
    // Record the first step after replacing spaces
    steps.push([...tape]);
    lastStep = [...tape];
  
    // Step 2: Encrypt the word
    for (let i = 0; i < word.length; i++) {
      const wordChar = word[i];
  
      if (wordChar === ' ') {
        encryptedWord += ' ';
        if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
          steps.push([...tape]); // Record the state after change
          lastStep = [...tape]; // Update last step
        }
        continue;
      }
  
      const keyChar = key[i % key.length];
      const encryptedChar = String.fromCharCode(
        ((wordChar.charCodeAt(0) - 65 + keyChar.charCodeAt(0) - 65) % 26) + 65
      );
      encryptedWord += encryptedChar;
      addStringResultToTape(encryptedChar);
  
      // Capture state after adding the character
      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]); // Record the state after change
        lastStep = [...tape]; // Update last step
      }
    }

    console.log("Result Tape: ", tape);
    console.log("Steps: ", steps);

    
    return { encryptedWord, steps, finalTape: tape };
  };
  


  const decrypt = (key, word) => {
    setTape(['*', '*']); // Reset tape for each decryption
    setKeyTape(['*', '*']); // Reset keyTape
    setWordTape(['*', '*']); // Reset wordTape

    let decryptedWord = '';
    let steps = [];
    let lastStep = null;

    // Step 1: Add the key and word to the tapes
    addStringToTape(key, keyTape, setKeyTape);
    addStringToTape(word, wordTape, setWordTape);

    steps.push([...tape]); // Record the initial state
    lastStep = [...tape];

        // Replace spaces with '-' to avoid empty spaces on the tape
    for (let i = 0; i < tape.length; i++) {
        if (tape[i] === ' ') {
            tape[i] = '-';
        }
    }
        
    // Record the first step after replacing spaces
    steps.push([...tape]);
    lastStep = [...tape];

    // Step 2: Decrypt the word
    for (let i = 0; i < word.length; i++) {
      const encryptedChar = word[i];

      if (encryptedChar === ' ') {
        decryptedWord += ' ';
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

      addStringResultToTape(decryptedChar);

      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]);
        lastStep = [...tape];
      }
    }

    return { decryptedWord, steps, finalTape: tape };
  };

  const addStringToTape = (value, currentTape, setTape) => {
    // Reset the tape by clearing it before adding new values
    currentTape.splice(0, currentTape.length);
    
    for (let i = 0; i < value.length; i++) {
      currentTape.push(value[i]);
    }

    if (currentTape[0] !== '*') currentTape.unshift('*');
    if (currentTape[currentTape.length - 1] !== '*') currentTape.push('*');  
    setTape([...currentTape]); // Make sure to use setTape to trigger the re-render
};



const addStringResultToTape = (value) => {
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

      <h3>Word Tape: </h3>
      <div className='tape-box-container'>
        {wordTape.map(w => 
            <span className="tape-box">{w}</span>
        )}
      </div>

      <h3>Key Tape: </h3>
      <div className='tape-box-container'>
        {keyTape.map(w => 
            <span className="tape-box">{w}</span>
        )}
      </div>

      <h3>Result Tape: </h3>

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
    </div>
  );
};

export default MultiTape;
