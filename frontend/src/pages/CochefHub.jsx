import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import imgBanner from '../assets/images/img_concept_5.png';
import imgVillageois from '../assets/images/img_concept_6.png';
import imgMarques from '../assets/images/img_concept_7.png';

function CochefHub() {
    return (
        <div className="hub-page">
            {/* 1. Full Width Banner */}
            <div className="w-full h-[60vh] relative overflow-hidden">
                <img
                    src={imgBanner}
                    alt="Cochef Hub Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black text-white font-heading text-center tracking-tighter"
                    >
                        {/* Cochef Hub */}
                    </motion.h1>
                </div>
            </div>

            {/* 2. Villageois Section */}
            <section className="py-20 bg-white">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-10 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-heading">
                                    CoChef pour les <span className="text-orange-600">villageois</span>
                                </h2>
                                <div className="space-y-6">
                                    <p className="text-gray-700 text-xl leading-relaxed">
                                        Vous avez l’opportunité de rencontrer des professionnels de divers domaines tout en savourant nos délicieuses créations.
                                    </p>
                                    <p className="text-gray-700 text-xl leading-relaxed">
                                        Vous avez accès à un environnement propice aux échanges et aux opportunités professionnelles.
                                    </p>
                                    <p className="text-gray-700 text-xl leading-relaxed font-bold">
                                        Vous allez faire partie de notre communauté de 300 Co-thinkers et 50 entrepreneurs.
                                    </p>
                                </div>
                                <div className="w-20 h-2 bg-orange-600 rounded-full mt-10"></div>
                            </motion.div>
                        </Col>
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <img
                                    src={imgVillageois}
                                    alt="CoChef pour les villageois"
                                    className="rounded-[40px] shadow-2xl w-full object-cover h-[500px]"
                                />
                                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-orange-600/10 rounded-full -z-10 border border-orange-200"></div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 3. Marques Section */}
            <section className="py-20 bg-orange-50/50">
                <Container>
                    <Row className="flex-row-reverse align-items-center">
                        <Col lg={6} className="mb-10 mb-lg-0 lg:ps-12">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 font-heading">
                                    CoChef pour les <span className="text-blue-500">marques</span>
                                </h2>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
                                        <p className="text-gray-700 text-xl leading-relaxed">
                                            Développement de nouveaux produits ou exploration de nouveaux marchés avec notre expertise et notre laboratoire culinaire dédié.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">2</div>
                                        <p className="text-gray-700 text-xl leading-relaxed">
                                            Test et optimisation de vos recettes pour répondre aux attentes des consommateurs.
                                        </p>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">3</div>
                                        <p className="text-gray-700 text-xl leading-relaxed">
                                            Comparaison de vos produits par rapport à la concurrence pour rester compétitif sur le marché.
                                        </p>
                                    </li>
                                </ul>
                                <div className="w-20 h-2 bg-blue-500 rounded-full mt-10"></div>
                            </motion.div>
                        </Col>
                        <Col lg={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <img
                                    src={imgMarques}
                                    alt="CoChef pour les marques"
                                    className="rounded-[40px] shadow-2xl w-full object-cover h-[500px]"
                                />
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-10 animate-pulse"></div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 4. Nouveau Produit Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-16">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900 font-heading mb-4"
                        >
                            Un nouveau produit <br /> <span className="text-orange-600">ou un nouveau marché</span>
                        </motion.h3>
                        <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
                    </div>
                    <Row>
                        <Col lg={6} className="pe-lg-5 mb-10 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-gray-700 text-xl leading-relaxed">
                                    Vous avez une idée de produit innovant que vous souhaitez lancer sur le marché ?
                                    CoChef est là pour vous accompagner dans ce processus excitant.
                                </p>
                                <p className="text-gray-700 text-xl leading-relaxed mt-4">
                                    Nous mettons à votre disposition notre laboratoire culinaire et notre équipe d'experts pour transformer votre vision en réalité.
                                    De la conception de recettes uniques à la réalisation de tests de marché, nous vous aidons à créer des produits qui captivent les consommateurs et se démarquent sur les rayons.
                                </p>
                            </motion.div>
                        </Col>
                        <Col lg={6} className="ps-lg-5">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 h-100 flex flex-col justify-center"
                            >
                                <div className="mb-8">
                                    <h4 className="text-2xl font-black text-orange-600 mb-2">Objectif :</h4>
                                    <p className="text-gray-700 text-lg font-medium">
                                        Lancer un nouveau produit avec succès ou pénétrer un nouveau marché.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-orange-600 mb-2">Avantages :</h4>
                                    <p className="text-gray-700 text-lg font-medium">
                                        Maximiser le potentiel de vos nouveaux produits et explorez de nouvelles opportunités sur le marché.
                                    </p>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 5. Optimisation Produits Section */}
            <section className="py-20 bg-orange-50/50">
                <Container>
                    <div className="text-center mb-16">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900 font-heading mb-4"
                        >
                            Optimisez vos <span className="text-blue-600">offres produits</span>
                        </motion.h3>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                    </div>
                    <Row>
                        <Col lg={6} className="pe-lg-5 mb-10 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-gray-700 text-xl leading-relaxed">
                                    Vos produits existants ont-ils besoin d'un coup de pouce pour rester compétitifs sur le marché ?
                                    CoChef vous propose des services d'optimisation de produits pour maximiser leur attrait et leur rentabilité.
                                </p>
                                <p className="text-gray-700 text-xl leading-relaxed mt-4">
                                    À travers des analyses approfondies, des tests sensoriels et des études de marché, nous identifions les forces et les faiblesses de vos produits, puis nous développons des solutions pour les améliorer et répondre aux attentes des consommateurs les plus exigeants.
                                </p>
                            </motion.div>
                        </Col>
                        <Col lg={6} className="ps-lg-5">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-blue-50 p-8 rounded-[40px] border border-blue-100 h-100 flex flex-col justify-center"
                            >
                                <div className="mb-8">
                                    <h4 className="text-2xl font-black text-blue-600 mb-2">Objectif :</h4>
                                    <p className="text-gray-700 text-lg font-medium">
                                        Optimisation de vos offres produits, enrichir votre portefeuille d'innovations
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-blue-600 mb-2">Avantages :</h4>
                                    <p className="text-gray-700 text-lg font-medium">
                                        Amélioration de vos produits, développement de nouveaux concepts, et l’engagement de votre public dans le processus d'innovation.
                                    </p>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 6. Concurrence Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="text-center mb-16">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900 font-heading mb-4"
                        >
                            Vos produits <span className="text-orange-600">VS La concurrence</span>
                        </motion.h3>
                        <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
                    </div>
                    <Row>
                        <Col lg={6} className="pe-lg-5 mb-10 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <p className="text-gray-700 text-xl leading-relaxed">
                                    Vous voulez savoir comment vos produits se comparent à ceux de vos concurrents ?
                                    CoChef vous offre une analyse comparative approfondie pour évaluer votre position sur le marché.
                                </p>
                                <p className="text-gray-700 text-xl leading-relaxed mt-4">
                                    À travers des études sensorielles, des benchmarks concurrentiels et des recherches de marché, nous vous donnons un aperçu précieux de vos forces et faiblesses par rapport à la concurrence.
                                    Cette analyse stratégique vous permet de prendre des décisions éclairées pour optimiser votre positionnement et stimuler votre croissance.
                                </p>
                            </motion.div>
                        </Col>
                        <Col lg={6} className="ps-lg-5">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 h-100 flex flex-col justify-center"
                            >
                                <div className="mb-8">
                                    <h4 className="text-2xl font-black text-orange-600 mb-2">Objectif :</h4>
                                    <p className="text-gray-700 text-lg font-medium">
                                        Comparaison de vos produits par rapport à la concurrence et obtenir une vision globale du marché.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-orange-600 mb-2">Avantages :</h4>
                                    <p className="text-gray-700 text-lg font-medium">
                                        Obtenez des informations précieuses pour affiner vos produits et positionner efficacement votre marque sur le marché.
                                    </p>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 7. Contact Section (From Concept) */}
            <div id="contact" className="contact-us section py-16">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 align-self-center wow fadeInLeft" data-wow-duration="0.5s" data-wow-delay="0.25s">
                            <div className="section-heading">
                                <h2>N'hésitez pas à nous envoyer un message pour vos besoins culinaires</h2>
                                <p>Nous sommes à votre écoute pour toute demande d'atelier, de service traiteur ou de collaboration.</p>
                                <div className="phone-info">
                                    <h4>Pour toute question, appelez-nous : <span><i className="fa fa-phone"></i> <a href="#">01-23-45-67-89</a></span></h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 wow fadeInRight" data-wow-duration="0.5s" data-wow-delay="0.25s">
                            <form id="contact" action="" method="post">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <fieldset>
                                            <input type="name" name="name" id="name" placeholder="Nom" autoComplete="on" required />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-6">
                                        <fieldset>
                                            <input type="surname" name="surname" id="surname" placeholder="Prénom" autoComplete="on" required />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12">
                                        <fieldset>
                                            <input type="text" name="email" id="email" pattern="[^ @]*@[^ @]*" placeholder="Votre Email" required="" />
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12">
                                        <fieldset>
                                            <textarea name="message" className="form-control" id="message" placeholder="Votre Message" required=""></textarea>
                                        </fieldset>
                                    </div>
                                    <div className="col-lg-12">
                                        <fieldset>
                                            <button type="submit" id="form-submit" className="main-button ">Envoyer</button>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="contact-dec">
                                    <img src="/assets/images/contact-decoration.png" alt="" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CochefHub;
