import React from "react";
import "./Layout.css";

export default function TableContainer({ children }) {
  return (
    <div className="container-fluid py-3 page-container">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11">
          {children}
        </div>
      </div>
    </div>
  );
}
