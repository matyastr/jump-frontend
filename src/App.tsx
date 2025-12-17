import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const response = await fetch("http://localhost:5001/get-data");
      const data = await response.json();
      setItems(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/add-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Value: value,
        }),
      });

      if (response.ok) {
        fetchAllData();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>Jump Sample Project</h1>
      <h2>Items Fetched</h2>
      <div className="Card">
        {items.map((item: any, index: number) => (
          <div key={index}>{item.Value}</div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Please enter a value."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit">Save to SQL</button>
      </form>
    </>
  );
}

export default App;
