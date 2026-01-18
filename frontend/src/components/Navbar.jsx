import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import CartModal from './CartModal';

function Navbar() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const { cartCount } = useCart();
    const [showCart, setShowCart] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:8000/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    // Optionally clear invalid token
                    // localStorage.removeItem('token');
                }
            }
        };
        fetchUser();
    }, [location.pathname]); // Re-fetch on route change to keep sync if needed

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <header className="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className="main-nav">
                                {/* ***** Logo Start ***** */}
                                <Link to="/" className="logo">
                                    <img src="/assets/images/logo.png" alt="CoChef" style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }} />
                                </Link>
                                {/* ***** Logo End ***** */}
                                {/* ***** Menu Start ***** */}
                                <ul className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
                                    <li className="scroll-to-section"><Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
                                    <li className="scroll-to-section"><Link to="/menus" className={location.pathname === '/menus' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Menus</Link></li>
                                    <li className="scroll-to-section"><Link to="/concept" className={location.pathname === '/concept' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Concept</Link></li>
                                    <li className="scroll-to-section"><Link to="/hub" className={location.pathname === '/hub' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>CoChef Hub</Link></li>
                                    <li className="scroll-to-section"><Link to="/gourmandise" className={location.pathname === '/gourmandise' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Gourmandises</Link></li>
                                    <li className="scroll-to-section"><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
                                    {user && (
                                        <li className="scroll-to-section"><Link to="/profil" className={location.pathname === '/profil' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Profil</Link></li>
                                    )}
                                    {user && user.role === 'superadmin' && (
                                        <li className="scroll-to-section"><Link to="/superadmin" className={location.pathname === '/superadmin' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Superadmin</Link></li>
                                    )}
                                    {user && user.role === 'webmaster' && (
                                        <li className="scroll-to-section"><Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Webmaster</Link></li>
                                    )}
                                    {user && user.role === 'gerant' && (
                                        <li className="scroll-to-section"><Link to="/gerant" className={location.pathname === '/gerant' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Gérant</Link></li>
                                    )}
                                    {user && user.role === 'caissier' && (
                                        <li className="scroll-to-section"><Link to="/caissier" className={location.pathname === '/caissier' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>Caisse</Link></li>
                                    )}

                                    {/* Cart Icon */}
                                    <li className="scroll-to-section ms-2">
                                        <Link to="#" onClick={(e) => { e.preventDefault(); setShowCart(true); setMobileMenuOpen(false); }} className="cart-icon position-relative">
                                            <i className="fa fa-shopping-cart" style={{ fontSize: '1.2rem' }}></i>
                                            {cartCount > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.6rem' }}>
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </li>

                                    <li className="scroll-to-section">
                                        <div className="main-red-button">
                                            {user ? (
                                                <Link to="#" onClick={(e) => { e.preventDefault(); handleLogout(); setMobileMenuOpen(false); }}>Logout</Link>
                                            ) : (
                                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                            )}
                                        </div>
                                    </li>
                                </ul>
                                <a className={`menu-trigger ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                                    <span>Menu</span>
                                </a>
                                {/* ***** Menu End ***** */}
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
            <CartModal show={showCart} onHide={() => setShowCart(false)} />
        </>
    );
}

export default Navbar;
