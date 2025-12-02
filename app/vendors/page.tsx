"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {Plus, Trash2} from "lucide-react";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

/* Vendors Page :
Left top : category list(fetched from app/api/vendorCategories)
Right Bottom: vendors filtered by selected category only
Add Vendor Modal: (Use selected category by category dropdown)
*/

// types
type Category = {
    _id: string;
    name: string;
    description?: string;
    type?: "Expense" | "Income" |string;
    color?: string;
};

type Vendor = {
    _id?: string;
    name: string;
    categoryId?: string;
    category?: Category | null;
    frequencyPerMonth?: number |string;
    outgoingMin?: number | string;
    outgoingMax?: number | string;
    incomingMin?: number | string;
    incomingMax?: number | string;
    weekendActivity?: number | string;
};

export default function VendorsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loadingVendors, setLoadingVendors] = useState(false);

    // add vendor modal
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [form, setForm] = useState<Vendor>({
        name: "",
        categoryId: "",
        frequencyPerMonth: "",
        outgoingMin: "",
        outgoingMax: "",
        incomingMin: "",
        incomingMax: "",
        weekendActivity: "",
    });

    // fetch categories
    async function fetchCategories() {
        try {
            const response = await fetch("/api/vendorCategories");
            const json = await response.json();
            if(!Array.isArray(json)){
                setCategories([]);
                return;
            }
            setCategories(json);
            if(!selectedCategory && json.length > 0) setSelectedCategory(json[0]);
        }
        catch(error) {
            console.error("fetch categories error:", error);
        }
    }

    // fetch vendors for selected category
    async function fetchVendors(categoryId?: string) {
        if(!categoryId) {
            setVendors([]);
            return;
        }
        try {
            setLoadingVendors(true);
            const response = await fetch(`/api/vendors?categoryId=${encodeURIComponent(categoryId)}`);
            const json = await response.json();
            setVendors(Array.isArray(json)?json:[]);
        }
        catch(error) {
            console.error("fetch vendors error:", error);
        }
        finally {
            setLoadingVendors(false);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchVendors(selectedCategory._id);
        }
        else {
            setVendors([]);
        }
    }, [selectedCategory]);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const {name, value} = e.target;
        setForm((s) => ({...s, [name]: value}));
    };

    async function handleAddVendor(e?: React.FormEvent) {
        e?.preventDefault();
        const categoryId = form.categoryId || selectedCategory?._id;
        if (!form.name?.trim() || !categoryId) return alert("Vendor name and category are required");
        try {
            const payload = {...form, categoryId};
            const response = await fetch("/api/vendors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();
            if(!response.ok) {
                alert(json.error || "Failed to create vendor");
                return;
            }

            if(json?.data && json.data.category && json.data.category._id === (selectedCategory?._id ?? "")) {
                setVendors((p) => [json.data, ...p]);
            }
            else {
                // created vendor might belong to different category: refetch current list
                if(selectedCategory) {
                    await fetchVendors(selectedCategory._id);
                }
            }
        setForm({
            name: "",
            categoryId: "",
            frequencyPerMonth: "",
            outgoingMin: "",
            outgoingMax: "",
            incomingMin: "",
            incomingMax: "",
            weekendActivity: "",
        });
        setShowVendorModal(false);
    }
    catch(error) {
        console.error("handleAddVendor error:", error);
        alert("Failed to create vendor");
    }
    }

    async function handleDeleteVendor(id: string) {
        const confirmed = confirm("Delete this vendor?");
        if(!confirmed) {
            return;
        }
        try {
            const response = await fetch("/api/vendors", {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id}),
            });

            const json = await response.json();
            if(!response.ok) {
                alert(json.error || "Failed to delete vendor");
                return;
            }
            setVendors((p) => p.filter((v) => v._id !==id));
        }
        catch(error) {
            console.error("deleteVendorError:", error);
            alert("Failed to delete vendor");
        }
    }
    
    return (    
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="items-center justify-between">
                <h1 className="text-xl font-semibold">
                    Vendors
                </h1>

                <div>
                    <Button 
                    onClick={() => {
                        if(!selectedCategory) return alert("Select a category first");
                        setShowVendorModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Vendor
                    </Button>
                </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Categories Panel */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle className="text-base font-semibold">
                                    Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-2">                                
                                    {categories.map((c) => (
                                        <button
                                        key={c._id}
                                        onClick={() => setSelectedCategory(c)}
                                        className={`w-full text-left p-3 rounded-lg ${
                                            selectedCategory?._id === c._id ? "bg-blue-50" : "bg-white"
                                        } border`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-medium">
                                                        {c.name}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {/* Optionally vendor count*/}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {c.description}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Vendors Panel */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader className="flex items-center justify-between p-4">
                                <CardTitle className="text-base font-semibold">
                                    {selectedCategory ? `${selectedCategory.name} Vendors`: "Select a Category"}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-4">
                                <div>
                                    <input
                                    type="text"
                                    placeholder="Search Vendors..."
                                    className="w-full rounded-full border pl-4 pr-4 py-2 text-sm shadow-sm"
                                    onChange={(e) => {
                                        const q = e.target.value.toLowerCase().trim();
                                        if (!q) {
                                            if(selectedCategory) {
                                                fetchVendors(selectedCategory._id);
                                            }
                                        }
                                        else {
                                            setVendors((prev) => prev.filter((v) => v.name.toLowerCase().includes(q)));
                                        }
                                    }}
                                    />
                                </div>

                                <div className="mt-6 min-h-[160px]">
                                    {
                                        loadingVendors ? (
                                            <div>
                                                Loading Vendors...
                                                </div>
                                        ) : !selectedCategory ?(
                                            <div className="text-gray-500">
                                                Choose a category to view vendors.
                                            </div>
                                        ) : vendors.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                                <div>
                                                    No Vendors found in {selectedCategory.name}
                                                </div>
                                            </div>
                                        ): (
                                            <div className="grid gap-3">
                                                {
                                                    vendors.map((v) => (
                                                        <div key={v._id} className="border p-3 rounded-lg bg-gray-50 flex flex-col">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium">
                                                                        {v.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        Category: {selectedCategory?.name}
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-2 items-center">
                                                                    <button className="text-red-600" onClick={() => handleDeleteVendor(String(v._id))}>
                                                                        <Trash2 />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="text-sm text-gray-700 mt-2 space-y-1">
                                                                <div>
                                                                    Frequency: {v.frequencyPerMonth ?? "-"} /month
                                                                </div>
                                                                <div>
                                                                    Outgoing: {v.outgoingMin ?? "-"} - {v.outgoingMax ?? "-"} 
                                                                </div>
                                                                <div>
                                                                    Incoming: {v.incomingMin ?? "-"} - {v.incomingMax ?? "-"}
                                                                </div>
                                                                <div>
                                                                    Weekend Activity: {v.weekendActivity ?? "-"} %
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                        }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Add vendor modal */}
                {showVendorModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Add Vendor
                            </h2>
                            <form onSubmit={handleAddVendor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vendor Name
                                    </label>
                                    <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    type="text" 
                                    placeholder="e.g. Amazon Web Services"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Vendor Category
                                    </label>
                                    <select 
                                    name="categoryId" 
                                    value={form.categoryId ?? selectedCategory?._id ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">
                                            Select Category
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Outgoing Min
                                        </label>
                                        <input
                                        name="outgoingMin"
                                        value={String(form.outgoingMin ?? "")}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Outgoing Max
                                        </label>
                                        <input 
                                        name="outgoingMax"
                                        value={String(form.outgoingMax ?? "")}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Incoming Min
                                        </label>
                                        <input
                                        name="incomingMin"
                                        value={String(form.incomingMin ?? "")}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Incoming Max
                                        </label>
                                        <input 
                                        name="incomingMax"
                                        value={String(form.incomingMax ?? "")}
                                        onChange={handleInputChange}
                                        type="number"
                                        className="w-full border rounded-md px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Frequency (Per Month)
                                    </label>
                                    <input 
                                    name="frequencyPerMonth"
                                    value={String(form.frequencyPerMonth ?? "")}
                                    onChange={handleInputChange}
                                    type="number"
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Weekend Activity(%)
                                    </label>
                                    <input 
                                    name="weekendActivity"
                                    value={String(form.weekendActivity ?? "")}
                                    onChange={handleInputChange}
                                    type="number"
                                    className="w-full border rounded-md px-3 py-2 text-sm"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowVendorModal(false)} className="px-4 py-2 rounded-lg border text-sm">
                                        Cancel
                                    </button>
                                    <button 
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
                                    >
                                        Save Vendor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
        </div>
    );
}