import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="bg-white rounded-4 shadow-lg p-4 p-md-5">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">Conditions Générales d'Utilisation</h1>
                        <p className="text-muted">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                    </div>

                    <div className="terms-content">
                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">1. Acceptation des Conditions</h2>
                            <p className="text-muted">
                                En accédant et en utilisant le site CoChef, vous acceptez d'être lié par ces conditions générales d'utilisation.
                                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">2. Description du Service</h2>
                            <p className="text-muted">
                                CoChef est une plateforme de restauration permettant aux utilisateurs de consulter nos menus, passer des commandes,
                                et s'inscrire à nos événements culinaires. Nous nous réservons le droit de modifier ou d'interrompre le service
                                à tout moment sans préavis.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">3. Compte Utilisateur</h2>
                            <p className="text-muted">
                                Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de :
                            </p>
                            <ul className="text-muted">
                                <li>Maintenir la confidentialité de votre mot de passe</li>
                                <li>Toutes les activités effectuées sous votre compte</li>
                                <li>Nous informer immédiatement de toute utilisation non autorisée</li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">4. Commandes et Paiements</h2>
                            <p className="text-muted">
                                Toutes les commandes sont soumises à disponibilité. Nous nous réservons le droit d'annuler toute commande
                                pour des raisons légitimes. Les prix affichés sont en Dinars Tunisiens (DT) et peuvent être modifiés sans préavis.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">5. Propriété Intellectuelle</h2>
                            <p className="text-muted">
                                Tout le contenu présent sur CoChef (textes, images, logos, vidéos) est protégé par les lois sur la propriété intellectuelle.
                                Toute reproduction ou utilisation non autorisée est strictement interdite.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">6. Protection des Données</h2>
                            <p className="text-muted">
                                Nous nous engageons à protéger vos données personnelles conformément à notre politique de confidentialité.
                                Vos informations ne seront jamais vendues à des tiers et seront utilisées uniquement pour améliorer votre expérience.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">7. Limitation de Responsabilité</h2>
                            <p className="text-muted">
                                CoChef ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de
                                l'impossibilité d'utiliser nos services, sauf en cas de faute grave ou intentionnelle de notre part.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">8. Modifications des Conditions</h2>
                            <p className="text-muted">
                                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entreront en vigueur
                                dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">9. Contact</h2>
                            <p className="text-muted">
                                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à :
                            </p>
                            <ul className="text-muted">
                                <li>Email : contact@cochef.tn</li>
                                <li>Téléphone : +216 XX XXX XXX</li>
                                <li>Adresse : Startup Village, Tunis, Tunisie</li>
                            </ul>
                        </section>
                    </div>

                    <div className="text-center mt-5 pt-4 border-top">
                        <Link to="/login" className="btn btn-primary btn-lg px-5 rounded-pill">
                            <i className="fa fa-arrow-left me-2"></i>
                            Retour à la connexion
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default TermsOfService;
