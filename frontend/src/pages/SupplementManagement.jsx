import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function SupplementManagement() {
    const [supplements, setSupplements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplement, setEditingSupplement] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        available: 1,
        image_url: ''
    });
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchSupplements();
    }, []);

    const fetchSupplements = async () => {
        try {
            const res = await axios.get('http://localhost:8000/admin/supplements', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSupplements(res.data);
        } catch (err) {
            console.error("Error fetching supplements:", err);
        }
    };

    const handleShow = (supplement = null) => {
        if (supplement) {
            setEditingSupplement(supplement);
            setFormData({
                name: supplement.name,
                price: supplement.price,
                available: supplement.available,
                image_url: supplement.image_url || ''
            });
        } else {
            setEditingSupplement(null);
            setFormData({
                name: '',
                price: 0,
                available: 1,
                image_url: ''
            });
        }
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        setUploading(true);
        try {
            const res = await axios.post('http://localhost:8000/upload', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            setFormData({ ...formData, image_url: res.data.url });
        } catch (err) {
            console.error("Error uploading image:", err);
            alert("Erreur lors de l'upload de l'image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplement) {
                await axios.put(`http://localhost:8000/admin/supplements/${editingSupplement.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:8000/admin/supplements', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchSupplements();
            handleClose();
        } catch (err) {
            console.error("Error saving supplement:", err);
            alert("Erreur lors de l'enregistrement du supplément");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce supplément ?")) {
            try {
                await axios.delete(`http://localhost:8000/admin/supplements/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchSupplements();
            } catch (err) {
                console.error("Error deleting supplement:", err);
            }
        }
    };

    return (
        <div className="py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestion des <em>Suppléments</em></h2>
                    <Button variant="primary" onClick={() => handleShow()}>Ajouter un Supplément</Button>
                </div>

                <Table responsive striped hover className="bg-white shadow-sm rounded">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prix (DT)</th>
                            <th>Disponibilité</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {supplements.map(s => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{s.price.toFixed(2)}</td>
                                <td>{s.available ? 'Oui' : 'Non'}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(s)}>
                                        <i className="fa fa-edit"></i>
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(s.id)}>
                                        <i className="fa fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingSupplement ? 'Modifier le Supplément' : 'Ajouter un Supplément'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Nom</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Prix (DT)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image</Form.Label>
                                {formData.image_url && (
                                    <div className="mb-2">
                                        <img src={formData.image_url} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                                    </div>
                                )}
                                <Form.Control
                                    type="file"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                                {uploading && <Form.Text className="text-primary">Upload en cours...</Form.Text>}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Disponible"
                                    checked={formData.available === 1}
                                    onChange={e => setFormData({ ...formData, available: e.target.checked ? 1 : 0 })}
                                />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
                            <Button variant="primary" type="submit">Enregistrer</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
}

export default SupplementManagement;
