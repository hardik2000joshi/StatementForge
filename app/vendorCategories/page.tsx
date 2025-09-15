"use client";

import Button from "@/components/ui/Button";
import {Card, CardContent} from "@/components/ui/card";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const categories = [
    {
        name: "AWS",
        description: "No description provided",
        type: "Expense",
        color: "bg-red-50",
    },
    {
        name: "Cloud Services",
        description: "Cloud computing and hosting services",
        type: "Expense",
        color: "bg-blue-50",
    },
    {
        name: "Payment Processors",
        description: "Settlements from payment providers used for payment processing of transactions",
        type: "Income",
        color: "bg-blue-100",
    },
    {
        name: "Utility Bills",
        description: "Utility Bills",
        type: "Expense",
        color: "bg-yellow-100",
    },
];

export default function vendorCategoriesPage() {

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">
                    Vendor Categories
                    </h1>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2"/> Add Category
                    </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap:4">
                {categories.map((cat, index) => (
                    <Card
                    key={index}
                    className={`p-4 rounded-2xl shadow-sm border ${cat.color}`}
                    >
                        <CardContent className="p-6">
                            {/* Title + Actions */}
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-semibold text-lg">
                                    {cat.name}
                                </h2>
                                <div className="flex gap-2">
                                    <button className="text-blue-600 hover:text-blue-800">
                                        <Pencil className="h-4 w-4"/>
                                    </button>
                                    <button className="text-red-600 hover:text-red-800">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-3">
                                {cat.description}
                            </p>

                            {/* Type Tag */}
                            <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full $ {
                                cat.type === "Income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                            >

                                {cat.type === "Income" ? "Income" : "Expense" }
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Create Vendor Category
                        </h2>
                        <form className="space-y-4">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input 
                                type="text" 
                                placeholder="e.g., Cloud Services"
                                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}