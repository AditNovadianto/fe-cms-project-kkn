import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenExpired } from "../utils/auth"
import { Check } from "lucide-react"

type GroupItemType = {
    name: string
    period: string
}

type GroupType = {
    subtitle: string
    list: GroupItemType[]
}

type TimelineType = {
    year: string
    title: string
    description?: string
    note?: string
    items: string[]
    groups: GroupType[]
}

type SejarahType = {
    timeline: TimelineType[]
    isActive: boolean
    updatedAt: string
}

type UserType = {
    id_user: string | number
}

const Sejarah = () => {
    const [, setSejarah] = useState<SejarahType | null>(null)
    const [timeline, setTimeline] = useState<TimelineType[]>([])
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<UserType | null>(null)
    const [notification, setNotification] = useState<string | null>(null);

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
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [notification]);

    useEffect(() => {
        const fetchSejarah = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/getSejarahContents`,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Gagal mengambil sejarah")

                const json = await res.json()

                setSejarah(json)
                setTimeline(json.timeline || [])
            } catch (err) {
                console.error(err)
            }
        }

        fetchSejarah()
    }, [isEdit])

    const handleTimelineChange = (
        index: number,
        field: keyof TimelineType,
        value: any
    ) => {
        const updated = [...timeline]

        updated[index] = { ...updated[index], [field]: value }
        setTimeline(updated)
    }

    const handleAddTimeline = () => {
        setTimeline([
            ...timeline,
            {
                year: "",
                title: "",
                description: "",
                note: "",
                items: [],
                groups: [],
            },
        ])
    }

    const handleRemoveTimeline = (index: number) => {
        setTimeline(timeline.filter((_, i) => i !== index))
    }

    const handleAddItem = (tIdx: number) => {
        const updated = [...timeline]

        updated[tIdx].items.push("")
        setTimeline(updated)
    }

    const handleItemChange = (tIdx: number, iIdx: number, value: string) => {
        const updated = [...timeline]

        updated[tIdx].items[iIdx] = value
        setTimeline(updated)
    }

    const handleRemoveItem = (tIdx: number, iIdx: number) => {
        const updated = [...timeline]

        updated[tIdx].items = updated[tIdx].items.filter((_, i) => i !== iIdx)
        setTimeline(updated)
    }

    const handleAddGroup = (tIdx: number) => {
        const updated = [...timeline]

        updated[tIdx].groups.push({ subtitle: "", list: [] })
        setTimeline(updated)
    }

    const handleRemoveGroup = (tIdx: number, gIdx: number) => {
        const updated = [...timeline]

        updated[tIdx].groups = updated[tIdx].groups.filter((_, i) => i !== gIdx)
        setTimeline(updated)
    }

    const handleGroupSubtitleChange = (
        tIdx: number,
        gIdx: number,
        value: string
    ) => {
        const updated = [...timeline]

        updated[tIdx].groups[gIdx].subtitle = value
        setTimeline(updated)
    }

    const handleAddGroupItem = (tIdx: number, gIdx: number) => {
        const updated = [...timeline]

        updated[tIdx].groups[gIdx].list.push({ name: "", period: "" })
        setTimeline(updated)
    }

    const handleGroupItemChange = (
        tIdx: number,
        gIdx: number,
        iIdx: number,
        field: "name" | "period",
        value: string
    ) => {
        const updated = [...timeline]

        updated[tIdx].groups[gIdx].list[iIdx][field] = value
        setTimeline(updated)
    }

    const handleRemoveGroupItem = (
        tIdx: number,
        gIdx: number,
        iIdx: number
    ) => {
        const updated = [...timeline]

        updated[tIdx].groups[gIdx].list = updated[tIdx].groups[gIdx].list.filter(
            (_, i) => i !== iIdx
        )
        setTimeline(updated)
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/updateSection/8`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        timeline,
                        updatedBy: user?.id_user,
                    }),
                }
            )

            if (!res.ok) throw new Error("Update gagal")

            const updated = await res.json()

            setSejarah(updated)
            setIsEdit(false)
            setNotification("Data Sejarah berhasil diperbarui");
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* VIEW */}
            <div className="space-y-4 mb-6">
                {timeline.map((t, i) => (
                    <div key={i} className="border rounded-lg p-4">
                        <h4 className="font-bold">{t.year}</h4>
                        <p className="font-medium">{t.title}</p>
                        {t.description && <p className="text-sm">{t.description}</p>}
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsEdit(true)}
                className="cursor-pointer w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
            >
                Edit Sejarah
            </button>

            {isEdit && (
                <div className="z-10 fixed inset-0 bg-black/50 flex justify-center p-6">
                    <div className="bg-white p-6 rounded-lg w-[60%] space-y-6 overflow-y-auto">
                        {timeline.map((t, tIdx) => (
                            <div key={tIdx} className="border p-4 rounded space-y-3">
                                <div>
                                    <p className="font-semibold">Year</p>

                                    <input
                                        value={t.year}
                                        onChange={(e) =>
                                            handleTimelineChange(tIdx, "year", e.target.value)
                                        }
                                        className="w-full border px-3 py-2 mt-2"
                                        placeholder="Tahun"
                                    />
                                </div>

                                <div>
                                    <p className="font-semibold">Title</p>

                                    <input
                                        value={t.title}
                                        onChange={(e) =>
                                            handleTimelineChange(tIdx, "title", e.target.value)
                                        }
                                        className="w-full border px-3 py-2 mt-2"
                                        placeholder="Judul"
                                    />
                                </div>

                                <div>
                                    <p className="font-semibold">Description</p>

                                    <textarea
                                        value={t.description}
                                        onChange={(e) =>
                                            handleTimelineChange(tIdx, "description", e.target.value)
                                        }
                                        className="w-full border px-3 py-2 mt-2"
                                        placeholder="Deskripsi"
                                    />
                                </div>

                                <div>
                                    <p className="font-semibold">Notes</p>

                                    <textarea
                                        value={t.note}
                                        onChange={(e) =>
                                            handleTimelineChange(tIdx, "note", e.target.value)
                                        }
                                        className="w-full border px-3 py-2 mt-2"
                                        placeholder="Catatan"
                                    />
                                </div>

                                {/* ITEMS */}
                                <div>
                                    <p className="font-semibold">Items</p>

                                    {t.items.map((it, iIdx) => (
                                        <div key={iIdx} className="flex gap-2 mt-1">
                                            <input
                                                value={it}
                                                onChange={(e) =>
                                                    handleItemChange(tIdx, iIdx, e.target.value)
                                                }
                                                className="flex-1 border px-3 py-1"
                                            />

                                            <button
                                                onClick={() => handleRemoveItem(tIdx, iIdx)}
                                                className="cursor-pointer text-red-600"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => handleAddItem(tIdx)}
                                        className="cursor-pointer text-blue-500 text-sm mt-1"
                                    >
                                        + Tambah Item
                                    </button>
                                </div>

                                {/* GROUPS */}
                                <div>
                                    <p className="font-semibold">Groups</p>
                                    {t.groups.map((g, gIdx) => (
                                        <div key={gIdx} className="border p-3 mt-2 rounded">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold">Group {gIdx + 1}</p>
                                                <button
                                                    onClick={() => handleRemoveGroup(tIdx, gIdx)}
                                                    className="cursor-pointer text-red-600 text-sm"
                                                >
                                                    Hapus Group
                                                </button>
                                            </div>

                                            <div className="mt-3">
                                                <p className="font-semibold">Subtitle</p>

                                                <input
                                                    value={g.subtitle}
                                                    onChange={(e) =>
                                                        handleGroupSubtitleChange(
                                                            tIdx,
                                                            gIdx,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border px-3 py-1 mt-2"
                                                    placeholder="Subtitle"
                                                />
                                            </div>

                                            {g.list.map((li, lIdx) => (
                                                <div key={lIdx} className="flex gap-2 mt-2">
                                                    <div>
                                                        <p className="font-semibold">Name</p>

                                                        <input
                                                            value={li.name}
                                                            onChange={(e) =>
                                                                handleGroupItemChange(
                                                                    tIdx,
                                                                    gIdx,
                                                                    lIdx,
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="border px-2 py-1 mt-2"
                                                            placeholder="Nama"
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold">Period</p>

                                                        <input
                                                            value={li.period}
                                                            onChange={(e) =>
                                                                handleGroupItemChange(
                                                                    tIdx,
                                                                    gIdx,
                                                                    lIdx,
                                                                    "period",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="border px-2 py-1 mt-2"
                                                            placeholder="Periode"
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveGroupItem(tIdx, gIdx, lIdx)
                                                        }
                                                        className="cursor-pointer text-red-600"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                onClick={() => handleAddGroupItem(tIdx, gIdx)}
                                                className="cursor-pointer text-blue-500 text-sm mt-1"
                                            >
                                                + Tambah Anggota
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={() => handleAddGroup(tIdx)}
                                        className="cursor-pointer text-blue-500 text-sm mt-2"
                                    >
                                        + Tambah Group
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRemoveTimeline(tIdx)}
                                    className="cursor-pointer text-red-600 text-sm"
                                >
                                    Hapus Timeline
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleAddTimeline}
                            className="cursor-pointer text-blue-500 text-sm"
                        >
                            + Tambah Timeline
                        </button>

                        <div className="flex justify-end gap-2">
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
    )
}

export default Sejarah
