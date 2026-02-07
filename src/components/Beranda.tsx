import { useEffect, useState } from "react"
import Navbar from "./Navbar"

type BerandaType = {
    heroImage: { url: string; alt: string };
    title: string;
    subtitle: string;
    tagline: string;
    description: string;
    isActive: boolean;
    updatedAt: string;
};

type UserType = {
    id_user: string | number;
};

const Beranda = () => {
    const [beranda, setBeranda] = useState<BerandaType | null>(null)
    const [isEditData, setIsEditData] = useState(false);
    const [isEditImage, setIsEditImage] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        tagline: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageAlt, setImageAlt] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const item = localStorage.getItem("user");

        if (item) {
            setUser(JSON.parse(item));
        }
    }, []);

    useEffect(() => {
        const getBerandaContents = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/getBerandaContents`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Get Beranda gagal")
                }

                const data = await response.json()

                setBeranda(data)

                setFormData({
                    title: data.title,
                    subtitle: data.subtitle,
                    tagline: data.tagline,
                    description: data.description,
                });

                setImageAlt(data.heroImage?.alt || "");
                setPreview(data.heroImage?.url || null);
            } catch (error) {
                console.error(error)
            }
        }

        getBerandaContents()
    }, [isEditData, isEditImage])

    const handleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateData = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/1`,
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

            setBeranda(updated);
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

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/uploadHeroImageSection/1`,
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

            setBeranda(updated);
            setIsEditImage(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    console.log(beranda)

    return (
        <div>
            <Navbar section={'Beranda'} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* IMAGE */}
                <div className="rounded-lg overflow-hidden border">
                    <img
                        src={beranda?.heroImage?.url}
                        alt={beranda?.heroImage?.alt}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* INFO */}
                <div className="border rounded-lg p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">
                            {beranda?.title}
                        </h2>
                        <p className="text-gray-600 mb-2">
                            {beranda?.subtitle}
                        </p>
                        <p className="italic text-sm text-gray-500 mb-4">
                            “{beranda?.tagline}”
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {beranda?.description}
                        </p>
                    </div>

                    {/* STATUS */}
                    <div className="mt-4 flex items-center justify-between text-sm">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${beranda?.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {beranda?.isActive ? "Aktif" : "Tidak Aktif"}
                        </span>

                        <span className="text-gray-500">
                            Terakhir diperbarui:{" "}
                            {beranda?.updatedAt && new Date(beranda.updatedAt).toLocaleDateString(
                                "id-ID",
                                {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <button onClick={() => setIsEditImage(true)} className="w-full bg-blue-500 rounded-lg px-5 py-3 cursor-pointer text-white font-semibold hover:bg-blue-600 transition-all">Edit Image</button>

            <button onClick={() => setIsEditData(true)} className="mt-5 w-full bg-blue-500 rounded-lg px-5 py-3 cursor-pointer text-white font-semibold hover:bg-blue-600 transition-all">Edit Data</button>

            {isEditData && (
                <div className="bg-black/50 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg w-[50%] flex flex-col gap-5">
                        <div>
                            <p className="font-semibold">Title</p>

                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleDataChange}
                                className="w-full border rounded px-3 py-2 mt-2"
                                placeholder="Judul"
                            />
                        </div>

                        <div>
                            <p className="font-semibold">Subtitle</p>

                            <input
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleDataChange}
                                className="w-full border rounded px-3 py-2 mt-2"
                                placeholder="Subjudul"
                            />
                        </div>

                        <div>
                            <p className="font-semibold">Tagline</p>

                            <input
                                name="tagline"
                                value={formData.tagline}
                                onChange={handleDataChange}
                                className="w-full border rounded px-3 py-2 mt-2"
                                placeholder="Tagline"
                            />
                        </div>

                        <div>
                            <p className="font-semibold">Description</p>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleDataChange}
                                className="w-full border rounded px-3 py-2 mt-2"
                                rows={5}
                                placeholder="Deskripsi"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsEditData(false)}
                                className="px-4 py-2 border rounded cursor-pointer"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUpdateData}
                                disabled={loading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Menyimpan..." : "Simpan Data"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isEditImage && (
                <div className="bg-black/50 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg w-[40%] flex flex-col gap-5">
                        <h2 className="text-lg font-semibold">Edit Gambar Beranda</h2>

                        {/* PREVIEW */}
                        <div className="w-full h-56 border rounded overflow-hidden">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Tidak ada gambar
                                </div>
                            )}
                        </div>

                        {/* FILE INPUT */}
                        <div>
                            <p className="font-semibold">Gambar Baru</p>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-2 border p-2 rounded-lg"
                            />
                        </div>

                        {/* ALT TEXT */}
                        <div>
                            <p className="font-semibold">Alt Text</p>
                            <input
                                value={imageAlt}
                                onChange={(e) => setImageAlt(e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-2"
                                placeholder="Deskripsi gambar"
                            />
                        </div>

                        {/* ACTION */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsEditImage(false)}
                                className="px-4 py-2 border rounded cursor-pointer"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUpdateImage}
                                disabled={loading || !imageFile}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? "Menyimpan..." : "Simpan Gambar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Beranda