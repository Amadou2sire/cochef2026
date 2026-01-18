import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from './contexts/CartContext';

import Home from './pages/Home';
import Menus from './pages/Menus';
import Gourmandise from './pages/Gourmandise';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginRegister from './pages/LoginRegister';
import Profil from './pages/Profil';
import Gerant from './pages/Gerant';
import Caissier from './pages/Caissier';
import AdminDashboard from './pages/AdminDashboard';
import ProductManagement from './pages/ProductManagement';
import SupplementManagement from './pages/SupplementManagement';
import EventManagement from './pages/EventManagement';
import AdminSettings from './pages/AdminSettings';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menus" element={<Menus />} />
              <Route path="/gourmandise" element={<Gourmandise />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginRegister />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute roles={['client', 'webmaster', 'gerant', 'caissier', 'superadmin']} />}>
                <Route path="/profil" element={<Profil />} />
              </Route>

              <Route element={<PrivateRoute roles={['gerant', 'webmaster']} />}>
                <Route path="/gerant" element={<Gerant />} />
              </Route>

              <Route element={<PrivateRoute roles={['caissier', 'webmaster', 'gerant']} />}>
                <Route path="/caissier" element={<Caissier />} />
              </Route>

              <Route element={<PrivateRoute roles={['superadmin']} />}>
                <Route path="/superadmin" element={<SuperAdminDashboard />} />
              </Route>

              <Route element={<PrivateRoute roles={['webmaster']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/supplements" element={<SupplementManagement />} />
                <Route path="/admin/events" element={<EventManagement />} />
              </Route>

            </Routes>
          </div>
          <Footer />
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
