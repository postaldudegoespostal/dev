# 📂 Frontend Architecture Documentation: "The Living System" Portfolio

This document outlines the architecture, technology stack, and business logic for the frontend of the "Living System" portfolio project. The backend (Spring Boot) is fully operational. This frontend will act as a consumer, strictly adhering to the API contract.

## 1. Core Concept & UX Flow

This is not a static portfolio. It is an interactive "System Architect Simulation".

1. **First Visit:** The user is intercepted by a "System Critical" simulation (Overlay).
2. **The Decision:** The user solves a backend crisis scenario (fetched from API).
3. **The Outcome:** Based on the user's choice, the site renders in one of three modes:
* **Learning Mode (Junior/Fail):** Focus on educational content.
* **Standard Mode (Mid/Neutral):** Clean, professional CV look.
* **God Mode (Senior/Architect):** Unlocks real-time metrics (Latency, CPU) and deep technical details.


4. **Persistence:** The user's level is saved locally. On refresh, the simulation is skipped, and the saved mode is loaded.

## 2. Technology Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** Zustand (w/ Persist Middleware for LocalStorage)
* **Animations:** Framer Motion (Critical for the "Cyber/System" feel)
* **HTTP Client:** Axios (Must handle Interceptors for Latency)
* **Icons:** Lucide React

## 3. Project Structure

```
/src
  /app
    /page.tsx           # Single Page Application (Main Entry)
    /layout.tsx         # Global Layout (Fonts, Metadata)
  /components
    /simulation         # Simulation Overlay, Result Cards, System Diagram
    /dashboard          # Hero, Stats, Projects, Blog Section
    /ui                 # Reusable atoms (Buttons, Cards, Badges)
    /layout             # Navbar, Footer
  /core
    /api                # Axios instance & setup
    /hooks              # Custom hooks
    /store              # Zustand global stores
    /types              # TypeScript interfaces (match Backend DTOs)
  /services             # API Service calls (SimulationService, BlogService)

```

## 4. State Management (Zustand)

We need a global store to track the "User Level" and "System Latency".

**Store Name:** `useSystemStore`

* **State:**
* `userLevel`: `'GUEST' | 'JUNIOR' | 'MID' | 'SENIOR'` (Default: 'GUEST')
* `hasPlayed`: `boolean` (Default: false)
* `lastLatency`: `number` (Updated via API headers)
* `systemStatus`: `'CRITICAL' | 'STABLE' | 'OPTIMIZED'`


* **Actions:**
* `completeSimulation(result: VerificationResult)`
* `updateLatency(ms: number)`
* `resetSimulation()`


* **Persistence:** Use `persist` middleware to save `userLevel` and `hasPlayed` to `localStorage`.

## 5. API Integration & Latency Tracking

**Critical Requirement:** The backend sends a custom header `X-Execution-Time` in every response. The frontend must capture this to display the "Real-time Latency" in God Mode.

**Axios Interceptor Setup:**

```typescript
// core/api/axios.ts
import axios from 'axios';
import { useSystemStore } from '@/core/store/useSystemStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g., http://localhost:8080/api
});

api.interceptors.response.use((response) => {
  const latencyHeader = response.headers['x-execution-time'];
  if (latencyHeader) {
    // Update global store without triggering re-renders unnecessarily
    useSystemStore.getState().updateLatency(parseInt(latencyHeader));
  }
  return response;
});

export default api;

```

## 6. Feature Modules

### A. The Simulation Overlay (The Gatekeeper)

* **Trigger:** Loads on `page.tsx` if `store.hasPlayed === false`.
* **API Calls:**
* `GET /simulation/random`: Fetches the scenario (Title, Desc, Options).
* `POST /simulation/verify`: Sends `{ scenarioId, selectedOptionId }`.


* **UI/UX:**
* Full-screen modal with a "Terminal/System Alert" aesthetic.
* **Animation:** Use Framer Motion for entering/exiting elements.
* **Feedback:** Do not show "Correct/Incorrect" immediately. Show "Analyzing System Impact..." -> Then transition to the Main Site based on the result.



### B. The Dashboard (The Result)

The main page content adapts based on `useSystemStore.userLevel`.

1. **Hero Section:**
* **Senior:** "System Optimized. Latency: {lastLatency}ms. Welcome, Architect." (Green/Cyber theme).
* **Mid:** "Hello, I am [Name]. Software Engineer." (Clean/White theme).
* **Junior:** "System Recovering. Learning Mode Active." (Warning/Yellow theme).
* **WakaTime Integration:** Fetch from `/stats` endpoint.


2. **Projects Section:**
* Fetch from `/projects`.
* **God Mode Feature:** If user is SENIOR, project cards show "Architecture Details" (Microservices, DB choice) instead of just generic descriptions.


3. **Blog Section:**
* Fetch from `/blogs`.
* **Learning Mode Feature:** If user is JUNIOR, this section moves up, right below the Hero section.


4. **Refactor Slider (AI vs Engineer):**
* A component comparing "Bad Code" vs "Clean Code".
* This is purely frontend UI (Static or Config driven), no specific backend endpoint needed yet.



## 7. Design System Guidelines

* **Font:** 'JetBrains Mono' or 'Fira Code' for code/headings. 'Inter' for body.
* **Colors (Tailwind Config):**
* `cyber-black`: `#0a0a0a`
* `neon-green`: `#00ff41` (Success/Senior)
* `alert-red`: `#ff0033` (Critical/Junior)
* `warning-orange`: `#ff9900` (Mid)


* **Vibe:** Minimalist, High-Tech, NOT cluttery.

## 8. Implementation Steps for AI

1. **Setup:** Initialize Next.js, Tailwind, and Zustand.
2. **API Layer:** Configure Axios with the `X-Execution-Time` interceptor.
3. **Store:** Build the `useSystemStore` with persistence.
4. **Simulation:** Build the `SimulationOverlay` component fetching from `/api/simulation/random`.
5. **Dashboard:** Build the main page components that react to the store state.
6. **Polish:** Add Framer Motion animations for smooth transitions between modes.

---

# 🎨 UI/UX Design System Document: "The Architect's Console"

This document defines the visual identity and user experience for the portfolio. The goal is to convey **"High-Performance Backend Engineering"**—structured, fast, powerful, and serious.

## 1. Core Philosophy: "The Server Room Aesthetic"

* **Keywords:** Precision, Latency, Stability, Monitoring, Industrial, Mat.
* **Feeling:** Like looking at a high-end dashboard (e.g., Datadog, Grafana, AWS Console) but with a personalized, artistic touch.
* **Anti-Patterns:** No "Gamers/Esports" aesthetics, no excessive "Glitch" effects, no childish fonts.

## 2. Color Palette (Dark Mode Only)

The base is deep, industrial darks. Red is used sparingly for critical actions and alerts. Blue/Purple is used extremely subtly for depth.

### A. Backgrounds (The Void)

* **`#050505` (Obsidian):** Main background. Not pure black, but very close.
* **`#0F0F12` (Dark Slate):** Card backgrounds, secondary sections.
* **`#1A1A1E` (Gunmetal):** Borders, inputs, subtle dividers.

### B. Primary Accent (The Power)

* **`#FF3333` (Signal Red):** Primary buttons (hover states), critical alerts, error lines.
* **`#CC2929` (Deep Red):** Button default state.
* **`#4D1212` (Blood Red Alpha):** Background for error messages or "Junior/Fail" modes (low opacity).

### C. Secondary Accents (The Logic)

* **`#E0E0E0` (Off-White):** Primary text.
* **`#A1A1AA` (Metallic Gray):** Secondary text, descriptions.
* **`#4F46E5` (Indigo Glow):** *Very subtle* gradients or shadows to add depth (representing "Cooling Systems"). Use at 5-10% opacity.

## 3. Typography

We need a mix of "Code" and "Modern Swiss" styles.

* **Headings / Data:** `JetBrains Mono` or `IBM Plex Mono`. (Gives the engineering feel).
* *Usage:* Navigation, Stats (Latency), Code Snippets, Titles.


* **Body / Long Text:** `Inter` or `Geist Sans`. (Clean, readable, modern).
* *Usage:* Blog posts, "About Me" vision text.



## 4. UI Components & Behavior

### A. The Simulation Overlay (Entrance)

* **Visual:** A centered "System Dialog" floating on a blurred backdrop.
* **Border:** 1px solid `#333`.
* **Animation:** Use a "Typewriter" effect for the problem description.
* **Options:** Cards that light up on hover.
* *Hover Effect:* The border turns from Gray to White (or Red for dangerous options).



### B. The Vision Section (Hero)

Instead of a big photo, we focus on **Text & Data**.

* **Layout:** Split screen or Centered Text.
* **Content:** A strong manifesto about backend engineering (e.g., "Building systems that survive the storm").
* **Decoration:** A subtle, animated grid in the background (faint gray lines) moving very slowly.

### C. Dashboard Cards (Projects/Stats)

* **Style:** "Bento Grid" layout (Grid of boxes).
* **Material:** Matte glass effect (Glassmorphism) but very dark. `backdrop-filter: blur(10px)`.
* **Borders:** Very thin (`1px`), subtle gray borders.
* **Interactivity:** When hovering over a project card, show technical specs (Java, Spring, PostgreSQL) in a "tooltip" or reveal animation.

### D. The "Latency" Indicator (God Mode)

* **Position:** Fixed at the top-right or bottom-right.
* **Visual:** A small dot pulsating.
* Green (`#22C55E`) = Optimized/Senior Mode.
* Red (`#FF3333`) = Fail/Junior Mode.


* **Text:** `LATENCY: 12ms` (Monospaced font).

## 5. Animations (Framer Motion)

* **Entry:** Fade-in + Slide-up (Smooth, expensive feel).
* **Hover:** Immediate response (0.1s duration). We want it to feel "snappy" like a CLI tool, not "floaty" like a marketing site.
* **Transitions:** When switching from Simulation to Dashboard, use a "System Unlock" effect (e.g., the overlay scales down and disappears, revealing the dashboard underneath).

## 6. Implementation Notes for Developer

* **Tailwind Config:** Extend the color palette with the custom reds and darks defined above.
* **Grid:** Use CSS Grid for the dashboard layout.
* **Shadows:** Avoid large drop shadows. Use "Inner Glows" or colored borders to define depth.
* **Gradients:** Use a radial gradient of the "Indigo Glow" (`#4F46E5`) at the very bottom center of the page to give that "Ambient Server Light" effect without overpowering the Red/Black theme.

---
> **"I Architect Reliability."**
> "Frontend is the face, but Backend is the spine. I don't just write code; I design resilient systems that handle scale, minimize latency, and survive failures. While others focus on how it looks, I focus on how it works when traffic spikes to 10x."
