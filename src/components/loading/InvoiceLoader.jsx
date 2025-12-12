import "./Loader.css";

export default function InvoiceLoader() {
  return (
    <div className="invoice-loader-overlay">
      <div className="glitch" data-glitch="Načítám...">Načítám...</div>
    </div>
  );
}
