import { Flag, House, Map, SquareDashed, Users } from "lucide-react";
import { useState } from "react";
import Beranda from "../components/Beranda";

const menus = [
    {
        name: "Beranda",
        icon: <House />
    },
    {
        name: "Demografi Desa",
        icon: <Users />
    },
    {
        name: "Peta Wilayah",
        icon: <Map />
    },
    {
        name: "Visi & Misi",
        icon: <Flag />
    },
    {
        name: "Batas Wilayah",
        icon: <SquareDashed />
    }
];

const Dashboard = () => {
    const [section, setSection] = useState("Beranda");

    return (
        <div className="w-full min-h-screen flex">
            {/* SIDEBAR */}
            <aside
                className="group bg-white border-r transition-all duration-300 ease-in-out w-16 hover:w-64 min-h-screen flex flex-col gap-5 p-3"
            >
                {menus.map((menu, index) => (
                    <button
                        key={index}
                        onClick={() => setSection(menu.name)}
                        className={`flex items-center gap-3 px-2 hover:px-3 py-2 rounded text-left hover:bg-gray-100 transition-all cursor-pointer ${section === menu.name ? "bg-gray-200 font-semibold" : ""}`}
                    >
                        {/* Icon placeholder */}
                        <span className="block">
                            {menu.icon}
                        </span>

                        {/* Text */}
                        <span
                            className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            {menu.name}
                        </span>
                    </button>
                ))}
            </aside>

            {/* CONTENT */}
            <main className="flex-1 min-h-screen p-6">
                {section === "Beranda" && <Beranda />}
                {/* <h1 className="text-2xl font-bold mb-4">{section}</h1>
                <div className="border rounded p-4">
                    Content {section}
                </div> */}
            </main>
        </div>
    );
};

export default Dashboard;
