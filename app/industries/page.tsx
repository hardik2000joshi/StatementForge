"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// Modal Component for adding a new Industry
const AddIndustryModal = ({ onClose, onCreate } : {onClose: () => void; onCreate: (name:string) => void; }) => {
    const [newIndustryName, setNewIndustryName] = useState("");
    const handleCreate = () => {
        if (newIndustryName.trim ()) {
            onCreate(newIndustryName);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        Create New Industry
                    </h2>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                            Add New Industry
                        </h3>
                        <label className="block text-sm font-medium text-gray-700">
                            Industry Name
                            </label>
                            <input 
                            type="text"
                            placeholder="e.g., EdTech, Real Estate, Construction"
                            value={newIndustryName}
                            onChange={(e) => setNewIndustryName(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                             />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Description (Optional)
                        </label>
                        <textarea 
                        placeholder="Brief description of the industry"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 resize-none"
                        rows={3} 
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                    onClick={onClose}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"                    
                    >
                        Cancel
                    </button>

                    <button
                    onClick={handleCreate}
                    className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"                    
                    >
                        Create Industry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function IndustriesPage() {
    const [industries, setIndustries] = useState([
        {id: 1, name: "All Industries", count: 2},
        {id: 2, name: "Mobile Top-ups", count: 2},
    ]);

    const [activeIndustry, setActiveIndustry] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleAddIndustry = (newIndustryName: string) => {
        const newId = industries.length > 0 ? Math.max(...industries.map(i => i.id)) + 1 : 1;
        const newIndustry = {
            id: newId,
            name: newIndustryName,
            count: 0
        };
        console.log("New Industry Added:", newIndustry);
        setIndustries([...industries, newIndustry]);
        setIsModalOpen(false);
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

                    <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4" /> Add Industry                    
                        </button>
                </div>

                <div className="space-y-2">
                    {industries.map((industry) => (
                        <div
                        key={industry.id}
                        onClick={() => setActiveIndustry(industry.id)}
                        className={`flex items-center justify-between rounded-full px-4 py-2 cursor-pointer ${
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
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
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

                {isModalOpen && <AddIndustryModal onClose={() => setIsModalOpen(false)}  onCreate={handleAddIndustry}/>}
                        </div>
    );

}