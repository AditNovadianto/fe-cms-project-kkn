import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { Eye, EyeClosed } from "lucide-react";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/getAllRoles`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Gagal mengambil data")

                const json = await res.json()

                setRoles(json)
            } catch (err) {
                console.error(err)
            }
        }

        fetchData()
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Password dan konfirmasi password tidak sama");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signUpUsers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nama_user: name,
                    email_user: email,
                    password_user: password,
                    id_landingpage: 1,
                    id_role: selectedRole
                }),
            });

            if (!response.ok) {
                throw new Error("Gagal membuat akun");
            }

            navigate("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
            <img className="w-75" src={logo} alt="" />

            <h1 className="text-2xl font-bold text-blue-600 mb-6 mt-5">
                CMS Allakuang Landingpage
            </h1>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
            >
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Sign Up
                </h1>

                {error && (
                    <div className="text-center mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Nama
                    </label>

                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="Nama Lengkap"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>

                    <input
                        type="email"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Role
                    </label>

                    <select
                        className="cursor-pointer w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        required
                    >
                        <option value="">-- Pilih Role --</option>

                        {roles.map((role) => (
                            <option key={role.id_role} value={role.id_role}>
                                {role.nama_role}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-2 right-5"
                        >
                            {!showPassword ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                        Konfirmasi Password
                    </label>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute top-2 right-5"
                        >
                            {!showConfirmPassword ? <Eye /> : <EyeClosed />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-5"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>

                <p className="mt-5 text-center">
                    Already have an account?{" "}
                    <Link
                        to={"/"}
                        className="font-semibold underline text-blue-800"
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
