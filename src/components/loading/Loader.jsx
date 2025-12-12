import React from "react";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader d-flex justify-content-center mt-5">
      <div data-glitch="Loading..." className="glitch">Načítání dat...</div>
    </div>
  );
}
