import { Flag, House, Map, SquareDashed, Users } from "lucide-react";
import { useState } from "react";
import Beranda from "../components/Beranda";
import Demografi from "../components/Demografi";
import Navbar from "../components/Navbar";
import smallLogo from "../images/icon-logo.png"
import bigLogo from "../images/logo.png"
import PetaWilayah from "../components/petaWilayah";

const menus = [
    {
        name: "Beranda",
        icon: <House />
    },
    {
        name: "Demografi",
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
                <button className="cursor-pointer relative h-12 flex items-center justify-center">
                    {/* LOGO KECIL */}
                    <img
                        src={smallLogo}
                        alt="Logo icon"
                        className="absolute w-10 opacity-100 scale-100 transition-all duration-300 ease-out group-hover:opacity-0 group-hover:scale-90"
                    />

                    {/* LOGO BESAR */}
                    <img
                        src={bigLogo}
                        alt="Logo full"
                        className="absolute w-full opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100"
                    />
                </button>

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
                <Navbar section={section} />

                {section === "Beranda" && <Beranda />}
                {section === "Demografi" && <Demografi />}
                {section === "Peta Wilayah" && <PetaWilayah />}
            </main>
        </div>
    );
};

export default Dashboard;
