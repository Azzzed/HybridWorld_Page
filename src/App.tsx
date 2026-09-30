import { MotionConfig } from "motion/react";
import Navbar from "./components/Navbar";
import HeroScroll from "./components/HeroScroll";
import BrandStrip from "./components/BrandStrip";
import Services from "./components/Services";
import ShopReveal from "./components/ShopReveal";
import CarStrip from "./components/CarStrip";
import Locations from "./components/Locations";
import Reviews from "./components/Reviews";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import QuickCall from "./components/QuickCall";
import StructuredData from "./components/StructuredData";

export default function App() {
  return (
    /* reducedMotion="user" hace que motion.dev respete la preferencia del
       sistema en las animaciones de entrada (los carruseles siguen girando). */
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#servicios">
        Saltar al contenido
      </a>
      <Navbar />
      <main>
        <HeroScroll />
        <BrandStrip />
        <Services />
        <ShopReveal />
        <CarStrip />
        <Locations />
        <Reviews />
        <Contact />
      </main>
      <Footer />
      <QuickCall />
      <StructuredData />
    </MotionConfig>
  );
}
