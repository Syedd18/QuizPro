# QuizPro - Professional Online Quiz Platform

An industry-grade, production-quality online quiz system built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. Features secure authentication, real-time quiz interface, comprehensive admin panel, and fully responsive mobile-first design.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## ✨ Key Features

### Student Features
- **Authentication** - Secure login/registration with validation
- **Quiz Dashboard** - Browse published quizzes with descriptions
- **Quiz Interface** - Single-question-per-screen layout with real-time timer
- **Results Review** - Detailed score breakdown with answer analysis
- **Quiz History** - Track all previous attempts and statistics
- **Responsive Design** - Optimized for phone, tablet, and desktop

### Admin Features
- **Quiz Management** - Create, edit, publish/unpublish quizzes
- **Question Management** - Add multiple choice questions with explanations
- **Admin Dashboard** - View statistics and quiz metrics
- **Back Navigation** - Easy navigation between admin pages

### Technical Features
- 🎨 **Premium UI/UX** - Modern glassmorphic design with smooth animations
- 📱 **Mobile-First** - Touch-friendly interface (44px minimum touch targets)
- ♿ **Accessible** - WCAG compliant keyboard navigation support
- 🌓 **Dark Mode** - Full dark theme support
- ⚡ **Performance** - Optimized bundle size (~11.25 kB gzipped CSS)
- 🔒 **Protected Routes** - Role-based access control

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Multi-variant button (5 styles)
│   ├── FormInput.tsx   # Form inputs with validation
│   ├── Timer.tsx       # Countdown timer
│   ├── ProgressBar.tsx # Quiz progress indicator
│   ├── QuizCard.tsx    # Quiz card component
│   ├── Alert.tsx       # Alert/notification
│   ├── Header.tsx      # App header with nav
│   ├── ThemeToggle.tsx # Dark/light mode toggle
│   └── ProtectedRoute.tsx # Route protection
├── pages/               # Page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Student login
│   ├── Register.tsx    # Student registration
│   ├── ConfirmEmail.tsx# Email confirmation
│   ├── Dashboard.tsx   # Quiz listing dashboard
│   ├── Quiz.tsx        # Quiz interface
│   ├── Results.tsx     # Results & answer review
│   ├── QuizHistory.tsx # Attempt history
│   ├── AdminLogin.tsx  # Admin login
│   ├── AdminDashboard.tsx # Admin hub
│   ├── AdminQuizManagement.tsx # Quiz management
│   ├── CreateQuiz.tsx  # Quiz creation
│   └── Admin.tsx       # Admin panel
├── contexts/           # React context providers
│   ├── AuthContext.tsx # Authentication context
│   └── ThemeContext.tsx # Dark/light theme
├── hooks/              # Custom React hooks
│   ├── useForm.ts      # Form handling
│   ├── useTimer.ts     # Timer logic
│   └── useLocalStorage.ts # Local storage hook
├── lib/                # Library & utilities
│   ├── database.ts     # Supabase integration
│   └── supabase.ts     # Supabase client
├── types/              # TypeScript definitions
│   └── index.ts        # Shared types
├── data/               # Mock data
│   └── mockData.ts     # Test data
└── App.tsx             # Main app 

## 🔐 Authentication

### Student Login
- Demo credentials: Use any email and 6+ character password
- Session stored in browser with JWT tokens
- Protected routes enforce authentication



## 📊 Navigation Flow

```
Home/Public
├── Student Path
│   ├── Login → Dashboard → [Quiz/History/Results]
│   └── Register → Email Confirmation
└── Admin Path
    ├── Admin Login → Admin Dashboard
    └── Admin Dashboard → [Quiz Management/Create Quiz]
```


## 🎯 User Flows

### Taking a Quiz
1. Login to dashboard
2. Select quiz from dashboard
3. Answer questions one per screen
4. Submit quiz (auto-submits when time expires)
5. View results with score breakdown
6. Review correct/incorrect answers
7. Access quiz history for all attempts

### Creating Quiz (Admin)
1. Admin Login with admin credentials
2. Go to Admin Dashboard → Create Quiz
3. Add quiz details (title, time limit, marks)
4. Add multiple choice questions with explanations
5. Publish quiz to make available to students

## 🛠️ Technology Stack

- **React 18.2** - UI library with hooks
- **TypeScript 5.2** - Type safety and IntelliSense
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Vite 5.0** - Fast build tool (3s cold start)
- **React Router 6.18** - Client-side routing
- **Lucide React 0.294** - Icon library
- **Supabase** - Backend/Database (optional)
- **PostCSS** - CSS processing



## 🎯 Feature Details

### Quiz Interface
- **Single Question View** - One question per screen for focus
- **Navigation** - Previous/Next buttons with state preservation
- **Real-time Timer** - Visual countdown with warning states (red alert at 10s)
- **Progress Tracking** - Visual progress bar showing completion percentage

### Results Page
- **Score Breakdown** - Percentage score, marks earned, correct/wrong/unanswered count
- **Answer Review** - See all questions with selected vs correct answers
- **Color-Coded** - Green for correct, red for incorrect, gray for unanswered
- **Back Navigation** - Easy return to dashboard or quiz history
- **Print Preview** - Print-friendly results format

### Admin Panel
- **Quiz CRUD** - Create, read, update, delete operations
- **Publish Control** - Toggle quiz availability to students
- **Statistics** - View quiz metrics and student performance
- **Question Management** - Add/edit MCQ with explanations
- **Dashboard** - Overview of all quizzes and student activity

### Quiz History
- **Attempt Tracking** - All previous quiz attempts with dates
- **Statistics** - Personal attempt statistics (average score, total attempts)
- **Performance Chart** - Visual representation of score trends
- **Quick Review** - Quick access to view previous results

## 🔄 Navigation Features

Every page includes context-appropriate back buttons:
- Uses ArrowLeft icon from lucide-react
- Ghost button variant (minimal styling)
- Hidden text on mobile (visible on desktop)
- Navigates to logical previous screen (Last page, Admin Dashboard, Home, etc.)

Example:
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

## 💅 CSS Architecture

**Tailwind CSS + Custom Layers**
- Component layer: `.btn-*`, `.input-field`, `.card-*`
- Utility layer: Custom responsive utilities
- Base layer: Global resets and animations

**Animations**
- `fadeIn` - Opacity transitions
- `slideUp` - Bottom-to-top motion
- `scaleIn` - Scale growth effect
- `float` - Floating elevation effect
- `glow` - Pulsing glow effect
- `shimmer` - Loading shimmer effect

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation throughout
- ✅ Focus indicators on all interactive elements
- ✅ Form validation with clear error messages
- ✅ Screen reader friendly components
- ✅ 44px+ touch targets on mobile
- ✅ High contrast text (WCAG AA)
- ✅ Dark mode support for reduced eye strain

## 🧪 Component Usage Examples

### Button Component
```tsx
<Button
  variant="primary" | "secondary" | "outline" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  isLoading={boolean}
  icon={<IconComponent size={20} />}
  onClick={handler}
>
  Button Text
</Button>
```

### FormInput Component
```tsx
<FormInput
  label="Email"
  name="email"
  type="email"
  placeholder="you@example.com"
  value={value}
  onChange={handler}
  error={errorMessage}
  required={true}
/>
```

### Alert Component
```tsx
<Alert
  type="success" | "error" | "warning" | "info"
  title="Title"
  message="Alert message"
  onClose={handler}
/>
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser

### Installation Steps

1. **Extract Project**
   ```bash
   cd "Online Quiz"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Opens at `http://localhost:3001`

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```




