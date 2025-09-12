"use client";

import { Download, Eye, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";

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

    const [search, setSearch] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClearAll = () => {
        setInvoices([]);
        setShowConfirm(false);
    };

    const filteredInvoices = invoices.filter(
        (invoice) => 
            invoice.id.toLowerCase().includes(search.toLowerCase()) || 
        invoice.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Invoice Management
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage invoices generated from statement transactions
                    </p>
                </div>

                    <Button
                    onClick={() => setShowConfirm(true)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" /> Clear All ({invoices.length})
                    </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                    {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
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
                    ))
                ) :  (
                    <p className="text-center text-gray-500 text-sm">
                            No invoices available
                        </p>
                )}
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-[400 px]">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete all {invoices.length} invoices? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 border-t border-gray-300 bg-gray-100 px-4 py-2 rounded-b-md">
                            <Button
                            onClick={() => setShowConfirm(false)}
                            className="px-4 py-1.5 rounded border border-gray-400 bg-gray-200 text-gray-900 hover:bg-gray-300"
                            >
                               Cancel
                            </Button>

                            <Button
                            onClick={handleClearAll}
                            className="px-4 py-1.5 rounded border border-blue-700 bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div> 
    );
}