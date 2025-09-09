"use client";

import { count } from "console";
import { ArrowDownRight, ArrowUpRight, Plus, Search, Tag } from "lucide-react";
import { useState } from "react";

export default function Categories() {
    const [selectedCategory, setSelectedCategory] = useState<string | null> (null);
    const [selectedVendorGroup, setSelectedVendorGroup] = useState<string | null> (null);

    const data = [
        {
            type: "Income",
            vendors: [{name: "Payment Processors", count: 1}],
            total: 1,
            color: "green",
            icon: <ArrowUpRight className="w-4 h-4 text-green-600"/>
        },
        {
            type: "Expense",
            vendors: [
                {name: "AWS", count: 0},
                {name: "Cloud Services", count: 0},
                {name: "Utility Bills", count: 1},
            ],
            total: 3,
            color: "red",
            icon: <ArrowDownRight className="w-4 h-4 text-red-600"/>,
        },
    ];

    return (
        <div className="space-y-6">
        <div className="rounded-2xl border p-4 bg-gray-5">
            <h2 className="text-base font-semibold mb-4">
                Categories
            </h2>
            <div className="space-y-4">
                {data.map((category, idx) => (
                    <div key={idx} className= "rounded-xl overflow-hidden">
                        {/* Category Header */}
                        <div
                        className={`flex items-center justify-between p-4 ${
                            category.color === "green"
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                        >

                            <div className="flex items-center gap-2">
                                {category.icon}

                                <span className="font-medium">
                                    {category.type}
                            </span>
                            </div>

                            <span className="text-sm text-gray-500">
                                {category.total} total vendors
                            </span>
                        </div>

                        {/* Vendors List */}
                        <div className="divide-y">
                            {category.vendors.map((vendor, i) => (
                                <div
                                key={i}
                                onClick={() => {
                                    setSelectedCategory(category.type);
                                    setSelectedVendorGroup(vendor.name);
                                }}
                                className={`flex items-center justify-between p-4 cursor-pointer $ {
                                    selectedVendorGroup === vendor.name
                                    ? "bg-blue-50"
                                    : "bg-gray-50"
                                    } hover: bg-blue-50`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-gray-500"/>
                                        <span>{vendor.name}</span>
                                    </div>

                                    <span className="text-sm text-gray-500">
                                        {vendor.count} vendors
                                    </span>

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Vendor Details Panel */}
        {selectedVendorGroup && (
            <div className="rounded-2xl border p-6 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        {selectedVendorGroup} Vendors
                    </h3>
                    <p className="text-sm text-gray-500">
                        Manage vendors for realistic transaction generation
                    </p>
                </div>

                <button className="flex items-center gap-1 rounded-full bg-blue-500 text-white px-3 py-1 text-sm hover:bg-blue-600">
                    <Plus className="w-4 h-4"/> Add Vendor
                </button>
            </div>

            {/* Search Bar */}

            <div>
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3"/>
                <input 
                type="text"
                placeholder="Search vendors..." 
                className="w-full rounded-full border pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center text-gray-500 py-12">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentcolor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0013.586 3H10.414a1 1 0 00-.707.293L8.293 4.707A1 1 0 017.586 5H4a2 2 0 00-2 2z"
                     />
                    </svg>
                    <p>
                        No vendors found in {selectedVendorGroup}
                    </p>
            </div>
        </div>
        )}
        
        </div>
    );
}