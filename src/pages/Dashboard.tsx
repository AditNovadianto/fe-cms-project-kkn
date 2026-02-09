import {
    Building2,
    Flag,
    History,
    House,
    Images,
    Landmark,
    Map,
    MapPin,
    SquareDashed,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";

import Beranda from "../components/Beranda";
import Demografi from "../components/Demografi";
import Navbar from "../components/Navbar";
import PetaWilayah from "../components/PetaWilayah";
import VisiMisi from "../components/VisiMisi";
import BatasWilayah from "../components/BatasWilayah";
import Pemerintahan from "../components/Pemerintahan";
import Potensi from "../components/Potensi";
import Sejarah from "../components/Sejarah";
import Wisata from "../components/Wisata";

import smallLogo from "../images/icon-logo.png";
import bigLogo from "../images/logo.png";
import SaranaPrasarana from "../components/SaranaPrasarana";
import Galeri from "../components/Galeri";

const menus = [
    { name: "Beranda", icon: <House /> },
    { name: "Demografi", icon: <Users /> },
    { name: "Peta Wilayah", icon: <Map /> },
    { name: "Visi & Misi", icon: <Flag /> },
    { name: "Batas Wilayah", icon: <SquareDashed /> },
    { name: "Pemerintahan", icon: <Landmark /> },
    { name: "Potensi", icon: <TrendingUp /> },
    { name: "Sejarah", icon: <History /> },
    { name: "Wisata", icon: <MapPin /> },
    { name: "Sarana & Prasarana", icon: <Building2 /> },
    { name: "Galeri", icon: <Images /> },
];

const Dashboard = () => {
    const [section, setSection] = useState("Beranda");

    return (
        <div className="w-full h-screen flex">
            {/* SIDEBAR */}
            <aside className="sticky top-0 z-5 group bg-white border-r transition-all duration-300 ease-in-out w-16 hover:w-64 h-screen flex flex-col gap-5 p-3">
                <button className="relative h-12 flex items-center justify-center">
                    <img
                        src={smallLogo}
                        alt="Logo icon"
                        className="absolute w-10 opacity-100 scale-100 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90"
                    />
                    <img
                        src={bigLogo}
                        alt="Logo full"
                        className="absolute w-full opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
                    />
                </button>

                {menus.map((menu) => (
                    <button
                        key={menu.name}
                        onClick={() => setSection(menu.name)}
                        className={`cursor-pointer flex items-center gap-3 px-2 hover:px-3 py-2 rounded transition-all hover:bg-gray-100 ${section === menu.name ? "bg-gray-200 font-semibold" : ""}`}
                    >
                        <span>{menu.icon}</span>
                        <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {menu.name}
                        </span>
                    </button>
                ))}
            </aside>

            {/* CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col h-screen p-5">
                <Navbar section={section} />

                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 rounded-lg">
                    {section === "Beranda" && <Beranda />}
                    {section === "Demografi" && <Demografi />}
                    {section === "Peta Wilayah" && <PetaWilayah />}
                    {section === "Visi & Misi" && <VisiMisi />}
                    {section === "Batas Wilayah" && <BatasWilayah />}
                    {section === "Pemerintahan" && <Pemerintahan />}
                    {section === "Potensi" && <Potensi />}
                    {section === "Sejarah" && <Sejarah />}
                    {section === "Wisata" && <Wisata />}
                    {section === "Sarana & Prasarana" && <SaranaPrasarana />}
                    {section === "Galeri" && <Galeri />}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
