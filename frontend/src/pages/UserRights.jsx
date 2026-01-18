import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function UserRights() {
    return (
        <div className="min-h-screen bg-gray-50 py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="bg-white rounded-4 shadow-lg p-4 p-md-5">
                    <div className="text-center mb-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">Droits des Utilisateurs</h1>
                        <p className="text-muted">Droit à l'information et contrôle de vos données</p>
                    </div>

                    <div className="rights-content">
                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">1. Droit à l'Information</h2>
                            <p className="text-muted">
                                Vous avez le droit d'être informé de la manière dont vos données sont collectées et utilisées.
                                CoChef s'engage à une totale transparence sur ses processus de traitement.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">2. Vos Droits d'Accès et de Rectification</h2>
                            <p className="text-muted">
                                Vous pouvez à tout moment accéder aux données personnelles que nous détenons vous concernant.
                                Vous avez également le droit de demander la rectification de toute information inexacte ou incomplète
                                directement depuis votre espace "Profil" ou en nous contactant.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">3. Droit à la Suppression (Droit à l'Oubli)</h2>
                            <p className="text-muted">
                                Vous avez le droit de demander la suppression de vos données personnelles de nos systèmes.
                                Nous traiterons votre demande dans les plus brefs délais, sous réserve des obligations légales de conservation.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">4. Droit d'Opposition et à la Limitation</h2>
                            <p className="text-muted">
                                Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes ou demander
                                la limitation de leur traitement dans certains cas spécifiques prévus par la loi.
                            </p>
                        </section>

                        <section className="mb-5">
                            <h2 className="h3 fw-bold text-dark mb-3">5. Comment Exercer vos Droits ?</h2>
                            <p className="text-muted">
                                Pour toute demande relative à vos droits, vous pouvez nous contacter :
                            </p>
                            <ul className="text-muted">
                                <li>Par email : dpo@cochef.tn</li>
                                <li>Via notre formulaire de contact sur le site</li>
                                <li>Directement depuis votre compte utilisateur (pour la modification)</li>
                            </ul>
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

export default UserRights;
