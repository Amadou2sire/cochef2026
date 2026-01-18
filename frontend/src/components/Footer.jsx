import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.25s">
                        <div className="d-flex flex-column align-items-center">
                            <p className="mb-2">© Copyright 2026 CoChef. Tous droits réservés.</p>
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item mx-2">
                                    <Link to="/terms" className="text-muted small hover:text-primary transition-colors">Conditions d'Utilisation</Link>
                                </li>
                                <li className="list-inline-item mx-2">
                                    <Link to="/politique-confidentialite" className="text-muted small hover:text-primary transition-colors">Confidentialité</Link>
                                </li>
                                <li className="list-inline-item mx-2">
                                    <Link to="/securite-donnees" className="text-muted small hover:text-primary transition-colors">Sécurité</Link>
                                </li>
                                <li className="list-inline-item mx-2">
                                    <Link to="/vos-droits" className="text-muted small hover:text-primary transition-colors">Vos Droits</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
