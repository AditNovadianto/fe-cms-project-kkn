import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../utils/auth"

type ImageType = {
    url: string
    alt: string
}

type SaranaItemType = {
    title: string
    description: string
    image: ImageType
}

type SaranaPrasaranaType = {
    description: string
    saranaPrasarana: SaranaItemType[]
    isActive: boolean
    updatedAt: string
}

type UserType = {
    id_user: string | number
}

const SaranaPrasarana = () => {
    const [, setSaranaPrasarana] = useState<SaranaPrasaranaType | null>(null)
    const [items, setItems] = useState<SaranaItemType[]>([])
    const [description, setDescription] = useState("")
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const [imageIndex, setImageIndex] = useState<number | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imageAlt, setImageAlt] = useState("")
    const [preview, setPreview] = useState<string | null>(null)

    const [user, setUser] = useState<UserType | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        if (isTokenExpired(String(token))) {
            sessionStorage.clear()

            navigate("/")
        }
    }, [navigate])

    useEffect(() => {
        const u = localStorage.getItem("user")

        if (u) setUser(JSON.parse(u))
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/getSaranaPrasaranaContents`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Gagal mengambil data")

                const json = await res.json()

                setSaranaPrasarana(json)

                setItems(json.saranaPrasarana || [])
                setDescription(json.description || "")
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [isEdit, items])

    const handleChangeItem = (
        index: number,
        field: keyof SaranaItemType,
        value: string
    ) => {
        const updated = [...items]

        updated[index] = { ...updated[index], [field]: value }
        setItems(updated)
    }

    const handleAddItem = () => {
        setItems([
            ...items,
            {
                title: "",
                description: "",
                image: { url: "", alt: "" },
            },
        ])
    }

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    const handleUpdate = async () => {
        setLoading(true)

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/10`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        description,
                        saranaPrasarana: items,
                        updatedBy: user?.id_user,
                    }),
                }
            )

            if (!res.ok) throw new Error("Update gagal")

            const updated = await res.json()

            setSaranaPrasarana(updated)
            setIsEdit(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const openImageModal = (index: number) => {
        setImageIndex(index)
        setPreview(items[index].image.url || null)
        setImageAlt(items[index].image.alt || "")
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        setImageFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleUploadImage = async () => {
        if (imageIndex === null || !imageFile) return

        setLoading(true)

        try {
            const fd = new FormData()
            fd.append("image", imageFile)
            fd.append("alt", imageAlt)
            fd.append("saranaPrasaranaTitle", items[imageIndex].title)

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/uploadImageSaranaPrasaranaSection/10`,
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

            setItems(updated.saranaPrasarana)
            setImageIndex(null)
            setImageFile(null)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* LIST */}
            <div className="space-y-4 mb-6">
                {items?.map((it, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                        {it.image?.url && (
                            <img
                                src={it.image.url}
                                alt={it.image.alt}
                                className="w-full h-48 object-cover rounded mb-3"
                            />
                        )}
                        <h4 className="font-semibold">{it.title}</h4>
                        <p className="text-sm text-gray-600">{it.description}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsEdit(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
            >
                Edit Sarana & Prasarana
            </button>

            {isEdit && (
                <div className="z-10 fixed inset-0 bg-black/50 flex justify-center p-5">
                    <div className="bg-white w-[55%] p-6 rounded-lg space-y-4 overflow-y-auto">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="Deskripsi Sarana & Prasarana"
                        />

                        {items?.map((it, idx) => (
                            <div key={idx} className="border rounded p-4 space-y-2">
                                <div className="flex justify-between">
                                    <p className="font-semibold">Item {idx + 1}</p>
                                    <button
                                        onClick={() => handleRemoveItem(idx)}
                                        className="cursor-pointer text-red-600 text-sm"
                                    >
                                        Hapus
                                    </button>
                                </div>

                                <input
                                    value={it.title}
                                    onChange={(e) =>
                                        handleChangeItem(idx, "title", e.target.value)
                                    }
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="Judul"
                                />

                                <textarea
                                    value={it.description}
                                    onChange={(e) =>
                                        handleChangeItem(idx, "description", e.target.value)
                                    }
                                    className="w-full border rounded px-2 py-1"
                                    placeholder="Deskripsi"
                                />

                                <button
                                    onClick={() => openImageModal(idx)}
                                    className="cursor-pointer text-blue-600 text-sm"
                                >
                                    Upload / Ganti Gambar
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleAddItem}
                            className="cursor-pointer text-blue-600 text-sm font-medium"
                        >
                            + Tambah Sarana / Prasarana
                        </button>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                onClick={() => setIsEdit(false)}
                                className="cursor-pointer border px-4 py-2 rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUpdate}
                                disabled={loading}
                                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL IMAGE */}
            {imageIndex !== null && (
                <div className="z-10 fixed inset-0 bg-black/50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-[40%] space-y-4">
                        {preview && (
                            <img
                                src={preview}
                                className="w-full h-48 object-cover rounded"
                            />
                        )}

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
                                onClick={() => setImageIndex(null)}
                                className="cursor-pointer border px-4 py-2 rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUploadImage}
                                disabled={loading}
                                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SaranaPrasarana
