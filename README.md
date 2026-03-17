# FindMarsShips

**Simulador educativo de multiplicación de matrices ambientado en una guerra espacial.**
Aprende los algoritmos Naive y Strassen mientras defiendes las lunas de Saturno.

---

## Lore y contexto narrativo

**Año 2187.** Venus y Marte libran una guerra por la soberanía de las 53 lunas de Saturno. La **Alianza Terrestre Unificada** te recluta como **Oficial Táctico** para ejecutar simulaciones de combate basadas en multiplicación de matrices.

Cada misión descansa sobre tres matrices:

| Matriz | Color | Rol narrativo |
|--------|-------|---------------|
| **A** | Azul | Estado del campo de batalla — situación táctica actual |
| **B** | Roja | Amenaza enemiga — maniobra marciana o factores externos |
| **C** | Verde | Predicción del campo de batalla — resultado A × B |

### Naves marcianas camufladas

Al obtener la matriz C, el jugador debe detectar **valores primos**: las unidades marcianas camufladas resuenan energéticamente con estos valores. Identificarlas correctamente otorga puntos y refuerza la comprensión del contenido de la matriz producto.

---

## Cómo se juega

### Flujo de pantallas

```
Welcome → Cinemática → 6 Misiones → Hall of Fame
```

La cinemática introductoria se muestra solo la primera vez (se puede saltar).

### Fases de cada misión

1. **Briefing** — Contexto narrativo y explicación matemática de la misión.
2. **Ready to calc** — Las matrices A y B son visibles. El jugador puede:
   - **Iniciar simulación**: calcula A × B y pasa a la fase de detección.
   - **"Ver cómo se calcula"**: modo enseñanza paso a paso que muestra el cálculo celda por celda antes de jugar.
3. **Calculating** — La multiplicación se ejecuta (Naive o Strassen según la misión).
4. **Finding** (30 segundos) — Fase de detección:
   - **Clic izquierdo** sobre una celda de C: la marca como sospechosa (nave enemiga).
   - **Clic derecho** sobre una celda de C: activa el **Protocolo Simon Says**, un minijuego de memoria que revela información sobre si el valor es primo.
   - Al pasar el cursor sobre una celda de C se muestra el desglose del producto punto que generó ese valor.
5. **Results** — Puntuación del nivel. Si se alcanza el mínimo requerido, se desbloquea la siguiente misión.

### Simon Says

Minijuego de memoria con secuencias en una cuadrícula 3×2. Cada misión tiene un número limitado de usos. La dificultad (longitud de secuencia) escala con el nivel.

### Puntuación

| Acción | Puntos |
|--------|--------|
| Marcar correctamente un primo | +2 |
| Marcar incorrectamente un no-primo | −1 |
| Bonus de tiempo | 0.12 × segundos restantes |

- **Puntuación mínima para avanzar**: se calcula dinámicamente como ~40% de los primos detectables en la matriz (redondeado hacia arriba, mínimo 1).
- La misión 6 (final) no tiene puntuación mínima.

---

## Las 6 misiones

| # | Nombre | Dimensiones | Algoritmo | Simon Says (usos) |
|---|--------|-------------|-----------|-------------------|
| 1 | Sector Training Alpha | 3×3 | Naive | 1 |
| 2 | Nebulosa Beta Patrol | 4×3 → 3×4 = 4×4 | Naive | 2 |
| 3 | Anillos de Saturno Skirmish | 4×4 | Naive | 3 |
| 4 | Emboscada en Luna Gamma | 6×6 | Naive | 5 |
| 5 | Flota Fantasma Delta | 8×8 | Strassen | 6 |
| 6 | Agujero de Gusano Omega | 12×12 | Strassen | 6 |

---

## Propósito educativo: Multiplicación de matrices

### Qué es la multiplicación de matrices

Dadas A (m×n) y B (n×p), el resultado C (m×p) se calcula como:

```
C[i][j] = Σ(k=0..n-1) A[i][k] × B[k][j]
```

Cada celda de C es el **producto punto** de la fila i de A con la columna j de B.

### Algoritmo Naive — O(n³)

Implementación directa: tres bucles anidados que recorren filas, columnas y la dimensión compartida. Usado en las misiones 1–4.

Para una matriz 6×6, esto implica 6³ = 216 multiplicaciones escalares.

### Algoritmo de Strassen — O(n^2.807)

Técnica divide-and-conquer que particiona cada matriz en 4 bloques y calcula **7 productos auxiliares** (M₁…M₇) en lugar de los 8 del método directo, reduciendo la complejidad asintótica. Usado en las misiones 5–6.

Para matrices que no son potencia de 2 (como 12×12), se aplica padding a la siguiente potencia de 2 (16×16) y luego se recorta el resultado.

### Modo enseñanza

Antes de iniciar la simulación, el jugador puede activar el **modo enseñanza** que muestra paso a paso cómo se calcula cada celda de C, resaltando la fila de A y la columna de B involucradas. Incluye reproducción automática y avance manual.

### Panel educativo de Strassen

En las misiones 5 y 6, un panel desplegable muestra la descomposición en bloques y los 7 productos M₁…M₇ calculados por el algoritmo de Strassen.

---

## Tech stack

- **React 19** — UI con hooks y componentes funcionales
- **Vite** — Bundler y dev server
- **Tailwind CSS v4** — Estilos utilitarios con tema sci-fi retro
- **Fuentes**: VT323, Audiowide, Share Tech Mono (Google Fonts)
- Sin backend — todo corre en el navegador, puntuaciones en `localStorage`

---

## Cómo ejecutar

```bash
npm install
npm run dev
```

Para build de producción:

```bash
npm run build
npm run preview
```
