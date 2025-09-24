"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../context/userContext";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const {loginUser} = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
     try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // save logged in user in context
      loginUser(data);

      // Redirect to home
      router.push("/");
    }
    catch(err) {
        setError("something went wrong");
    }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
                <h1 className="mb-2 text-2xl font-semibold text-gray-800">
                    Log in to your account
                </h1>

                <p className="mb-6 text-gray-500">
                    Welcome back, we hope you're having a great day.
                </p>

                <form 
                onSubmit={handleSubmit}
                className="space-y-4"
                >
                    <div>
                        <label
                        htmlFor="email"
                        className="mb-1 block text-left text-sm font-medium text-gray-700" 
                        >
                            Email
                        </label>
                        <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password"
                        className="mb-1 block text-left text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                        id="password"
                        name="password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        autoComplete="current-password"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500" 
                        /> 
                    </div>

                    <div className="flex justify-between">
                        <a href="/forgotPassword"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            Forgot your password?
                        </a>
                    </div>


          {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex space-x-2">
                        <button
                        type="submit"
                        className="w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                            Login
                        </button>
                        <a 
                        href="/"
                        className="w-full rounded-lg bg-gray-400 px-4 py-2 text-center font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                        Cancel
                            </a>   
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{""}
                        <a 
                        href="/sign-up"
                        className="rounded-lg bg-green-500 px-3 py-1 font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Sign Up
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}