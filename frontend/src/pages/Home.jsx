import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductSelectionModal from '../components/ProductSelectionModal';


function Home() {
    const [events, setEvents] = useState([]);
    const [occupancy, setOccupancy] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false);

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
                const [eventsRes, occupancyRes, productsRes] = await Promise.all([
                    axios.get('http://localhost:8000/events'),
                    axios.get('http://localhost:8000/kitchen/occupancy'),
                    axios.get('http://localhost:8000/menu')
                ]);
                setEvents(eventsRes.data);
                setOccupancy(occupancyRes.data);
                setProducts(productsRes.data);
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

            <div className="main-banner wow fadeIn" id="top" data-wow-duration="1s" data-wow-delay="0.5s">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-lg-6 align-self-center">
                                    <div className="left-content header-text wow fadeInLeft" data-wow-duration="1s" data-wow-delay="1s">
                                        <h6>Welcome to CoChef</h6>
                                        <h2>We Make <em>Delicious Ideas</em> &amp; <span>Gourmet</span> Experiences</h2>
                                        <p>CoChef is your premium destination for culinary sharing, where passion meets expertise. Discover our unique platform designed for food lovers.</p>
                                        <form id="search" action="#" method="GET">
                                            <fieldset>
                                                <input type="address" name="address" className="email" placeholder="Rechercher une recette ou un chef..." autoComplete="on" required />
                                            </fieldset>
                                            <fieldset>
                                                <button type="submit" className="main-button">Rechercher</button>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="right-image d-none d-lg-block wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.5s">
                                        <img src="/assets/images/banner-right-image.png" alt="team meeting" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="about" className="about-us section">
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
                                    <div className="col-lg-6">
                                        <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="0.5s">
                                            <div className="icon">
                                                <img src="/assets/images/service-icon-01.png" alt="reporting" />
                                            </div>
                                            <div className="right-text">
                                                <h4>Ateliers Culinaire</h4>
                                                <p>Participez à des cours interactifs avec nos meilleurs chefs.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="0.7s">
                                            <div className="icon">
                                                <img src="/assets/images/service-icon-02.png" alt="" />
                                            </div>
                                            <div className="right-text">
                                                <h4>Recettes Exclusives</h4>
                                                <p>Accédez à des centaines de recettes testées et approuvées.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="0.9s">
                                            <div className="icon">
                                                <img src="/assets/images/service-icon-03.png" alt="" />
                                            </div>
                                            <div className="right-text">
                                                <h4>Communauté Active</h4>
                                                <p>Échangez avec d'autres passionnés et partagez vos astuces.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="item wow fadeIn" data-wow-duration="1s" data-wow-delay="1.1s">
                                            <div className="icon">
                                                <img src="/assets/images/service-icon-04.png" alt="" />
                                            </div>
                                            <div className="right-text">
                                                <h4>Services Traiteur</h4>
                                                <p>Organisez vos événements avec nos solutions sur mesure.</p>
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
                                <img src="/assets/images/chef-portrait.jpg" alt="Chef de la semaine" className="rounded-4 shadow-lg" />
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeInRight" data-wow-duration="1s" data-wow-delay="0.2s">
                            <div className="section-heading">
                                <h6>Le Chef de la Semaine</h6>
                                <h2>Rencontrez le Chef <em>Marc Antoine</em> &amp; Son Savoir-<span>Faire</span> UNIQUE</h2>
                                <p>Cette semaine, nous mettons à l'honneur le Chef Marc Antoine, passionné par la cuisine fusion et les produits de saison. Avec plus de 15 ans d'expérience dans les plus grands restaurants, il partage avec vous ses secrets et ses inspirations pour des moments gourmands inoubliables.</p>
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
                        <div className="col-lg-6 offset-lg-3">
                            <div className="section-heading  wow bounceIn" data-wow-duration="1s" data-wow-delay="0.2s">
                                <h2>Découvrez Nos <em>Plats du Jour</em> &amp; Commandez en <span>Ligne</span></h2>
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

            <div id="blog" className="our-blog section mb-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.25s">
                            <div className="section-heading">
                                <h2>Nos Prochains <em>Évènements</em> &amp; <span>Ateliers</span></h2>
                                {occupancy && (
                                    <div className="kitchen-occupancy mt-4 p-3 bg-light rounded shadow-sm border border-light">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="mb-0"><i className="fa fa-fire text-danger"></i> Disponibilité Cuisine</h5>
                                            <span className="badge bg-success" style={{ fontSize: '0.9rem' }}>
                                                {occupancy.free_tables} tables libres
                                            </span>
                                        </div>
                                        <div className="progress" style={{ height: '25px', borderRadius: '15px' }}>
                                            <div
                                                className={`progress-bar progress-bar-striped progress-bar-animated ${occupancy.percentage > 80 ? 'bg-danger' : occupancy.percentage > 50 ? 'bg-warning' : 'bg-success'}`}
                                                role="progressbar"
                                                style={{ width: `${occupancy.percentage}%` }}
                                                aria-valuenow={occupancy.occupied_places}
                                                aria-valuemin="0"
                                                aria-valuemax={occupancy.max_capacity}
                                            >
                                                {occupancy.occupied_places} / {occupancy.max_capacity} Occupées
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between mt-2 small text-muted">
                                            <span><i className="fa fa-user"></i> Manuel: {occupancy.manual_occupied}</span>
                                            <span><i className="fa fa-calendar"></i> Événements: {occupancy.event_occupied}</span>
                                        </div>
                                    </div>
                                )}
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
                                                    <li><i className="fa fa-users"></i> {events[0].occupied_places} / {events[0].total_places} places</li>
                                                </ul>
                                                <a href="#"><h4>{events[0].title}</h4></a>
                                                <p>{events[0].description}</p>
                                                <div className="main-blue-button">
                                                    <a href="#">En savoir plus</a>
                                                </div>
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
                                                        <p>{event.occupied_places} / {event.total_places} places occupées</p>
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