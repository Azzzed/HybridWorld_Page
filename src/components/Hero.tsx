import { motion } from "motion/react";
import { MapPin, Phone } from "lucide-react";
import GradientWaves from "./reactbits/GradientWaves";
import MetallicPaint from "./reactbits/MetallicPaint";
import SplitText from "./ui/SplitText";
import { Cta, CtaGhost } from "./ui/Cta";
import { site } from "../data/site";
import "./hero.css";

/**
 * Hero de una sola pantalla: fondo GradientWaves, el mensaje a la izquierda y
 * el logo del taller en cromo líquido a la derecha. Sin scroll scrubbing.
 *
 * El cromo es `MetallicPaint` de ReactBits, que toma la silueta del logo por
 * el canal alfa y le pinta encima un shader metálico en movimiento.
 */
export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__veil">
        <GradientWaves
          horizonColor="#50ff27"
          waveColor="#006806"
          crestColor="#FFFFFF"
          speed={0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
        />
      </div>

      <div className="shell hero__in">
        <div className="hero__copy">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Taller especializado en híbridos
          </motion.span>

          <SplitText
            as="h1"
            className="hero__title"
            text="Tu híbrido, en manos que lo entienden."
            onView={false}
            step={16}
            delay={220}
          />

          <motion.p
            className="hero__lede"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            Baterías híbridas, diagnóstico y reparación general.
            Tres talleres en California y se habla español en los tres.
          </motion.p>

          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
          >
            <Cta href={site.mainPhoneHref}>
              <Phone size={16} /> {site.mainPhone}
            </Cta>
            <CtaGhost href="#sucursales">
              <MapPin size={16} /> Sucursales
            </CtaGhost>
          </motion.div>
        </div>

        <motion.div
          className="hero__chrome"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="img"
          aria-label="Logo de Hybrid World Inc en cromo"
        >
          <MetallicPaint
            imageSrc="/img/logo-chrome-src.png"
            speed={0.22}
            liquid={0.62}
            scale={3.6}
            refraction={0.016}
            blur={0.01}
            /* Cromo de verdad: mucho contraste entre reflejo y sombra, y
               tinte neutro frío. El verde de la marca ya lo pone el fondo. */
            brightness={2.8}
            contrast={0.9}
            fresnel={1.35}
            lightColor="#ffffff"
            darkColor="#0a0d11"
            tintColor="#dce9f2"
            patternSharpness={1.6}
            chromaticSpread={1.3}
            contour={0.3}
            mouseAnimation
          />
        </motion.div>
      </div>

      <span className="hero__scroll" aria-hidden>
        <span />
      </span>
    </section>
  );
}
