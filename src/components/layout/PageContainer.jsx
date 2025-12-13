import React from "react";
import "./Layout.css";

export default function PageContainer({ children }) {
  return (
    <div className="container py-4 page-container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-11 col-lg-10 col-xl-9 col-xxl-8">
          {children}
        </div>
      </div>
    </div>
  );
}
