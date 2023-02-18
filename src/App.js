import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import PublicRoute from './components/PublicRoute'
//import ProtectedRoute from './components/ProtectedsRoute'
import Customers from "./pages/Customers"
import Services from "./pages/Services"
import Reports from "./pages/TaxReports"
import Generate from "./pages/Invoice_Generate"
import Invoices from "./pages/Invoices"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/shared/Layout"
import Invoice from "./components/invoice/Invoice"
import UserProfile from './components/UserProfile';
import POCreate from './pages/POCreate';
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
const options = {
  //timeout: 2000,
  position: positions.TOP_CENTER,
  
};

function App() {
 
  return (
     <BrowserRouter>
     <Provider template={AlertTemplate} {...options}>
          <Routes>
              <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
              <Route path='/' element={<Layout /> } >
              <Route index element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="services" element={<Services />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="pocreates" element={<POCreate />} />
              <Route path="generates" element={<Generate />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="InvoiceView/:id" element={<Invoice />} />
              </Route>
          </Routes>
        </Provider>
      </BrowserRouter>
  )
}
export default App;
