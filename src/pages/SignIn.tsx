import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/signInUsers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email_user: email, password_user: password }),
            });

            if (!response.ok) {
                throw new Error("Email atau password salah");
            }

            const data = await response.json();

            sessionStorage.setItem("token", data.token);

            localStorage.setItem("user", JSON.stringify(data.user));

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">CMS Allakuang Landingpage</h1>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
            >
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Sign In
                </h1>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

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

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>

                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </div>
    );
};

export default SignIn;
