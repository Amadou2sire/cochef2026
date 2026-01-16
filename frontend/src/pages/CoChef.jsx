import { motion } from 'framer-motion';
import chef from '../assets/images/chef-portrait.jpg';

function CoChef() {
    return (
        <div className="pt-24 min-h-screen bg-white">
            <header className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-600/10 z-0"></div>
                <div className="container px-6 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading">Notre Histoire</h1>
                    <div className="w-32 h-1.5 bg-orange-600 mx-auto mb-10 rounded-full"></div>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto italic font-medium">
                        "La cuisine est le cœur d'une maison, et CoChef est le cœur d'une communauté."
                    </p>
                </div>
            </header>

            <section className="py-24">
                <div className="container px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <img src={chef} alt="L'équipe CoChef" className="rounded-[40px] shadow-2xl w-full h-auto object-cover transform rotate-2 hover:rotate-0 transition-transform duration-700" />
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply opacity-70 animate-pulse"></div>
                            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-orange-50 rounded-full mix-blend-multiply opacity-70 animate-pulse delay-700"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Une passion transmise de génération en génération.</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Tout a commencé dans une petite cuisine de village, où l'odeur du pain frais et des mijotés remplissait l'air. CoChef n'est pas seulement un restaurant, c'est l'aboutissement d'un rêve : créer un espace où la haute gastronomie rencontre la simplicité du partage.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Notre philosophie repose sur trois piliers : la qualité irréprochable des produits, le respect des traditions et l'innovation constante. Chaque plat que nous servons est une pièce de notre histoire que nous partageons avec vous.
                            </p>

                            <div className="grid grid-cols-2 gap-8 pt-6">
                                <div>
                                    <div className="text-4xl font-black text-orange-600 mb-2">2015</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Année de création</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-orange-600 mb-2">50k+</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Clients heureux</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="container px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-4">Nos Valeurs</h2>
                        <div className="w-24 h-1 bg-orange-600 mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: 'Produits Locaux', icon: '🌿', desc: 'Nous travaillons exclusivement avec des producteurs locaux pour garantir une fraîcheur absolue.' },
                            { title: 'Artisanat', icon: '👨‍🍳', desc: 'Chaque sauce, chaque pain, chaque dessert est fait maison dans nos cuisines.' },
                            { title: 'Partage', icon: '🤝', desc: 'Nous croyons que la nourriture est le meilleur vecteur de lien social et de convivialité.' }
                        ].map((val, idx) => (
                            <div key={idx} className="bg-white p-12 rounded-[32px] shadow-lg border border-gray-100 hover:shadow-orange-100 transition-all text-center group">
                                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-300">{val.icon}</div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900">{val.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CoChef;
