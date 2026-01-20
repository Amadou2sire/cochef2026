import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Gerant() {
    const [dashboardData, setDashboardData] = useState({
        total_sales: '0.00',
        today_sales: '0.00',
        orders_today: 0,
        average_order: '0.00',
        top_products: [],
        sales_by_category: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const [statsRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:8000/admin/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8000/orders', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setDashboardData(statsRes.data);
                // Filter active orders (pending or preparing)
                const activeOrders = ordersRes.data.filter(o => o.status === 'pending' || o.status === 'preparing');
                setOrders(activeOrders);

            } catch (err) {
                console.error(err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    toast.error('Session expirée ou non autorisée');
                    navigate('/login');
                } else {
                    toast.error('Erreur lors du chargement des données');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8000/admin/export', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob', // Important for file download
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = res.headers['content-disposition'];
            let fileName = 'export.xlsx';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Export réussi !');
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de l'export");
        }
    };

    const stats = [
        { label: 'Chiffre d\'Affaires Total', value: `${dashboardData.total_sales} DT`, change: 'Total', icon: 'ti-money' },
        { label: 'Ventes Aujourd\'hui', value: `${dashboardData.today_sales} DT`, change: '24h', icon: 'ti-stats-up' },
        { label: 'Commandes du Jour', value: dashboardData.orders_today, change: '24h', icon: 'ti-receipt' },
        { label: 'Panier Moyen', value: `${dashboardData.average_order} DT`, change: 'Avg', icon: 'ti-bar-chart' },
    ];

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-orange-600">Chargement...</div>;
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 py-10 shadow-sm">
                <div className="container px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold font-heading text-gray-900">Tableau de Bord Gérant</h1>
                        <p className="text-gray-500 text-sm">Vue d'ensemble des performances du restaurant</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExport}
                            className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2"
                        >
                            <i className="ti-export"></i> Exporter Excel
                        </button>
                    </div>
                </div>
            </header>

            <section className="py-12 flex-grow">
                <div className="container px-6">
                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {stats.map((stat, idx) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                key={stat.label}
                                className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-100 flex flex-col justify-between"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl text-orange-600">
                                        <i className={stat.icon}></i>
                                    </div>
                                    <span className="text-gray-500 font-bold text-xs bg-gray-100 px-2 py-1 rounded-lg">
                                        {stat.change}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</h3>
                                    <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10 mb-10">
                        {/* Action Required (Pending Orders) */}
                        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-lg border border-gray-100 p-10 min-h-[400px] flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Que dois-je faire maintenant ?</h2>
                            <p className="text-gray-500 mb-6 text-sm">Commandes en attente de traitement ({orders.length})</p>

                            {orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                                                <th className="pb-4">ID</th>
                                                <th className="pb-4">Client</th>
                                                <th className="pb-4">Total</th>
                                                <th className="pb-4">Statut</th>
                                                <th className="pb-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {orders.slice(0, 5).map(order => (
                                                <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                                    <td className="py-4 font-mono text-gray-500">#{order.id}</td>
                                                    <td className="py-4 font-bold text-gray-900">{order.user_id}</td>
                                                    <td className="py-4 text-gray-900">{order.total_price} DT</td>
                                                    <td className="py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'preparing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4">
                                                        <button
                                                            className="text-orange-600 font-bold hover:text-orange-700 text-xs"
                                                            onClick={() => navigate('/caissier')}
                                                        >
                                                            Voir Flux
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {orders.length > 5 && (
                                        <div className="mt-4 text-center">
                                            <button onClick={() => navigate('/caissier')} className="text-gray-500 hover:text-orange-600 text-sm font-medium transition-colors">
                                                Voir toutes les commandes →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-grow bg-green-50 rounded-[32px] border-2 border-dashed border-green-100 flex items-center justify-center text-green-600 font-bold p-10">
                                    <div className="text-center">
                                        <div className="text-4xl mb-4 text-green-600">
                                            <i className="ti-check-box"></i>
                                        </div>
                                        <p>Tout est calme pour le moment.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Top Selling Items */}
                        <div className="lg:col-span-1 bg-white rounded-[40px] shadow-lg border border-gray-100 p-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-10">Meilleures Ventes</h2>
                            <div className="space-y-8">
                                {dashboardData.top_products.length > 0 ? (
                                    dashboardData.top_products.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                                                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                                    <div className="bg-orange-600 h-full" style={{ width: `${100 - (idx * 15)}%` }}></div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-gray-400">{item.sales}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Aucune vente enregistrée.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sales by Category */}
                    <div className="bg-white rounded-[40px] shadow-lg border border-gray-100 p-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-10">Performance par Catégorie</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {dashboardData.sales_by_category && dashboardData.sales_by_category.length > 0 ? (
                                dashboardData.sales_by_category.map((cat, idx) => (
                                    <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold text-gray-800 capitalize mb-2">{cat.category}</h3>
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Revenus</p>
                                                <p className="text-2xl font-black text-orange-600">{cat.total} DT</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Ventes</p>
                                                <p className="text-xl font-bold text-gray-900">{cat.count}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 col-span-full text-center">Aucune donnée de catégorie disponible.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Gerant;
