import { useEffect, useState } from "react";
import { isTokenExpired } from "../utils/auth";
import { useNavigate } from "react-router-dom";

type PetaWilayahType = {
    luasWilayah: string;
    polaPemukiman: string;
    jaringanJalan: string;
    kondisiWilayah: string;
    skalaPeta: string;
    heroImage: {
        url: string;
        alt: string;
    };
    isActive: boolean;
    updatedAt: string;
};

type UserType = {
    id_user: string | number;
};

const PetaWilayah = () => {
    const [peta, setPeta] = useState<PetaWilayahType | null>(null);
    const [isEditData, setIsEditData] = useState(false);
    const [isEditImage, setIsEditImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageAlt, setImageAlt] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        luasWilayah: "",
        polaPemukiman: "",
        jaringanJalan: "",
        kondisiWilayah: "",
        skalaPeta: "",
    });

    const [user, setUser] = useState<UserType | null>(null);
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
        const getPetaWilayah = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/getPetaWilayahContents`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Get Peta Wilayah gagal");

                const data = await response.json();

                setPeta(data);

                setFormData({
                    luasWilayah: data.luasWilayah,
                    polaPemukiman: data.polaPemukiman,
                    jaringanJalan: data.jaringanJalan,
                    kondisiWilayah: data.kondisiWilayah,
                    skalaPeta: data.skalaPeta,
                });

                setImageAlt(data.heroImage?.alt || "");
                setPreview(data.heroImage?.url || null);
            } catch (err) {
                console.error(err);
            }
        };

        getPetaWilayah();
    }, [isEditData, isEditImage]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/3`,
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

            if (!response.ok) throw new Error("Update data gagal");

            const updated = await response.json();

            setPeta(updated);
            setIsEditData(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleUpdateImage = async () => {
        if (!imageFile) return;

        setLoading(true);
        try {
            const formDataImage = new FormData();
            formDataImage.append("image", imageFile);
            formDataImage.append("alt", imageAlt);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/uploadHeroImageSection/3`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: formDataImage,
                }
            );

            if (!response.ok) throw new Error("Update image gagal");

            const updated = await response.json();

            setPeta(updated);
            setIsEditImage(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* IMAGE */}
                <div className="border rounded-lg overflow-hidden">
                    <img
                        src={peta?.heroImage?.url}
                        alt={peta?.heroImage?.alt}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* INFO */}
                <div className="border rounded-lg p-6 flex flex-col justify-between">
                    <div className="space-y-3 text-sm">
                        <p><b>Luas Wilayah:</b> {peta?.luasWilayah}</p>
                        <p><b>Pola Pemukiman:</b> {peta?.polaPemukiman}</p>
                        <p><b>Jaringan Jalan:</b> {peta?.jaringanJalan}</p>
                        <p><b>Kondisi Wilayah:</b> {peta?.kondisiWilayah}</p>
                        <p><b>Skala Peta:</b> {peta?.skalaPeta}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${peta?.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {peta?.isActive ? "Aktif" : "Tidak Aktif"}
                        </span>

                        <span className="text-gray-500">
                            Terakhir diperbarui:{" "}
                            {peta?.updatedAt &&
                                new Date(peta.updatedAt).toLocaleDateString(
                                    "id-ID",
                                    { day: "2-digit", month: "long", year: "numeric" }
                                )}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setIsEditImage(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
                Edit Gambar Peta
            </button>

            <button
                onClick={() => setIsEditData(true)}
                className="cursor-pointer mt-4 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
                Edit Data Peta
            </button>

            {isEditData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[45%] space-y-4">
                        <h3 className="text-lg font-semibold">Edit Data Peta Wilayah</h3>

                        {Object.keys(formData).map((key) => (
                            <div key={key}>
                                <p className="font-medium capitalize">{key}</p>

                                <input
                                    name={key}
                                    value={(formData as any)[key]}
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

            {isEditImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[40%] space-y-4">
                        <h3 className="text-lg font-semibold">Edit Gambar Peta</h3>

                        <div className="h-56 border rounded overflow-hidden">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    Tidak ada gambar
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="font-semibold">Gambar Baru</p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full mt-2 border p-2 rounded-lg"
                            />
                        </div>

                        <div>
                            <p className="font-semibold">Alt Text</p>

                            <input
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-2"
                                placeholder="Deskripsi gambar"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditImage(false)}
                                className="cursor-pointer px-4 py-2 border rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUpdateImage}
                                disabled={loading || !imageFile}
                                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                            >
                                {loading ? "Menyimpan..." : "Simpan Gambar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PetaWilayah;
