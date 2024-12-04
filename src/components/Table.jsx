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
    const tableRows = [];
    const highlightedColumns = new Set(); // Track highlighted columns
  
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
  
    // Process steps to highlight rows, columns, and the specific cell
    steps.forEach((step) => {
      if (step.char === "+") return; // Skip the "+" symbol
  
      const charIndex = alphabet.indexOf(step.char); // Column to highlight
      const keyIndex = alphabet.indexOf(step.keyChar); // Row to highlight
      const rowIndex = keyIndex + 1; // Adjust for header row at index 0
  
      highlightedColumns.add(charIndex); // Add column index to the set
  
      // Highlight the row
      const rowToClone = tableRows[rowIndex];
      if (rowToClone) {
        const newRow = React.cloneElement(rowToClone, {
          children: React.Children.map(rowToClone.props.children, (child, idx) => {
            if (idx === charIndex + 1) {
              // Highlight specific cell
              return React.cloneElement(child, { className: 'highlight-cell' });
            }
            return child;
          }),
          className: 'highlight-row', // Add class for the entire row
        });
        tableRows[rowIndex] = newRow;
      }
    });
  
    // Highlight columns in all rows
    for (let i = 1; i < tableRows.length; i++) { // Skip the header row
      const row = tableRows[i];
      if (row) {
        const newRow = React.cloneElement(row, {
          children: React.Children.map(row.props.children, (child, idx) => {
            if (highlightedColumns.has(idx - 1)) { // Adjust for <th> in the row
              return React.cloneElement(child, {
                className: `${child.props.className || ''} highlight-col`,
              });
            }
            return child;
          }),
        });
        tableRows[i] = newRow;
      }
    }
  
    return tableRows;
  }
  
  

  return (
    <div id='table-container'>
      {result && (
        <>
        <table>
          {displayVigenereTable(result.steps)}
        </table>
        </>
      )}
    </div>
  );
};

export default Table;
