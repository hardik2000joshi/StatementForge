"use client";

export default function ContactUsPage() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                Contact Us
                </h1>

                <form className="space-y-6">
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <input 
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="flex-1 p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input 
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="flex-1 p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <input 
                        type="text"
                        name="Subject"
                        placeholder="Subject"
                        className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                        />
                    </div>

                    <div>
                        <textarea 
                        name="message"
                        placeholder="Your Message"
                        className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={7} 
                        >
                        </textarea>
                    </div>

                    <div>
                        <button 
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Send Message
                        </button>
                    </div>
                    </form>
        </main>
    )
}