import React from "react";

export default function TableContainer({ children }) {
  return (
    <div className="container-fluid py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11">
          {children}
        </div>
      </div>
    </div>
  );
}
