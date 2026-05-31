import { useState, useEffect } from "react";

// ─── CSS ────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #F7F5F2;
    --surface: #FFFFFF;
    --surface2: #F0EDE8;
    --border: #E2DDD7;
    --accent: #C8F04E;
    --accent2: #1A1A1A;
    --text: #1A1A1A;
    --text2: #6B6560;
    --text3: #9E9790;
    --danger: #E84545;
    --success: #2ECC71;
    --warn: #F5A623;
    --shadow: 0 2px 12px rgba(0,0,0,0.07);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
    --radius: 12px;
    --radius-sm: 8px;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-body); background: var(--bg); color: var(--text); min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .topbar {
    background: var(--accent2); color: white; padding: 0 24px; height: 60px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
  }
  .topbar-logo { font-family: var(--font-display); font-size: 28px; letter-spacing: 2px; color: var(--accent); }
  .topbar-logo span { color: white; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .view-toggle { display: flex; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; }
  .view-toggle button {
    padding: 6px 14px; font-size: 13px; font-family: var(--font-body); font-weight: 500;
    border: none; background: transparent; color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.2s;
  }
  .view-toggle button.active { background: var(--accent); color: var(--accent2); }

  .main { display: flex; flex: 1; overflow: hidden; }

  .sidebar {
    width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0;
  }
  .sidebar-section { padding: 16px; }
  .sidebar-label {
    font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
    color: var(--text3); margin-bottom: 8px; padding: 0 4px;
  }
  .client-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: var(--radius-sm); cursor: pointer; transition: background 0.15s; margin-bottom: 2px;
  }
  .client-item:hover { background: var(--surface2); }
  .client-item.active { background: var(--accent); }
  .client-item.active .client-name { color: var(--accent2); font-weight: 600; }
  .client-avatar {
    width: 32px; height: 32px; border-radius: 50%; background: var(--accent2); color: var(--accent);
    font-family: var(--font-display); font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .client-name { font-size: 14px; font-weight: 500; color: var(--text); }
  .add-client-btn {
    width: 100%; padding: 10px; border: 2px dashed var(--border); border-radius: var(--radius-sm);
    background: transparent; color: var(--text3); font-family: var(--font-body); font-size: 13px;
    cursor: pointer; transition: all 0.2s; margin-top: 4px;
  }
  .add-client-btn:hover { border-color: var(--accent); color: var(--accent2); background: rgba(200,240,78,0.1); }

  .content { flex: 1; overflow-y: auto; padding: 24px; }

  .tabs {
    display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 4px; margin-bottom: 24px; width: fit-content;
  }
  .tab-btn {
    padding: 8px 18px; border: none; border-radius: var(--radius-sm); background: transparent;
    font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--text2); cursor: pointer; transition: all 0.2s;
  }
  .tab-btn.active { background: var(--accent2); color: white; }

  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; box-shadow: var(--shadow); margin-bottom: 16px;
  }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .card-title { font-family: var(--font-display); font-size: 20px; letter-spacing: 1px; color: var(--text); }

  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; }
  .stat-card { background: var(--surface2); border-radius: var(--radius); padding: 14px; text-align: center; }
  .stat-value { font-family: var(--font-display); font-size: 28px; letter-spacing: 1px; color: var(--accent2); line-height: 1; margin-bottom: 4px; }
  .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); }
  .stat-change { font-size: 12px; font-weight: 600; margin-top: 4px; }
  .stat-change.pos { color: var(--success); }
  .stat-change.neg { color: var(--danger); }

  .workout-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 12px; }
  .workout-header { background: var(--accent2); color: white; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
  .workout-title { font-family: var(--font-display); font-size: 18px; letter-spacing: 1px; color: var(--accent); }
  .workout-meta { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .exercise-row {
    display: grid; grid-template-columns: 1fr 70px 70px 80px 90px;
    gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--border); align-items: center; font-size: 14px;
  }
  .exercise-row:last-child { border-bottom: none; }
  .exercise-row.header {
    background: var(--surface2); font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.8px; color: var(--text3); padding: 8px 16px;
  }
  .exercise-name { font-weight: 500; }
  .log-input {
    width: 100%; padding: 4px 8px; border: 1px solid var(--border); border-radius: 6px;
    font-family: var(--font-body); font-size: 13px; background: var(--bg); text-align: center; transition: border-color 0.2s;
  }
  .log-input:focus { outline: none; border-color: var(--accent); }
  .log-input.logged { background: rgba(200,240,78,0.15); border-color: var(--accent); }

  .btn {
    padding: 10px 20px; border-radius: var(--radius-sm); border: none; font-family: var(--font-body);
    font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-primary { background: var(--accent); color: var(--accent2); }
  .btn-primary:hover { background: #b8e030; transform: translateY(-1px); }
  .btn-dark { background: var(--accent2); color: white; }
  .btn-dark:hover { background: #333; transform: translateY(-1px); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface2); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text2); margin-bottom: 6px; display: block; }
  .form-input {
    width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);
    font-family: var(--font-body); font-size: 14px; background: var(--surface); color: var(--text); transition: border-color 0.2s;
  }
  .form-input:focus { outline: none; border-color: var(--accent2); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 200; padding: 20px;
  }
  .modal {
    background: var(--surface); border-radius: var(--radius); padding: 28px;
    width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg);
  }
  .modal-title { font-family: var(--font-display); font-size: 24px; letter-spacing: 1px; margin-bottom: 20px; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

  .tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .tag-green { background: rgba(46,204,113,0.15); color: var(--success); }
  .tag-yellow { background: rgba(200,240,78,0.3); color: #7a9000; }

  .empty { text-align: center; padding: 48px 24px; color: var(--text3); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-title { font-family: var(--font-display); font-size: 22px; letter-spacing: 1px; color: var(--text2); margin-bottom: 6px; }
  .empty-sub { font-size: 14px; }

  .client-hero {
    background: var(--accent2); border-radius: var(--radius); padding: 24px; color: white;
    margin-bottom: 20px; display: flex; align-items: center; gap: 20px;
  }
  .client-hero-avatar {
    width: 60px; height: 60px; border-radius: 50%; background: var(--accent); color: var(--accent2);
    font-family: var(--font-display); font-size: 26px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .client-hero-name { font-family: var(--font-display); font-size: 32px; letter-spacing: 2px; color: var(--accent); }
  .client-hero-sub { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 2px; }

  .section-title { font-family: var(--font-display); font-size: 22px; letter-spacing: 1px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .log-date { font-size: 12px; color: var(--text3); margin-bottom: 8px; font-weight: 500; }
  .evolt-form { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .no-client { flex: 1; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; color: var(--text3); padding: 48px; }
  .no-client-icon { font-size: 56px; opacity: 0.4; }
  .no-client-text { font-family: var(--font-display); font-size: 28px; letter-spacing: 2px; color: var(--text2); }
  .exercise-builder-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 36px; gap: 8px; align-items: center; margin-bottom: 8px; }

  .link-box {
    display: flex; align-items: center; gap: 8px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 8px 12px; margin-top: 6px;
  }
  .link-text { font-size: 12px; color: var(--text2); font-family: monospace; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 24px; }
  .login-card { background: var(--surface); border-radius: var(--radius); padding: 40px 36px; width: 100%; max-width: 400px; box-shadow: var(--shadow-lg); text-align: center; }
  .login-logo { font-family: var(--font-display); font-size: 36px; letter-spacing: 3px; color: var(--accent2); margin-bottom: 4px; }
  .login-logo span { color: var(--accent); }
  .login-sub { color: var(--text3); font-size: 14px; margin-bottom: 32px; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  @media (max-width: 768px) {
    .sidebar { width: 200px; }
    .exercise-row { grid-template-columns: 1fr 55px 55px 65px 80px; font-size: 12px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .evolt-form { grid-template-columns: repeat(2,1fr); }
  }
`;

// ─── STORAGE — uses localStorage for standalone deployment ───────────────────
const STORAGE_KEY = "fitcoach_data";

const defaultData = {
  clients: [
    { id: "c1", name: "Alex Johnson", email: "alex@email.com", goal: "Muscle Gain", joinDate: "2024-01-15", token: "tok_alexj" },
    { id: "c2", name: "Sarah Williams", email: "sarah@email.com", goal: "Weight Loss", joinDate: "2024-02-01", token: "tok_sarahw" },
    { id: "c3", name: "Mike Torres", email: "mike@email.com", goal: "Athletic Performance", joinDate: "2024-03-10", token: "tok_miket" },
  ],
  workouts: {},
  logs: {},
  evolt: {},
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultData;
  } catch { return defaultData; }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function generateToken(name) {
  const slug = name.toLowerCase().replace(/\s+/g, "").slice(0, 8);
  const rand = Math.random().toString(36).slice(2, 7);
  return `tok_${slug}${rand}`;
}

// ─── SPARKLINE ───────────────────────────────────────────────────────────────
function SparkLine({ data, color = "#C8F04E", height = 80 }) {
  if (!data || data.length < 2) return (
    <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 12 }}>Not enough data</div>
  );
  const w = 300, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * (h - 10) - 5;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

// ─── EVOLT PANEL ─────────────────────────────────────────────────────────────
function EvoltPanel({ clientId, evoltData, onAdd }) {
  const entries = evoltData[clientId] || [];
  const latest = entries[entries.length - 1];
  const prev = entries[entries.length - 2];
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), bodyFat: "", muscleMass: "", bmi: "", hydration: "", visceralFat: "", weight: "" });

  const fields = [
    { key: "bodyFat", label: "Body Fat", unit: "%" },
    { key: "muscleMass", label: "Muscle Mass", unit: "kg" },
    { key: "bmi", label: "BMI", unit: "" },
    { key: "hydration", label: "Hydration", unit: "%" },
    { key: "visceralFat", label: "Visceral Fat", unit: "" },
    { key: "weight", label: "Weight", unit: "kg" },
  ];

  function delta(key) {
    if (!latest || !prev || !latest[key] || !prev[key]) return null;
    return parseFloat(latest[key]) - parseFloat(prev[key]);
  }

  function handleAdd() {
    onAdd(clientId, { ...form, id: Date.now().toString() });
    setShowForm(false);
    setForm({ date: new Date().toISOString().slice(0, 10), bodyFat: "", muscleMass: "", bmi: "", hydration: "", visceralFat: "", weight: "" });
  }

  return (
    <div>
      <div className="card-header">
        <div className="section-title">⚡ EVOLT Data</div>
        <button className="btn btn-dark btn-sm" onClick={() => setShowForm(true)}>+ Add Scan</button>
      </div>
      {latest && (
        <div className="stats-grid">
          {fields.map(f => {
            const d = delta(f.key);
            const isGoodDown = ["bodyFat", "visceralFat"].includes(f.key);
            return (
              <div className="stat-card" key={f.key}>
                <div className="stat-value">{latest[f.key] || "—"}<span style={{ fontSize: 14 }}>{f.unit}</span></div>
                <div className="stat-label">{f.label}</div>
                {d !== null && (
                  <div className={`stat-change ${isGoodDown ? (d < 0 ? "pos" : "neg") : (d > 0 ? "pos" : "neg")}`}>
                    {d > 0 ? "▲" : "▼"} {Math.abs(d).toFixed(1)}{f.unit}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {entries.length > 1 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>Body Fat % Trend</div>
          <SparkLine data={entries.map(e => parseFloat(e.bodyFat)).filter(Boolean)} color="#C8F04E" />
          <div style={{ marginTop: 16, marginBottom: 12, fontSize: 13, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>Muscle Mass Trend</div>
          <SparkLine data={entries.map(e => parseFloat(e.muscleMass)).filter(Boolean)} color="#1A1A1A" />
        </div>
      )}
      {entries.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📊</div>
          <div className="empty-title">No Scans Yet</div>
          <div className="empty-sub">Add the first EVOLT scan to start tracking progress.</div>
        </div>
      )}
      {entries.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Scan History</div>
          {[...entries].reverse().map((e, i) => (
            <div key={e.id} style={{ padding: "10px 0", borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none", fontSize: 13 }}>
              <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--text2)" }}>{e.date}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {fields.map(f => e[f.key] ? <span key={f.key}><span style={{ color: "var(--text3)" }}>{f.label}: </span>{e[f.key]}{f.unit}</span> : null)}
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add EVOLT Scan</div>
            <div className="form-group">
              <label className="form-label">Scan Date</label>
              <input type="date" className="form-input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="evolt-form">
              {fields.map(f => (
                <div className="form-group" key={f.key}>
                  <label className="form-label">{f.label}{f.unit ? ` (${f.unit})` : ""}</label>
                  <input type="number" step="0.1" className="form-input" placeholder="0.0" value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd}>Save Scan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WORKOUT BUILDER ─────────────────────────────────────────────────────────
function WorkoutBuilder({ onSave, onCancel, existing }) {
  const [name, setName] = useState(existing?.name || "");
  const [day, setDay] = useState(existing?.day || "");
  const [exercises, setExercises] = useState(existing?.exercises || [{ name: "", sets: "", reps: "", weight: "", rest: "" }]);

  function addEx() { setExercises(p => [...p, { name: "", sets: "", reps: "", weight: "", rest: "" }]); }
  function removeEx(i) { setExercises(p => p.filter((_, idx) => idx !== i)); }
  function updateEx(i, field, val) { setExercises(p => p.map((e, idx) => idx === i ? { ...e, [field]: val } : e)); }

  function save() {
    if (!name.trim()) return;
    onSave({ id: existing?.id || Date.now().toString(), name, day, exercises: exercises.filter(e => e.name.trim()) });
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
        <div className="modal-title">{existing ? "Edit Workout" : "New Workout"}</div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Workout Name</label>
            <input className="form-input" placeholder="e.g. Upper Body A" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Day / Label</label>
            <input className="form-input" placeholder="e.g. Monday, Day 1" value={day} onChange={e => setDay(e.target.value)} />
          </div>
        </div>
        <div className="divider" />
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 36px", gap: 8, marginBottom: 6, padding: "0 2px" }}>
          {["Exercise", "Sets", "Reps", "Weight", "Rest (s)", ""].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--text3)" }}>{h}</div>
          ))}
        </div>
        {exercises.map((ex, i) => (
          <div key={i} className="exercise-builder-row">
            <input className="form-input" placeholder="Exercise name" value={ex.name} onChange={e => updateEx(i, "name", e.target.value)} />
            <input className="form-input" placeholder="4" value={ex.sets} onChange={e => updateEx(i, "sets", e.target.value)} style={{ textAlign: "center" }} />
            <input className="form-input" placeholder="10" value={ex.reps} onChange={e => updateEx(i, "reps", e.target.value)} style={{ textAlign: "center" }} />
            <input className="form-input" placeholder="kg" value={ex.weight} onChange={e => updateEx(i, "weight", e.target.value)} style={{ textAlign: "center" }} />
            <input className="form-input" placeholder="60" value={ex.rest} onChange={e => updateEx(i, "rest", e.target.value)} style={{ textAlign: "center" }} />
            <button onClick={() => removeEx(i)} style={{ width: 32, height: 32, border: "none", background: "var(--surface2)", borderRadius: 6, cursor: "pointer", color: "var(--danger)", fontWeight: 700, fontSize: 16 }}>×</button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={addEx}>+ Add Exercise</button>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={save}>Save Workout</button>
        </div>
      </div>
    </div>
  );
}

// ─── WORKOUT LOG VIEW ─────────────────────────────────────────────────────────
function WorkoutLogView({ workout, logs, onLog, isTrainer }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = (logs[workout.id] || []).find(l => l.date === today);
  const [data, setData] = useState(todayLog?.data || {});
  const [saved, setSaved] = useState(false);

  function handleChange(exIdx, val) {
    setData(p => ({ ...p, [`${exIdx}_actual`]: val }));
    setSaved(false);
  }

  function handleSave() {
    onLog(workout.id, { date: today, data });
    setSaved(true);
  }

  const pastLogs = (logs[workout.id] || []).filter(l => l.date !== today).slice(-3).reverse();

  return (
    <div className="workout-card">
      <div className="workout-header">
        <div>
          <div className="workout-title">{workout.name}</div>
          <div className="workout-meta">{workout.day} · {workout.exercises.length} exercises</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <span className="tag tag-green">✓ Saved</span>}
          {!isTrainer && <button className="btn btn-primary btn-sm" onClick={handleSave}>Log Session</button>}
        </div>
      </div>
      <div>
        <div className="exercise-row header">
          <span>Exercise</span><span>Sets</span><span>Reps</span><span>Target</span><span>Actual</span>
        </div>
        {workout.exercises.map((ex, i) => (
          <div className="exercise-row" key={i}>
            <span className="exercise-name">{ex.name}</span>
            <span style={{ textAlign: "center", color: "var(--text2)" }}>{ex.sets}</span>
            <span style={{ textAlign: "center", color: "var(--text2)" }}>{ex.reps}</span>
            <span style={{ textAlign: "center", color: "var(--text2)" }}>{ex.weight}</span>
            {isTrainer ? (
              <span style={{ textAlign: "center", color: "var(--text3)", fontSize: 12 }}>—</span>
            ) : (
              <input className={`log-input ${data[`${i}_actual`] ? "logged" : ""}`} placeholder="kg × reps" value={data[`${i}_actual`] || ""} onChange={e => handleChange(i, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      {pastLogs.length > 0 && (
        <div style={{ padding: "12px 16px", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "var(--text3)", marginBottom: 8 }}>Recent Sessions</div>
          {pastLogs.map((log, i) => (
            <div key={i} style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{log.date}:</span>{" "}
              {Object.entries(log.data).filter(([k]) => k.endsWith("_actual")).map(([k, v]) => {
                const idx = parseInt(k.split("_")[0]);
                return `${workout.exercises[idx]?.name}: ${v}`;
              }).join(" · ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CLIENT DETAIL ────────────────────────────────────────────────────────────
function ClientDetail({ client, data, onUpdate, isTrainer }) {
  const [tab, setTab] = useState("workouts");
  const [showBuilder, setShowBuilder] = useState(false);
  const [editWorkout, setEditWorkout] = useState(null);
  const [copied, setCopied] = useState(false);

  const workouts = data.workouts[client.id] || [];
  const logs = data.logs[client.id] || {};
  const evolt = data.evolt || {};
  const clientLink = `${window.location.origin}${window.location.pathname}?client=${client.token}`;

  function copyLink() {
    navigator.clipboard.writeText(clientLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  function saveWorkout(w) {
    const existing = workouts.find(x => x.id === w.id);
    const updated = existing ? workouts.map(x => x.id === w.id ? w : x) : [...workouts, w];
    onUpdate({ workouts: { ...data.workouts, [client.id]: updated } });
    setShowBuilder(false); setEditWorkout(null);
  }

  function deleteWorkout(id) {
    onUpdate({ workouts: { ...data.workouts, [client.id]: workouts.filter(w => w.id !== id) } });
  }

  function logWorkout(workoutId, entry) {
    const clientLogs = logs[workoutId] || [];
    const existing = clientLogs.findIndex(l => l.date === entry.date);
    const updated = existing >= 0 ? clientLogs.map((l, i) => i === existing ? entry : l) : [...clientLogs, entry];
    onUpdate({ logs: { ...data.logs, [client.id]: { ...logs, [workoutId]: updated } } });
  }

  function addEvolt(clientId, entry) {
    const entries = evolt[clientId] || [];
    onUpdate({ evolt: { ...evolt, [clientId]: [...entries, entry] } });
  }

  const totalSessions = Object.values(logs).reduce((a, v) => a + v.length, 0);

  const tabs = isTrainer
    ? [{ id: "workouts", label: "Workouts" }, { id: "evolt", label: "EVOLT" }, { id: "progress", label: "Progress" }, { id: "access", label: "Client Link" }]
    : [{ id: "workouts", label: "My Workouts" }, { id: "evolt", label: "Body Stats" }, { id: "progress", label: "History" }];

  return (
    <div className="content">
      <div className="client-hero">
        <div className="client-hero-avatar">{client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
        <div style={{ flex: 1 }}>
          <div className="client-hero-name">{client.name}</div>
          <div className="client-hero-sub">{client.goal} · {client.email} · {totalSessions} sessions logged</div>
        </div>
        {isTrainer && <button className="btn btn-primary btn-sm" onClick={() => setShowBuilder(true)}>+ Workout</button>}
      </div>

      <div className="tabs">
        {tabs.map(t => <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>

      {tab === "workouts" && (
        <div>
          {workouts.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🏋️</div>
              <div className="empty-title">No Workouts Yet</div>
              <div className="empty-sub">{isTrainer ? "Build the first workout plan." : "Your trainer hasn't added any workouts yet."}</div>
              {isTrainer && <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowBuilder(true)}>+ Create Workout</button>}
            </div>
          ) : workouts.map(w => (
            <div key={w.id}>
              <WorkoutLogView workout={w} logs={logs} onLog={logWorkout} isTrainer={isTrainer} />
              {isTrainer && (
                <div style={{ display: "flex", gap: 8, marginTop: -8, marginBottom: 16, justifyContent: "flex-end" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditWorkout(w); setShowBuilder(true); }}>Edit</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => deleteWorkout(w.id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "evolt" && (
        <div className="card"><EvoltPanel clientId={client.id} evoltData={evolt} onAdd={addEvolt} /></div>
      )}

      {tab === "progress" && (
        <div>
          <div className="section-title">📋 Session History</div>
          {Object.entries(logs).length === 0 ? (
            <div className="empty"><div className="empty-icon">📅</div><div className="empty-title">No Sessions Logged</div></div>
          ) : Object.entries(logs).map(([workoutId, entries]) => {
            const workout = workouts.find(w => w.id === workoutId);
            if (!workout || entries.length === 0) return null;
            return (
              <div className="card" key={workoutId}>
                <div className="card-title" style={{ marginBottom: 12 }}>{workout.name}</div>
                {[...entries].reverse().map((entry, i) => (
                  <div key={i} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div className="log-date">📅 {entry.date}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Object.entries(entry.data).filter(([k]) => k.endsWith("_actual")).map(([k, v]) => {
                        const idx = parseInt(k.split("_")[0]);
                        return <span key={k} className="tag tag-yellow">{workout.exercises[idx]?.name}: {v}</span>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {tab === "access" && isTrainer && (
        <div className="card">
          <div className="section-title">🔗 Client Access Link</div>
          <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 16, lineHeight: 1.6 }}>
            Send this private link to <strong>{client.name}</strong>. They'll see only their own data.
          </p>
          <div className="link-box">
            <span className="link-text">{clientLink}</span>
            <button className="btn btn-primary btn-sm" onClick={copyLink}>{copied ? "✓ Copied!" : "Copy Link"}</button>
          </div>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 12 }}>Each client has a unique token. To reset access, delete and re-add the client.</p>
        </div>
      )}

      {showBuilder && <WorkoutBuilder onSave={saveWorkout} onCancel={() => { setShowBuilder(false); setEditWorkout(null); }} existing={editWorkout} />}
    </div>
  );
}

// ─── ADD CLIENT MODAL ─────────────────────────────────────────────────────────
function AddClientModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", goal: "General Fitness" });
  const goals = ["General Fitness", "Muscle Gain", "Weight Loss", "Athletic Performance", "Mobility", "Endurance"];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">Add New Client</div>
        <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="jane@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
        <div className="form-group">
          <label className="form-label">Goal</label>
          <select className="form-input" value={form.goal} onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}>
            {goals.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { if (form.name) onSave({ ...form, id: "c" + Date.now(), joinDate: new Date().toISOString().slice(0, 10), token: generateToken(form.name) }); }}>Add Client</button>
        </div>
      </div>
    </div>
  );
}

// ─── TRAINER DASHBOARD ───────────────────────────────────────────────────────
function TrainerDashboard({ data, onUpdate }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const clients = data.clients || [];

  function addClient(client) {
    onUpdate({ clients: [...clients, client] });
    setSelectedClient(client);
    setShowAddClient(false);
  }

  const client = clients.find(c => c.id === selectedClient?.id);

  return (
    <div className="main">
      <div className="sidebar">
        <div className="sidebar-section">
          <div className="sidebar-label">Clients ({clients.length})</div>
          {clients.map(c => (
            <div key={c.id} className={`client-item ${selectedClient?.id === c.id ? "active" : ""}`} onClick={() => setSelectedClient(c)}>
              <div className="client-avatar">{c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
              <div>
                <div className="client-name">{c.name}</div>
                <div style={{ fontSize: 11, color: selectedClient?.id === c.id ? "rgba(26,26,26,0.6)" : "var(--text3)" }}>{c.goal}</div>
              </div>
            </div>
          ))}
          <button className="add-client-btn" onClick={() => setShowAddClient(true)}>+ Add Client</button>
        </div>
      </div>
      {client ? (
        <ClientDetail client={client} data={data} onUpdate={onUpdate} isTrainer={true} />
      ) : (
        <div className="no-client">
          <div className="no-client-icon">👈</div>
          <div className="no-client-text">Select a Client</div>
          <div style={{ fontSize: 14, color: "var(--text3)", maxWidth: 240, textAlign: "center" }}>Choose a client from the sidebar to manage their profile, workouts, and EVOLT data.</div>
        </div>
      )}
      {showAddClient && <AddClientModal onSave={addClient} onClose={() => setShowAddClient(false)} />}
    </div>
  );
}

// ─── CLIENT PORTAL ────────────────────────────────────────────────────────────
function ClientPortal({ data, onUpdate, token }) {
  const client = (data.clients || []).find(c => c.token === token);
  if (!client) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-logo">FIT<span>COACH</span></div>
          <div className="login-sub">Your personal training portal</div>
          <div style={{ color: "var(--danger)", fontSize: 14, marginTop: 8 }}>
            ⚠️ This link is invalid or has expired.<br />Please contact your trainer for a new link.
          </div>
        </div>
      </div>
    );
  }
  return <div className="main"><ClientDetail client={client} data={data} onUpdate={onUpdate} isTrainer={false} /></div>;
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("trainer");
  const [data, setData] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const clientToken = params.get("client");

  useEffect(() => { setData(loadData()); }, []);

  function handleUpdate(patch) {
    const updated = { ...data, ...patch };
    setData(updated);
    saveData(updated);
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ ...data, _exported: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitcoach-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!data) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "DM Sans, sans-serif", color: "#9E9790" }}><style>{styles}</style>Loading…</div>;

  if (clientToken) {
    return (
      <div className="app">
        <style>{styles}</style>
        <div className="topbar"><div className="topbar-logo">FIT<span>COACH</span></div></div>
        <ClientPortal data={data} onUpdate={handleUpdate} token={clientToken} />
      </div>
    );
  }

  return (
    <div className="app">
      <style>{styles}</style>
      <div className="topbar">
        <div className="topbar-logo">FIT<span>COACH</span></div>
        <div className="topbar-right">
          <div className="view-toggle">
            <button className={view === "trainer" ? "active" : ""} onClick={() => setView("trainer")}>Trainer</button>
            <button className={view === "client" ? "active" : ""} onClick={() => setView("client")}>Preview</button>
          </div>
          <button onClick={exportData} style={{ padding: "6px 14px", fontSize: 13, fontFamily: "var(--font-body)", fontWeight: 600, border: "none", background: "rgba(200,240,78,0.15)", color: "var(--accent)", borderRadius: 8, cursor: "pointer" }}>↓ Export</button>
        </div>
      </div>
      {view === "trainer" ? (
        <TrainerDashboard data={data} onUpdate={handleUpdate} />
      ) : (
        <div style={{ padding: 24, flex: 1 }}>
          <div className="card" style={{ maxWidth: 500 }}>
            <div className="section-title">👁 Preview Mode</div>
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>Go to a client's <strong>Client Link</strong> tab and copy their unique link to preview their view.</p>
          </div>
        </div>
      )}
    </div>
  );
}
