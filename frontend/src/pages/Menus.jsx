import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ProductSelectionModal from '../components/ProductSelectionModal';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';

function Menus() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(['Tous']);
    const [activeTab, setActiveTab] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8000/menu');
                setProducts(res.data);

                const uniqueCats = ['Tous', ...new Set(res.data.map(p => p.category.charAt(0).toUpperCase() + p.category.slice(1)))];
                setCategories(uniqueCats);
            } catch (err) {
                console.error("Error fetching menu data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleOrderClick = (item) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const product = products.find(p => p.id === item.originalId);
        setSelectedProduct(product);
        setShowSelectionModal(true);
    };

    const filteredItems = () => {
        return products.filter(p => {
            const matchesCategory = activeTab === 'Tous' || p.category.toLowerCase() === activeTab.toLowerCase();
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        }).map(p => ({
            id: `prod-${p.id}`,
            originalId: p.id,
            name: p.name,
            price: `${p.base_price.toFixed(2)} DT`,
            category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
            desc: p.description,
            img: p.image_url || 'https://images.unsplash.com/photo-1540648364855-ad348cc39317?q=80&w=600',
            available: p.available === 1
        }));
    };

    const displayItems = filteredItems();

    return (
        <div className="pt-24 min-h-screen bg-gray-50">
            <header className="bg-white py-16 border-b border-gray-200">
                <div className="container px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold  mb-4 text-gray-900 font-heading">Notre Carte</h1>
                    <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>

                    <div className="max-w-sm mx-auto py-3 mb-8 relative">
                        <Form.Control
                            type="text"
                            placeholder="Rechercher un plat, un ingrédient..."
                            className="px-6 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Chaque plat est une invitation au voyage culinaire, préparé avec passion et des produits de saison sélectionnés.
                    </p>
                </div>
            </header>

            <section className="py-12">
                <div className="container px-6">
                    <div className="flex flex-wrap justify-center gap-4 mb-16 py-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === cat
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-5">
                            <AnimatePresence>
                                {displayItems.length > 0 ? (
                                    displayItems.map((item) => (
                                        <div key={item.id} className="col-lg-3 col-md-6">
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.3 }}
                                                className="h-100"
                                            >
                                                <Card className="h-100 border-0 shadow-sm hover-shadow transition-all overflow-hidden bg-white">
                                                    <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                                                        <Card.Img
                                                            variant="top"
                                                            src={item.img}
                                                            className="h-100 w-100 object-cover transform hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <span className="position-absolute top-0 start-0 m-3 px-3 py-1 bg-primary text-white rounded-pill text-xs fw-bold shadow-sm">
                                                            {item.category}
                                                        </span>
                                                        {!item.available && (
                                                            <div className="position-absolute inset-0 bg-black/40 flex items-center justify-center">
                                                                <span className="px-3 py-1 bg-dark text-white rounded-pill text-xs fw-bold">
                                                                    Indisponible
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Card.Body className="p-4 d-flex flex-column text-center">
                                                        <Card.Title className="fw-bold mb-3">{item.name}</Card.Title>
                                                        <Card.Text className="text-muted small mb-4 flex-grow-1">
                                                            {item.desc}
                                                            <br />
                                                            <strong className="text-primary d-block mt-2 font-black">{item.price}</strong>
                                                        </Card.Text>
                                                        <Button
                                                            variant="primary"
                                                            className="w-100 rounded-pill py-2 fw-bold shadow-sm hover:translate-y-[-2px] transition-all"
                                                            disabled={!item.available}
                                                            onClick={() => handleOrderClick(item)}
                                                        >
                                                            {item.available ? 'Commander' : 'Indisponible'}
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center py-20">
                                        <h3 className="text-xl text-gray-500">Aucun résultat trouvé pour "{searchTerm}"</h3>
                                        <button
                                            onClick={() => { setSearchTerm(''); setActiveTab('Tous'); }}
                                            className="mt-4 text-primary font-bold hover:underline border-0 bg-transparent"
                                        >
                                            Réinitialiser les filtres
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>

            <ProductSelectionModal
                show={showSelectionModal}
                onHide={() => setShowSelectionModal(false)}
                product={selectedProduct}
            />
        </div>
    );
}

export default Menus;
