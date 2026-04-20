"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            router.push("/dashboard");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
            <form onSubmit={handleLogin} className="p-8 bg-white rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <input 
                    type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setEmail(e.target.value)} required
                />
                <input 
                    type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setPassword(e.target.value)} required
                />
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
                <p className="mt-4 text-center">No account? <Link href="/register" className="text-blue-500">Register</Link></p>
            </form>
        </div>
    );
}