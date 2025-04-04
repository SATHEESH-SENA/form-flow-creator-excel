
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FormProvider } from "@/context/FormContext";

import MainLayout from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import FormList from "./pages/FormList";
import FormBuilder from "./components/form-builder/FormBuilder";
import FormDetail from "./pages/FormDetail";
import Settings from "./pages/Settings";
import PublicForm from "./pages/PublicForm";
import NotFound from "./pages/NotFound";
import GstRegistrationForm from "./pages/GstRegistrationForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FormProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public form submission route */}
            <Route path="/form/:id" element={<PublicForm />} />
            
            {/* App routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="forms" element={<FormList />} />
              <Route path="forms/new" element={<FormBuilder />} />
              <Route path="forms/:id" element={<FormDetail />} />
              <Route path="forms/:id/edit" element={<FormBuilder />} />
              <Route path="settings" element={<Settings />} />
              <Route path="gst-registration" element={<GstRegistrationForm />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FormProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
