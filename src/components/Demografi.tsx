import { useEffect, useState } from "react";
import { isTokenExpired } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

type DemografiType = {
    jumlahPenduduk: string;
    lakiLaki: string;
    perempuan: string;
    kepalaKeluarga: string;
    isActive: boolean;
    updatedAt: string;
};

type UserType = {
    id_user: string | number;
};

const Demografi = () => {
    const [demografi, setDemografi] = useState<DemografiType | null>(null);
    const [isEditData, setIsEditData] = useState(false);
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jumlahPenduduk: "",
        lakiLaki: "",
        perempuan: "",
        kepalaKeluarga: "",
    });
    const [notification, setNotification] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const item = localStorage.getItem("user");

        if (item) setUser(JSON.parse(item));
    }, []);

    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [notification]);

    useEffect(() => {
        const getDemografiContents = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/getDemografiContents`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Get Demografi gagal");

                const data = await response.json();
                setDemografi(data);

                setFormData({
                    jumlahPenduduk: data.jumlahPenduduk,
                    lakiLaki: data.lakiLaki,
                    perempuan: data.perempuan,
                    kepalaKeluarga: data.kepalaKeluarga,
                });
            } catch (err) {
                console.error(err);
            }
        };

        getDemografiContents();
    }, [isEditData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateData = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/2`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        updatedBy: user?.id_user,
                    }),
                }
            );

            if (!response.ok) throw new Error("Update demografi gagal");

            const updated = await response.json();
            setDemografi(updated);
            setIsEditData(false);
            setNotification("Data Demografi berhasil diperbarui");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="border rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Data Demografi</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Jumlah Penduduk</p>
                        <p className="font-semibold">{demografi?.jumlahPenduduk}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Kepala Keluarga</p>
                        <p className="font-semibold">{demografi?.kepalaKeluarga}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Laki-laki</p>
                        <p className="font-semibold">{demografi?.lakiLaki}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Perempuan</p>
                        <p className="font-semibold">{demografi?.perempuan}</p>
                    </div>
                </div>

                {/* STATUS */}
                <div className="mt-6 flex items-center justify-between text-sm">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${demografi?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {demografi?.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>

                    <span className="text-gray-500">
                        Terakhir diperbarui:{" "}
                        {demografi?.updatedAt &&
                            new Date(demografi.updatedAt).toLocaleDateString(
                                "id-ID",
                                { day: "2-digit", month: "long", year: "numeric" }
                            )}
                    </span>
                </div>
            </div>

            <button
                onClick={() => setIsEditData(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
                Edit Data Demografi
            </button>

            {isEditData && (
                <div className="z-10 fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[40%] flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">Edit Demografi</h3>

                        {[
                            { label: "Jumlah Penduduk", name: "jumlahPenduduk" },
                            { label: "Laki-laki", name: "lakiLaki" },
                            { label: "Perempuan", name: "perempuan" },
                            { label: "Kepala Keluarga", name: "kepalaKeluarga" },
                        ].map((item) => (
                            <div key={item.name}>
                                <p className="font-medium">{item.label}</p>

                                <input
                                    name={item.name}
                                    value={(formData as any)[item.name]}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 mt-1"
                                />
                            </div>
                        ))}

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                onClick={() => setIsEditData(false)}
                                className="cursor-pointer px-4 py-2 border rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUpdateData}
                                disabled={loading}
                                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                            >
                                {loading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className="flex items-center gap-2 fixed bottom-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-fade-in">
                    <Check />

                    <p>{notification}</p>
                </div>
            )}
        </div>
    );
};

export default Demografi;
