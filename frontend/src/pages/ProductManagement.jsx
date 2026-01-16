import { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'plats',
        description: '',
        base_price: 0,
        product_type: 'plat',
        image_url: '',
        available: 1,
        supplement_ids: []
    });
    const [supplements, setSupplements] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts();
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

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/menu');
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const handleShow = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                description: product.description || '',
                base_price: product.base_price,
                product_type: product.product_type,
                image_url: product.image_url || '',
                available: product.available,
                supplement_ids: product.supplements ? product.supplements.map(s => s.id) : []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                category: 'plats',
                description: '',
                base_price: 0,
                product_type: 'plat',
                image_url: '',
                available: 1,
                supplement_ids: []
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

            const payload = { ...formData, image_url: imageUrl };

            if (editingProduct) {
                await axios.put(`http://localhost:8000/products/${editingProduct.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:8000/products', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchProducts();
            handleClose();
        } catch (err) {
            console.error("Error saving product:", err);
            alert("Erreur lors de l'enregistrement du produit");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            try {
                await axios.delete(`http://localhost:8000/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts();
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };

    return (
        <div className="py-5" style={{ marginTop: '100px' }}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestion des <em>Produits</em></h2>
                    <Button variant="primary" onClick={() => handleShow()}>Ajouter un Produit</Button>
                </div>

                <Table responsive striped hover className="bg-white shadow-sm rounded">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Prix</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>{p.base_price} DT</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(p)}>
                                        <i className="fa fa-edit"></i>
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.id)}>
                                        <i className="fa fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}</Modal.Title>
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
                                <Form.Label>Catégorie</Form.Label>
                                <Form.Select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="entrees">Entrées</option>
                                    <option value="plats">Plats</option>
                                    <option value="sandwichs">Sandwichs</option>
                                    <option value="pizzas">Pizzas</option>
                                    <option value="boissons">Boissons</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Prix de base (DT)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.base_price}
                                    onChange={e => setFormData({ ...formData, base_price: parseFloat(e.target.value) })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image du Produit {formData.image_url && <span className="text-muted">(Laisse vide pour garder l'actuelle)</span>}</Form.Label>
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
                            <Form.Group className="mb-3">
                                <Form.Label>Suppléments Associés</Form.Label>
                                <div className="p-3 border rounded bg-light" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {supplements.length === 0 ? (
                                        <p className="small text-muted mb-0">Aucun supplément créé.</p>
                                    ) : (
                                        supplements.map(s => (
                                            <Form.Check
                                                key={s.id}
                                                type="checkbox"
                                                id={`supp-${s.id}`}
                                                label={`${s.name} (+${s.price.toFixed(2)} DT)`}
                                                checked={formData.supplement_ids.includes(s.id)}
                                                onChange={e => {
                                                    const ids = e.target.checked
                                                        ? [...formData.supplement_ids, s.id]
                                                        : formData.supplement_ids.filter(id => id !== s.id);
                                                    setFormData({ ...formData, supplement_ids: ids });
                                                }}
                                            />
                                        ))
                                    )}
                                </div>
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

export default ProductManagement;
