import React, { useEffect, useRef, useState } from "react";
import { isTokenExpired } from "../utils/auth";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
    section: string;
};

const Navbar: React.FC<NavbarProps> = ({ section }) => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<{
        nama_user: string;
        email_user: string;
    } | null>(null);

    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (isTokenExpired(String(token))) {
            sessionStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        const item = localStorage.getItem("user");

        if (item) {
            setUser(JSON.parse(item));
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const logOutHandler = () => {
        sessionStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <div className="bg-gray-100 px-2 py-2 rounded-lg w-full flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{section}</h1>

            {/* PROFILE */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setOpen((prev) => !prev)}
                    className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                        {user?.nama_user?.charAt(0) ?? "A"}
                    </div>

                    {/* Name */}
                    <span className="text-sm font-medium">
                        {user?.nama_user ?? "User"}
                    </span>
                </button>

                {/* DROPDOWN */}
                {open && (
                    <div className="overflow-hidden absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-md z-50">
                        <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium">{user?.nama_user}</p>

                            <p className="text-xs text-gray-500">{user?.email_user}</p>
                        </div>

                        <button className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                            Profile
                        </button>

                        <button
                            onClick={logOutHandler}
                            className="cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
