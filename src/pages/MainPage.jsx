import React from "react";
import LightRay from "../components/background/LightRay";
import "./MainPage.css";

export default function MainPage({ children }) {
  return (
    <div className="main-page fullscreen">

      {/* JEDNO SPOLEČNÉ POZADÍ */}
      <LightRay
        raysOrigin="top-center"
        raysColor="#820d8dff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="mainpage-rays"
      />

      {/* OBSAH (přední vrstva) */}
      <div className="mainpage-content">
        {children}
      </div>

    </div>
  );
}
