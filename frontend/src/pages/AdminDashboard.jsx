import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [capacity, setCapacity] = useState(10);
    const [isSaving, setIsSaving] = useState(false);

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
            alert("Capacité mise à jour !");
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

                <Row className="mt-5">
                    <Col lg={12}>
                        <Card className="border-0 shadow-sm p-4">
                            <h4>Paramètres Généraux</h4>
                            <hr />
                            <Form.Group className="mb-3 d-flex align-items-center">
                                <div style={{ minWidth: '200px' }}>
                                    <Form.Label className="mb-0">Capacité Maximale Cuisine</Form.Label>
                                    <small className="d-block text-muted">Nombre de places total disponibles.</small>
                                </div>
                                <Form.Control
                                    type="number"
                                    style={{ width: '100px' }}
                                    className="mx-3"
                                    value={capacity}
                                    onChange={e => setCapacity(parseInt(e.target.value))}
                                />
                                <Button
                                    variant="success"
                                    onClick={handleSaveCapacity}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Envoi...' : <><i className="fa fa-save me-2"></i> Enregistrer</>}
                                </Button>
                            </Form.Group>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default AdminDashboard;
