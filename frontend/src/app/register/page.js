"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert("Registration successful! Please login.");
            router.push("/login");
        } else {
            alert("Registration failed.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96 text-black">
                <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
                <input 
                    type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setEmail(e.target.value)} required
                />
                <input 
                    type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setPassword(e.target.value)} required
                />
                <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
                <p className="mt-4 text-center">Already have an account? <Link href="/login" className="text-blue-500">Login</Link></p>
            </form>
        </div>
    );
}