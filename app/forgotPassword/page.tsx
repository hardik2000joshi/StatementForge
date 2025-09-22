"use client";

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
                <h1 className="mb-2 text-2xl font-semibold text-gray-800">
                    Forgot your password?
                </h1>

                <p className="mb-6 text-gray-500">
                    Enter the email address associated with your account and we will send you a link to reset your password.
                </p>

                <form className="space-y-4">
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

                    <div className="flex space-x-2">
                        <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Send Reset Link
                        </button>
                        <a 
                        href="/login"
                        className="w-full rounded-lg bg-gray-400 px-4 py-2 text-center font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}