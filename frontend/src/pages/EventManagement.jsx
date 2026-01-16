import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function EventManagement() {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        total_places: 0,
        occupied_places: 0,
        tables_required: 0,
        image_url: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:8000/events');
            setEvents(res.data);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const handleShow = (event = null) => {
        if (event) {
            setEditingEvent(event);
            // Format date for datetime-local input
            const dateObj = new Date(event.date);
            const formattedDate = dateObj.toISOString().slice(0, 16);
            setFormData({
                title: event.title,
                description: event.description,
                date: formattedDate,
                total_places: event.total_places,
                occupied_places: event.occupied_places,
                tables_required: event.tables_required || 0,
                image_url: event.image_url || ''
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: '',
                description: '',
                date: '',
                total_places: 0,
                occupied_places: 0,
                tables_required: 0,
                image_url: ''
            });
        }
        setSelectedFile(null);
        setShowModal(true);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleClose = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let imageUrl = formData.image_url;

            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                const uploadRes = await axios.post('http://localhost:8000/upload', uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                imageUrl = uploadRes.data.url;
            }

            // Ensure numbers are parsed integers
            const payload = {
                ...formData,
                image_url: imageUrl,
                occupied_places: parseInt(formData.occupied_places),
                total_places: parseInt(formData.total_places),
                tables_required: parseInt(formData.tables_required)
            };

            if (editingEvent) {
                await axios.put(`http://localhost:8000/events/${editingEvent.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:8000/events', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchEvents();
            handleClose();
        } catch (err) {
            console.error("Error saving event:", err);
            alert("Erreur lors de l'enregistrement de l'événement");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
            try {
                await axios.delete(`http://localhost:8000/events/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchEvents();
            } catch (err) {
                console.error("Error deleting event:", err);
            }
        }
    };

    return (
        <div className="py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestion des <em>Événements</em></h2>
                    <Button variant="primary" onClick={() => handleShow()}>Ajouter un Événement</Button>
                </div>

                <Table responsive striped hover className="bg-white shadow-sm rounded">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Date</th>
                            <th>Places</th>
                            <th>Tables Requises</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(e => (
                            <tr key={e.id}>
                                <td>{e.title}</td>
                                <td>{new Date(e.date).toLocaleString('fr-FR')}</td>
                                <td>{e.occupied_places} / {e.total_places}</td>
                                <td>{e.tables_required || 0} tables</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(e)}>
                                        <i className="fa fa-edit"></i>
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(e.id)}>
                                        <i className="fa fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingEvent ? 'Modifier l\'Événement' : 'Ajouter un Événement'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Titre</Form.Label>
                                <Form.Control
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Date et Heure</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </Form.Group>
                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Total de places</Form.Label>
                                        <Form.Control
                                            type="number"
                                            required
                                            value={formData.total_places}
                                            onChange={e => setFormData({ ...formData, total_places: parseInt(e.target.value) })}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Places occupées</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.occupied_places}
                                            onChange={e => setFormData({ ...formData, occupied_places: parseInt(e.target.value) })}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tables Requises (Cuisine)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={formData.tables_required}
                                            onChange={e => setFormData({ ...formData, tables_required: parseInt(e.target.value) })}
                                        />
                                        <Form.Text className="text-muted">
                                            Nombre de tables occupées en cuisine
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image de l'Événement {formData.image_url && <span className="text-muted">(Laisse vide pour garder l'actuelle)</span>}</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {formData.image_url && !selectedFile && (
                                    <div className="mt-2">
                                        <img src={formData.image_url} alt="Current" style={{ width: '100px', borderRadius: '8px' }} />
                                    </div>
                                )}
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>Annuler</Button>
                            <Button variant="primary" type="submit" disabled={isUploading}>
                                {isUploading ? 'Téléchargement...' : 'Enregistrer'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>
        </div>
    );
}

export default EventManagement;
