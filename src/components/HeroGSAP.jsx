import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

import logoImg from '../assets/logo_horizontal_color.png'; 
import mountainsImg from '../assets/fondomontanias.svg';

export default function HeroGSAP({ setPage }) {
  const heroContainer = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainer.current, 
        start: 'top top',               
        end: '+=250',              
        scrub: 0.5,
      },
    });

    tl.to('.gsap-logo', {
      y: -150,
      scale: 3,
      opacity: 0,
      ease: 'power3.in',
    }, 0); 

    tl.to('.gsap-text', {
      opacity: 0,
      y: 80,
      scale: 0.8,
      ease: 'power2.in',
    }, 0);

    tl.to('.gsap-mountains', {
      y: 200,
      opacity: 0,
      ease: 'power1.in',
    }, 0); 

    tl.to('.gsap-ring', {
      scale: 2,
      opacity: 0,
      stagger: 0.05,
      ease: 'power2.inOut'
    }, 0);

  }, { scope: heroContainer }); 

  const bannerStyles = {
    height: "92vh", 
    minHeight: 520,
    background: "linear-gradient(120deg, #FDFBF7 0%, #F5EFE6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    color: "var(--wine-dark)",
  };

  const ringStyles = {
    position: "absolute",
    borderRadius: "50%",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    pointerEvents: 'none',
  };

  return (
    <section id="hero" ref={heroContainer} style={bannerStyles}>
      
      <div className="gsap-ring" style={{ ...ringStyles, width: 600, height: 600, border: "1px solid rgba(107,31,42,0.08)" }} />
      <div className="gsap-ring" style={{ ...ringStyles, width: 700, height: 700, border: "1px solid rgba(107,31,42,0.04)" }} />

      <div 
        style={{
          textAlign: "center",
          maxWidth: 720,
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: "translateY(-8vh)"
        }}
      >
        <div className="gsap-text" style={{ fontFamily: "var(--sans)", fontSize: 11, letterSpacing: 8, color: "var(--gold)", marginBottom: 35, textTransform: "uppercase", fontWeight: "700" }}>
          Bodega · Desde 1892
        </div>

        <div className="gsap-logo" style={{ width: '100%', maxWidth: '420px', marginBottom: '45px' }}>
          <img src={logoImg} alt="Logo Campos de Solana" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
        </div>

        <p className="gsap-text" style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 400, lineHeight: 1.9, color: "var(--charcoal)", maxWidth: 480, margin: "0 0 40px 0" }}>
          Vinos de carácter nacidos en la tierra. Cada botella es el reflejo de nuestra tradición y pasión por la viticultura de excelencia.
        </p>

        <div className="gsap-text" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn-gold" onClick={() => setPage("catalog")} style={{ padding: "14px 28px", fontSize: "14px" }}> Explorar catálogo </button>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => setPage("register")}
            style={{ color: "var(--wine-dark)", borderColor: "var(--wine-dark)", background: "transparent", padding: "14px 28px", fontSize: "14px" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--wine-dark)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--wine-dark)";
            }}
          > 
            Crear cuenta 
          </button>
        </div>
      </div>

      <div className="gsap-mountains" style={{ 
          position: 'absolute', 
          bottom: '0%', 
          left: 0, 
          width: '100%', 
          zIndex: 2,
          opacity: 0.95 
      }}>
        <img src={mountainsImg} alt="Silueta de Montañas" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
      </div>

    </section>
  );
}