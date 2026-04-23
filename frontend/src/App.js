import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Home() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    const checkApi = async () => {
      if (!BACKEND_URL) {
        setStatus("Missing REACT_APP_BACKEND_URL in .env");
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/`);
        setStatus(response?.data?.message || "API connected");
      } catch (error) {
        setStatus("API check failed. Verify backend URL and /api endpoint.");
      }
    };

    checkApi();
  }, []);

  return (
    <main className="layout">
      <aside className="sidebar">
        <h1>React BMS</h1>
        <p>Building Management Dashboard</p>
      </aside>
      <section className="content">
        <h2>Step 1 complete: React app initialized</h2>
        <p>{status}</p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
