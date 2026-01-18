import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductSelectionModal from '../components/ProductSelectionModal';


import videoBg from '../assets/videos/videoCoChef.mp4';

function Home() {
    const [events, setEvents] = useState([]);
    const [occupancy, setOccupancy] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false);

    const [settings, setSettings] = useState({});

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

            <div id="about" className="about-us section" style={{ marginTop: '0' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="left-image d-none d-lg-block wow fadeIn" data-wow-duration="1s" data-wow-delay="0.2s">
                                <img src="/assets/images/about-left-image.png" alt="person graphic" />
                            </div>
                        </div>
                        <div className="col-lg-8 align-self-center">
                            <div className="services">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <div className="right-text">
                                                <h1 style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '2.5rem' }}>
                                                    {settings.welcome_title || "Bienvenue chez CoChef"}
                                                </h1>
                                                <h3 style={{ color: 'black', lineHeight: '1.4', fontWeight: 'normal', marginBottom: '25px', fontSize: '1.5rem' }}>
                                                    {(settings.welcome_subtitle || "Le bon goût des affaires\noù chaque repas est une opportunité").split('\n').map((line, i) => (
                                                        <span key={i}>{line}<br /></span>
                                                    ))}
                                                </h3>
                                                <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                                                    {settings.welcome_text || "Explorez une expérience culinaire exceptionnelle au cœur d'un village animé, où l'innovation et la tradition se rencontrent, grâce à l’écosystème proposé par StartUp Village."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="services" className="our-services section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 align-self-center  wow fadeInLeft" data-wow-duration="1s" data-wow-delay="0.2s">
                            <div className="left-image">
                                <img src={settings.chef_image_url || "/assets/images/chef-portrait.jpg"} alt="Chef de la semaine" className="rounded-4 shadow-lg" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
                            <div className="section-heading">
                                <h6>Le Chef de la Semaine</h6>
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
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2">
                            <div className="section-heading text-center mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    viewport={{ once: true }}
                                >
                                    <h6 className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-2">Carte du moment</h6>
                                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                        Découvrez Nos <em className="italic text-orange-600">Plats du Jour</em> <br className="d-none d-md-block" />
                                        & Commandez en <span className="text-blue-500">Ligne</span>
                                    </h2>
                                    <div className="w-20 h-1 bg-orange-600 mx-auto mt-4 rounded-full"></div>
                                </motion.div>
                            </div>
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

            {/* Free Tables Section */}
            {occupancy && (
                <div id="free-tables" className="section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="section-heading text-center wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.2s">
                                    <h2>Disponibilité <em>Cuisine</em> en <span>Temps Réel</span></h2>
                                    <p className="d-none d-md-block">Consultez la disponibilité de nos tables pour planifier votre visite</p>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-10 col-lg-8 px-3 px-md-4">
                                <div className="kitchen-occupancy p-3 p-md-5 bg-white rounded-4 shadow-lg border border-light wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 mb-md-4 gap-2">
                                        <h3 className="mb-0 fw-bold fs-5 fs-md-4"><i className="fa fa-fire text-danger me-2"></i> Tables Disponibles</h3>
                                        <span className="badge bg-success fs-6 fs-md-5 px-3 px-md-4 py-2">
                                            {occupancy.free_tables} tables libres
                                        </span>
                                    </div>
                                    <div className="progress mb-3" style={{ height: '30px', borderRadius: '20px' }}>
                                        <div
                                            className={`progress-bar progress-bar-striped progress-bar-animated ${occupancy.percentage > 80 ? 'bg-danger' : occupancy.percentage > 50 ? 'bg-warning' : 'bg-success'}`}
                                            role="progressbar"
                                            style={{ width: `${100 - occupancy.percentage}%`, fontSize: '0.9rem', fontWeight: 'bold' }}
                                            aria-valuenow={occupancy.free_tables}
                                            aria-valuemin="0"
                                            aria-valuemax={occupancy.max_capacity}
                                        >
                                            {occupancy.free_tables} Tables Libres
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div id="blog" className="our-blog section mb-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.25s">
                            <div className="section-heading">
                                <h2>Nos Prochains <em>Évènements</em> &amp; <span>Ateliers</span></h2>
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.25s">
                            <div className="top-dec">
                                <img src="/assets/images/blog-dec.png" alt="" />
                            </div>
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
                                    <h4>Pour toute question, appelez-nous : <span><i className="fa fa-phone"></i> <a href="#">01-23-45-67-89</a></span></h4>
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