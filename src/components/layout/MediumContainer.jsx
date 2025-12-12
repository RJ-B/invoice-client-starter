import React from "react";

export default function MediumContainer({ children }) {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-11 col-xl-10 col-xxl-9">
          {children}
        </div>
      </div>
    </div>
  );
}
