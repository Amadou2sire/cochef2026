import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Confidentialite() {
    return (
        <div className="min-h-screen bg-gray-50 py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="bg-white rounded-4 shadow-lg p-4 p-md-5">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">Politique de Confidentialité</h1>
                        <p className="text-muted">Charte de protection et finalité des données</p>
                    </div>

                    <div className="privacy-content">
                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">1. Charte de Protection des Données</h2>
                            <p className="text-muted">
                                CoChef s'engage à ce que la collecte et le traitement de vos données, effectués à partir du site cochef.tn,
                                soient conformes au règlement général sur la protection des données (RGPD) et à la législation nationale.
                                Nous apportons une attention particulière à la sécurité et à la confidentialité de vos informations.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">2. Politique de Confidentialité</h2>
                            <p className="text-muted">
                                Cette politique décrit comment nous collectons, utilisons et protégeons vos données personnelles
                                lorsque vous utilisez notre site web. Nous ne collectons que les données strictement nécessaires
                                au bon fonctionnement de nos services.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">3. Finalité des Données Collectées</h2>
                            <p className="text-muted">
                                Les données que nous collectons sont utilisées pour les finalités suivantes :
                            </p>
                            <ul className="text-muted">
                                <li>Gestion de votre compte utilisateur et de vos commandes</li>
                                <li>Envoi d'informations sur nos événements et ateliers (si consenti)</li>
                                <li>Amélioration de notre service client et support</li>
                                <li>Statistiques de fréquentation du site (anonymisées)</li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">4. Types de Données Collectées</h2>
                            <p className="text-muted">
                                Nous pouvons être amenés à collecter : Nom, Prénom, Email, Numéro de téléphone, Adresse de livraison,
                                et historique de commandes. Ces données sont conservées uniquement pendant la durée nécessaire
                                aux finalités pour lesquelles elles ont été collectées.
                            </p>
                        </section>
                    </div>

                    <div className="text-center mt-5 pt-4 border-top">
                        <Link to="/" className="btn btn-primary btn-lg px-5 rounded-pill">
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Confidentialite;
