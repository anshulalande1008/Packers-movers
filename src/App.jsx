import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import MoveCard from "./components/MoveCard.jsx";
import { fetchMoves } from "./api.js";
import { normalizeSample } from "./sample.js";

export default function App() {
  const [moves, setMoves] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [usingSample, setUsingSample] = useState(false);

  const load = useCallback(async (signal) => {
    setStatus("loading");
    setError("");
    try {
      setMoves(await fetchMoves(signal));
      setUsingSample(false);
      setStatus("ready");
    } catch (e) {
      if (e.name === "AbortError") return;
      setError(e.message || "Something went wrong.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const showSample = () => {
    setMoves(normalizeSample());
    setUsingSample(true);
    setStatus("ready");
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <h1 className="page-title">My Moves</h1>

        {usingSample && (
          <p className="notice" role="status">
            Showing sample data because the live API could not be reached.{" "}
            <button className="link-btn" onClick={() => load()}>Try the API again</button>
          </p>
        )}

        {status === "loading" && (
          <div className="state" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            Loading your moves…
          </div>
        )}

        {status === "error" && (
          <div className="state state-error" role="alert">
            <p><strong>Couldn't load your moves.</strong> {error}</p>
            <div className="state-actions">
              <button className="btn btn-solid" onClick={() => load()}>Retry</button>
              <button className="btn btn-outline" onClick={showSample}>Use sample data</button>
            </div>
          </div>
        )}

        {status === "ready" && moves.map((m) => <MoveCard key={m.key} move={m} />)}
      </main>
    </div>
  );
}
