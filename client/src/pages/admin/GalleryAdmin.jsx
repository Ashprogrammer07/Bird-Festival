
import { useState, useEffect } from 'react';
import { galleryAPI } from '../../services/api';
import { Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const GalleryAdmin = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadCaption, setUploadCaption] = useState('');
    const [message, setMessage] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const res = await galleryAPI.getImages();
            setImages(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('image', uploadFile);
        formData.append('title', uploadCaption);

        try {
            await galleryAPI.uploadImage(formData);
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
            setUploadFile(null);
            setUploadCaption('');
            // Reset file input
            e.target.reset();
            fetchImages();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('common.delete') + "?")) return;
        try {
            await galleryAPI.deleteImage(id);
            setImages(images.filter(img => img._id !== id));
        } catch (error) {
            alert("Failed to delete image");
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block mr-2" /> {t('common.loading')}</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{t('admin.gallery')}</h1>
                    <p className="text-gray-500 text-sm">{t('home.galleryDesc')}</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload size={20} /> {t('common.upload')}
                </h2>
                <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.upload')}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title ({t('common.optional')})</label>
                        <input
                            type="text"
                            value={uploadCaption}
                            onChange={(e) => setUploadCaption(e.target.value)}
                            placeholder="e.g. Migratory Birds"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!uploadFile || uploading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {t('common.upload')}
                    </button>
                </form>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                    <div key={img._id} className="group relative bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                            <img
                                src={img.imageUrl}
                                alt={img.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-2">
                            <p className="text-xs font-medium text-gray-700 truncate" title={img.title}>{img.title}</p>
                            <p className="text-[10px] text-gray-400">{new Date(img.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(img._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            title="Delete Image"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500">No photos in the gallery yet.</p>
                </div>
            )}
        </div>
    );
};

export default GalleryAdmin;
