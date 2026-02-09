import { useEffect, useState } from "react";
import { isTokenExpired } from "../utils/auth";
import { useNavigate } from "react-router-dom";

type VisiMisiType = {
    visi: string;
    misi: string[];
    isActive: boolean;
    updatedAt: string;
};

type UserType = {
    id_user: string | number;
};

const VisiMisi = () => {
    const [visiMisi, setVisiMisi] = useState<VisiMisiType | null>(null);
    const [isEditData, setIsEditData] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        visi: "",
        misi: [] as string[],
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
        const getVisiMisi = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/getVisiMisiContents`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Get Visi Misi gagal");

                const result = await response.json();

                setVisiMisi(result);

                setFormData({
                    visi: result.visi,
                    misi: result.misi,
                });
            } catch (err) {
                console.error(err);
            }
        };

        getVisiMisi();
    }, [isEditData]);

    const handleVisiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, visi: e.target.value });
    };

    const handleMisiChange = (index: number, value: string) => {
        const updated = [...formData.misi];
        updated[index] = value;
        setFormData({ ...formData, misi: updated });
    };

    const addMisi = () => {
        setFormData({ ...formData, misi: [...formData.misi, ""] });
    };

    const removeMisi = (index: number) => {
        setFormData({
            ...formData,
            misi: formData.misi.filter((_, i) => i !== index),
        });
    };

    const handleUpdateData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/4`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        visi: formData.visi,
                        misi: formData.misi,
                        updatedBy: user?.id_user,
                    }),
                }
            );

            if (!response.ok) throw new Error("Update Visi Misi gagal");

            const updated = await response.json();

            setVisiMisi(updated);
            setIsEditData(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="border rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Visi & Misi</h2>

                {/* VISI */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Visi</h3>
                    <p className="italic text-gray-700">
                        “{visiMisi?.visi}”
                    </p>
                </div>

                {/* MISI */}
                <div>
                    <h3 className="font-semibold mb-2">Misi</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        {visiMisi?.misi?.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ol>
                </div>

                {/* STATUS */}
                <div className="mt-6 flex items-center justify-between text-sm">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${visiMisi?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {visiMisi?.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>

                    <span className="text-gray-500">
                        Terakhir diperbarui:{" "}
                        {visiMisi?.updatedAt &&
                            new Date(visiMisi.updatedAt).toLocaleDateString(
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
                Edit Visi & Misi
            </button>

            {isEditData && (
                <div className="z-10 fixed inset-0 bg-black/50 flex p-5 justify-center">
                    <div className="bg-white p-6 rounded-lg w-[50%] overflow-y-auto overflow-hidden space-y-4">
                        <h3 className="text-lg font-semibold">Edit Visi & Misi</h3>

                        {/* VISI */}
                        <div>
                            <p className="font-medium">Visi</p>
                            <textarea
                                value={formData.visi}
                                onChange={handleVisiChange}
                                rows={3}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                        </div>

                        {/* MISI */}
                        <div>
                            <p className="font-medium mb-2">Misi</p>
                            {formData?.misi?.map((item, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        value={item}
                                        onChange={(e) =>
                                            handleMisiChange(index, e.target.value)
                                        }
                                        className="flex-1 border rounded px-3 py-2"
                                    />

                                    <button
                                        onClick={() => removeMisi(index)}
                                        className="cursor-pointer px-3 py-2 bg-red-500 text-white rounded"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addMisi}
                                className="cursor-pointer mt-2 text-sm text-blue-600 hover:underline"
                            >
                                + Tambah Misi
                            </button>
                        </div>

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
        </div>
    );
};

export default VisiMisi;
