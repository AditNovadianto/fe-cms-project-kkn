import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../utils/auth"

type GalleryItemType = {
    url: string
    alt: string
}

type GaleriType = {
    gallery: GalleryItemType[]
    isActive: boolean
    updatedAt: string
}

type UserType = {
    id_user: string | number
}

const Galeri = () => {
    const [, setGaleriData] = useState<GaleriType | null>(null)
    const [gallery, setGallery] = useState<GalleryItemType[]>([])
    const [isEditData, setIsEditData] = useState(false)
    const [loading, setLoading] = useState(false)

    const [showImageModal, setShowImageModal] = useState(false)
    const [, setImageIndex] = useState<number | null>(null)
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
                    `${import.meta.env.VITE_API_URL}/getGalleryContents`,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Gagal mengambil data galeri")

                const json = await res.json()
                setGaleriData(json)
                setGallery(json.gallery || [])
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [isEditData])

    const handleRemoveImage = (index: number) => {
        setGallery(gallery.filter((_, i) => i !== index))
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/11`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        gallery,
                        updatedBy: user?.id_user,
                    }),
                }
            )

            if (!res.ok) throw new Error("Update gagal")

            const updated = await res.json()

            setGaleriData(updated)
            setIsEditData(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const openImageModal = (index: number | null) => {
        setImageIndex(index)
        setPreview(index !== null ? gallery[index]?.url : null)
        setImageAlt(index !== null ? gallery[index]?.alt : "")
        setShowImageModal(true)
    }

    const closeImageModal = () => {
        setShowImageModal(false)
        setImageIndex(null)
        setImageFile(null)
        setPreview(null)
        setImageAlt("")
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) return

        setImageFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleUploadImage = async () => {
        if (!imageFile) return

        setLoading(true)

        try {
            const fd = new FormData()
            fd.append("image", imageFile)
            fd.append("alt", imageAlt)

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/uploadGalleryImageSection/11`,
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

            setGallery(updated.gallery)
            closeImageModal()
            setIsEditData(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* LIST GALERI */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {gallery?.map((g, idx) => (
                    <div key={idx} className="border rounded-lg p-2">
                        <img
                            src={g.url}
                            alt={g.alt}
                            className="w-full h-40 object-cover rounded"
                        />
                        <p className="text-xs text-gray-600 mt-1">{g.alt}</p>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsEditData(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
            >
                Edit Galeri
            </button>

            {/* MODAL EDIT */}
            {isEditData && (
                <div className="z-10 fixed inset-0 bg-black/50 flex justify-center p-5">
                    <div className="bg-white w-[55%] p-6 rounded-lg space-y-4 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-4">
                            {gallery?.map((g, idx) => (
                                <div key={idx} className="border rounded p-2 space-y-2">
                                    <img
                                        src={g.url}
                                        alt={g.alt}
                                        className="w-full h-32 object-cover rounded"
                                    />

                                    <p className="text-xs">{g.alt}</p>

                                    <div className="flex justify-between text-sm">
                                        <button
                                            onClick={() => handleRemoveImage(idx)}
                                            className="text-red-600 cursor-pointer"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => openImageModal(null)}
                            className="cursor-pointer text-blue-600 text-sm font-medium"
                        >
                            + Tambah Gambar
                        </button>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                onClick={() => setIsEditData(false)}
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
            {showImageModal && (
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
                                onClick={closeImageModal}
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

export default Galeri
