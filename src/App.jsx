import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Templates from "./pages/Templates";  //new
import MasterForm from './pages/MasterForm';
import Shipments from './pages/Shipments';
import TeamManagement from './pages/TeamManagement';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import InrInvoice from './pages/InrInvoice';
import PaymentDetails from './pages/PaymentDetails';
import ProformaInvoice from './pages/ProformaInvoice';
import ProtectedRoute from './components/ProtectedRoute';

// Import your new Master Data pages
import ProductMaster from './pages/ProductMaster';
import BuyerMaster from './pages/BuyerMaster';
import ManufacturerMaster from './pages/ManufacturerMaster';
import Exporter from './pages/ExporterProfile';
import RangeMaster from './pages/RangeMaster';
import BankMaster from './pages/BankMaster';


import PartyWiseReport from './pages/PartyWiseReport';
import ItemWiseReport from './pages/ItemWiseReport';
function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '  ',
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#334155',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invoice-inr/:id" element={<InrInvoice />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="shipments" element={<Shipments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="/dashboard/proforma-invoice" element={<ProformaInvoice />} /> 
          <Route path="payment-details" element={<PaymentDetails />} />
          {/* <Route path="templates" element={<Templates />} />
          <Route path="builder" element={<TemplateBuilder />} /> */}
          
          <Route element={<ProtectedRoute allowedRoles={['Admin', 'Team Leader']} />}>
            <Route path="master-form" element={<MasterForm />} />
            <Route path="master-form/:id" element={<MasterForm />} />
            <Route path="templates" element={<Templates />} />
            <Route path="party-wise" element={<PartyWiseReport />} />
  <Route path="item-wise" element={<ItemWiseReport />} />
            
            {/* New Master Data Routes */}
            <Route path="master-data/product" element={<ProductMaster />} />
            <Route path="master-data/buyer" element={<BuyerMaster />} />
            <Route path="master-data/manufacturer" element={<ManufacturerMaster />} />
            <Route path="master-data/range" element={<RangeMaster />} />
            <Route path="master-data/exporter" element={<Exporter/>}/>
            <Route path="master-data/bank" element={<BankMaster />} />

          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="settings" element={<Settings />} />
            <Route path="team" element={<TeamManagement />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;