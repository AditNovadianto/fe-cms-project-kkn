import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../utils/auth"

type ItemType = {
    name: string
    description: string
}

type PemerintahanType = {
    kepalaDesa: string
    sekretarisDesa: string
    item: ItemType[]
    heroImage: {
        url: string
        alt: string
    }
    isActive: boolean
    updatedAt: string
}

type UserType = {
    id_user: string | number
}

const Pemerintahan = () => {
    const [pemerintahan, setPemerintahan] = useState<PemerintahanType | null>(null)
    const [isEditData, setIsEditData] = useState(false)
    const [isEditImage, setIsEditImage] = useState(false)
    const [loading, setLoading] = useState(false)

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imageAlt, setImageAlt] = useState("")
    const [preview, setPreview] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        kepalaDesa: "",
        sekretarisDesa: "",
    })

    const [items, setItems] = useState<ItemType[]>([])
    const [user, setUser] = useState<UserType | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = sessionStorage.getItem("token")

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")

            navigate("/")
        }
    }, [navigate])

    useEffect(() => {
        const item = localStorage.getItem("user")
        if (item) setUser(JSON.parse(item))
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/getPemerintahanContents`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Gagal mengambil data")

                const json = await res.json()

                setPemerintahan(json)

                setFormData({
                    kepalaDesa: json.kepalaDesa,
                    sekretarisDesa: json.sekretarisDesa,
                })

                setItems(json.item || [])
                setImageAlt(json.heroImage?.alt || "")
                setPreview(json.heroImage?.url || null)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [isEditData, isEditImage])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleItemChange = (
        index: number,
        field: keyof ItemType,
        value: string
    ) => {
        const updated = [...items]
        updated[index][field] = value
        setItems(updated)
    }

    const handleUpdateData = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/6`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        item: items,
                        updatedBy: user?.id_user,
                    }),
                }
            )

            if (!res.ok) throw new Error("Update gagal")

            const updated = await res.json()

            setPemerintahan(updated)
            setIsEditData(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        setImageFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleUpdateImage = async () => {
        if (!imageFile) return
        setLoading(true)

        try {
            const fd = new FormData()
            fd.append("image", imageFile)
            fd.append("alt", imageAlt)

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/uploadHeroImageSection/6`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: fd,
                }
            )

            if (!res.ok) throw new Error("Upload gagal")

            const updated = await res.json()

            setPemerintahan(updated)
            setIsEditImage(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* HERO */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="border rounded-lg overflow-hidden">
                    <img
                        src={pemerintahan?.heroImage?.url}
                        alt={pemerintahan?.heroImage?.alt}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="border rounded-lg p-6 space-y-3">
                    <p><b>Kepala Desa:</b> {pemerintahan?.kepalaDesa}</p>

                    <p><b>Sekretaris Desa:</b> {pemerintahan?.sekretarisDesa}</p>

                    <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${pemerintahan?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {pemerintahan?.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>

                    <p className="text-gray-500 text-sm">
                        Terakhir diperbarui:{" "}
                        {pemerintahan?.updatedAt &&
                            new Date(pemerintahan.updatedAt).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                    </p>
                </div>
            </div>

            {/* ITEM */}
            <div className="space-y-4 mb-6">
                {items.map((it, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                        <h4 className="font-semibold">{it.name}</h4>
                        <p className="text-sm text-gray-600">{it.description}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsEditImage(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
                Edit Gambar
            </button>

            <button
                onClick={() => setIsEditData(true)}
                className="cursor-pointer mt-4 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
                Edit Data Pemerintahan
            </button>

            {/* MODAL EDIT DATA */}
            {isEditData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[45%] space-y-4">
                        <h3 className="font-semibold text-lg">Edit Pemerintahan</h3>

                        <input
                            name="kepalaDesa"
                            value={formData.kepalaDesa}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Kepala Desa"
                        />

                        <input
                            name="sekretarisDesa"
                            value={formData.sekretarisDesa}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Sekretaris Desa"
                        />

                        {items.map((it, idx) => (
                            <div key={idx} className="border rounded p-3 space-y-2">
                                <input
                                    value={it.name}
                                    onChange={(e) =>
                                        handleItemChange(idx, "name", e.target.value)
                                    }
                                    className="w-full border rounded px-2 py-1"
                                />

                                <textarea
                                    value={it.description}
                                    onChange={(e) =>
                                        handleItemChange(idx, "description", e.target.value)
                                    }
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>
                        ))}

                        <div className="flex justify-end gap-2">
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

            {/* MODAL IMAGE */}
            {isEditImage && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[40%] space-y-4">
                        <img
                            src={preview || ""}
                            className="w-full h-56 object-cover rounded"
                        />

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
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Pemerintahan
