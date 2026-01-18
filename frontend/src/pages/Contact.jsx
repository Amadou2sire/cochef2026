import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
    const [acceptedTerms, setAcceptedTerms] = useState(false);

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
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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

                                <div className="flex items-start gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="terms-checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-600"
                                    />
                                    <label htmlFor="terms-checkbox" className="text-sm text-gray-600 leading-relaxed">
                                        J'accepte les{' '}
                                        <Link to="/terms" target="_blank" className="text-orange-600 hover:underline font-bold">
                                            Conditions d'Utilisation
                                        </Link>
                                        {' '}et je reconnais avoir lu la{' '}
                                        <Link to="/politique-confidentialite" target="_blank" className="text-orange-600 hover:underline font-bold">
                                            Politique de Confidentialité
                                        </Link>
                                    </label>
                                </div>

                                <button
                                    disabled={!acceptedTerms}
                                    className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 ${acceptedTerms ? 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-orange-200' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
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
                                            <p className="text-gray-500 leading-relaxed">Startup Village Menzah,<br />Tunis, Tunisie</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                                            📞
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">Téléphone</h4>
                                            <p className="text-gray-500 leading-relaxed">
                                                <a href="tel:+21671234567" className="hover:text-orange-600 transition-colors">+216 71 234 567</a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
                                            📧
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg mb-1">Email</h4>
                                            <p className="text-gray-500 leading-relaxed">
                                                <a href="mailto:contact@cochef.tn" className="hover:text-orange-600 transition-colors">contact@cochef.tn</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Section */}
                            <div className="bg-gray-100 rounded-3xl h-[450px] overflow-hidden border-4 border-white shadow-xl relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.8772477157486!2d10.1836141!3d36.8454158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd354e90709f37%3A0xf9353bb6963cdbd2!2sStartup%20Village%20Menzah!5e0!3m2!1sfr!2stn!4v1768773453793!5m2!1sfr!2stn"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
