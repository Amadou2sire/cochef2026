import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ProductSelectionModal from '../components/ProductSelectionModal';


import videoBg from '../assets/videos/videoCoChef.mp4';

function Home() {
    const [events, setEvents] = useState([]);
    const [occupancy, setOccupancy] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false);

    const [settings, setSettings] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Handle preloader
        const preloader = document.getElementById('js-preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('loaded');
            }, 500);
        }

        // Fetch data
        const fetchData = async () => {
            try {
                const [eventsRes, occupancyRes, productsRes, settingsRes] = await Promise.all([
                    axios.get('http://localhost:8000/events'),
                    axios.get('http://localhost:8000/kitchen/occupancy'),
                    axios.get('http://localhost:8000/menu'),
                    axios.get('http://localhost:8000/settings')
                ]);
                setEvents(eventsRes.data);
                setOccupancy(occupancyRes.data);
                setProducts(productsRes.data);

                // Process settings
                const settingsMap = {};
                settingsRes.data.forEach(s => {
                    settingsMap[s.key] = s.value;
                });
                setSettings(settingsMap);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleOrderClick = (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setSelectedProduct(product);
        setShowSelectionModal(true);
    };

    return (
        <>
            {/* ***** Preloader Start ***** */}
            <div id="js-preloader" className="js-preloader">
                <div className="preloader-inner">
                    <span className="dot"></span>
                    <div className="dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            {/* ***** Preloader End ***** */}

            <div className="main-banner wow fadeIn" id="top" data-wow-duration="1s" data-wow-delay="0.5s" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
                <video autoPlay muted loop playsInline key={settings.home_banner_video_url} style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    zIndex: '0',
                    transform: 'translate(-50%, -50%)',
                    objectFit: 'cover'
                }}>
                    <source src={settings.home_banner_video_url || videoBg} type="video/mp4" />
                </video>
                {/* Overlay removed as requested implicitly by removing text */}

                <div className="container" style={{ position: 'relative', zIndex: '2' }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-12 align-self-center">
                                    <div className="left-content header-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="1s">
                                    </div>
                                </div>
                                {/* Removed right image as video takes focus */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="about" className="about-us section" style={{ marginTop: '0px', paddingTop: '60px', paddingBottom: '60px', backgroundColor: '#ffffff', backgroundImage: 'none' }}>
                <div className="container">
                    <div className="row align-items-center g-4 g-lg-5">
                        {/* Left Side - Image */}
                        <motion.div
                            className="col-lg-5"
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="d-none d-lg-block wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
                                <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden' }}>
                                    <img src="/assets/images/about-left-image.png" alt="About CoChef" style={{ width: '100%', height: 'auto', display: 'block' }} />
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Content */}
                        <motion.div
                            className="col-lg-7"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="services">
                                <div className="wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.3s">
                                    {/* Main Title */}
                                    <h1 className="text-gray-900 font-black mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1' }}>
                                        {settings.welcome_title || "Bienvenue chez CoChef"}
                                    </h1>

                                    {/* Separator */}
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div style={{ width: '50px', height: '4px', backgroundColor: '#FF6B35', borderRadius: '10px' }}></div>
                                        <span className="font-bold" style={{ fontSize: '0.9rem', letterSpacing: '1px', color: '#FF6B35' }}>UNE EXPERIENCE UNIQUE</span>
                                    </div>

                                    {/* Subtitle */}
                                    <h3 className="text-gray-800 mb-4 font-bold" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', lineHeight: '1.5' }}>
                                        {(settings.welcome_subtitle || "Le bon goût des affaires\noù chaque repas est une opportunité").split('\n').map((line, i) => (
                                            <span key={i}>{line}<br /></span>
                                        ))}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 mb-5" style={{ fontSize: 'clamp(1rem, 2vw, 1.1rem)', lineHeight: '1.8', marginBottom: '2rem' }}>
                                        {settings.welcome_text || "Explorez une expérience culinaire exceptionnelle au cœur d'un village animé, où l'innovation et la tradition se rencontrent, grâce à l'écosystème proposé par StartUp Village."}
                                    </p>

                                    {/* Features List */}
                                    <div className="row g-3 mb-5">
                                        <div className="col-sm-6">
                                            <div className="d-flex gap-3">
                                                <div style={{ minWidth: '50px' }}>
                                                    <div className="d-flex align-items-center justify-content-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', width: '50px', height: '50px' }}>
                                                        <i className="fa fa-user" style={{ color: '#FF6B35', fontSize: '1.5rem' }}></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-gray-900 font-bold mb-1">Chefs Talentueux</h5>
                                                    <p className="text-gray-600 text-sm mb-0">Expertise reconnue</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex gap-3">
                                                <div style={{ minWidth: '50px' }}>
                                                    <div className="d-flex align-items-center justify-content-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', width: '50px', height: '50px' }}>
                                                        <i className="fa fa-leaf" style={{ color: '#FF6B35', fontSize: '1.5rem' }}></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-gray-900 font-bold mb-1">Produits Frais</h5>
                                                    <p className="text-gray-600 text-sm mb-0">De qualite superieure</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex gap-3">
                                                <div style={{ minWidth: '50px' }}>
                                                    <div className="d-flex align-items-center justify-content-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', width: '50px', height: '50px' }}>
                                                        <i className="fa fa-heart" style={{ color: '#FF6B35', fontSize: '1.5rem' }}></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-gray-900 font-bold mb-1">Passion</h5>
                                                    <p className="text-gray-600 text-sm mb-0">Dans chaque plat</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="d-flex gap-3">
                                                <div style={{ minWidth: '50px' }}>
                                                    <div className="d-flex align-items-center justify-content-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)', width: '50px', height: '50px' }}>
                                                        <i className="fa fa-clock-o" style={{ color: '#FF6B35', fontSize: '1.5rem' }}></i>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h5 className="text-gray-900 font-bold mb-1">Service Rapide</h5>
                                                    <p className="text-gray-600 text-sm mb-0">Qualite garantie</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>


            <div id="services" className="our-services section">
                <div className="container">
                    <h2 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight mb-5 text-center">
                        Le Chef de la <span className="text-orange-600">Semaine</span> <br className="d-none d-md-block" />
                    </h2>
                    <div className="row">
                        <div className="col-lg-6 align-self-center  wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
                            <div className="left-image">
                                <img src={settings.chef_image_url || "/assets/images/chef-portrait.jpg"} alt="Chef de la semaine" className="rounded-4 shadow-lg" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
                            <div className="section-heading">
                                
                                <h2>Rencontrez le Chef <em>{settings.chef_name || "Marc Antoine"}</em> &amp; Son Savoir-<span>Faire</span> UNIQUE</h2>
                                <p>{settings.chef_description || "Cette semaine, nous mettons à l'honneur le Chef Marc Antoine, passionné par la cuisine fusion et les produits de saison. Avec plus de 15 ans d'expérience dans les plus grands restaurants, il partage avec vous ses secrets et ses inspirations pour des moments gourmands inoubliables."}</p>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="first-bar progress-skill-bar">
                                        <h4>Cuisine Signature</h4>
                                        <span>95%</span>
                                        <div className="filled-bar"></div>
                                        <div className="full-bar"></div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="second-bar progress-skill-bar">
                                        <h4>Innovation Gastronomique</h4>
                                        <span>88%</span>
                                        <div className="filled-bar"></div>
                                        <div className="full-bar"></div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="third-bar progress-skill-bar">
                                        <h4>Transmission & Partage</h4>
                                        <span>98%</span>
                                        <div className="filled-bar"></div>
                                        <div className="full-bar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="portfolio" className="our-portfolio section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <motion.div
                                className="text-center wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.2s"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h6 className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-3">Menu du Jour</h6>
                                <h2 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight mb-3">
                                    Découvrez Nos <span className="text-orange-600 ">Plats du Jour</span> <br className="d-none d-md-block" />
                                    & Commandez en <span className="text-blue-500">Ligne</span>
                                </h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Explorez nos créations culinaires et passez vos commandes en ligne
                                </p>
                                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mt-4 rounded-full"></div>
                            </motion.div>
                        </div>
                    </div>
                    <div className="row">
                        {products.length > 0 ? (
                            products.slice(0, 4).map((product, idx) => (
                                <div key={product.id} className="col-lg-3 col-sm-6 mb-5 text-center">
                                    <div className="wow bounceInUp" data-wow-duration="1s" data-wow-delay={`${0.3 + (idx * 0.1)}s`}>
                                        <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                                            <Card.Img variant="top" src={product.image_url || 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800'} className="rounded-top" style={{ height: '200px', objectFit: 'cover' }} />
                                            <Card.Body>
                                                <Card.Title className="font-weight-bold">{product.name}</Card.Title>
                                                <Card.Text>
                                                    {product.description}
                                                    <br />
                                                    <strong className="text-primary">{product.base_price.toFixed(2)} DT</strong>
                                                </Card.Text>
                                                <Button
                                                    variant="primary"
                                                    className="rounded-pill px-4"
                                                    disabled={!product.available}
                                                    onClick={() => handleOrderClick(product)}
                                                >
                                                    {product.available ? 'Commander' : 'Indisponible'}
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <p className="text-muted">Aucun plat disponible pour le moment.</p>
                            </div>
                        )}
                    </div>
                    {products.length > 4 && (
                        <div className="row mt-4 mb-5">
                            <div className="col-lg-12 text-center">
                                <div className="main-blue-button">
                                    <Link to="/menus">Voir plus de menus</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ProductSelectionModal
                show={showSelectionModal}
                onHide={() => setShowSelectionModal(false)}
                product={selectedProduct}
            />

            {/* Kitchen Availability Section */}
            {occupancy && (
                <div id="kitchen-availability" className="section bg-white" style={{ paddingTop: '60px', paddingBottom: '30px' }}>
                    <div className="container">
                        {/* Section Header */}
                        <div className="row mb-5">
                            <div className="col-12">
                                <motion.div
                                    className="text-center wow fadeInUp"
                                    data-wow-duration="1s"
                                    data-wow-delay="0.2s"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <h6 className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-3">Suivi en Direct</h6>
                                    <h2 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight mb-3">
                                        Disponibilité <span className="text-orange-600">des tables</span> <br className="d-none d-md-block" />
                                        en <span className="text-blue-500">Temps Réel</span>
                                    </h2>
                                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                        Consultez l'état de nos cuisines et planifiez votre visite
                                    </p>
                                    <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mt-4 rounded-full"></div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="row g-3 g-md-4 mb-5">
                            {/* Available Tables Card */}
                            <motion.div
                                className="col-12 col-sm-6 col-lg-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="kitchen-stat-card bg-white rounded-2xl p-4 p-md-5 border border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="stat-icon bg-green-100 rounded-full p-3" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa fa-check-circle text-green-600" style={{ fontSize: '28px' }}></i>
                                        </div>
                                        <span className="badge bg-green-500 text-white px-3 py-2 rounded-full text-sm font-bold">Libre</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">Tables Disponibles</p>
                                    <h3 className="text-gray-900 text-4xl font-black mb-0">{occupancy.free_tables}</h3>
                                </div>
                            </motion.div>

                            {/* Occupied Tables Card */}
                            <motion.div
                                className="col-12 col-sm-6 col-lg-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="kitchen-stat-card bg-white rounded-2xl p-4 p-md-5 border border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.4s">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="stat-icon bg-orange-100 rounded-full p-3" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa fa-fire text-orange-600" style={{ fontSize: '28px' }}></i>
                                        </div>
                                        <span className="badge bg-orange-500 text-white px-3 py-2 rounded-full text-sm font-bold">Occupée</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">Tables Occupées</p>
                                    <h3 className="text-gray-900 text-4xl font-black mb-0">{occupancy.max_capacity - occupancy.free_tables}</h3>
                                </div>
                            </motion.div>

                            {/* Total Capacity Card */}
                            <motion.div
                                className="col-12 col-sm-6 col-lg-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="kitchen-stat-card bg-white rounded-2xl p-4 p-md-5 border border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.5s">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="stat-icon bg-blue-100 rounded-full p-3" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa fa-cog text-blue-600" style={{ fontSize: '28px' }}></i>
                                        </div>
                                        <span className="badge bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-bold">Total</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">Capacité Totale</p>
                                    <h3 className="text-gray-900 text-4xl font-black mb-0">{occupancy.max_capacity}</h3>
                                </div>
                            </motion.div>

                            {/* Occupancy Rate Card */}
                            <motion.div
                                className="col-12 col-sm-6 col-lg-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                viewport={{ once: true }}
                            >
                                <div className="kitchen-stat-card bg-white rounded-2xl p-4 p-md-5 border border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-300 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.6s">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <div className="stat-icon bg-purple-100 rounded-full p-3" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa fa-asterisk text-purple-600" style={{ fontSize: '28px' }}></i>
                                        </div>
                                        <span className={`badge text-white px-3 py-2 rounded-full text-sm font-bold ${occupancy.percentage > 80 ? 'bg-red-500' : occupancy.percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                            {occupancy.percentage > 80 ? 'Élevé' : occupancy.percentage > 50 ? 'Moyen' : 'Faible'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">Taux d'Occupation</p>
                                    <h3 className="text-gray-900 text-4xl font-black mb-0">{occupancy.percentage}%</h3>
                                </div>
                            </motion.div>
                        </div>

                        {/* Visual Progress Bar */}
                        <motion.div
                            className="row"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="col-12">
                                <div className="bg-white rounded-2xl p-4 p-md-5 border border-2 border-gray-200 shadow-md wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.7s">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="text-gray-900 font-bold mb-0">
                                            <i className="fa fa-tachometer-alt me-2 text-orange-600"></i>
                                            Charge de Travail Actuelle
                                        </h4>
                                        <span className={`badge text-white px-4 py-2 rounded-full font-bold ${occupancy.percentage > 80 ? 'bg-red-500' : occupancy.percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                            {occupancy.percentage > 80 ? '🔴 Très Occupée' : occupancy.percentage > 50 ? '🟡 Modérément Occupée' : '🟢 Peu Occupée'}
                                        </span>
                                    </div>
                                    <div className="progress" style={{ height: '32px', borderRadius: '20px', backgroundColor: '#f0f0f0' }}>
                                        <motion.div
                                            className={`progress-bar ${occupancy.percentage > 80 ? 'bg-danger' : occupancy.percentage > 50 ? 'bg-warning' : 'bg-success'}`}
                                            role="progressbar"
                                            style={{ borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', color: 'white' }}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${occupancy.percentage}%` }}
                                            transition={{ delay: 0.8, duration: 1 }}
                                            viewport={{ once: true }}
                                        >
                                            {occupancy.percentage}%
                                        </motion.div>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-3 mb-0">
                                        <i className="fa fa-info-circle me-2"></i>
                                        {occupancy.percentage > 80 ? 'Cuisines à pleine capacité - Délai d\'attente possible' : occupancy.percentage > 50 ? 'Cuisines bien chargées - Service normal' : 'Excellente disponibilité - Accueil immédiat'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            <div id="blog" className="our-blog section mb-2">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-lg-12">
                            <motion.div
                                className="text-center wow fadeInUp"
                                data-wow-duration="1s"
                                data-wow-delay="0.2s"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h6 className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-3">À Ne Pas Manquer</h6>
                                <h2 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight mb-3">
                                    Nos Prochains <span className="text-orange-600 ">Évènements</span> <br className="d-none d-md-block" />
                                    & <span className="text-blue-500">Ateliers</span>
                                </h2>
                                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                    Rejoignez-nous pour des moments festifs et enrichissants autour de la gastronomie
                                </p>
                                <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mt-4 rounded-full"></div>
                            </motion.div>
                        </div>
                    </div>
                    <div className="row">
                        {events.length > 0 ? (
                            <>
                                <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
                                    <div className="left-image">
                                        <a href="#"><img src={events[0].image_url || "/assets/images/big-blog-thumb.jpg"} alt={events[0].title} style={{ height: '400px', objectFit: 'cover', borderRadius: '20px' }} /></a>
                                        <div className="info">
                                            <div className="inner-content">
                                                <ul>
                                                    <li><i className="fa fa-calendar"></i> {new Date(events[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</li>
                                                    <li><i className="fa fa-users"></i> {events[0].occupied_places} places</li>
                                                </ul>
                                                <a href="#"><h4>{events[0].title}</h4></a>
                                                <p>{events[0].description}</p>
                                                {/* <div className="main-blue-button">
                                                    <a href="#">En savoir plus</a>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.25s">
                                    <div className="right-list">
                                        <ul>
                                            {events.slice(1, 4).map((event, idx) => (
                                                <li key={event.id}>
                                                    <div className="left-content align-self-center">
                                                        <span><i className="fa fa-calendar"></i> {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                        <a href="#"><h4>{event.title}</h4></a>
                                                        <p>{event.occupied_places} places occupées</p>
                                                    </div>
                                                    <div className="right-image">
                                                        <a href="#"><img src={event.image_url || "/assets/images/blog-thumb-01.jpg"} alt={event.title} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '15px' }} /></a>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col-lg-12 text-center py-5">
                                <p>Aucun évènement à venir pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div id="contact" className="contact-us section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 align-self-center wow fadeInLeft" data-wow-duration="0.5s" data-wow-delay="0.25s">
                            <div className="section-heading">
                                <h2>N'hésitez pas à nous envoyer un message pour vos besoins culinaires</h2>
                                <p>Nous sommes à votre écoute pour toute demande d'atelier, de service traiteur ou de collaboration.</p>
                                <div className="phone-info">
                                    <h4>Pour toute question, appelez-nous :<br></br><span><i className="fa fa-phone"></i> <a href="tel:01-23-45-67-89">01-23-45-67-89</a></span></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeInRight" data-wow-duration="0.5s" data-wow-delay="0.25s">
                            <form id="contact" action="" method="post">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <fieldset>
                                            <input type="name" name="name" id="name" placeholder="Nom" autoComplete="on" required />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-6">
                                        <fieldset>
                                            <input type="surname" name="surname" id="surname" placeholder="Prénom" autoComplete="on" required />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12">
                                        <fieldset>
                                            <input type="text" name="email" id="email" pattern="[^ @]*@[^ @]*" placeholder="Votre Email" required="" />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12">
                                        <fieldset>
                                            <textarea name="message" className="form-control" id="message" placeholder="Votre Message" required=""></textarea>
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12">
                                        <fieldset>
                                            <button type="submit" id="form-submit" className="main-button ">Envoyer</button>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="contact-dec">
                                    <img src="/assets/images/contact-decoration.png" alt="" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;