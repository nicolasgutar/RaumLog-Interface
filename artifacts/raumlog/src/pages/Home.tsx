import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import HostSection from "@/components/HostSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <HostSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
