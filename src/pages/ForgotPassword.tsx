import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/forgotPassword`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email_user: email,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Email tidak ditemukan");
            }

            setSuccess(
                "Link reset password berhasil dikirim. Silakan cek email kamu."
            );
            setEmail("");
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
                    Forgot Password
                </h1>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 text-sm text-green-600 bg-green-50 p-2 rounded">
                        {success}
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

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <p className="mt-5 text-center">
                    <Link
                        to={"/"}
                        className="font-semibold underline text-blue-800"
                    >
                        Back to Sign In
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPassword;
