import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import HeroSlider from "./components/HeroSlider";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ProcessSection from "./components/ProcessSection";
import ShowcaseSection from "./components/ShowcaseSection";
import WhyChooseSection from "./components/WhyChooseSection";
import PartnerLogos from "./components/PartnerLogos";
import TeamAndEvents from "./components/TeamAndEvents";
import RequestCallSection from "./components/RequestCallSection";
import TestimonialsSection from "./components/TestimonialsSection";
import BlogSection from "./components/BlogSection";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <>
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Navbar */}
      <Navbar />

      <main className="bg-[#f8fafc] text-[#0f172a]">
        {/* 3. Hero / Banner Slider */}
        <HeroSlider />

        {/* 4. About Ladi */}
        <AboutSection />

        {/* 5. Services & DPS Packages */}
        <ServicesSection />

        {/* 6. Process (Cara Kerja) */}
        <ProcessSection />

        {/* 7. Showcase "Apa yang Sudah Dibuat oleh Ladi" */}
        <ShowcaseSection />

        {/* 8. Why Choose Ladi */}
        <WhyChooseSection />

        {/* 9. Technology Ecosystem Logos */}
        <PartnerLogos />

        {/* 10. Team & Events */}
        <TeamAndEvents />

        {/* 11. Request a Call / Consultation Form */}
        <RequestCallSection />

        {/* 12. Testimonials (Klien Nyata) */}
        <TestimonialsSection />

        {/* 13. Dynamic Blog Section */}
        <BlogSection />
      </main>

      {/* 14. Footer */}
      <Footer />

      {/* Floating WhatsApp Action */}
      <WhatsAppButton />
    </>
  );
}
