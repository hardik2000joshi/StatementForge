"use client";

export default function SignUpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                <h1 className="mb-2 text-2xl font-semibold text-gray-800">
                    Sign Up 
                </h1>

                <p className="mb-6 text-gray-500">
                    You're a few seconds away from your Invoice Simple account!
                </p>

                <form
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
                        placeholder="name@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"   
                        />
                    </div>

                    <div>
                        <label 
                        htmlFor="password"
                        >
                            Password
                        </label>

                        <input 
                        id="password"
                        name="password"
                        type="password"
                        placeholder="********"
                        autoComplete="new-password"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" 
                        /> 
                    </div>

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
                        <a 
                        href="/login"
                        className="w-full rounded-lg bg-gray-400 px-4 py-2 text-center font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Cancel
                        </a>
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-500">
                        By signing up, you agree to the terms of use & privacy policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
