import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import FindSpace from "@/pages/FindSpace";
import OfferSpace from "@/pages/OfferSpace";
import Contact from "@/pages/Contact";
import MyAccount from "@/pages/MyAccount";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={base}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encuentra-tu-espacio" element={<FindSpace />} />
          <Route path="/ofrece-tu-espacio" element={<OfferSpace />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/mi-cuenta" element={<MyAccount />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
