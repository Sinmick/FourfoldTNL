import { useEffect, useState } from "react";
import { arenas } from "./data/arenas.js";
import { calculateExpPerHour } from "./calculators/expPerHour.js";
import {
  totalExpForLevel,
  expToNextLevel,
  expBetweenLevels,
} from "./calculators/tnl.js";

function App() {
  const [page, setPage] = useState(
    window.location.pathname === "/exp-hour" ? "exp-hour" : "tnl"
  );

  useEffect(() => {
    const handlePopState = () => {
      setPage(
        window.location.pathname === "/exp-hour" ? "exp-hour" : "tnl"
      );
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function navigate(path) {
    window.history.pushState({}, "", path);
    setPage(path === "/exp-hour" ? "exp-hour" : "tnl");
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header>
        <h1>Fourfold Calculator</h1>

        <nav style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <button onClick={() => navigate("/tnl")}>
            TNL Calculator
          </button>

          <button onClick={() => navigate("/exp-hour")}>
            EXP / Hour
          </button>
        </nav>
      </header>

      {page === "tnl" && <TNLCalculator />}
      {page === "exp-hour" && <ExpPerHourCalculator />}
    </div>
  );
}

function TNLCalculator() {
  const [mode, setMode] = useState("levels");

  // Current Level → Target Level
  const [currentLevel, setCurrentLevel] = useState("");
  const [targetLevel, setTargetLevel] = useState("");

  // Level → Total EXP
  const [levelForTotalExp, setLevelForTotalExp] = useState("");

  const [result, setResult] = useState(null);

  function handleCalculate() {
    if (mode === "levels") {
      const current = Number(currentLevel);
      const target = Number(targetLevel);

      if (
        current < 1 ||
        target < 1 ||
        target <= current
      ) {
        setResult(null);
        return;
      }

      const expNeeded = expBetweenLevels(
        current,
        target
      );

      const nextLevelExp = expToNextLevel(current);

      setResult({
        type: "levels",
        currentLevel: current,
        targetLevel: target,
        expNeeded: expNeeded,
        nextLevelExp: nextLevelExp,
      });
    }

    if (mode === "level-total-exp") {
      const level = Number(levelForTotalExp);

      if (level < 1) {
        setResult(null);
        return;
      }

      const totalExp = totalExpForLevel(level);

      setResult({
        type: "level-total-exp",
        level: level,
        totalExp: totalExp,
      });
    }
  }

  return (
    <main>
      <h2>To Next Level Calculator</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <input
            type="radio"
            name="tnl-mode"
            value="levels"
            checked={mode === "levels"}
            onChange={() => {
              setMode("levels");
              setResult(null);
            }}
          />

          {" "}Current Level → Target Level
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="tnl-mode"
            value="level-total-exp"
            checked={mode === "level-total-exp"}
            onChange={() => {
              setMode("level-total-exp");
              setResult(null);
            }}
          />

          {" "}Level → Total EXP
        </label>
      </div>

      {mode === "levels" && (
        <section>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="current-level">
              Current Level
            </label>

            <br />

            <input
              id="current-level"
              type="number"
              min="1"
              step="1"
              value={currentLevel}
              placeholder="Enter current level"
              onChange={(e) =>
                setCurrentLevel(e.target.value)
              }
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="target-level">
              Target Level
            </label>

            <br />

            <input
              id="target-level"
              type="number"
              min="1"
              step="1"
              value={targetLevel}
              placeholder="Enter target level"
              onChange={(e) =>
                setTargetLevel(e.target.value)
              }
            />
          </div>
        </section>
      )}

      {mode === "level-total-exp" && (
        <section>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="level-for-total-exp">
              Level
            </label>

            <br />

            <input
              id="level-for-total-exp"
              type="number"
              min="1"
              step="1"
              value={levelForTotalExp}
              placeholder="Enter level"
              onChange={(e) =>
                setLevelForTotalExp(e.target.value)
              }
            />
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={handleCalculate}
      >
        Calculate
      </button>

      <div style={{ marginTop: "30px" }}>
        <h3>Result</h3>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            minHeight: "80px",
          }}
        >
          {result === null && (
            "Results will appear here."
          )}

          {result?.type === "levels" && (
            <div>
              <p>
                EXP needed to reach level{" "}
                {result.targetLevel}:
              </p>

              <strong>
                {Math.round(
                  result.expNeeded
                ).toLocaleString()}{" "}
                EXP
              </strong>

              <p>
                EXP needed from level{" "}
                {result.currentLevel} to the next level:
              </p>

              <strong>
                {Math.round(
                  result.nextLevelExp
                ).toLocaleString()}{" "}
                EXP
              </strong>
            </div>
          )}

          {result?.type === "level-total-exp" && (
            <div>
              <p>
                Total EXP required to reach level{" "}
                {result.level}:
              </p>

              <strong>
                {Math.round(
                  result.totalExp
                ).toLocaleString()}{" "}
                EXP
              </strong>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ExpPerHourCalculator() {
  const [partySize, setPartySize] = useState(1);
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const [selectedArena, setSelectedArena] = useState("");

  const [arenaMode, setArenaMode] = useState("preset");

  const [manualArenaName, setManualArenaName] = useState("");
  const [manualExp, setManualExp] = useState("");

  const [result, setResult] = useState(null);

  function handleCalculate() {
    let expPerRun;

    if (arenaMode === "preset") {
      const arena = arenas.find((arena) => arena.id === selectedArena);

      if (!arena) {
        return;
      }

      expPerRun = arena.expPerRun;
    }

    if (arenaMode === "manual") {
      expPerRun = Number(manualExp);

      if (expPerRun <= 0) {
        return;
      }
    }

    const expPerHour = calculateExpPerHour(
      expPerRun,
      partySize,
      Number(minutes),
      Number(seconds)
    );

    setResult(expPerHour);
  }

  return (
    <main>
      <h2>EXP / Hour Calculator</h2>

      <section style={{ marginBottom: "25px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="party-size">
            Party Size
          </label>

          <br />

          <select
            id="party-size"
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
          >
            <option value={1}>1 Player</option>
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
            <option value={5}>5 Players</option>
          </select>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="minutes">
            Minutes
          </label>

          <br />

          <input
            id="minutes"
            type="number"
            min="0"
            step="1"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="seconds">
            Seconds
          </label>

          <br />

          <input
            id="seconds"
            type="number"
            min="0"
            max="59"
            step="1"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
          />
        </div>
      </section>

      <section style={{ marginBottom: "25px" }}>
        <h3>Arena</h3>

        <div style={{ marginBottom: "15px" }}>
          <label>
            <input
              type="radio"
              name="arena-mode"
              value="preset"
              checked={arenaMode === "preset"}
              onChange={() => setArenaMode("preset")}
            />
            {" "}Preset Arena
          </label>

          <br />

          <label>
            <input
              type="radio"
              name="arena-mode"
              value="manual"
              checked={arenaMode === "manual"}
              onChange={() => setArenaMode("manual")}
            />
            {" "}Manual Values
          </label>
        </div>

        {arenaMode === "preset" && (
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="arena">
              Arena
            </label>

            <br />

            <select
              id="arena"
              value={selectedArena}
              onChange={(e) => setSelectedArena(e.target.value)}
            >
              <option value="" disabled>
                Select an arena
              </option>

              {arenas.map((arena) => (
                <option key={arena.id} value={arena.id}>
                  {arena.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {arenaMode === "manual" && (
          <div>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="manual-arena-name">
                Arena Name
              </label>

              <br />

              <input
                id="manual-arena-name"
                type="text"
                placeholder="Example: Custom Dungeon"
                value={manualArenaName}
                onChange={(e) => setManualArenaName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="manual-exp">
                EXP per Completion
              </label>

              <br />

              <input
                id="manual-exp"
                type="number"
                min="0"
                step="1"
                placeholder="Enter EXP"
                value={manualExp}
                onChange={(e) => setManualExp(e.target.value)}
              />
            </div>
          </div>
        )}
      </section>

      <button type="button" onClick={handleCalculate}>
        Calculate
      </button>

      <div style={{ marginTop: "30px" }}>
        <h3>Result</h3>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            minHeight: "80px",
          }}
        >
          {result !== null ? `${Math.round(result).toLocaleString()} EXP / hour` : "Results will appear here."}
        </div>
      </div>
    </main>
  );
}

export default App;