"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function SignUpPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organization, setOrganization] = useState("");
    const [role, setRole] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const res = await fetch ("/api/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    organization,
                    role,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("Account Created Successfully! Redirecting to login after 10 seconds ...");
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
                setOrganization("");
                setRole("");

            // Auto redirect after 6 seconds
            setTimeout(() => {
                router.push("/login");
            }, 6000);
        }
            else {
                setErrorMessage(data.error || "Failed to create Account");
            }
        }
        catch(err) {
            console.error("Signup error:", err);
            setErrorMessage("Something went wrong. Please try again.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w
-sm rounded-lg bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-2xl font-semibold text-gray-800">
                    Sign Up 
                </h1>

                <p className="mb-6 text-gray-500">
                    You're a few seconds away from your Invoice Simple account!
                </p>

                <form onSubmit={handleSubmit}
                className="space-y-4"
                >
                    <div>
                        <label
                        htmlFor="firstName"
                        className="mb-1 block text-left text-sm font-medium text-gray-700"
                        >
                            First Name
                        </label>
                        <input
                        id="firstName"
                        name="firstName" 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Johny"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label 
                        htmlFor="lastName"
                        className="mb-1 block text-left text-sm font-medium text-gray-700"
                        >
                            Last Name
                        </label>

                        <input
                        id="lastName"
                        name="lastName"
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="AppleSeed"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label 
                        htmlFor="email"
                        className="mb-1 block text-left text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>

                        <input 
                        id="email"
                        name="email"
                        type="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"   
                        />
                    </div>

                    <div>
                        <label 
                        htmlFor="password"
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
                        autoComplete="new-password"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        /> 
                    </div>

                    <div>
                        <label 
                        htmlFor="Organization"
                        className="mb-1 block text-left text-sm font-medium text-gray-700"
                        >
                            Organization
                        </label>

                        <input type="text" 
                        placeholder="ABC Ltd"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        />
                    </div>

                    <div>
                        <label htmlFor="Role"
                        className="mb-1 block text-left text-sm font-medium text-gray-700"
                        >
                            Role
                        </label>

                        <input 
                        type="text"
                        placeholder="Team Head"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required 
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        />
                    </div>

                    {
                        successMessage && (
                            <p className="text-green-600 text-sm">
                                {successMessage}
                                </p>
                        )
                    }

                    {
                        errorMessage && (
                            <p className="text-red-500 text-sm">
                                {errorMessage}
                                </p>
                        )
                    }

                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                            id="newsletter"
                            name="newsletter" 
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                        </div>

                        <div className="ml-3 text-sm">
                            <label 
                            htmlFor="newsletter"
                            className="font-medium text-gray-700"
                            >
                                I want to receive emails from Invoice Simple and its Affiliates
                about their products, services, news, events, and promotions.
                Read our {" "}
                <a 
                href="#"
                className="text-blue-600 hover:underline"
                >
                    Privacy Policy
                </a>
                            </label>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                        type="submit"
                        className="w-full rounded-lg bg-orange-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                            Create Account
                        </button>
                        <button
                        className="w-full rounded-lg bg-gray-400 px-4 py-2 text-center font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-500">
                        By signing up, you agree to the terms of use & privacy policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
