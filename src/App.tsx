import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import Careers from "./pages/Careers";
import CareerDetail from "./pages/CareerDetail";
import Profile from "./pages/Profile";
import ProjectTools from "./pages/ProjectTools";
import Mentorship from "./pages/Mentorship";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";

const queryClient = new QueryClient();

// ProtectedRoute and PublicRoute pulled from components

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout/:planId" element={<Checkout />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/career/:id" element={<CareerDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/project-tools" element={<ProjectTools />} />
          <Route path="/mentorship" element={<Mentorship />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
