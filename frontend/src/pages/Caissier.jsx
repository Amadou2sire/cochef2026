import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Caissier() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('En cours'); // 'En cours', 'Prêt', 'Terminé', 'Tout'
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [kitchenData, setKitchenData] = useState({
        manual_occupied: 0,
        max_capacity: 10,
        occupied_places: 0,
        event_occupied: 0
    });
    const navigate = useNavigate();

    // Fetch Kitchen Data
    const fetchKitchenData = async () => {
        try {
            const res = await axios.get('http://localhost:8000/kitchen/occupancy');
            setKitchenData(res.data);
        } catch (err) {
            console.error("Error fetching kitchen data:", err);
        }
    };

    const handleKitchenUpdate = async (manual, capacity) => {
        try {
            const token = localStorage.getItem('token');
            const newManual = Math.max(0, manual);
            const newCapacity = Math.max(1, capacity);

            await axios.post('http://localhost:8000/kitchen/occupancy', {
                manual_occupied: newManual,
                max_capacity: newCapacity
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistic update
            // We should really re-fetch or calculate derived state, but simple update is okay for immediate feedback
            // Fetching is safer because of the total sum calculation
            fetchKitchenData();
        } catch (err) {
            console.error("Error updating kitchen:", err);
            toast.error("Erreur mise à jour cuisine");
        }
    };

    // Clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Orders - Polling every 3 seconds
    useEffect(() => {
        let isMounted = true;
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await axios.get('http://localhost:8000/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (isMounted) {
                    // Sort by date desc
                    const sortedOrders = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    setOrders(prevOrders => {
                        // Check for new orders if we already have data
                        if (prevOrders.length > 0 && sortedOrders.length > prevOrders.length) {
                            const newOrderCount = sortedOrders.length - prevOrders.length;
                            toast.info(`🔔 ${newOrderCount} nouvelle(s) commande(s) !`, {
                                position: "top-center",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                        }
                        return sortedOrders;
                    });
                    setIsLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    toast.error('Session expirée');
                    navigate('/login');
                }
            }
        };

        fetchOrders(); // Initial fetch
        fetchKitchenData();
        const interval = setInterval(() => {
            fetchOrders();
            fetchKitchenData();
        }, 3000); // Poll every 3s
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [navigate]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:8000/orders/${orderId}/status?status=${newStatus}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Commande #${orderId} mise à jour : ${newStatus}`);
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const getFilteredOrders = () => {
        switch (filter) {
            case 'En cours':
                return orders.filter(o => o.status === 'pending' || o.status === 'preparing');
            case 'Prêt':
                return orders.filter(o => o.status === 'ready');
            case 'Terminé':
                return orders.filter(o => o.status === 'closed');
            default:
                return orders;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(amount);
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 py-6 sticky top-0 z-20 shadow-sm">
                <div className="container px-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-gray-900">Portail Caissier</h1>
                        <p className="text-gray-500 text-sm">Gestion des commandes en temps réel</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <div className="text-orange-600 font-black text-xl">
                                {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Heure Service</div>
                        </div>
                        <div className="h-12 w-[1px] bg-gray-200 hidden md:block"></div>
                        <div className="bg-green-100 px-4 py-2 rounded-xl flex items-center gap-2 text-green-700">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold uppercase tracking-wider">Connecté</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="py-8 flex-grow">
                <div className="container px-6">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Sidebar Filters */}
                        <div className="lg:col-span-1 space-y-6 sticky top-32 self-start">
                            {/* Kitchen Management Card */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span>🍽️</span> Gestion Cuisine
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tables Occupées (Manuel)</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleKitchenUpdate(kitchenData.manual_occupied - 1, kitchenData.max_capacity)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                                            >-</button>
                                            <input
                                                type="number"
                                                value={kitchenData.manual_occupied}
                                                onChange={(e) => handleKitchenUpdate(parseInt(e.target.value) || 0, kitchenData.max_capacity)}
                                                className="w-full text-center font-bold border-gray-200 rounded-lg py-1"
                                            />
                                            <button
                                                onClick={() => handleKitchenUpdate(kitchenData.manual_occupied + 1, kitchenData.max_capacity)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Capacité Totale</label>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleKitchenUpdate(kitchenData.manual_occupied, kitchenData.max_capacity - 1)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                                            >-</button>
                                            <input
                                                type="number"
                                                value={kitchenData.max_capacity}
                                                onChange={(e) => handleKitchenUpdate(kitchenData.manual_occupied, parseInt(e.target.value) || 0)}
                                                className="w-full text-center font-bold border-gray-200 rounded-lg py-1"
                                            />
                                            <button
                                                onClick={() => handleKitchenUpdate(kitchenData.manual_occupied, kitchenData.max_capacity + 1)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">Événements:</span>
                                            <span className="font-bold">{kitchenData.event_occupied} tables</span>
                                        </div>
                                        <div className="flex justify-between items-center text-orange-600">
                                            <span className="text-sm font-bold">Total Occupé:</span>
                                            <span className="font-black">{kitchenData.occupied_places} / {kitchenData.max_capacity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { name: 'En cours', count: orders.filter(o => o.status === 'pending' || o.status === 'preparing').length },
                                    { name: 'Prêt', count: orders.filter(o => o.status === 'ready').length },
                                    { name: 'Terminé', count: orders.filter(o => o.status === 'closed').length },
                                    { name: 'Tout', count: orders.length }
                                ].map((f) => (
                                    <button
                                        key={f.name}
                                        onClick={() => setFilter(f.name)}
                                        className={`w-full flex justify-between items-center px-6 py-4 rounded-2xl font-bold transition-all ${filter === f.name
                                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-orange-200'
                                            }`}
                                    >
                                        <span>{f.name}</span>
                                        <span className={`text-xs px-2 py-1 rounded-lg ${filter === f.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            {f.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orders List */}
                        <div className="lg:col-span-3">
                            {isLoading ? (
                                <div className="text-center py-20 text-gray-400">Chargement des commandes...</div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-20 text-center">
                                    <div className="text-6xl mb-4">📭</div>
                                    <h3 className="text-xl font-bold text-gray-400">Aucune commande dans cette catégorie</h3>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    <AnimatePresence>
                                        {filteredOrders.map((order) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                layout
                                                key={order.id}
                                                className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
                                            >
                                                {/* Left: Ticket ID */}
                                                <div className="w-20 h-20 bg-gray-50 rounded-[24px] flex flex-col items-center justify-center border border-gray-100 shrink-0">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">N°</span>
                                                    <span className="text-2xl font-black text-gray-900">#{order.id}</span>
                                                </div>

                                                {/* Middle: Order Details */}
                                                <div className="flex-grow text-center md:text-left w-full">
                                                    <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="font-bold text-gray-900">
                                                                {order.user?.name || `Client #${order.user_id}`}
                                                            </h3>
                                                            <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded-lg">
                                                                {formatTime(order.created_at)}
                                                            </span>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mt-2 md:mt-0 ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                                                                order.status === 'ready' ? 'bg-green-100 text-green-700' :
                                                                    'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {order.status === 'pending' ? 'En Attente' :
                                                                order.status === 'preparing' ? 'En Cuisine' :
                                                                    order.status === 'ready' ? 'Prêt' : 'Clôturé'}
                                                        </span>
                                                    </div>

                                                    <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-600 mb-3 text-left">
                                                        {order.order_details?.map((detail, idx) => (
                                                            <div key={idx} className="flex justify-between border-b border-gray-100 last:border-0 py-1 last:pb-0 first:pt-0">
                                                                <span>{detail.quantity}x Produit #{detail.product_id}</span>
                                                                <span className="font-bold">{detail.total_price} DT</span>
                                                            </div>
                                                        )) || "Détails non disponibles"}
                                                    </div>

                                                    <div className="text-right font-black text-lg text-gray-900">
                                                        Total: {formatCurrency(order.total_price)}
                                                    </div>
                                                </div>

                                                {/* Right: Actions */}
                                                <div className="flex flex-col gap-2 shrink-0 min-w-[140px]">
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200"
                                                        >
                                                            👨‍🍳 En Cuisine
                                                        </button>
                                                    )}
                                                    {order.status === 'preparing' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'ready')}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-200"
                                                        >
                                                            ✅ Prêt
                                                        </button>
                                                    )}
                                                    {order.status === 'ready' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(order.id, 'closed')}
                                                            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-gray-200"
                                                        >
                                                            🏁 Clôturer
                                                        </button>
                                                    )}
                                                    {order.status === 'closed' && (
                                                        <button disabled className="bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-bold text-sm">
                                                            Archivé
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Caissier;
