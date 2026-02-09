import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../utils/auth"

type PotensiItemType = {
    name: string
    description: string
}

type PotensiType = {
    potensi: PotensiItemType[]
    isActive: boolean
    updatedAt: string
}

type UserType = {
    id_user: string | number
}

const Potensi = () => {
    const [potensi, setPotensi] = useState<PotensiType | null>(null)
    const [items, setItems] = useState<PotensiItemType[]>([])
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState<UserType | null>(null)
    const navigate = useNavigate()

    // 🔐 cek token
    useEffect(() => {
        const token = sessionStorage.getItem("token")
        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/")
        }
    }, [navigate])

    // 👤 get user
    useEffect(() => {
        const item = localStorage.getItem("user")
        if (item) setUser(JSON.parse(item))
    }, [])

    // 📡 get data
    useEffect(() => {
        const fetchPotensi = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/getPotensiContents`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Gagal mengambil potensi")

                const json = await res.json()

                setPotensi(json)
                setItems(json.potensi || [])
            } catch (err) {
                console.error(err)
            }
        }

        fetchPotensi()
    }, [isEdit])

    const handleItemChange = (
        index: number,
        field: keyof PotensiItemType,
        value: string
    ) => {
        const updated = [...items]
        updated[index][field] = value

        setItems(updated)
    }

    const handleAddItem = () => {
        setItems([...items, { name: "", description: "" }])
    }

    const handleRemoveItem = (index: number) => {
        const updated = items.filter((_, i) => i !== index)

        setItems(updated)
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/7`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        potensi: items,
                        updatedBy: user?.id_user,
                    }),
                }
            )

            if (!res.ok) throw new Error("Update gagal")

            const updated = await res.json()

            setPotensi(updated)
            setIsEdit(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* LIST POTENSI */}
            <div className="space-y-4 mb-6">
                {items.map((it, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                        <h4 className="font-semibold">{it.name}</h4>
                        <p className="text-sm text-gray-600">{it.description}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mb-4">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${potensi?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {potensi?.isActive ? "Aktif" : "Tidak Aktif"}
                </span>

                <span className="text-gray-500 text-sm">
                    Terakhir diperbarui:{" "}
                    {potensi?.updatedAt &&
                        new Date(potensi.updatedAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                </span>
            </div>

            <button
                onClick={() => setIsEdit(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
                Edit Potensi Desa
            </button>

            {isEdit && (
                <div className="z-10 fixed inset-0 bg-black/50 flex p-5 justify-center">
                    <div className="bg-white p-6 rounded-lg w-[45%] overflow-y-auto overflow-hidden space-y-4">
                        <h3 className="text-lg font-semibold">Edit Potensi Desa</h3>

                        {items.map((it, idx) => (
                            <div key={idx} className="border rounded p-3 space-y-2">
                                <input
                                    value={it.name}
                                    onChange={(e) =>
                                        handleItemChange(idx, "name", e.target.value)
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Nama Potensi"
                                />

                                <textarea
                                    value={it.description}
                                    onChange={(e) =>
                                        handleItemChange(idx, "description", e.target.value)
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Deskripsi Potensi"
                                />

                                <button
                                    onClick={() => handleRemoveItem(idx)}
                                    className="cursor-pointer text-red-600 text-sm font-medium"
                                >
                                    Hapus Potensi
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleAddItem}
                            className="cursor-pointer w-full py-2 text-blue-500 text-left text-sm font-medium"
                        >
                            + Tambah Potensi
                        </button>

                        <div className="flex justify-end gap-2 pt-3">
                            <button
                                onClick={() => setIsEdit(false)}
                                className="cursor-pointer px-4 py-2 border rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleUpdate}
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
    )
}

export default Potensi
