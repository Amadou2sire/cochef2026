import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Form, Row, Col } from 'react-bootstrap';

function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isLogin) {
                const params = new URLSearchParams();
                params.append('username', formData.email);
                params.append('password', formData.password);

                const res = await axios.post('http://localhost:8000/auth/login', params, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                const token = res.data.access_token;
                localStorage.setItem('token', token);
                toast.success('Bon retour parmi nous !');

                const userRes = await axios.get('http://localhost:8000/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const role = userRes.data.role;
                if (role === 'webmaster') navigate('/admin');
                else if (role === 'caissier') navigate('/caissier');
                else if (role === 'gerant') navigate('/gerant');
                else navigate('/');
            } else {
                await axios.post('http://localhost:8000/auth/register', {
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    name: `${formData.first_name} ${formData.last_name}`.trim() || formData.email,
                    phone: formData.phone
                });
                toast.success('Compte créé avec succès !');
                setIsLogin(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex py-5 items-center justify-center relative overflow-hidden bg-black">
            {/* Full screen blurred background image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2000')",
                    filter: "blur(8px) brightness(0.4)"
                }}
            ></div>

            {/* Decorative orange glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] z-0"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[500px] mx-4"
            >
                {/* Logo Area */}
                <div className="text-center mb-6 mb-md-8">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                        Co<span className="text-orange-600">Chef.</span>
                    </h1>
                    <p className="text-orange-100/60 font-medium tracking-widest uppercase text-[10px]">L'Art de Bien Manger</p>
                </div>

                {/* Glass Card */}
                <div className="backdrop-blur-2xl bg-white/10 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-white/20 shadow-2xl relative overflow-hidden group">
                    {/* Inner light sweep effect */}
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none group-hover:translate-x-full duration-1000"></div>

                    {/* Form Toggle */}
                    <div className="flex bg-black/20 p-1 rounded-2xl mb-6 md:mb-10 relative z-10">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all ${isLogin ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all ${!isLogin ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Inscription
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            <Form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                {!isLogin && (
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 mb-md-4">
                                                <Form.Label className="text-[10px] font-black uppercase text-orange-200/50 tracking-[0.2em] ml-1 mb-2">Prénom</Form.Label>
                                                <Form.Control
                                                    name="first_name" required type="text" placeholder="Prénom"
                                                    value={formData.first_name} onChange={handleChange}
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 py-3 md:py-4 rounded-2xl focus:bg-white/10 focus:border-orange-600 transition-all shadow-none"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 mb-md-4">
                                                <Form.Label className="text-[10px] font-black uppercase text-orange-200/50 tracking-[0.2em] ml-1 mb-2">Nom</Form.Label>
                                                <Form.Control
                                                    name="last_name" required type="text" placeholder="Nom"
                                                    value={formData.last_name} onChange={handleChange}
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 py-3 md:py-4 rounded-2xl focus:bg-white/10 focus:border-orange-600 transition-all shadow-none"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                )}

                                <Form.Group className="mb-3 mb-md-4">
                                    <Form.Label className="text-[10px] font-black uppercase text-orange-200/50 tracking-[0.2em] ml-1 mb-2">Adresse Email</Form.Label>
                                    <Form.Control
                                        name="email" required type="email" placeholder="chef@cochef.com"
                                        value={formData.email} onChange={handleChange}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 py-3 md:py-4 rounded-2xl focus:bg-white/10 focus:border-orange-600 transition-all shadow-none"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-6 md:mb-8">
                                    <Form.Label className="text-[10px] font-black uppercase text-orange-200/50 tracking-[0.2em] ml-1 mb-2">Mot de passe</Form.Label>
                                    <div className="position-relative">
                                        <Form.Control
                                            name="password" required type={showPassword ? "text" : "password"} placeholder="••••••••"
                                            value={formData.password} onChange={handleChange}
                                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 py-3 md:py-4 rounded-2xl focus:bg-white/10 focus:border-orange-600 transition-all shadow-none pe-5"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="position-absolute end-0 top-50 translate-middle-y me-3 bg-transparent border-0 text-white/40 hover:text-white transition-colors"
                                            style={{ marginTop: '2px' }}
                                        >
                                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </Form.Group>

                                {/* Terms Checkbox */}
                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="terms-checkbox"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        label={
                                            <span className="text-white/70 text-sm">
                                                J'accepte les{' '}
                                                <Link
                                                    to="/terms"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-orange-400 hover:text-orange-300 underline"
                                                >
                                                    Conditions d'Utilisation
                                                </Link>
                                                {' '}et je reconnais avoir lu la{' '}
                                                <Link
                                                    to="/politique-confidentialite"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-orange-400 hover:text-orange-300 underline"
                                                >
                                                    Politique de Confidentialité
                                                </Link>
                                            </span>
                                        }
                                        className="terms-checkbox"
                                    />
                                </Form.Group>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading || !acceptedTerms}
                                    className={`w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black py-4 md:py-5 rounded-2xl shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 transition-all flex items-center justify-center gap-2 md:gap-3 uppercase tracking-wider text-sm md:text-base ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {isLogin ? (
                                                <>
                                                    <i className="fa fa-utensils"></i>
                                                    <span>Démarrez la Dégustation</span>
                                                    <i className="fa fa-arrow-right"></i>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa fa-user-plus"></i>
                                                    <span>Rejoindre CoChef</span>
                                                </>
                                            )}
                                        </>
                                    )}
                                </motion.button>
                            </Form>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer terms */}
                <p className="text-center muted text-white/30 text-[10px] mt-8 tracking-widest uppercase"><span className="text-white/50 underline cursor-pointer hover:text-orange-600 transition-colors"></span>
                </p>
            </motion.div>
        </div>
    );
}

export default LoginRegister;
