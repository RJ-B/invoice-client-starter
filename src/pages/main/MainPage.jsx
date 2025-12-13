import React from "react";
import PropTypes from "prop-types";
import LightRay from "../../components/background/LightRay";
import "./MainPage.css";


/* ================= Error Boundary pro pozadí ================= */
class BackgroundErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return null; // fallback – stránka zůstane funkční i bez pozadí
    }
    return this.props.children;
  }
}

BackgroundErrorBoundary.propTypes = {
  children: PropTypes.node,
};

/* ================= MainPage layout ================= */
export default function MainPage({ children = null }) {
  const isDesktop =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  return (
    <div className="main-page fullscreen">
      {/* Společné pozadí */}
      <BackgroundErrorBoundary>
        <LightRay
          raysOrigin="top-center"
          raysColor="#820d8dff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={isDesktop}
          mouseInfluence={isDesktop ? 0.1 : 0}
          noiseAmount={0.1}
          distortion={0.05}
          className="mainpage-rays"
        />
      </BackgroundErrorBoundary>

      {/* Obsah */}
      <div className="mainpage-content">
        {children}
      </div>
    </div>
  );
}

MainPage.propTypes = {
  children: PropTypes.node,
};
