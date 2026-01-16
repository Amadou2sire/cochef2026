import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Dashboard() {
    const navigate = useNavigate();

    const roles = [
        { title: 'Client', icon: '👤', path: '/profil', desc: 'Accédez à vos commandes et paramètres personnels.' },
        { title: 'Caissier', icon: '🏢', path: '/caissier', desc: 'Gérez les commandes entrantes et les paiements.' },
        { title: 'Gérant', icon: '📊', path: '/gerant', desc: 'Consultez les statistiques et gérez l\'établissement.' }
    ];

    return (
        <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center py-20 px-6">
            <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-xs font-black tracking-[0.4em] text-orange-600 uppercase block mb-4">Administration</span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 font-heading">Sélecteur d'Interface</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Choisissez le portail correspondant à votre rôle pour commencer votre session.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {roles.map((role, idx) => (
                        <motion.button
                            key={role.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(role.path)}
                            className="bg-white p-12 rounded-[48px] shadow-lg border border-gray-100 hover:shadow-2xl hover:border-orange-200 transition-all text-center group flex flex-col items-center"
                        >
                            <div className="w-32 h-32 bg-orange-50 rounded-[40px] flex items-center justify-center text-6xl mb-10 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                {role.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">{role.title}</h3>
                            <p className="text-gray-500 leading-relaxed mb-10 flex-grow">{role.desc}</p>
                            <div className="flex items-center gap-3 text-orange-600 font-bold uppercase tracking-widest text-xs group-hover:gap-6 transition-all">
                                Accéder au portail <span>→</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400 text-sm">
                        Vous n'avez pas accès à certains portails ? <button className="text-orange-600 font-bold hover:underline">Contactez l'administration.</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
