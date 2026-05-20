import Header from "../components/Header";
import Hero from "../components/Hero";
import Introduction from "../components/Introduction";
import SignatureDishes from "../components/SignatureDishes";
import DiningCombos from "../components/DiningCombos";
import ReservationSection from "../components/ReservationSection";
import Gallery from "../components/Gallery";
import PromoBanner from "../components/PromoBanner";
import Testimonials from "../components/Testimonials";
import LocationContact from "../components/LocationContact";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-charcoal text-cream font-sans smooth-scroll">
      <Header />
      <main>
        <Hero />
        <Introduction />
        <SignatureDishes />
        <DiningCombos />
        <ReservationSection />
        <Gallery />
        <PromoBanner />
        <Testimonials />
        <LocationContact />
      </main>
      <Footer />
    </div>
  );
}
