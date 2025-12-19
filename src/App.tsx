import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [currencySigns, setCurrencieSigns] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [convertedList, setConvertedList] = useState<string[]>([]);

  useEffect(() => {
    fetchAllData();
    getCurrencies();
  }, []);

  fetch;

  const getCurrencies = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();

      const newCurrencySigns: any = [];

      Object.entries(data.rates).forEach(([key]) => {
        newCurrencySigns.push(key);
      });

      setCurrencieSigns(newCurrencySigns);
      setSelectedCurrency(newCurrencySigns[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const getRates = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();

      const newCurrencies: any = [];

      Object.entries(data.rates).forEach(([key, value]) => {
        newCurrencies.push(key + "|" + value);
      });

      return newCurrencies;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchAllData = async () => {
    try {
      const response = await fetch("http://localhost:5001/get-data");
      const data = await response.json();

      const dataArray: string[] = [];
      data.forEach((item: any) => {
        dataArray.push(item.Value);
      });

      setConvertedList(dataArray);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const latestRates = await getRates();

    const exchangeTuple = latestRates.find((val: any) => {
      const pair = val.split("|");

      if (pair[0] === selectedCurrency) {
        return true;
      }
    });

    const exchangeRate = exchangeTuple.split("|");
    const convertedVal = Number(value) * Number(exchangeRate[1]);
    const finalVal = convertedVal.toFixed(2);

    setConvertedList((prev) => [...prev, finalVal]);

    try {
      const response = await fetch("http://localhost:5001/add-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Value: finalVal,
        }),
      });
      if (response.ok) {
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCurrencyChange = (e: any) => {
    setSelectedCurrency(e.target.value);
  };
  
  const handleInputChange = (value: any) => {
    if (isNaN(value)) {
      return;
    }

    setValue(value);
  };

  return (
    <>
      <h1>Jump Sample Project</h1>
      <h2>Current Converter</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter dollar amount"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <button type="submit">Convert Currency</button>
      </form>
      <div className="Card">
        <div>Currency Rate: </div>
        <select value={selectedCurrency} onChange={handleCurrencyChange}>
          {currencySigns.map((sign, index) => (
            <option key={index} value={sign}>
              {sign}
            </option>
          ))}
        </select>
      </div>

      <div className="Card">
        {convertedList.map((item: any, index: number) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </>
  );
}

export default App;
