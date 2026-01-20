import { motion } from 'framer-motion';
import patisserieSignatureImg from '../assets/images/patisserieSignatures.png';
import patissiereImg from '../assets/images/patissiere.png';

function Gourmandise() {
    const cakes = [
        { id: 1, name: 'Le Royal Chocolat', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop' },
        { id: 2, name: 'Fraisier Tradition', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop' },
        { id: 3, name: 'Mille-Feuille Vanille', img: patisserieSignatureImg },
    ];

    return (
        <div className="gourmandise-page">
            {/* 1. Full Width Banner */}
            <div className="w-full h-[60vh] relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1920&auto=format&fit=crop"
                    alt="Boulangerie Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white font-heading text-center shadow-lg">
                        {/* Les gourmandises d'Ihsene */}
                    </h1>
                </div>
            </div>

            {/* 2. Mosaic Section */}
            <section className="py-20 bg-orange-50/30">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">Nos Créations</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2 font-heading">Pâtisseries Signatures</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Big Item 1 (Span 2 rows on large screens?) - Keeping it simple 3 columns for now as requested "3 gateaux différents" */}
                        {cakes.map((cake, idx) => (
                            <motion.div
                                key={cake.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2 }}
                                viewport={{ once: true }}
                                className="group relative h-[400px] rounded-[32px] overflow-hidden shadow-xl cursor-pointer"
                            >
                                <img
                                    src={cake.img}
                                    alt={cake.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <h3 className="text-white text-2xl font-bold">{cake.name}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Description Section */}
            <section className="py-10 bg-white">
                <div className="container px-6 mx-auto">
                    <h2 className="text-4xl font-bold mb-5 text-gray-900 font-heading mb-8 text-center lg:text-left">L'Art de la Boulangerie Artisanale</h2>
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2 order-2 lg:order-1">
                            <div className="relative">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-100 rounded-full -z-10"></div>
                                <img
                                    src={patissiereImg}
                                    alt="Patissière"
                                    className="rounded-[40px] shadow-2xl w-full"
                                />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-600/10 rounded-full -z-10"></div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-6 order-3 lg:order-2">
                            <p className="text-gray-500 text-lg leading-relaxed">
                                Chez "Les gourmandises d'Ihsene", nous croyons que chaque gâteau raconte une histoire.
                                Notre boulangerie est née d'une passion dévorante pour les saveurs authentiques et le savoir-faire traditionnel.
                            </p>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                Nous sélectionnons rigoureusement nos farines, nos beurres et nos chocolats pour vous offrir
                                une expérience gustative inoubliable. Que ce soit pour un petit-déjeuner gourmand ou un
                                dessert d'exception, nous mettons tout notre cœur dans chaque création.
                            </p>
                            <div className="pt-4">
                                <button className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-orange-700 transition-all transform hover:-translate-y-1">
                                    Découvrir notre histoire
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Contact Block (Similar to Home.jsx) */}
            <div id="contact" className="contact-us section py-20 bg-gray-50">
                <div className="container px-6 mx-auto">
                    <div className="row">
                        <div className="col-lg-6 align-self-center">
                            <div className="section-heading mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Commandez vos douceurs dès maintenant</h2>
                                <p className="text-gray-500">Pour vos anniversaires, mariages ou simplement pour le plaisir, contactez-nous pour une commande personnalisée.</p>
                                <div className="phone-info mt-6">
                                    <h4 className="text-xl font-bold">Appelez-nous : <span className="text-orange-600"><i className="fa fa-phone"></i> <a href="#" className="text-orange-600 hover:text-orange-700">01-23-45-67-89</a></span></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <form id="contact" action="" method="post" className="bg-white p-8 rounded-[32px] shadow-xl">
                                <div className="row">
                                    <div className="col-lg-6 mb-4">
                                        <fieldset>
                                            <input type="name" name="name" id="name" placeholder="Nom" autoComplete="on" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200" />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-6 mb-4">
                                        <fieldset>
                                            <input type="surname" name="surname" id="surname" placeholder="Prénom" autoComplete="on" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200" />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12 mb-4">
                                        <fieldset>
                                            <input type="text" name="email" id="email" pattern="[^ @]*@[^ @]*" placeholder="Votre Email" required="" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200" />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12 mb-4">
                                        <fieldset>
                                            <textarea name="message" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[150px]" id="message" placeholder="Votre commande ou message..." required=""></textarea>
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12">
                                        <fieldset>
                                            <button type="submit" id="form-submit" className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all">Envoyer ma demande</button>
                                        </fieldset>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Gourmandise;
