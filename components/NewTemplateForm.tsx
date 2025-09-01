    "use client";

import { useRouter } from "next/navigation";
    import { useRef, useState } from "react";

    export default function NewTemplateForm({onSave, onCancel} : {onSave: (template: any) => void, onCancel: () => void}) {
        const [name, setName] = useState("");
        const [type, setType] = useState("Bank Statement");
        const [htmlFile, setHTMLFile] = useState<File | null> (null);
        const [cssFile, setCssFile] = useState<File | null> (null);
        const htmlRef = useRef<HTMLInputElement | null> (null);
        const cssRef = useRef<HTMLInputElement | null> (null);
        
            const handleSubmit = (e: React.FormEvent) => {
                e.preventDefault();
                onSave({name, type, htmlFile, cssFile})
            }

            const router = useRouter();

        return (
            <div className="p-6 border rounded-lg bg-white shadow-md ">
                <h2 className="text-xl font-semibold mb-4">
                    Create New Template
                </h2>

                <p className="text-sm text-slate-600 mb-4">
                    Create a custom template for bank statements or invoices with your own design and vendor <br /> assignments.
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Template Name */}
                    <div>
                        <label className="block text-sm font-medium">
                            Template Name
                        </label>
                        <input 
                        type="text"
                        placeholder="Enter Template Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                    </div>

                    {/* Template Type */}

                    <div>
                        <label className="block text-sm font-medium">
                            Template Type
                        </label>

                        <select 
                        value={type}
                        onChange={(e) => 
                            setType(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 mt-1"
                        >
                            <option>
                                Bank Statement
                            </option>
                            <option>
                                Invoice
                            </option>
                        </select>
                    </div>

                    {/* Custom Files Heading */}
                    <div className="pt-2">
                        <h3 className="text-sm font-medium">
                            Custom Files (optional)
                        </h3>
                    </div>

                    {/* Upload HTML */}
                    <div className="flex items-center justify-between">
                        <div>
                        <label className="block text-sm font-medium">
                            Custom HTML Template
                        </label>

                        <p className="text-sm text-slate-500">
                            Upload .html file to define structure
                        </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                            type="button"
                            onClick={() => router.push("/upload-html")}
                            className="bg-[#13a0ff] hover:bg-[#0e8de6] text-white font-medium px-4 py-2 rounded-full shadow"
                            >
                                Upload HTML
                            </button>
                            {htmlFile && <span className="text-sm text-slate-500 max-w-xs truncate">{htmlFile.name}</span>}

                        </div>
                        </div>

                    {/* Upload CSS */}

                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block text-sm font-medium">
                                Custom CSS Styles
                                </label>
                                <p className="text-sm text-slate-500">
                                    Upload .css file to define styling
                                    </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                        type="button"
                                        onClick={() => router.push("/upload-css")}
                                        className="bg-[#13a0ff] hover:bg-[#0e8de6] text-white font-medium px-4 py-2 rounded-full shadow"
                                        >
                                            Upload CSS
                                            </button>
                                            {cssFile && <span className="text-sm text-slate-500 max-w-xs truncate">{cssFile.name}</span>}
                                            </div>
                                            </div>

                                            {/* Guidelines Box */}
                                            <div className="p-4 rounded-lg border border-sky-200 bg-sky-50">
                                                <div className="flex items-start gap-3">
                                                    <svg 
                                                    width = "28"
                                                    height = "28"
                                                    viewBox = "0 0 24 24"
                                                    fill = "none"
                                                    xmlns = "http://WWW.w3.org/2000/svg"
                                                    className="mt-1 flex-shrink-0"
                                                    >

                                                            <circle cx="12" cy="12" r="10" stroke="#2B8FD6" strokeWidth="1.2" fill="white"/>
                                                            <path d="M11.9999 7.5V8.5" stroke="#2B8FD6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M11.9999 10.5V16.5" stroke="#2B8FD6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>

                                                        </svg>

                                                        <div>
                                                            <h4 className="font-semibold text-sky-700 mb-2">
                                                                Template Guidelines
                                                            </h4>

                                                            <p className="text-sm text-slate-600 mb-2">
                                                                <strong>
                                                                    HTML Templates
                                                                </strong>
                                                                <br />
                                                                </p>
                                                                <p>
                                                                    Use variables like companyName, accountNumber, and transactions
                                                                in your <br /> HTML for dynamic content replacement.
                                                        </p>

                                                        <p className="text-sm text-slate-600 mb-2">
                                                            <strong>
                                                                CSS Styling
                                                            </strong>
                                                            <br />
                                                            Style your template with custom CSS. Use print media queries for PDF generation <br />
                                                             optimization. 
                                                        </p>

                                                        <div className="text-sm text-slate-600 mb-2">
                                                            <strong>
                                                                File Requirements
                                                            </strong>
                                                            <ul className="mt-2 text-sm space-y-1 list-disc ml-5 text-slate-600">
                                                                <li>
                                                                    HTML: Max 5MB, .html extension
                                                                </li>
                                                                <li>
                                                                    CSS: Max 2MB, .css extension
                                                                </li>
                                                                <li>
                                                                    UTF-8 encoding recommended
                                                                </li>
                                                            </ul>
                                                        </div>


                                                        </div>

                                                </div>
                                            </div>

                                            {/* Documentation + Important Notes */}
                                            <div className="border rounded-lg p-4 bg-white mb-6">
                                                <div className="mb-4">
                                                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                                                        Documentation
                                                    </h3>
                                                    <button
                                                    type="button"
                                                    className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-medium flex items-center gap-2"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 4v16m8-8H4"
                                                            />
                                                        </svg>
                                                        View Documentation
                                                    </button>
                                                </div>

                                                {/* Important Notes */}
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg pt-4 text-sm text-yellow-900">
                                                    <h4 className="font-medium mb-2 flex items-center gap-2">
                                                        Important Notes
                                                    </h4>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>
                                                            Templates are processed server-side for security
                                                        </li>
                                                        <li>
                                                            JavaScript execution is disabled in templates
                                                        </li>
                                                        <li>
                                                            External resources may be blocked
                                                        </li>
                                                        <li>
                                                            Test templates thoroughly before production use
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                    {/* Actions */}

                    <div className="flex gap-4">
                        <button 
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Create Template
                        </button>

                        <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        )
    }