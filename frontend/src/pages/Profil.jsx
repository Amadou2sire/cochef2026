import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

function Profil() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'settings'

    // Form states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const [userRes, ordersRes] = await Promise.all([
                    axios.get('http://localhost:8000/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:8000/orders', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                setUser(userRes.data);
                setOrders(ordersRes.data);
                setFirstName(userRes.data.first_name || '');
                setLastName(userRes.data.last_name || '');
                setPhone(userRes.data.phone || '');
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Erreur lors de la récupération des données");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put('http://localhost:8000/auth/me', {
                first_name: firstName,
                last_name: lastName,
                phone: phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            toast.success("Profil mis à jour avec succès");
        } catch (err) {
            toast.error("Erreur lors de la mise à jour du profil");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:8000/auth/change-password', {
                current_password: currentPassword,
                new_password: newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Mot de passe mis à jour");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            toast.error(err.response?.data?.detail || "Erreur lors du changement de mot de passe");
        }
    };

    if (isLoading) {
        return (
            <div className="pt-32 flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            {/* Profile Header */}
            <header className="bg-white border-b border-gray-200 py-16">
                <div className="container px-6 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-32 h-32 bg-orange-100 rounded-[40px] flex items-center justify-center text-5xl shadow-inner border-2 border-white">
                        👤
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <span className="bg-orange-600 text-white text-[10px] uppercase font-black px-4 py-1 rounded-full tracking-widest leading-loose">
                            {user.role}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading">
                            Bonjour, {user.first_name || user.name}
                        </h1>
                        <p className="text-gray-500 font-medium">{user.email}</p>
                    </div>
                    <div className="md:ml-auto flex gap-4">
                        <button
                            onClick={() => setActiveTab(activeTab === 'settings' ? 'orders' : 'settings')}
                            className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all"
                        >
                            {activeTab === 'settings' ? 'Mes Commandes' : 'Paramètres'}
                        </button>
                    </div>
                </div>
            </header>

            <section className="py-12">
                <div className="container px-6">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Stats Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-8 rounded-[32px] shadow-lg border border-gray-100">
                                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-6">Résumé de l'activité</h3>
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <span className="text-gray-500">Commandes totales</span>
                                        <span className="text-3xl font-black text-gray-900">{orders.length}</span>
                                    </div>
                                    <div className="flex justify-between items-end text-orange-600">
                                        <span>Statut de compte</span>
                                        <span className="text-sm font-black uppercase">{user.role}</span>
                                    </div>
                                    <div className="w-full bg-orange-50 h-2 rounded-full overflow-hidden">
                                        <div className="bg-orange-600 h-full w-[100%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-2">
                            {activeTab === 'orders' ? (
                                <div className="bg-white rounded-[40px] shadow-lg border border-gray-100 p-10">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-10">Historique des Commandes</h2>

                                    {orders.length === 0 ? (
                                        <div className="text-center py-10 text-gray-500">
                                            Vous n'avez pas encore passé de commande.
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {orders.map((order, idx) => (
                                                <motion.div
                                                    key={order.id}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl border border-gray-50 hover:border-orange-100 hover:bg-orange-50/20 transition-all group"
                                                >
                                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-white transition-colors">📦</div>
                                                    <div className="flex-grow text-center md:text-left">
                                                        <div className="text-[10px] font-black tracking-widest text-[#BBB] mb-1">REF: #{order.id}</div>
                                                        <h4 className="font-bold text-gray-900">{new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</h4>
                                                        <p className="text-gray-400 text-xs">{order.order_details.length} articles</p>
                                                    </div>
                                                    <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                        <span className="text-xl font-black text-gray-900 font-heading tracking-tighter">{order.total_price.toFixed(2)} DT</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Personal Info Form */}
                                    <div className="bg-white rounded-[40px] shadow-lg border border-gray-100 p-10">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Informations Personnelles</h2>
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Prénom</label>
                                                    <input
                                                        type="text"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-orange-600 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Nom</label>
                                                    <input
                                                        type="text"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-orange-600 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Téléphone</label>
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-orange-600 transition-all"
                                                />
                                            </div>
                                            <button type="submit" className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                                                Enregistrer les modifications
                                            </button>
                                        </form>
                                    </div>

                                    {/* Change Password Form */}
                                    <div className="bg-white rounded-[40px] shadow-lg border border-gray-100 p-10">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Sécurité</h2>
                                        <form onSubmit={handleChangePassword} className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Mot de passe actuel</label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-orange-600 transition-all"
                                                    required
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Nouveau mot de passe</label>
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-orange-600 transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 tracking-widest">Confirmer</label>
                                                    <input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className="w-full bg-gray-50 border-0 rounded-2xl p-4 focus:ring-2 focus:ring-orange-600 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <button type="submit" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-black/20">
                                                Mettre à jour le mot de passe
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Profil;
