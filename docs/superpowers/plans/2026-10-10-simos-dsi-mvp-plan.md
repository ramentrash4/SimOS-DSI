# SimOS DSI MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MVP of the SimOS DSI educational game, featuring a responsive React frontend (PWA) with a virtual phone interface, the Chatter app, and Supabase integration.

**Architecture:** A Vite + React (TypeScript) frontend that scales to fit a "Virtual Phone" container on desktop (Projector mode) or fills the screen on mobile. Uses Supabase for data storage (missions and story nodes).

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Supabase Client, React Router.

## Global Constraints

- Must be a responsive React web app (usable on desktop and mobile).
- Must use Tailwind CSS for styling.
- Must connect to Supabase for backend data.

---

### Task 1: Project Initialization and Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Test: `tests/setup.test.ts` (using Vitest)

**Interfaces:**
- Produces: A running Vite React + Tailwind environment.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/setup.test.ts
import { describe, it, expect } from 'vitest';

describe('Environment Setup', () => {
  it('should have React available', () => {
    expect(typeof window).toBe('object');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/setup.test.ts`
Expected: FAIL (vitest not installed or configured).

- [ ] **Step 3: Write minimal implementation**

Run initialization commands (to be executed by agent):
```bash
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer vitest
npx tailwindcss init -p
```
Configure Tailwind in `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
Add Tailwind directives to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/setup.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: initialize vite react ts project with tailwind and vitest"
```

---

### Task 2: Supabase Client Configuration

**Files:**
- Create: `src/lib/supabase.ts`, `.env.example`
- Test: `tests/supabase.test.ts`

**Interfaces:**
- Produces: `supabase` (SupabaseClient instance) for database operations.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/supabase.test.ts
import { describe, it, expect } from 'vitest';
import { supabase } from '../src/lib/supabase';

describe('Supabase Client', () => {
  it('should initialize the supabase client', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/supabase.test.ts`
Expected: FAIL (file not found).

- [ ] **Step 3: Write minimal implementation**

Run: `npm install @supabase/supabase-js`

Create `.env.example`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/supabase.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: setup supabase client"
```

---

### Task 3: SimOS Layout Shell (Virtual Phone UI)

**Files:**
- Create: `src/components/SimOS/PhoneShell.tsx`, `src/components/SimOS/HomeScreen.tsx`
- Modify: `src/App.tsx`
- Test: `tests/PhoneShell.test.tsx` (Needs `@testing-library/react`)

**Interfaces:**
- Produces: `PhoneShell` (Wrapper component), `HomeScreen` (Displays fake apps).

- [ ] **Step 1: Write the failing test**

```typescript
// tests/PhoneShell.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhoneShell from '../src/components/SimOS/PhoneShell';

describe('PhoneShell', () => {
  it('renders the virtual phone container', () => {
    render(<PhoneShell><div data-testid="child">App</div></PhoneShell>);
    expect(screen.getByTestId('child')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm install -D @testing-library/react jsdom @testing-library/jest-dom`
Update `vite.config.ts` to include `test: { environment: 'jsdom' }`.
Run: `npx vitest run tests/PhoneShell.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

Create `src/components/SimOS/PhoneShell.tsx`:
```typescript
import React from 'react';

const PhoneShell: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] h-[800px] bg-black rounded-[3rem] border-[8px] border-gray-800 overflow-hidden relative shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-1/2 mx-auto z-50"></div>
        
        {/* Screen Content */}
        <div className="w-full h-full bg-slate-800 text-white overflow-y-auto pt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PhoneShell;
```

Update `src/App.tsx`:
```typescript
import PhoneShell from './components/SimOS/PhoneShell';

function App() {
  return (
    <PhoneShell>
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mt-10">SimOS</h1>
      </div>
    </PhoneShell>
  );
}

export default App;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/PhoneShell.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: create virtual phone shell UI"
```
