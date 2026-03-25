import React, { Suspense, lazy, useContext } from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PrivateRoute from './components/PrivateRoute';
import { UserContext } from './context/UserContext';
import UserProvider from './context/UserContext';
import {Toaster} from "react-hot-toast"

const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Home = lazy(() => import("./pages/Dashboard/Home"));
const Income = lazy(() => import("./pages/Dashboard/Income"));
const Expense = lazy(() => import("./pages/Dashboard/Expense"));
const Budgets = lazy(() => import("./pages/Dashboard/Budgets"));
const AISummary = lazy(() => import("./pages/Dashboard/AISummary"));
const Chat = lazy(() => import("./pages/Dashboard/Chat"));
const Settings = lazy(() => import("./pages/Dashboard/Settings"));

const App = () => {
  return (
    <UserProvider>
      <div className='min-h-screen text-slate-900 antialiased'>
        <Router>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/"  element={<Root />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signUp" exact element={<SignUp />} />
              <Route path="/auth/callback" exact element={<AuthCallback />} />
              <Route path="/dashboard" exact element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/income" exact element={<PrivateRoute><Income /></PrivateRoute>} />
              <Route path="/expense" exact element={<PrivateRoute><Expense /></PrivateRoute>} />
              <Route path="/budgets" exact element={<PrivateRoute><Budgets /></PrivateRoute>} />
              <Route path="/ai-summary" exact element={<PrivateRoute><AISummary /></PrivateRoute>} />
              <Route path="/chat" exact element={<PrivateRoute><Chat /></PrivateRoute>} />
              <Route path="/settings" exact element={<PrivateRoute><Settings /></PrivateRoute>} />
            </Routes>
          </Suspense>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
            borderRadius: "18px",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            background: "rgba(255, 255, 255, 0.96)",
            color: "#0f172a",
            boxShadow: "0 24px 60px -34px rgba(15, 23, 42, 0.35)",
          },
        }}
      />
    </UserProvider>
  )
}

const Root = () => {
  const { isAuthenticated, loading } = useContext(UserContext);

  if (loading) {
    return <RouteFallback />
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

const RouteFallback = () => (
  <div className="grid min-h-screen place-items-center px-4">
    <div className="card flex w-full max-w-sm flex-col items-center gap-4 text-center">
      <div className="flex h-14 w-14 animate-spin items-center justify-center rounded-full border-4 border-primary/15 border-t-primary" />
      <div>
        <p className="text-sm font-semibold text-slate-900">Loading your workspace</p>
        <p className="mt-1 text-sm text-slate-500">Bringing your latest numbers into view.</p>
      </div>
    </div>
  </div>
)

export default App


// Router (or BrowserRouter)
// Wraps your entire app.
// Enables client-side routing (changing pages without refreshing).
// Tracks the URL in the address bar and shows the correct page/component.

// Routes
// A container for all your Routes.
// Think of it as a switchboard: it reads the current URL and matches it to a Route.

// Route
// Defines a URL path and which component should render when that path is visited.
