import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';

function ProductSelectionModal({ show, onHide, product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedSupplements, setSelectedSupplements] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (product) {
            const suppTotal = selectedSupplements.reduce((acc, s) => acc + s.price, 0);
            setTotalPrice((product.base_price + suppTotal) * quantity);
        }
    }, [product, quantity, selectedSupplements]);

    const handleToggleSupplement = (supp) => {
        setSelectedSupplements(prev => {
            const exists = prev.find(s => s.id === supp.id);
            if (exists) {
                return prev.filter(s => s.id !== supp.id);
            } else {
                return [...prev, supp];
            }
        });
    };

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedSupplements);
        onHide();
    };

    if (!product) return null;

    return (
        <Modal show={show} onHide={onHide} centered size="md">
            <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold">{product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-4">
                    <img
                        src={product.image_url || 'https://via.placeholder.com/300x200'}
                        alt={product.name}
                        className="img-fluid rounded-4 shadow-sm mb-3"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                    />
                    <p className="text-muted">{product.description}</p>
                </div>

                <div className="mb-4">
                    <h6 className="fw-bold mb-3 border-bottom pb-2">Personnaliser</h6>
                    {product.supplements && product.supplements.length > 0 ? (
                        <Row>
                            {product.supplements.map(supp => (
                                <Col xs={6} key={supp.id} className="mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        id={`supp-${supp.id}`}
                                        label={`${supp.name} (+${supp.price.toFixed(2)} DT)`}
                                        checked={selectedSupplements.some(s => s.id === supp.id)}
                                        onChange={() => handleToggleSupplement(supp)}
                                        className="small"
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <p className="small text-muted">Aucun supplément disponible pour ce plat.</p>
                    )}
                </div>

                <div className="d-flex align-items-center justify-content-between border-top pt-4">
                    <div className="d-flex align-items-center">
                        <Button variant="outline-light" className="text-dark border" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                        <span className="mx-3 fw-bold">{quantity}</span>
                        <Button variant="outline-light" className="text-dark border" onClick={() => setQuantity(quantity + 1)}>+</Button>
                    </div>
                    <div className="text-end">
                        <small className="text-muted d-block">Prix Total</small>
                        <span className="h4 mb-0 fw-black text-primary">{totalPrice.toFixed(2)} DT</span>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 p-4">
                <Button
                    variant="primary"
                    className="w-100 rounded-pill py-3 fw-bold shadow-lg"
                    onClick={handleAddToCart}
                >
                    Ajouter au Panier
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProductSelectionModal;
