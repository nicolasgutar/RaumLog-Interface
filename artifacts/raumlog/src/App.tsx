import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import FindSpace from "@/pages/FindSpace";
import OfferSpace from "@/pages/OfferSpace";
import Contact from "@/pages/Contact";
import AuthPage from "@/pages/AuthPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminControl from "@/pages/AdminControl";
import AdminFinanzas from "@/pages/AdminFinanzas";
import HostDashboard from "@/pages/HostDashboard";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Soporte from "@/pages/Soporte";
import OnboardingPage from "@/pages/OnboardingPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/not-found";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";

const queryClient = new QueryClient();

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={base}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encuentra-tu-espacio" element={<FindSpace />} />
          <Route path="/ofrece-tu-espacio" element={<OfferSpace />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/dashboard/host" element={<HostDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/control" element={<AdminControl />} />
          <Route path="/admin/finanzas" element={<AdminFinanzas />} />
          <Route path="/terminos-y-condiciones" element={<TermsAndConditions />} />
          <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
