## Qué es este proyecto

**FindMarsShips** es un simulador educativo de multiplicación de matrices ambientado en una guerra espacial entre Venus y Marte por la soberanía de las 53 lunas de Saturno. El jugador asume el rol de Oficial Táctico de la Alianza Terrestre Unificada, y cada misión es una simulación de combate que descansa sobre el mismo motor matemático: la multiplicación de matrices.

### Las tres matrices en la narrativa

- **Matriz A (azul) — Estado del campo de batalla**: situación táctica actual; primer operando
- **Matriz B (roja) — Amenaza enemiga**: maniobra marciana o factores externos; segundo operando
- **Matriz C (verde) — Predicción del campo de batalla**: resultado A×B; estado táctico proyectado

### Mecánica de unidades ocultas

Al obtener C, el jugador debe detectar **valores primos**: las unidades marcianas camufladas resuenan energéticamente con valores primos. Identificarlas otorga puntos y refuerza la comprensión concreta del contenido de la matriz producto.

### Los dos algoritmos

- **Naive** (niveles 1–4): O(n³), definición directa celda a celda. Simulación estándar para patrullas en los anillos exteriores.
- **Strassen** (niveles 5–6): O(n^2.807), 7 productos auxiliares M₁…M₇ en vez de 8. Solo matrices cuadradas. Simulaciones cuánticas para confrontaciones masivas cerca de Jápeto.

---

No hay framework de testing configurado.

---

## Arquitectura

### Flujo de pantallas (`App.jsx`)

```
WelcomeScreen → GameScreen (6 misiones) → HallOfFameScreen
```

`App.jsx` gestiona el estado global: `currentScreen`, `playerName`, `currentLevelIndex`, `totalScore`, `maxUnlockedLevel`.

### Fases de cada misión (`GameScreen.jsx`)

La máquina de estados recorre estas fases en orden:

1. `ready_to_calc` — A y B visibles; el jugador inicia la simulación
2. `calculating` — Multiplicación en progreso
3. `finding` — 30 segundos para revelar celdas de C y detectar primos
4. `simon_says` — Minijuego de validación al revelar una celda sospechosa (`SimonSays.jsx`)
5. `results` — Puntuación del nivel

### Puntuación

- **Puntos base** por nivel completado (10–150 según dificultad)
- **+6 / −6** por éxito/fallo en Simon Says (validación de primos)
- **+2** por primo correctamente revelado; **−1** por revelar no-primo
- **Bonus de tiempo**: `0.12 × segundos restantes`

### Niveles (`constants.js`)

| Misión | Dimensiones | Algoritmo | Puntos base |
|---|---|---|---|
| 1 | 3×3 | Naive | 10 |
| 2 | 4×3 → 4 | Naive | 20 |
| 3 | 4×4 | Naive | 40 |
| 4 | 6×6 | Naive | 60 |
| 5 | 8×8 | Strassen | 100 |
| 6 | 12×12 | Strassen | 150 |

### Estilos

Tailwind CSS v4 con tema en `tailwind.config.js`. Estética de terminal retro / sci-fi:
- Fuentes: VT323, Audiowide, Share Tech Mono (Google Fonts, cargadas en `index.html`)
- Colores: `space-dark`, `venus-blue`, `mars-red`, `accent-yellow`, `console-green`, `console-blue`
- Animaciones: scanline, blink, neon glow
