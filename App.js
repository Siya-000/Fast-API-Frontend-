import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    document.title = "ABCD123"; // Sets our Roll Number
  }, []);

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      setError(""); // Reset previous error message
      const parsedData = JSON.parse(jsonInput); // Parse the JSON
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format: Missing 'data' array");
      }

      const res = await axios.post('https://your-backend-url/bfhl', parsedData); // Replaces with our backend URL

      if (!res.data) throw new Error("Invalid response from backend");

      setResponseData(res.data); // Store the response data
    } catch (err) {
      setError(err.message || "Invalid JSON input or Backend Error");
    }
  };

  // Filter response data based on selected filters
  const filteredData = () => {
    if (!responseData) return {};
    let result = {};
    if (selectedFilters.includes("Alphabets")) result.alphabets = responseData.alphabets;
    if (selectedFilters.includes("Numbers")) result.numbers = responseData.numbers.map(String);
    if (selectedFilters.includes("Highest Alphabet")) result.highest_alphabet = responseData.highest_alphabet;
    return result;
  };

  return (
    <div className="container">
      <h1>JSON Input</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows="10"
        cols="50"
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {responseData && (
        <>
          <h2>Select Data to Display</h2>
          <select
            multiple
            onChange={(e) => setSelectedFilters([...e.target.selectedOptions].map(o => o.value))}
            style={{ width: '200px', height: '100px' }}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Alphabet">Highest Alphabet</option>
          </select>

          <h3>Filtered Data</h3>
          <pre>{JSON.stringify(filteredData(), null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
