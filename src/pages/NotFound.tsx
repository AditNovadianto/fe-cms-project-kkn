import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center bg-white p-8 rounded-xl shadow-md">
                <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-14 h-14 text-red-500" />
                </div>

                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Halaman Tidak Ditemukan
                </h2>

                <p className="text-sm text-gray-500 mb-6">
                    Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <ArrowLeft size={18} />
                    Kembali
                </button>
            </div>
        </div>
    );
};

export default NotFound;
