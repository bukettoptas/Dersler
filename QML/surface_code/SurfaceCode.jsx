import { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 5;

const COLORS = {
  dataNormal: "#0891B2",
  dataError: "#EF4444",
  measureNormal: "#F8FAFC",
  measureAlert: "#F59E0B",
  bg: "#0F172A",
  cardBg: "#1E293B",
  text: "#F1F5F9",
  muted: "#94A3B8",
  green: "#10B981",
  purple: "#7C3AED",
  teal: "#0891B2",
  border: "#334155",
};

function createInitialGrid() {
  const grid = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    const row = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      const isData = (r + c) % 2 === 0;
      row.push({
        isData,
        hasError: false,
        isAlert: false,
        value: 0,
      });
    }
    row.push({ isData: false, hasError: false, isAlert: false, value: 0, hidden: true });
    grid.push(row);
  }
  return grid;
}

function getNeighborDataQubits(grid, r, c) {
  const neighbors = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && grid[nr][nc].isData) {
      neighbors.push({ r: nr, c: nc });
    }
  }
  return neighbors;
}

function detectSyndromes(grid) {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell, isAlert: false })));
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!newGrid[r][c].isData && !newGrid[r][c].hidden) {
        const neighbors = getNeighborDataQubits(newGrid, r, c);
        const errorCount = neighbors.filter(n => newGrid[n.r][n.c].hasError).length;
        newGrid[r][c].isAlert = errorCount % 2 === 1;
      }
    }
  }
  return newGrid;
}

export default function SurfaceCodeViz() {
  const [grid, setGrid] = useState(createInitialGrid());
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showInfo, setShowInfo] = useState(0);

  const resetGrid = useCallback(() => {
    setGrid(createInitialGrid());
    setStep(0);
    setAutoPlay(false);
  }, []);

  const injectRandomError = useCallback(() => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell, hasError: false, isAlert: false })));
    const dataCells = [];
    for (let r = 0; r < GRID_SIZE; r++)
      for (let c = 0; c < GRID_SIZE; c++)
        if (newGrid[r][c].isData) dataCells.push({ r, c });
    const chosen = dataCells[Math.floor(Math.random() * dataCells.length)];
    newGrid[chosen.r][chosen.c].hasError = true;
    setGrid(newGrid);
    setStep(1);
  }, [grid]);

  const runSyndrome = useCallback(() => {
    setGrid(prev => detectSyndromes(prev));
    setStep(2);
  }, []);

  const fixError = useCallback(() => {
    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
      const alerts = [];
      for (let r = 0; r < GRID_SIZE; r++)
        for (let c = 0; c < GRID_SIZE; c++)
          if (newGrid[r][c].isAlert) alerts.push({ r, c });

      if (alerts.length >= 1) {
        const candidates = new Set();
        for (const a of alerts) {
          const neighbors = getNeighborDataQubits(newGrid, a.r, a.c);
          for (const n of neighbors) {
            candidates.add(`${n.r},${n.c}`);
          }
        }
        for (const key of candidates) {
          const [rr, cc] = key.split(",").map(Number);
          if (newGrid[rr][cc].hasError) {
            newGrid[rr][cc].hasError = false;
          }
        }
      }
      for (let r = 0; r < GRID_SIZE; r++)
        for (let c = 0; c < GRID_SIZE; c++)
          newGrid[r][c].isAlert = false;
      return newGrid;
    });
    setStep(3);
  }, []);

  const toggleCellError = (r, c) => {
    if (!grid[r][c].isData) return;
    const newGrid = grid.map(row => row.map(cell => ({ ...cell, isAlert: false })));
    newGrid[r][c].hasError = !newGrid[r][c].hasError;
    setGrid(newGrid);
    setStep(1);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const timers = [];
    if (step === 0) {
      timers.push(setTimeout(injectRandomError, 1000));
    } else if (step === 1) {
      timers.push(setTimeout(runSyndrome, 1500));
    } else if (step === 2) {
      timers.push(setTimeout(fixError, 2000));
    } else if (step === 3) {
      timers.push(setTimeout(() => {
        resetGrid();
        setTimeout(() => setAutoPlay(true), 500);
      }, 1500));
    }
    return () => timers.forEach(clearTimeout);
  }, [autoPlay, step, injectRandomError, runSyndrome, fixError, resetGrid]);

  const stepLabels = [
    { label: "Başlangıç", desc: "Tüm veri qubitleri sağlıklı", color: COLORS.teal },
    { label: "Hata Oluştu!", desc: "Bir veri qubitinde hata (kırmızı)", color: COLORS.dataError },
    { label: "Sendrom Ölçümü", desc: "Ölçüm qubitleri hatayı tespit etti (sarı)", color: COLORS.measureAlert },
    { label: "Düzeltildi!", desc: "Hata bulunup düzeltildi", color: COLORS.green },
  ];

  const cellSize = 52;
  const gap = 4;
  const gridPixels = GRID_SIZE * (cellSize + gap);

  const infoTabs = [
    {
      title: "Surface Code Nedir?",
      content: "Surface Code, kuantum hata düzeltme kodlarının en popüleridir. Qubit'leri 2 boyutlu bir ızgara üzerine yerleştirir. İki tür qubit vardır:\n\n• Veri qubitleri (renkli): Gerçek hesaplama bilgisini taşır\n• Ölçüm qubitleri (beyaz): Komşu veri qubitlerini kontrol eder\n\nBir emülatör veya yazılım DEĞİLDİR — fiziksel qubit'lerin nasıl düzenleneceğini ve bağlanacağını belirleyen bir MİMARİ PLANDIR."
    },
    {
      title: "Nasıl Çalışır?",
      content: "1️⃣ Veri qubitleri hesap yapar\n2️⃣ Ölçüm qubitleri sürekli komşularını kontrol eder\n3️⃣ \"Komşularımda tutarsızlık var mı?\" sorusunu sorar\n4️⃣ Tutarsızlık = HATA sinyali (sendrom)\n5️⃣ Klasik bilgisayar sendromu analiz eder\n6️⃣ Düzeltme komutu gönderilir\n\nÖnemli: Ölçüm qubitleri ASıL BİLGİYİ ölçmez — sadece \"komşular arasında fark var mı?\" diye bakar. Bu yüzden süperpozisyon bozulmaz!"
    },
    {
      title: "Neden Izgarada?",
      content: "Surface Code'un 2D ızgara yapısının avantajları:\n\n• Her qubit sadece 4 komşusuyla bağlantılı → üretimi kolay\n• Gerçek çip üzerinde fiziksel olarak uygulanabilir\n• IBM ve Google'ın çip tasarımları bu ızgarayı kullanıyor\n• Hata eşiği ~%1 → bugünkü qubit'lerin hata oranına yakın!\n\nAlternatifler (ör. qLDPC kodları) daha verimli ama üretimi çok daha zor."
    }
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", padding: "20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ color: COLORS.text, fontSize: 24, textAlign: "center", marginBottom: 4 }}>
          Surface Code — İnteraktif Görselleştirme
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", marginBottom: 20 }}>
          Veri qubit'lerine tıklayarak hata ekle, ardından tespit ve düzeltme sürecini izle
        </p>

        {/* Step indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {stepLabels.map((s, i) => (
            <div key={i} style={{
              padding: "8px 14px", borderRadius: 8,
              background: step === i ? s.color + "22" : COLORS.cardBg,
              border: `2px solid ${step === i ? s.color : COLORS.border}`,
              transition: "all 0.3s"
            }}>
              <div style={{ fontSize: 11, color: step === i ? s.color : COLORS.muted, fontWeight: 700 }}>
                Adım {i}
              </div>
              <div style={{ fontSize: 13, color: step === i ? COLORS.text : COLORS.muted, fontWeight: step === i ? 700 : 400 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Grid */}
          <div style={{ background: COLORS.cardBg, borderRadius: 16, padding: 24, border: `1px solid ${COLORS.border}` }}>
            <div style={{ position: "relative", width: gridPixels, height: gridPixels }}>
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  if (cell.hidden) return null;
                  const x = c * (cellSize + gap);
                  const y = r * (cellSize + gap);

                  let bg, borderColor, shadow = "none";
                  if (cell.isData) {
                    bg = cell.hasError ? COLORS.dataError : COLORS.dataNormal;
                    borderColor = cell.hasError ? "#DC2626" : "#0E7490";
                    if (cell.hasError) shadow = "0 0 12px rgba(239,68,68,0.6)";
                  } else {
                    bg = cell.isAlert ? COLORS.measureAlert : COLORS.measureNormal;
                    borderColor = cell.isAlert ? "#D97706" : "#CBD5E1";
                    if (cell.isAlert) shadow = "0 0 12px rgba(245,158,11,0.6)";
                  }

                  return (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => toggleCellError(r, c)}
                      style={{
                        position: "absolute", left: x, top: y,
                        width: cellSize, height: cellSize,
                        borderRadius: cell.isData ? 8 : 24,
                        background: bg, border: `2px solid ${borderColor}`,
                        boxShadow: shadow,
                        cursor: cell.isData ? "pointer" : "default",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.4s ease",
                        transform: cell.hasError ? "scale(1.1)" : cell.isAlert ? "scale(1.05)" : "scale(1)"
                      }}
                    >
                      <span style={{
                        fontSize: cell.isData ? 11 : 9,
                        fontWeight: 700,
                        color: cell.isData ? "white" : (cell.isAlert ? "#92400E" : "#64748B")
                      }}>
                        {cell.isData ? (cell.hasError ? "HATA" : "Veri") : (cell.isAlert ? "⚠" : "Ölç")}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Connection lines */}
              <svg style={{ position: "absolute", top: 0, left: 0, width: gridPixels, height: gridPixels, pointerEvents: "none" }}>
                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    if (cell.isData || cell.hidden) return null;
                    const cx = c * (cellSize + gap) + cellSize / 2;
                    const cy = r * (cellSize + gap) + cellSize / 2;
                    const neighbors = getNeighborDataQubits(grid, r, c);
                    return neighbors.map((n, i) => {
                      const nx = n.c * (cellSize + gap) + cellSize / 2;
                      const ny = n.r * (cellSize + gap) + cellSize / 2;
                      const isErrorPath = grid[n.r][n.c].hasError && cell.isAlert;
                      return (
                        <line key={`${r}-${c}-${i}`}
                          x1={cx} y1={cy} x2={nx} y2={ny}
                          stroke={isErrorPath ? COLORS.measureAlert : COLORS.border}
                          strokeWidth={isErrorPath ? 2.5 : 1}
                          opacity={isErrorPath ? 0.8 : 0.2}
                          strokeDasharray={isErrorPath ? "none" : "3,3"}
                        />
                      );
                    });
                  })
                )}
              </svg>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { color: COLORS.dataNormal, label: "Veri Qubit", shape: "square" },
                { color: COLORS.dataError, label: "Hatalı Qubit", shape: "square" },
                { color: COLORS.measureNormal, label: "Ölçüm Qubit", shape: "circle" },
                { color: COLORS.measureAlert, label: "Alarm!", shape: "circle" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 14, height: 14,
                    borderRadius: item.shape === "circle" ? "50%" : 3,
                    background: item.color,
                    border: `1px solid ${COLORS.border}`
                  }} />
                  <span style={{ fontSize: 11, color: COLORS.muted }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={injectRandomError} style={btnStyle(COLORS.dataError)}>
                Rastgele Hata Ekle
              </button>
              <button onClick={runSyndrome} disabled={step < 1} style={btnStyle(COLORS.measureAlert, step < 1)}>
                Sendrom Ölç
              </button>
              <button onClick={fixError} disabled={step < 2} style={btnStyle(COLORS.green, step < 2)}>
                Düzelt
              </button>
              <button onClick={resetGrid} style={btnStyle(COLORS.muted)}>
                Sıfırla
              </button>
              <button onClick={() => { resetGrid(); setTimeout(() => setAutoPlay(true), 300); }}
                style={btnStyle(COLORS.purple)}>
                ▶ Otomatik Demo
              </button>
            </div>
          </div>

          {/* Info panel */}
          <div style={{ flex: "1 1 280px", maxWidth: 340 }}>
            {/* Current step info */}
            <div style={{
              background: stepLabels[step].color + "15",
              border: `1px solid ${stepLabels[step].color}44`,
              borderRadius: 12, padding: 16, marginBottom: 16
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: stepLabels[step].color, marginBottom: 4 }}>
                {stepLabels[step].label}
              </div>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>
                {stepLabels[step].desc}
              </div>
            </div>

            {/* Tab buttons */}
            <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
              {infoTabs.map((tab, i) => (
                <button key={i} onClick={() => setShowInfo(i)} style={{
                  flex: 1, padding: "6px 4px", borderRadius: 6, border: "none",
                  background: showInfo === i ? COLORS.teal : COLORS.cardBg,
                  color: showInfo === i ? "white" : COLORS.muted,
                  fontSize: 10, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s"
                }}>
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Info content */}
            <div style={{
              background: COLORS.cardBg, borderRadius: 12,
              padding: 16, border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ color: COLORS.teal, fontSize: 14, marginTop: 0, marginBottom: 8 }}>
                {infoTabs[showInfo].title}
              </h3>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                {infoTabs[showInfo].content}
              </div>
            </div>

            {/* Quick math */}
            <div style={{
              background: COLORS.cardBg, borderRadius: 12,
              padding: 16, marginTop: 12, border: `1px solid ${COLORS.border}`
            }}>
              <h3 style={{ color: COLORS.measureAlert, fontSize: 14, marginTop: 0, marginBottom: 8 }}>
                Bu Izgarada Sayılar
              </h3>
              <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: COLORS.teal, fontWeight: 700 }}>
                    {(() => { let count = 0; grid.forEach(r => r.forEach(c => { if (c.isData) count++; })); return count; })()}
                  </span> veri qubit (hesap yapar)
                </div>
                <div>
                  <span style={{ color: COLORS.muted, fontWeight: 700 }}>
                    {(() => { let count = 0; grid.forEach(r => r.forEach(c => { if (!c.isData && !c.hidden) count++; })); return count; })()}
                  </span> ölçüm qubit (hata arar)
                </div>
                <div>
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>
                    {GRID_SIZE * GRID_SIZE}
                  </span> toplam fiziksel qubit
                </div>
                <div style={{ marginTop: 8, padding: "8px", background: COLORS.bg, borderRadius: 6, fontSize: 11 }}>
                  <span style={{ color: COLORS.measureAlert }}>→</span> Bu {GRID_SIZE}×{GRID_SIZE} ızgara sadece <span style={{ color: COLORS.green, fontWeight: 700 }}>~1 mantıksal qubit</span> oluşturur!
                  <br /><br />
                  Gerçekte <span style={{ color: COLORS.dataError }}>~30×30</span> veya daha büyük ızgaralar gerekiyor = <span style={{ fontWeight: 700 }}>~1000 fiziksel qubit</span> → 1 mantıksal qubit
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function btnStyle(color, disabled = false) {
  return {
    padding: "8px 14px", borderRadius: 8, border: "none",
    background: disabled ? COLORS.cardBg : color + "22",
    color: disabled ? COLORS.border : color,
    fontSize: 12, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    border: `1px solid ${disabled ? COLORS.border : color}44`
  };
}
