import { Modal, Button, Table } from 'react-bootstrap';
import { useCart } from '../hooks/useCart';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartModal({ show, onHide }) {
    const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmitOrder = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.info("Veuillez vous connecter pour passer commande.");
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                total_price: cartTotal,
                order_details: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    options: item.options,
                    unit_price: item.unit_price,
                    total_price: item.total_price
                }))
            };

            await axios.post('http://localhost:8000/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Commande passée avec succès !");
            clearCart();
            onHide();
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la commande.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDiscoverMenu = () => {
        onHide();
        navigate('/menus');
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="cart-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Votre Panier</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {cart.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fa fa-shopping-basket mb-3 text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted">Votre panier est vide.</p>
                        <Button variant="primary" className="rounded-pill mt-3" onClick={handleDiscoverMenu}>Découvrir le menu</Button>
                    </div>
                ) : (
                    <>
                        <Table responsive hover className="align-middle">
                            <thead>
                                <tr className="text-muted small text-uppercase tracking-wider border-bottom">
                                    <th>Produit</th>
                                    <th>Quantité</th>
                                    <th className="text-end">Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={item.img || 'https://via.placeholder.com/60'}
                                                    alt={item.name}
                                                    className="rounded-3 shadow-sm me-3"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <div className="fw-bold text-dark">{item.name}</div>
                                                    {item.options?.supplements?.length > 0 && (
                                                        <div className="small text-muted">
                                                            + {item.options.supplements.map(s => s.name).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <button
                                                    className="btn btn-sm btn-outline-light text-dark border-0"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >-</button>
                                                <span className="mx-2 fw-bold">{item.quantity}</span>
                                                <button
                                                    className="btn btn-sm btn-outline-light text-dark border-0"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >+</button>
                                            </div>
                                        </td>
                                        <td className="text-end fw-bold">{item.total_price.toFixed(2)} DT</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm text-danger border-0"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                            <div className="text-muted">Total de la commande</div>
                            <div className="h3 mb-0 fw-black text-primary">{cartTotal.toFixed(2)} DT</div>
                        </div>
                    </>
                )}
            </Modal.Body>
            {cart.length > 0 && (
                <Modal.Footer className="border-0 pt-0 p-4">
                    <Button variant="light" className="rounded-pill px-4" onClick={onHide}>Continuer mes achats</Button>
                    <Button
                        variant="primary"
                        className="rounded-pill px-5 py-2 fw-bold shadow"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Traitement...' : 'Passer la commande'}
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
}

export default CartModal;
