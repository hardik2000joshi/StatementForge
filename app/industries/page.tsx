"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function IndustriesPage() {
    const [industries, setIndustries] = useState([
        {id: 1, name: "All Industries", count: 2},
        {id: 2, name: "Mobile Top-ups", count: 2},
    ]);

    const [activeIndustry, setActiveIndustry] = useState(1);

    const vendors = [
        {
            id: 1,
            name: "Electricity Bill",
            category: "Utility Bills",
            industryId: 2,
            priceRange: "$20.45 - $1100.00",
            type: "Monthly Recurring",
        },
        {
            id: 2,
            name: "Rapyd",
            category: "Payment Processors",
            industryId: 2,
            priceRange: "$10000.00 - $20000.00",
            type: "Usage-Based Variable",
        },
    ];

    const handleDelete = (id: number) => {
        setIndustries(industries.filter((industry) => industry.id !== id));
    };

    const filteredVendors = 
    activeIndustry === 1
    ? vendors
    : vendors.filter((v) => v.industryId === activeIndustry);

    return (
        <div className="space-y-6 p-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Industries
                        </h2>
                        <p className="text-sm text-gray-500">
                            Browse vendors by industry type
                        </p>
                    </div>
                    <button className="flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-600">
                        <Plus className="w-4 h-4" /> Add Industry                    
                        </button>
                </div>

                <div className="space-y-2">
                    {industries.map((industry) => (
                        <div
                        key={industry.id}
                        onClick={() => setActiveIndustry(industry.id)}
                        className={`flex items-center justify-between rounded-full px-4 py-2 cursor-pointer $ {
                            activeIndustry === industry.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                        >
                            <span>
                                {industry.name}
                            </span>
                            <div className="flex items-center gap-3">
                                <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold $ {
                                    activeIndustry === industry.id
                                    ? "bg-black text-white"
                                    : "bg-black text-white"
                                    }`}
                                >
                                    {industry.count}
                                </span>

                                {industry.id !== 1 && (
                                    <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(industry.id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                    >

                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vendors Section */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                    {activeIndustry === 1 ? "All Vendors" : "Mobile Top-ups Vendors"}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    {activeIndustry === 1 
                    ? "All vendors across all industries"
                    : "Vendors available for this industry"
                    }
                </p>

                {filteredVendors.map((vendor) => (
                    <div
                    key={vendor.id}
                    className="rounded-xl border bg-gray-50 p-4 flex justify-between items-center mb-3"
                    >
                        <div>
                            <h3 className="font-medium">
                            {vendor.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {vendor.category}
                        </p>

                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1 inline-block">
                            Mobile Top-ups
                        </span>
                        </div>

                        <div className="text-right">
                        <p className="font-medium">
                            {vendor.priceRange}
                        </p>
                        <p className="text-sm text-gray-500">
                            {vendor.type}
                        </p>
                        {activeIndustry !==1 && (
                            <button className="text-red-500 text-sm mt-1">x</button>
                        )}
                    </div>

                    </div>
                ))}
                
               
                </div>
                        </div>
    )
}