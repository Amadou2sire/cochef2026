import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [capacity, setCapacity] = useState(10);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const res = await axios.get('http://localhost:8000/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.role !== 'webmaster') {
                    navigate('/');
                }
                setUser(res.data);

                // Fetch current capacity
                const settingsRes = await axios.get('http://localhost:8000/admin/settings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const capacitySetting = settingsRes.data.find(s => s.key === 'kitchen_capacity');
                if (capacitySetting) setCapacity(parseInt(capacitySetting.value));
            } catch (err) {
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleSaveCapacity = async () => {
        const token = localStorage.getItem('token');
        setIsSaving(true);
        try {
            await axios.post('http://localhost:8000/admin/settings', {
                key: 'kitchen_capacity',
                value: capacity.toString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Error updating capacity:", err);
        }
        setIsSaving(false);
    };

    if (!user) return null;

    return (
        <div className="admin-dashboard py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="section-heading mb-5">
                    <h2>Tableau de Bord <em>Webmaster</em></h2>
                    <p>Bienvenue, {user.name}. Gérez les contenus dynamiques de CoChef.</p>
                </div>
                <Row>
                    <Col lg={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm hover-shadow transition-all group">
                            <Card.Body className="p-4 text-center">
                                <div className="icon mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ fontSize: '3.5rem', color: '#03a4ed' }}>
                                    <i className="fa fa-cutlery"></i>
                                </div>
                                <h4 className="font-weight-bold mb-3">Gestion produits</h4>
                                <p className="text-muted mb-4">Ajoutez, modifiez ou supprimez des plats du menu en toute simplicité.</p>
                                <Button as={Link} to="/admin/products" variant="primary" className="rounded-pill px-4 py-2 font-weight-bold shadow-sm">Gérer les Produits</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm hover-shadow transition-all group">
                            <Card.Body className="p-4 text-center">
                                <div className="icon mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ fontSize: '3.5rem', color: '#03a4ed' }}>
                                    <i className="fa fa-cubes"></i>
                                </div>
                                <h4 className="font-weight-bold mb-3">Gestion suppléments</h4>
                                <p className="text-muted mb-4">Gérez les extras (fromage, sauces, etc.) et personnalisez vos offres.</p>
                                <Button as={Link} to="/admin/supplements" variant="primary" className="rounded-pill px-4 py-2 font-weight-bold shadow-sm">Gérer les Suppléments</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm hover-shadow transition-all group">
                            <Card.Body className="p-4 text-center">
                                <div className="icon mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ fontSize: '3.5rem', color: '#03a4ed' }}>
                                    <i className="fa fa-calendar"></i>
                                </div>
                                <h4 className="font-weight-bold mb-3">Gestion évènements</h4>
                                <p className="text-muted mb-4">Créez et organisez vos prochains ateliers culinaires et sessions.</p>
                                <Button as={Link} to="/admin/events" variant="primary" className="rounded-pill px-4 py-2 font-weight-bold shadow-sm">Gérer les Événements</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="mb-4">
                        <Card className="h-100 border-0 shadow-sm hover-shadow transition-all group">
                            <Card.Body className="p-4 text-center">
                                <div className="icon mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ fontSize: '3.5rem', color: '#03a4ed' }}>
                                    <i className="fa fa-desktop"></i>
                                </div>
                                <h4 className="font-weight-bold mb-3">Gestion Contenu (CMS)</h4>
                                <p className="text-muted mb-4">Modifiez la bannière, le chef de la semaine et les textes d'accueil.</p>
                                <Button as={Link} to="/admin/settings" variant="primary" className="rounded-pill px-4 py-2 font-weight-bold shadow-sm">Gérer le Contenu</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5 justify-content-center">
                    <Col lg={12}>
                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="bg-white p-4 border-b border-gray-100">
                                <h4 className="mb-0 d-flex align-items-center gap-3 text-gray-900">
                                    <i className="fa fa-gears text-gray-400"></i>
                                    Paramètres Généraux du Système
                                </h4>
                            </div>
                            <Card.Body className="p-5">
                                <Row className="align-items-center">
                                    <Col md={7}>
                                        <div className="d-flex align-items-center gap-4">
                                            <div className="bg-gray-50 p-4 rounded-circle text-gray-600" style={{ fontSize: '2rem' }}>
                                                <i className="fa fa-fire"></i>
                                            </div>
                                            <div>
                                                <h5 className="font-weight-bold mb-1 text-gray-900">Capacité des tables dans la Cuisine</h5>
                                                <p className="text-muted mb-0">Configurez le nombre maximal de couverts disponibles en temps réel.</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={5} className="mt-4 mt-md-0">
                                        <div className="d-flex align-items-center justify-content-md-end gap-3">
                                            <Form.Control
                                                type="number"
                                                className="form-control-lg border-2 shadow-sm"
                                                style={{ width: '120px', textAlign: 'center', borderRadius: '15px' }}
                                                value={capacity}
                                                onChange={e => setCapacity(parseInt(e.target.value))}
                                            />
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                className="rounded-pill px-5 py-3 font-weight-bold shadow transition-all hover-scale"
                                                onClick={handleSaveCapacity}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? 'Envoi...' : <><i className="fa fa-save me-2"></i> Enregistrer</>}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Success Modal */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-success d-flex align-items-center gap-2">
                        <i className="fa fa-check-circle"></i> Succès
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <div className="mb-4">
                        <i className="fa fa-cloud-upload text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h4>Configuration Enregistrée</h4>
                    <p className="text-muted">La capacité des tables dans la cuisine a été mise à jour avec succès.</p>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center pb-4">
                    <Button variant="success" className="rounded-pill px-5" onClick={() => setShowSuccessModal(false)}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminDashboard;
