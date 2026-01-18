import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import imgConcept from '../assets/images/img_concept.png';
import imgConcept2 from '../assets/images/img_concept_2.png';
import imgConcept3 from '../assets/images/img_concept_3.png';
import imgConcept4 from '../assets/images/img_concept_4.png';

function Concept() {
    return (
        <div className="concept-page">
            {/* 1. Full Width Banner */}
            <div className="w-full h-[60vh] relative overflow-hidden">
                <img
                    src={imgConcept}
                    alt="Concept Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black text-white font-heading text-center tracking-tighter"
                    >

                    </motion.h1>
                </div>
            </div>

            {/* 2. Core Concept Section */}
            <section className="py-16 bg-white overflow-hidden">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-100 rounded-full -z-10 animate-pulse"></div>
                                <img
                                    src={imgConcept2}
                                    alt="Concept Illustration"
                                    className="rounded-[40px] shadow-2xl w-full object-cover h-[500px]"
                                />
                                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-orange-600/10 rounded-full -z-10 border border-orange-200"></div>
                            </motion.div>
                        </Col>
                        <Col lg={6} className="ps-lg-5">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-orange-600 font-black tracking-[0.3em] uppercase text-xs mb-4 d-block">Notre Écosystème</span>
                                <p className="text-gray-700 text-2xl md:text-3xl font-medium leading-tight mb-8">
                                    Explorez une expérience culinaire exceptionnelle au cœur d'un village animé du bien-être,
                                    où l'innovation et la tradition se rencontrent, grâce à l’écosystème proposé par <span className="text-orange-600 font-bold">StartUp Village</span>.
                                </p>
                                <div className="w-20 h-2 bg-orange-600 rounded-full"></div>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 3. Mission & Vision Section */}
            <section className="py-16 bg-orange-50/50">
                <Container>
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900 font-heading mb-4"
                        >
                            Mission et valeurs
                        </motion.h2>
                        <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
                    </div>

                    <Row className="flex-row-reverse align-items-stretch">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative group h-full"
                            >
                                <img
                                    src={imgConcept3}
                                    alt="Mission and Vision"
                                    className="rounded-[48px] shadow-2xl w-full object-cover h-full group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="absolute inset-0 rounded-[48px] ring-1 ring-orange-600/20 px-0"></div>
                            </motion.div>
                        </Col>
                        <Col lg={6} className="pe-lg-5">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 p-md-12 rounded-[40px] shadow-xl border border-orange-100"
                            >
                                <h3 className="text-3xl font-black text-blue-500 mb-6 flex items-center gap-3">

                                    Vision
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-0">
                                    Créer une expérience culinaire de qualité grâce à une solution de <span className="text-gray-900 font-bold">cantine 2.0 novatrice</span>,
                                    offrant d'innombrables opportunités pour élargir une portée, optimiser la gamme de produits
                                    et explorer de nouveaux marchés.
                                </p>

                                <h3 className="text-3xl font-black text-blue-500 mb-6 flex items-center gap-3 mt-12 pt-8 border-t border-blue-50">

                                    Mission
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-0">
                                    Apporte son expertise sur les innovations culinaires. Aider à identifier des territoires d’opportunités avec un regard croisé entre différents univers :
                                </p>
                                <ul className="space-y-3">
                                    {['Marketing', 'Design', 'Culinaire', 'Grande consommation'].map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-600 font-medium">
                                            <i className="fa fa-check-circle text-orange-500 text-sm"></i>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 4. Privatisation Section */}
            <section className="py-16 bg-white">
                <Container>
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-gray-900 font-heading mb-4"
                        >
                            Concept
                        </motion.h2>
                        <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
                    </div>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-5 mb-lg-0">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <img
                                    src={imgConcept4}
                                    alt="Privatisation"
                                    className="rounded-[40px] shadow-2xl w-full object-cover h-[500px]"
                                />
                            </motion.div>
                        </Col>
                        <Col lg={6} className="ps-lg-5">
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >

                                <div className="mb-10">
                                    <h3 className="text-2xl font-black text-orange-600 mb-4">
                                        Privatisation de l’espace
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Offrez vous la possibilité d'organiser un repas en groupe dans un cadre exclusif.
                                    </p>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Vous êtes une marque ou une enseigne ? Profitez de cette opportunité pour promouvoir vos produits ou les tester auprès de notre audience privilégiée.
                                    </p>
                                </div>

                                <div className="mb-10">
                                    <h3 className="text-2xl font-black text-orange-600 mb-4">
                                        Catering
                                    </h3>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Que ce soit pour des réunions d'équipe, des formations ou des événements spéciaux au sein de StartUp Village, notre service de catering sur mesure garantit une expérience culinaire exceptionnelle.
                                    </p>
                                </div>


                            </motion.div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* 6. Contact Section (From Home) */}
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

export default Concept;
