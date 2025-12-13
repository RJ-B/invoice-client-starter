import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import PersonPage from "./pages/persons/PersonPage";
import InvoicePage from "./pages/invoices/InvoicePage";
import InvoiceStats from "./pages/statistics/InvoiceStats";

import Dashboard from "./pages/main/Dashboard";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import LoginPage from "./pages/auth/AuthPage";

import PageContainer from "./components/layout/PageContainer";
import TableContainer from "./components/layout/TableContainer";

import Navigation from "./components/navbar/Navigation"; // jediný navbar
import MainPage from "./pages/main/MainPage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./components/navbar/Navbar.css";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>

        {/* Jediný navbar – nahoře na desktopu, dole na mobilu */}
        <Navigation />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/auth" />} />
          <Route path="/register" element={<Navigate to="/auth" />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainPage>
                  <Routes>

                    {/* DASHBOARD */}
                    <Route
                      index
                      element={
                        <PageContainer>
                          <Dashboard />
                        </PageContainer>
                      }
                    />

                    {/* PERSONS */}
                    <Route
                      path="/persons"
                      element={
                        <PageContainer>
                          <PersonPage />
                        </PageContainer>
                      }
                    />

                    {/* OSOBA → PRODEJNÍ FAKTURY */}
                    <Route
                      path="/persons/identification/:ico/sales"
                      element={
                        <TableContainer>
                          <InvoicePage type="sales" />
                        </TableContainer>
                      }
                    />

                    {/* OSOBA → NÁKUPNÍ FAKTURY */}
                    <Route
                      path="/persons/identification/:ico/purchases"
                      element={
                        <TableContainer>
                          <InvoicePage type="purchases" />
                        </TableContainer>
                      }
                    />

                    {/* INVOICES */}
                    <Route
                      path="/invoices"
                      element={
                        <TableContainer>
                          <InvoicePage />
                        </TableContainer>
                      }
                    />

                    {/* STATISTIKY */}
                    <Route
                      path="/invoices/statistics"
                      element={
                        <TableContainer>
                          <InvoiceStats />
                        </TableContainer>
                      }
                    />

                  </Routes>
                </MainPage>
              </ProtectedRoute>
            }
          />
        </Routes>

      </Router>
    </QueryClientProvider>
  );
}

export default App;
