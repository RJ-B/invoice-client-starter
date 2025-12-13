import React from "react";
import InvoiceIndex from "./InvoiceIndex";

/**
 * Stránková komponenta pro správu faktur.
 *
 * Slouží jako route-level obálka nad komponentou InvoiceIndex.
 */
const InvoicePage = () => {
  return <InvoiceIndex />;
};

export default InvoicePage;
