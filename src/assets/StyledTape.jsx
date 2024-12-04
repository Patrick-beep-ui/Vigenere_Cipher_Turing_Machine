import React, { useState, useEffect } from 'react';

const Tape = ({ tapeKey, word }) => {
  const [result, setResult] = useState(null);
  const [tape, setTape] = useState(['*', '*']);
  const [showAll, setShowAll] = useState(false); // Controlar la visualización de todos los pasos
  const [currentStep, setCurrentStep] = useState(0); // Controlar el paso actual para "Next Step"

  useEffect(() => {
    if (tapeKey && word) {
      setResult(encrypt(tapeKey, word));
    }
  }, [tapeKey, word]);

  const encrypt = (key, word) => {
    setTape(['*', '*']); // Reset tape for each encryption
    let encryptedWord = "";
    let steps = []; // To store each intermediate tape state
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
  
      if (wordChar === " ") {
        // Handle spaces: Add them to the encrypted word and skip further processing
        encryptedWord += " ";
        addStringToTape("+");
        
        // Record the step only if it's different from the last one
        if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
          steps.push([...tape]); // Record the current tape state
          lastStep = [...tape]; // Update the last step
        }
        continue;
      }
  
      const keyChar = key[i % key.length]; // Repeat the key if shorter than the word
  
      // Calculate the encrypted character
      const encryptedChar = String.fromCharCode(
        ((wordChar.charCodeAt(0) - 65 + keyChar.charCodeAt(0) - 65) % 26) + 65
      );
      encryptedWord += encryptedChar;
  
      // Add encrypted character to the tape
      addStringToTape(encryptedChar);
      tape[wordStartIndex + i] = '+';
  
      // Record the step only if it's different from the last one
      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]); // Record the current tape state
        lastStep = [...tape]; // Update the last step
      }
    }

    // Step 3: Replace original key and word with '+'
    for (let i = 0; i < word.length + key.length; i++) {
      if (tape[i] !== '*') tape[i] = '+';
  
      // Record the step only if it's different from the last step
      if (JSON.stringify(tape) !== JSON.stringify(lastStep)) {
        steps.push([...tape]); // Record the current tape state
        lastStep = [...tape]; // Update the last step
      }
    }
  
    return { encryptedWord, steps, finalTape: tape };
  };

  const addStringToTape = (value) => {
    for (let i = 0; i < value.length; i++) {
      tape.splice(tape.length - 1, 0, value[i]); // Add the character at the end of the tape
    }
  };

  const enterSeparatorToTape = () => {
    tape.splice(tape.length - 1, 0, '+');
  };

  const handleShowAllSteps = () => {
    setShowAll(true);
    setCurrentStep(0); // Reset the step counter when switching to "Show All"
  };

  const handleNextStep = () => {
    if (currentStep < result.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (!result) return null;

  return (
    <div>
      <h3>Encryption Process:</h3>
      
      {/* Mostrar todos los pasos si 'showAll' es verdadero */}
      {showAll ? (
        result.steps.map((step, index) => (
          <div key={index} className="tape-box-container">
            <p>Step {index + 1}:</p>
            {step.map((char, i) => (
              <span
                key={i}
                className={`tape-box ${i === 0 ? 'start' : i === step.length - 1 ? 'end' : ''}`}
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
              className={`tape-box ${i === 0 ? 'start' : i === result.steps[currentStep].length - 1 ? 'end' : ''}`}
            >
              {char}
            </span>
          ))}
        </div>
      )}

      <div className="controls">
        <button onClick={handleNextStep} disabled={showAll || currentStep === result.steps.length - 1}>
          Next Step
        </button>
        <button onClick={handleShowAllSteps} disabled={showAll}>
          Show All Steps
        </button>
      </div>

      <h3>Encryption Complete</h3>
      <div className="encryption-result">
        <p><strong>Original Word:</strong> {word}</p>
        <p><strong>Key:</strong> {tapeKey}</p>
        <p><strong>Encrypted Word:</strong> {result.encryptedWord}</p>
      </div>

      <h3>Final Tape State:</h3>
      <div className="tape-box-container">
        {result.finalTape.map((char, index) => (
          <span
            key={index}
            className={`tape-box ${index === 0 ? 'start' : index === result.finalTape.length - 1 ? 'end' : ''}`}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tape;
