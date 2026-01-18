import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function SuperAdminDashboard() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        password: '',
        role: 'client'
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            if (error.response?.status === 403) {
                toast.error("Accès refusé");
                navigate('/');
            }
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                password: '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                email: '',
                first_name: '',
                last_name: '',
                phone: '',
                password: '',
                role: 'client'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update user
                const updateData = {
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    role: formData.role
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await axios.put(`http://localhost:8000/users/${editingUser.id}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Utilisateur mis à jour");
            } else {
                // Create user
                const createData = {
                    email: formData.email,
                    name: `${formData.first_name} ${formData.last_name}`.trim(),
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    password: formData.password,
                    role: formData.role
                };
                await axios.post('http://localhost:8000/users', createData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Utilisateur créé");
            }
            handleCloseModal();
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            toast.error(error.response?.data?.detail || "Erreur lors de la sauvegarde");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

        try {
            await axios.delete(`http://localhost:8000/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Utilisateur supprimé");
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.detail || "Erreur lors de la suppression");
        }
    };

    if (loading) return <div className="container mt-5 text-center">Chargement...</div>;

    return (
        <div className="superadmin-dashboard py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="section-heading mb-5">
                    <h2>Gestion des <em>Utilisateurs</em></h2>
                    <p>Créez, modifiez et gérez tous les utilisateurs du système.</p>
                </div>

                <Row className="mb-4">
                    <Col>
                        <Button variant="primary" onClick={() => handleOpenModal()}>
                            <i className="fa fa-plus me-2"></i>Créer un utilisateur
                        </Button>
                    </Col>
                </Row>

                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Email</th>
                                    <th>Nom</th>
                                    <th>Rôle</th>
                                    <th>Téléphone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.email}</td>
                                        <td>{user.name}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'superadmin' ? 'bg-danger' :
                                                    user.role === 'webmaster' ? 'bg-warning' :
                                                        user.role === 'gerant' ? 'bg-info' :
                                                            user.role === 'caissier' ? 'bg-success' :
                                                                'bg-secondary'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.phone || '-'}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleOpenModal(user)}
                                            >
                                                <i className="fa fa-edit"></i>
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/* Create/Edit Modal */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingUser ? 'Modifier' : 'Créer'} un utilisateur</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    disabled={!!editingUser}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Prénom</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Téléphone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Rôle</Form.Label>
                                <Form.Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    required
                                >
                                    <option value="client">Client</option>
                                    <option value="caissier">Caissier</option>
                                    <option value="gerant">Gérant</option>
                                    <option value="webmaster">Webmaster</option>
                                    <option value="superadmin">Superadmin</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mot de passe {editingUser && '(laisser vide pour ne pas changer)'}</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Annuler
                                </Button>
                                <Button variant="primary" type="submit">
                                    {editingUser ? 'Mettre à jour' : 'Créer'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
}

export default SuperAdminDashboard;
