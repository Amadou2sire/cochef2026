import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SecurityPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="bg-white rounded-4 shadow-lg p-4 p-md-5">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">Sécurité et Cyber-sécurité</h1>
                        <p className="text-muted">Nos engagements pour la protection de vos données</p>
                    </div>

                    <div className="security-content">
                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">1. Mesures de Sécurité</h2>
                            <p className="text-muted">
                                CoChef met en œuvre toutes les mesures techniques et organisationnelles nécessaires pour garantir
                                un niveau de sécurité adapté au risque, notamment pour prévenir la destruction, la perte,
                                l'altération, la divulgation non autorisée ou l'accès aux données.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">2. Cyber-sécurité</h2>
                            <p className="text-muted">
                                Nos protocoles incluent :
                            </p>
                            <ul className="text-muted">
                                <li>Chiffrement SSL/TLS pour toutes les communications</li>
                                <li>Hachage sécurisé des mots de passe</li>
                                <li>Pare-feu applicatif et surveillance des tentatives d'intrusion</li>
                                <li>Mises à jour régulières de nos systèmes et bibliothèques</li>
                            </ul>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">3. Intégrité des Données</h2>
                            <p className="text-muted">
                                Nous garantissons que vos données sont traitées de manière à assurer une sécurité appropriée,
                                y compris la protection contre le traitement non autorisé ou illicite. Les accès à nos bases
                                de données sont strictement limités au personnel autorisé.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">4. Notification en cas de faille</h2>
                            <p className="text-muted">
                                Conformément au RGPD, en cas de violation de données personnelles, CoChef s'engage à notifier
                                l'autorité de contrôle compétente et les utilisateurs concernés dans les délais légaux.
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

export default SecurityPolicy;
