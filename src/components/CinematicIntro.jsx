import React, { useState, useEffect, useCallback } from 'react';

const SCENE_DURATIONS = [5000, 5000, 7000, 8000, 5000];

export default function CinematicIntro({ playerName, onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Double-check guard on mount
  useEffect(() => {
    if (
      localStorage.getItem('cinematicSeen') ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      onComplete();
    }
  }, [onComplete]);

  // Auto-advance scenes 0–3
  useEffect(() => {
    if (currentScene >= 4) return;
    const timer = setTimeout(() => {
      setCurrentScene((s) => s + 1);
    }, SCENE_DURATIONS[currentScene]);
    return () => clearTimeout(timer);
  }, [currentScene]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const handleBegin = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => onComplete(), 500);
  }, [onComplete]);

  // --- Render helpers ---

  const renderScene = () => {
    switch (currentScene) {
      case 0:
        return <Scene1 />;
      case 1:
        return <Scene2 />;
      case 2:
        return <Scene3 />;
      case 3:
        return <Scene4 />;
      case 4:
        return <Scene5 />;
      default:
        return null;
    }
  };

  // ---------- SCENE 1 ----------
  const Scene1 = () => (
    <div className="scene-container">
      <svg className="scene-svg" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="40" fill="#b8860b" />
        <ellipse cx="200" cy="200" rx="80" ry="15" fill="none" stroke="#d4a84488" strokeWidth="3" transform="rotate(-20 200 200)" />

        {/* Venus ships orbit clockwise */}
        <g className="orbit-cw" style={{ transformOrigin: '200px 200px' }}>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 120 * Math.cos(rad);
            const y = 200 + 120 * Math.sin(rad);
            return <polygon key={i} points="0,-6 -4,5 4,5" fill="#378add" transform={`translate(${x},${y})`} />;
          })}
        </g>

        {/* Mars ships orbit counter-clockwise */}
        <g className="orbit-ccw" style={{ transformOrigin: '200px 200px' }}>
          {[36, 108, 180, 252, 324].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 100 * Math.cos(rad);
            const y = 200 + 100 * Math.sin(rad);
            return <polygon key={i} points="0,-6 -4,5 4,5" fill="#e24b4a" transform={`translate(${x},${y})`} />;
          })}
        </g>
      </svg>

      <p className="scene-text fade-in">
        Año 2187. Venus y Marte luchan por la soberanía de las 53 lunas de Saturno.
        <br />
        <span className="text-sm text-gray-400">Los anillos se tiñen de fuego cruzado.</span>
      </p>
    </div>
  );

  // ---------- SCENE 2 ----------
  const Scene2 = () => (
    <div className="scene-container">
      <svg className="scene-svg" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="40" fill="#b8860b" />
        <ellipse cx="200" cy="200" rx="80" ry="15" fill="none" stroke="#d4a84488" strokeWidth="3" transform="rotate(-20 200 200)" />

        <g className="orbit-cw" style={{ transformOrigin: '200px 200px' }}>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 120 * Math.cos(rad);
            const y = 200 + 120 * Math.sin(rad);
            return <polygon key={i} points="0,-6 -4,5 4,5" fill="#378add" transform={`translate(${x},${y})`} />;
          })}
        </g>

        <g className="orbit-ccw" style={{ transformOrigin: '200px 200px' }}>
          {[36, 108, 180, 252, 324].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 100 * Math.cos(rad);
            const y = 200 + 100 * Math.sin(rad);
            return <polygon key={i} points="0,-6 -4,5 4,5" fill="#e24b4a" transform={`translate(${x},${y})`} />;
          })}
        </g>

        {/* Earth ships entering from left */}
        <g className="enter-right">
          {[160, 190, 220].map((y, i) => (
            <polygon key={i} points="0,-6 -4,5 4,5" fill="#639922" transform={`translate(60,${y})`} />
          ))}
        </g>
      </svg>

      <p className="scene-text fade-in">
        La Tierra envía a la <span className="text-green-400 font-bold">Alianza Terrestre Unificada</span>.
        <br />
        Tú eres su Oficial Táctico.
      </p>
    </div>
  );

  // ---------- SCENE 3 ----------
  const Scene3 = () => (
    <div className="scene-container">
      <svg className="scene-svg" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="40" fill="#b8860b" />
        <ellipse cx="200" cy="200" rx="80" ry="15" fill="none" stroke="#d4a84488" strokeWidth="3" transform="rotate(-20 200 200)" />

        <g className="orbit-cw" style={{ transformOrigin: '200px 200px' }}>
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 120 * Math.cos(rad);
            const y = 200 + 120 * Math.sin(rad);
            return <polygon key={i} points="0,-6 -4,5 4,5" fill="#378add" transform={`translate(${x},${y})`} />;
          })}
        </g>

        <g className="orbit-ccw shake-group" style={{ transformOrigin: '200px 200px' }}>
          {[36, 108, 180, 252, 324].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = 200 + 100 * Math.cos(rad);
            const y = 200 + 100 * Math.sin(rad);
            return <polygon key={i} points="0,-6 -4,5 4,5" fill="#e24b4a" transform={`translate(${x},${y})`} />;
          })}
        </g>

        {/* Earth ships in position */}
        {[160, 190, 220].map((y, i) => (
          <polygon key={i} points="0,-6 -4,5 4,5" fill="#639922" transform={`translate(60,${y})`} />
        ))}

        {/* Explosions */}
        {[
          { cx: 150, cy: 170, delay: '0s' },
          { cx: 230, cy: 220, delay: '0.4s' },
          { cx: 180, cy: 250, delay: '0.8s' },
          { cx: 260, cy: 160, delay: '1.2s' },
        ].map((exp, i) => (
          <circle
            key={i}
            cx={exp.cx}
            cy={exp.cy}
            r="0"
            fill="#ffa500"
            className="explosion"
            style={{ animationDelay: exp.delay }}
          />
        ))}
      </svg>

      <p className="scene-text fade-in">
        Las batallas son caóticas. Predecir el campo de batalla requiere procesar
        <span className="text-yellow-400"> miles de variables </span> simultáneamente.
      </p>
    </div>
  );

  // ---------- SCENE 4 ----------
  const Scene4 = () => {
    // Points for the complexity graph
    const graphW = 260;
    const graphH = 120;
    const graphX = 70;
    const graphY = 20;
    const ns = [2, 4, 8, 12, 16];
    const maxVal = Math.pow(16, 3);

    const naivePoints = ns.map((n) => {
      const x = graphX + ((n - 2) / 14) * graphW;
      const y = graphY + graphH - (Math.pow(n, 3) / maxVal) * graphH;
      return `${x},${y}`;
    }).join(' ');

    const strassenPoints = ns.map((n) => {
      const x = graphX + ((n - 2) / 14) * graphW;
      const y = graphY + graphH - (Math.pow(n, 2.807) / maxVal) * graphH;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="scene-container" style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {/* Small patrol panel */}
          <div style={{ textAlign: 'center' }}>
            <p className="text-sm text-gray-400 mb-2">Patrulla pequeña (3&times;3)</p>
            <svg width="100" height="40" viewBox="0 0 100 40">
              {[15, 35, 55].map((x, i) => (
                <polygon key={`b${i}`} points="0,-5 -3,4 3,4" fill="#378add" transform={`translate(${x},20)`} />
              ))}
              {[65, 80, 95].map((x, i) => (
                <polygon key={`r${i}`} points="0,-5 -3,4 3,4" fill="#e24b4a" transform={`translate(${x},20)`} />
              ))}
            </svg>
            <p className="text-xs text-gray-500">27 operaciones</p>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '80px', background: '#ffffff44' }} />

          {/* Large battle panel */}
          <div style={{ textAlign: 'center' }}>
            <p className="text-sm text-gray-400 mb-2">Batalla en Jápeto (12&times;12)</p>
            <svg width="120" height="50" viewBox="0 0 120 50">
              {Array.from({ length: 12 }).map((_, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                return <circle key={`b${i}`} cx={10 + col * 12} cy={10 + row * 12} r="3" fill="#378add" />;
              })}
              {Array.from({ length: 12 }).map((_, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                return <circle key={`r${i}`} cx={65 + col * 12} cy={10 + row * 12} r="3" fill="#e24b4a" />;
              })}
            </svg>
            <p className="text-xs text-gray-500">1,728 operaciones</p>
          </div>
        </div>

        {/* Complexity graph */}
        <svg width="340" height="160" viewBox="50 10 280 140" style={{ margin: '0 auto', display: 'block' }}>
          {/* Axes */}
          <line x1={graphX} y1={graphY + graphH} x2={graphX + graphW} y2={graphY + graphH} stroke="#ffffff44" strokeWidth="1" />
          <line x1={graphX} y1={graphY} x2={graphX} y2={graphY + graphH} stroke="#ffffff44" strokeWidth="1" />

          {/* X ticks */}
          {ns.map((n) => {
            const x = graphX + ((n - 2) / 14) * graphW;
            return (
              <g key={n}>
                <line x1={x} y1={graphY + graphH} x2={x} y2={graphY + graphH + 5} stroke="#ffffff66" strokeWidth="1" />
                <text x={x} y={graphY + graphH + 15} fill="#ffffff88" fontSize="9" textAnchor="middle">{n}</text>
              </g>
            );
          })}

          {/* Naive line */}
          <polyline
            points={naivePoints}
            fill="none"
            stroke="#378add"
            strokeWidth="2"
            className="draw-line"
            style={{ strokeDasharray: 600, strokeDashoffset: 600 }}
          />
          <text x={graphX + graphW + 5} y={graphY + 10} fill="#378add" fontSize="9">Naive</text>

          {/* Strassen line */}
          <polyline
            points={strassenPoints}
            fill="none"
            stroke="#639922"
            strokeWidth="2"
            strokeDasharray="5,3"
            className="draw-line-strassen"
            style={{ strokeDasharray: '5,3', strokeDashoffset: 600 }}
          />
          <text x={graphX + graphW + 5} y={graphY + 50} fill="#639922" fontSize="9">Strassen</text>
        </svg>

        <p className="scene-text fade-in" style={{ marginTop: '1rem' }}>
          Misiones pequeñas usan el algoritmo <span className="text-blue-400">Naive</span>.
          <br />
          Batallas masivas usan <span className="text-green-400">Strassen</span>: 7 multiplicaciones en vez de 8, aplicado recursivamente.
        </p>

        <p className="scene-text fade-in-delayed text-xs text-gray-400" style={{ marginTop: '0.5rem' }}>
          n=12: Naive → 1,728 ops | Strassen → ~1,056 ops
        </p>
      </div>
    );
  };

  // ---------- SCENE 5 ----------
  const Scene5 = () => (
    <div className="scene-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.3 }}>
        <circle cx="100" cy="100" r="40" fill="#b8860b" />
        <ellipse cx="100" cy="100" rx="80" ry="15" fill="none" stroke="#d4a84488" strokeWidth="3" transform="rotate(-20 100 100)" />
      </svg>

      <div className="arrive" style={{ marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
        <svg width="120" height="30" viewBox="0 0 120 30">
          {[30, 60, 90].map((x, i) => (
            <polygon key={i} points="0,-8 -5,6 5,6" fill="#639922" transform={`translate(${x},15)`} />
          ))}
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <p className="fade-in" style={{ fontFamily: "'VT323', monospace", fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
          Oficial <span className="text-yellow-400">{playerName}</span>, la Alianza te necesita.
        </p>
        <p className="fade-in text-gray-300" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.95rem', animationDelay: '0.5s' }}>
          Analiza los datos. Predice el campo de batalla. Encuentra las naves enemigas.
        </p>

        <div className="fade-to-black-overlay" />

        <button
          onClick={handleBegin}
          className="begin-button"
        >
          Comenzar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a0f' }}>
      <style>{`
        .scene-container {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 5vh;
          color: #fff;
        }
        .scene-svg {
          width: min(80vw, 400px);
          height: min(80vw, 400px);
        }
        .scene-text {
          position: relative;
          max-width: 600px;
          text-align: center;
          padding: 0 1rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 1rem;
          line-height: 1.6;
          color: #d1d5db;
        }

        /* --- Animations --- */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes fadeToBlack {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes enter-right {
          from { transform: translateX(-100vw); }
          to { transform: translateX(0); }
        }
        @keyframes arrive {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes explosion {
          0% { r: 0; opacity: 1; }
          50% { r: 20; opacity: 0.8; }
          100% { r: 35; opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        @keyframes draw-line {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeInDelayed {
          0%, 80% { opacity: 0; }
          100% { opacity: 1; }
        }

        .fade-in {
          animation: fadeIn 1s ease-in forwards;
          opacity: 0;
        }
        .fade-in-delayed {
          animation: fadeInDelayed 5s ease-in forwards;
          opacity: 0;
        }
        .orbit-cw {
          animation: orbit-cw 12s linear infinite;
        }
        .orbit-ccw {
          animation: orbit-ccw 10s linear infinite;
        }
        .enter-right {
          animation: enter-right 2s ease-out forwards;
        }
        .arrive {
          animation: arrive 1s ease-out forwards;
        }
        .explosion {
          animation: explosion 0.8s ease-out forwards;
        }
        .shake-group {
          animation: orbit-ccw 10s linear infinite, shake 0.3s ease-in-out 1s 3;
        }
        .draw-line {
          animation: draw-line 3s ease-in-out forwards;
        }
        .draw-line-strassen {
          animation: draw-line 3s ease-in-out 0.5s forwards;
        }

        /* Fade to black overlay for scene 5 */
        .fade-to-black-overlay {
          position: fixed;
          inset: 0;
          background: #0a0a0f;
          animation: fadeToBlack 1s forwards;
          animation-delay: 2s;
          opacity: 0;
          pointer-events: none;
          z-index: 3;
        }

        .begin-button {
          position: relative;
          z-index: 10;
          margin-top: 2rem;
          padding: 0.75rem 2.5rem;
          background: transparent;
          border: 2px solid #eab308;
          color: #eab308;
          font-family: 'VT323', monospace;
          font-size: 1.4rem;
          cursor: pointer;
          opacity: 0;
          animation: fadeIn 0.5s forwards;
          animation-delay: 3s;
          transition: box-shadow 0.2s, background 0.2s;
        }
        .begin-button:hover {
          box-shadow: 0 0 15px #eab30888, 0 0 30px #eab30844;
          background: #eab30811;
        }

        /* Skip button */
        .skip-button {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 50;
          background: transparent;
          border: 1px solid #ffffff33;
          color: #9ca3af;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          padding: 0.4rem 1rem;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
        }
        .skip-button:hover {
          color: #fff;
          border-color: #ffffff88;
        }

        /* Progress dots */
        .progress-dots {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 50;
        }
        .progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #374151;
          transition: background 0.3s;
        }
        .progress-dot.active {
          background: #fff;
        }

        /* Global fade out */
        .cinematic-fade-out {
          animation: fadeOut 0.5s forwards;
        }
      `}</style>

      <div className={fadeOut ? 'cinematic-fade-out' : ''}>
        {renderScene()}
      </div>

      {/* Skip button */}
      <button className="skip-button" onClick={handleSkip}>
        Saltar
      </button>

      {/* Progress dots */}
      <div className="progress-dots">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`progress-dot ${i === currentScene ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
