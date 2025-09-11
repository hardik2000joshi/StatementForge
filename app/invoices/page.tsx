"use client";

import { Download, Eye, Search, Trash2 } from "lucide-react";
import { title } from "process";
import { useState } from "react";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([
        {
            id: "INV-2025-319611",
            title: "Electricity Bill",
            date: "1/1/2024",
            created:  "9/9/2025",
            amount: "-£5.46",
        },
        {
            id: "INV-2025-062916",
            title: "Electricity Bill",
            date: "1/1/2024",
            created: "9/3/2025",
            amount: "-£0.84",
        },
        {
            id: "INV-2025-200181",
            title: "Electricity Bill",
            date: "1/3/2024",
            created: "8/18/2025",
            amount: "-£5.49",
        },
        {
            id: "INV-2025-343296",
            title: "Electricity Bill",
            date: "1/1/2024",
            created: "8/14/2025",
            amount: "-£2.32",
        },
    ]);

    const handleClearAll = () => {
        setInvoices([]);
    };

    return (
        <div className="p-6 space y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">
                        Invoice Management
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage invoices generated from statement transactions
                    </p>
                </div>

                {invoices.length > 0 && (
                    <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow"
                    >
                        <Trash2 className="w-4 h-4" /> Clear All ({invoices.length})

                    </button>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                type="text"
                placeholder="Search invoices..."
                className="w-full rounded-full border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Recent Invoices */}
            <div className="rounded-2xl border bg-white shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-1">
                    Recent Invoices
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    Latest invoices generated from statement transactions
                </p>

                <div className="space-y-3">
                    {invoices.map((invoice) => (
                        <div
                        key={invoice.id} 
                        className="flex items-center justify-between rounded-xl border bg-gray-50 p-4"                        
                        >
                            {/* Left  Section */}
                            <div>
                                <p className="font-medium">
                                    {invoice.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {invoice.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                    Date: {invoice.date} &nbsp; Created: {invoice.created}
                                </p>
                            </div>

                            {/* Right Section */}
                            <div className="flex items-center gap-4">
                                <p className="text-red-500 font-semibold">
                                    {invoice.amount}
                                </p>
                                <button className="flex items-center gap-1 text-sm border rounded-full px-3 py-1 hover:bg-gray-1000">
                                    <Eye className="w-4 h-4" /> Preview
                                </button>
                                <button className="flex items-center gap-1 text-sm border rounded-full px-3 py-1 hover:bg-gray-100">
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                        </div>
                    ))}

                    {invoices.length === 0  && (
                        <p className="text-center text-gray-500 text-sm">
                            No invoices available
                        </p>
                    )}
                </div>
            </div>
        </div> 
    );
}