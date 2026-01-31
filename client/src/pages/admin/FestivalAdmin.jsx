
import { useState, useEffect } from "react";
import { festivalAPI } from "../../services/api";
import { Save, Plus, Trash2, Calendar, MapPin, Info } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const FestivalAdmin = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [festivalData, setFestivalData] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        features: []
    });
    const [message, setMessage] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await festivalAPI.getFestivalInfo();
            if (response.data) {
                // Format dates for input field (YYYY-MM-DD)
                const data = response.data;
                if (data.startDate) data.startDate = data.startDate.split('T')[0];
                if (data.endDate) data.endDate = data.endDate.split('T')[0];
                setFestivalData(data);
            }
        } catch (error) {
            console.error("Failed to fetch festival info", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFestivalData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...festivalData.features];
        newFeatures[index][field] = value;
        setFestivalData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFestivalData(prev => ({
            ...prev,
            features: [...prev.features, { title: "", description: "", icon: "binoculars" }]
        }));
    };

    const removeFeature = (index) => {
        const newFeatures = festivalData.features.filter((_, i) => i !== index);
        setFestivalData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await festivalAPI.updateFestivalInfo(festivalData._id, festivalData);
            setMessage({ type: "success", text: "Festival info updated successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to update info." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('admin.festivalContent')}</h1>
                    <p className="text-gray-500 text-sm">{t('admin.manageText')}</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Basic Info Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                        <Info size={18} /> {t('admin.basicInfo')}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.festivalTitle')}</label>
                            <input
                                type="text"
                                name="title"
                                value={festivalData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.featDesc')}</label>
                            <textarea
                                name="description"
                                rows="3"
                                value={festivalData.description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.location')}</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={festivalData.location}
                                    onChange={handleChange}
                                    className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.startDate')}</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={festivalData.startDate}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.endDate')}</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={festivalData.endDate}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Info size={18} /> {t('admin.homeFeatures')}
                        </h2>
                        <button
                            type="button"
                            onClick={addFeature}
                            className="text-sm flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                        >
                            <Plus size={16} /> {t('admin.addFeature')}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {festivalData.features.map((feature, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100 relative group">
                                <button
                                    type="button"
                                    onClick={() => removeFeature(index)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{t('admin.caption')}</label>
                                        <input
                                            type="text"
                                            value={feature.title}
                                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                                            className="w-full p-2 border rounded focus:ring-1 focus:ring-green-500 text-sm"
                                            placeholder="e.g. Guided Bird Watching"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{t('admin.iconKey')}</label>
                                        <select
                                            value={feature.icon}
                                            onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                                            className="w-full p-2 border rounded focus:ring-1 focus:ring-green-500 text-sm bg-white"
                                        >
                                            <option value="binoculars">Binoculars</option>
                                            <option value="lecture">Lecture / Talk</option>
                                            <option value="culture">Culture / Art</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                                    <textarea
                                        value={feature.description}
                                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                                        rows="2"
                                        className="w-full p-2 border rounded focus:ring-1 focus:ring-green-500 text-sm"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? t('admin.saving') : t('admin.saveChanges')}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default FestivalAdmin;
