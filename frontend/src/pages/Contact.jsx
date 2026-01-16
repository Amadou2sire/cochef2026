import { motion } from 'framer-motion';

function Contact() {
    return (
        <div className="pt-24 min-h-screen bg-white">
            <header className="py-20 bg-gray-50 border-b border-gray-200">
                <div className="container px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 font-heading">Contactez-nous</h1>
                    <div className="w-24 h-1 bg-orange-600 mx-auto mb-8"></div>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Une demande particulière ? Une réservation de groupe ? Notre équipe est à votre écoute.
                    </p>
                </div>
            </header>

            <section className="py-20">
                <div className="container px-6">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
                        >
                            <h2 className="text-3xl font-bold mb-8 text-gray-900">Envoyez-nous un message</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Nom</label>
                                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-all outline-none" placeholder="Votre nom" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email</label>
                                        <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-all outline-none" placeholder="votre@email.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Sujet</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-all outline-none" placeholder="L'objet de votre message" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Message</label>
                                    <textarea rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition-all outline-none resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                                </div>
                                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-3">
                                    <span>🚀 Envoyer le message</span>
                                </button>
                            </form>
                        </motion.div>

                        {/* Info & Map Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            <div>
                                <h2 className="text-3xl font-bold mb-8 text-gray-900">Nos coordonnées</h2>
                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                                            📍
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">Adresse</h4>
                                            <p className="text-gray-500 leading-relaxed">123 Rue de la Gastronomie,<br />75001 Paris, France</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                                            📞
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">Téléphone</h4>
                                            <p className="text-gray-500 leading-relaxed">+33 1 23 45 67 89</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                                            📧
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">Email</h4>
                                            <p className="text-gray-500 leading-relaxed">contact@cochef.fr</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-gray-200 rounded-3xl h-64 flex items-center justify-center text-gray-400 font-bold overflow-hidden border-4 border-white shadow-xl">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">🗺️</div>
                                    Carte Interactive
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
