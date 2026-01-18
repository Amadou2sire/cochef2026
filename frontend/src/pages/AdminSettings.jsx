import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminSettings() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form states
    const [bannerVideo, setBannerVideo] = useState('');
    const [chefName, setChefName] = useState('');
    const [chefDesc, setChefDesc] = useState('');
    const [chefImage, setChefImage] = useState('');
    const [welcomeTitle, setWelcomeTitle] = useState('');
    const [welcomeSubtitle, setWelcomeSubtitle] = useState('');
    const [welcomeText, setWelcomeText] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const settingsMap = {};
            response.data.forEach(s => {
                settingsMap[s.key] = s.value;
            });
            setSettings(settingsMap);

            // Initialize form fields
            setBannerVideo(settingsMap['home_banner_video_url'] || '');
            setChefName(settingsMap['chef_name'] || '');
            setChefDesc(settingsMap['chef_description'] || '');
            setChefImage(settingsMap['chef_image_url'] || '');
            setWelcomeTitle(settingsMap['welcome_title'] || '');
            setWelcomeSubtitle(settingsMap['welcome_subtitle'] || '');
            setWelcomeText(settingsMap['welcome_text'] || '');

            setLoading(false);
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Erreur lors du chargement des réglages");
            setLoading(false);
        }
    };

    const handleSave = async (key, value) => {
        try {
            await axios.post('http://localhost:8000/admin/settings', { key, value }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state
            setSettings(prev => ({ ...prev, [key]: value }));
            toast.success(`Réglage sauvegardé`);
        } catch (error) {
            console.error("Error saving setting:", error);
            toast.error("Erreur lors de la sauvegarde");
        }
    };

    const handleFileUpload = async (e, targetKey, setFunction) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            const url = response.data.url;
            setFunction(url);
            await handleSave(targetKey, url);
            setUploading(false);
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Erreur lors de l'upload");
            setUploading(false);
        }
    };

    if (loading) return <div className="container mt-5 text-center">Chargement...</div>;

    return (
        <div className="container mt-5 mb-5 space-y-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Gestion du Contenu (CMS)</h2>

            {/* Banner Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-primary">Bannière Vidéo</h3>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de la vidéo</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            value={bannerVideo}
                            onChange={(e) => setBannerVideo(e.target.value)}
                            onBlur={() => handleSave('home_banner_video_url', bannerVideo)}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ou uploader une nouvelle vidéo</label>
                    <input
                        type="file"
                        accept="video/*"
                        className="form-control"
                        onChange={(e) => handleFileUpload(e, 'home_banner_video_url', setBannerVideo)}
                    />
                    {uploading && <small className="text-primary">Upload en cours...</small>}
                </div>
                {bannerVideo && (
                    <div className="mt-2">
                        <small>Aperçu (Muted)</small>
                        <video src={bannerVideo} className="w-full h-48 object-cover rounded-md" muted playsInline />
                    </div>
                )}
            </div>

            {/* Welcome Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-primary">Bienvenue / À Propos</h3>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre Principal</label>
                    <input
                        type="text"
                        className="form-control"
                        value={welcomeTitle}
                        onChange={(e) => setWelcomeTitle(e.target.value)}
                        onBlur={() => handleSave('welcome_title', welcomeTitle)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={welcomeSubtitle}
                        onChange={(e) => setWelcomeSubtitle(e.target.value)}
                        onBlur={() => handleSave('welcome_subtitle', welcomeSubtitle)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Texte de description</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={welcomeText}
                        onChange={(e) => setWelcomeText(e.target.value)}
                        onBlur={() => handleSave('welcome_text', welcomeText)}
                    />
                </div>
            </div>

            {/* Chef Section */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-primary">Chef de la Semaine</h3>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du Chef</label>
                    <input
                        type="text"
                        className="form-control"
                        value={chefName}
                        onChange={(e) => setChefName(e.target.value)}
                        onBlur={() => handleSave('chef_name', chefName)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description / Bio</label>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={chefDesc}
                        onChange={(e) => setChefDesc(e.target.value)}
                        onBlur={() => handleSave('chef_description', chefDesc)}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image du Chef</label>
                    <div className="flex items-center gap-4">
                        {chefImage && <img src={chefImage} alt="Chef" className="h-20 w-20 object-cover rounded-full" />}
                        <div className="flex-1">
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={chefImage}
                                onChange={(e) => setChefImage(e.target.value)}
                                onBlur={() => handleSave('chef_image_url', chefImage)}
                                placeholder="URL de l'image"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={(e) => handleFileUpload(e, 'chef_image_url', setChefImage)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSettings;
