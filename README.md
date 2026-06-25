# QuizPro

A production-ready online quiz platform built with React, TypeScript, Tailwind CSS, and Vite. Supports separate student and admin workflows, real-time quiz-taking, and a fully responsive mobile-first interface.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [User Flows](#user-flows)
- [Component Reference](#component-reference)
- [Accessibility](#accessibility)

---

## Overview

QuizPro provides two distinct interfaces — one for students and one for administrators — with role-based route protection, session management, and an optional Supabase backend. The UI is built around a single-question-per-screen model to minimize cognitive load during quiz-taking.

---

## Features

### Student

- Registration and login with form validation
- Dashboard displaying all published quizzes
- Single-question quiz interface with a real-time countdown timer
- Automatic submission on timer expiry
- Detailed results page with per-question answer review
- Full attempt history with score statistics

### Admin

- Separate admin login with protected routes
- Create, edit, publish, and delete quizzes
- Add multiple-choice questions with explanations
- Dashboard with quiz metrics and student activity overview

### Platform

- Glassmorphic design system with smooth CSS animations
- Mobile-first layout with 44px minimum touch targets
- Full dark mode support
- WCAG AA–compliant accessibility
- Optimized production bundle (~11.25 kB gzipped CSS)

---

## Technology Stack

| Layer | Technology |
|---|---|
| UI Library | React 18.2 |
| Language | TypeScript 5.2 |
| Styling | Tailwind CSS 3.3 |
| Build Tool | Vite 5.0 |
| Routing | React Router 6.18 |
| Icons | Lucide React 0.294 |
| Backend (optional) | Supabase |
| CSS Processing | PostCSS |

---

## Project Structure

```
src/
├── components/             # Reusable UI primitives
│   ├── Alert.tsx
│   ├── Button.tsx
│   ├── FormInput.tsx
│   ├── Header.tsx
│   ├── ProgressBar.tsx
│   ├── ProtectedRoute.tsx
│   ├── QuizCard.tsx
│   ├── ThemeToggle.tsx
│   └── Timer.tsx
├── contexts/               # React context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── data/
│   └── mockData.ts         # Development mock data
├── hooks/                  # Custom React hooks
│   ├── useForm.ts
│   ├── useLocalStorage.ts
│   └── useTimer.ts
├── lib/                    # External service clients
│   ├── database.ts
│   └── supabase.ts
├── pages/                  # Route-level page components
│   ├── Admin.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   ├── AdminQuizManagement.tsx
│   ├── ConfirmEmail.tsx
│   ├── CreateQuiz.tsx
│   ├── Dashboard.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Quiz.tsx
│   ├── QuizHistory.tsx
│   ├── Register.tsx
│   └── Results.tsx
├── types/
│   └── index.ts            # Shared TypeScript types
└── App.tsx
```

---

## Getting Started

### Prerequisites

- Node.js 16 or later
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The dev server starts at [http://localhost:3001](http://localhost:3001).

### Production

```bash
npm run build
npm run preview
```

---

## Authentication

### Students

Students register with an email address and a password of six or more characters. Sessions are stored in the browser using JWT tokens. All student routes beyond the login page are protected and will redirect unauthenticated users.

### Admins

Admins log in through a separate route (`/admin/login`). Admin routes are protected by role-based access control and are inaccessible to student sessions.

---

## User Flows

### Taking a Quiz

1. Log in and open the student dashboard.
2. Select a published quiz.
3. Answer each question — one per screen — using Previous / Next navigation.
4. Submit manually or allow the timer to auto-submit.
5. Review your score breakdown and per-question analysis on the results page.
6. Access all past attempts from the Quiz History page.

### Creating a Quiz (Admin)

1. Log in through the admin login page.
2. Navigate to **Admin Dashboard → Create Quiz**.
3. Enter quiz details: title, time limit, and total marks.
4. Add multiple-choice questions with optional explanations.
5. Publish the quiz to make it visible to students.

### Navigation Map

```
/
├── /login              → /dashboard
│   └── /quiz/:id       → /results/:id
│   └── /history
└── /register           → /confirm-email

/admin/login            → /admin
    └── /admin/quizzes  → /admin/quizzes/create
```

---

## Component Reference

### Button

```tsx
<Button
  variant="primary" | "secondary" | "outline" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  isLoading={boolean}
  icon={<Icon size={20} />}
  onClick={handler}
>
  Label
</Button>
```

### FormInput

```tsx
<FormInput
  label="Email"
  name="email"
  type="email"
  placeholder="you@example.com"
  value={value}
  onChange={handler}
  error={errorMessage}
  required
/>
```

### Alert

```tsx
<Alert
  type="success" | "error" | "warning" | "info"
  title="Title"
  message="Description"
  onClose={handler}
/>
```

### Back Navigation (pattern)

Every page uses a consistent back-navigation pattern:

```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => navigate('/dashboard')}
  icon={<ArrowLeft size={20} />}
>
  <span className="hidden sm:inline">Back</span>
</Button>
```

---

## Accessibility

QuizPro targets WCAG 2.1 AA compliance across all views.

- Semantic HTML throughout
- ARIA labels and roles on interactive elements
- Full keyboard navigation with visible focus indicators
- Form validation with descriptive inline error messages
- Screen-reader–friendly component structure
- 44px minimum touch targets on mobile
- High-contrast text in both light and dark themes
