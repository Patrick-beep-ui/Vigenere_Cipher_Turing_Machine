import React, { useState, useEffect } from 'react';

const Table = ({ tapeKey, word }) => {
  const [result, setResult] = useState(null);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    if (tapeKey && word) {
      const encryptionResult = vigenereEncrypt(word, tapeKey);
      setResult(encryptionResult);
    }
  }, [tapeKey, word]);

  function vigenereEncrypt(message, key) {
    const keyRepeater = key.repeat(Math.ceil(message.length / key.length)).slice(0, message.length);
    let result = "";
    const steps = []; // To track encryption steps

    for (let i = 0; i < message.length; i++) {
      if (message[i] === "+") {
        result += "+";
        steps.push({ char: "+", keyChar: "+", encrypted: "+" });
      } else {
        const mIndex = message.charCodeAt(i) - 65;
        const kIndex = keyRepeater.charCodeAt(i) - 65;
        const encrypted = String.fromCharCode(((mIndex + kIndex) % 26) + 65);
        result += encrypted;
        steps.push({ char: message[i], keyChar: keyRepeater[i], encrypted });
      }
    }

    return { result, steps };
  }

  // Table display logic
  function displayVigenereTable(steps) {
    const keyRepeater = tapeKey.repeat(Math.ceil(word.length / tapeKey.length)).slice(0, word.length);
    const tableRows = [];
  
    // Create the header row with the alphabet
    const headerRow = (
      <tr>
        <th></th>
        {alphabet.split("").map((c, index) => (
          <th key={index}>{c}</th>
        ))}
      </tr>
    );
  
    tableRows.push(headerRow);
  
    // Create rows for each letter in the alphabet
    for (let i = 0; i < alphabet.length; i++) {
      const row = (
        <tr key={i}>
          <th>{alphabet[i]}</th>
          {alphabet
            .slice(i)
            .concat(alphabet.slice(0, i))
            .split("")
            .map((c, index) => (
              <td key={index}>{c}</td>
            ))}
        </tr>
      );
      tableRows.push(row);
    }
  
    // Highlight relevant rows and columns based on steps
    steps.forEach((step) => {
      if (step.char === "+") return;
  
      const charIndex = alphabet.indexOf(step.char);
      const keyIndex = alphabet.indexOf(step.keyChar);
  
      // Highlight the row
      const rowIndex = keyIndex + 1; // +1 because header row is at index 0
      const rowToClone = tableRows[rowIndex];
  
      if (rowToClone) {
        const newRow = React.cloneElement(rowToClone, {
          className: 'highlight-row',
          children: React.Children.map(rowToClone.props.children, (child, idx) =>
            idx === charIndex + 1 // Highlight the specific column
              ? React.cloneElement(child, { className: 'highlight-col' })
              : child
          ),
        });
  
        tableRows[rowIndex] = newRow;
      }
    });
  
    return tableRows;
  }
  

  return (
    <div id='table-container'>
      {result && (
        <table>
          {displayVigenereTable(result.steps)}
        </table>
      )}
    </div>
  );
};

export default Table;
