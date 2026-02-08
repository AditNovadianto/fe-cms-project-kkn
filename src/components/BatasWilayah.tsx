import { useEffect, useState } from "react"
import { isTokenExpired } from "../utils/auth"
import { useNavigate } from "react-router-dom"

type BatasWilayahType = {
    batasUtara: string
    batasSelatan: string
    batasTimur: string
    batasBarat: string
    isActive: boolean
    updatedAt: string
}

type UserType = {
    id_user: string | number
}

const BatasWilayah = () => {
    const [batas, setBatas] = useState<BatasWilayahType | null>(null)
    const [isEditData, setIsEditData] = useState(false)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        batasUtara: "",
        batasSelatan: "",
        batasTimur: "",
        batasBarat: "",
    })

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
        const getBatasWilayah = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/getBatasWilayahContents`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Gagal mengambil data")

                const data = await res.json()

                setBatas(data)

                setFormData({
                    batasUtara: data.batasUtara,
                    batasSelatan: data.batasSelatan,
                    batasTimur: data.batasTimur,
                    batasBarat: data.batasBarat,
                })
            } catch (err) {
                console.error(err)
            }
        }

        getBatasWilayah()
    }, [isEditData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/5`,
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
            )

            if (!res.ok) throw new Error("Update gagal")

            const updated = await res.json()

            setBatas(updated)
            setIsEditData(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* INFO */}
            <div className="border rounded-lg p-6 mb-6">
                <div className="space-y-3 text-sm">
                    <p><b>Utara:</b> {batas?.batasUtara}</p>
                    <p><b>Selatan:</b> {batas?.batasSelatan}</p>
                    <p><b>Timur:</b> {batas?.batasTimur}</p>
                    <p><b>Barat:</b> {batas?.batasBarat}</p>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${batas?.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {batas?.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>

                    <span className="text-gray-500">
                        Terakhir diperbarui:{" "}
                        {batas?.updatedAt &&
                            new Date(batas.updatedAt).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            })}
                    </span>
                </div>
            </div>

            <button
                onClick={() => setIsEditData(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
                Edit Batas Wilayah
            </button>

            {/* MODAL */}
            {isEditData && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-[40%] space-y-4">
                        <h3 className="text-lg font-semibold">Edit Batas Wilayah</h3>

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

export default BatasWilayah
