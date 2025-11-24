"use client";

import Button from "@/components/ui/Button";
import {Card, CardContent} from "@/components/ui/card";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

/* vendor categories frontend page:
fetches categories from app/api/vendorCategories/route.ts
create categories(POST)
Delete category(Delete)
Get all category(GET)
*/

// types
type Category = {
    _id: string;
    name: string;
    description: string;
    type?: "Expense" | "Income" | "string";
    color?: string;
};

type Vendor = {
    _id?: string;
    name: string;
    categoryId?: string;
    category?: Category | null;
    frequencyPerMonth?: number | string;
    outgoingMin?: number | string;
    outgoingMax?: number | string;
    incomingMin?: number | string;
    incomingMax?: number | string;
    weekendActivity?: number | string;
};

/*const categories = [
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
];*/

export default function VendorCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    // vendors for selected category
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loadingVendors, setLoadingVendors] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);

    // form for category
    const [catForm, setCatForm] =useState({
        name: "",
        description: "",
        type: "Expense",
        color: "blue",
    });

    // selected category (by clicking)
    const[selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Add vendor modal(for the selected category)
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [vendorForm, setVendorForm] = useState<Vendor>({
        name: "",
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
            setLoadingCategories(true);
            const response = await fetch("/api/vendorCategories");
            // json format
            const json = await response.json();
            if (!Array.isArray(json)) {
                console.error("Unexpected categories payload:", json);
                setCategories([]);
                return;
            }
            setCategories(json);
            // if no selected category, select first by default
            if(!selectedCategory && json.length > 0) {
                setSelectedCategory(json[0]);
            } 
            else if (selectedCategory){
                // refresh selectedCategory object reference
                const updated = json.find((c: Category) => c._id === selectedCategory._id) ?? null;
                setSelectedCategory(updated);
            }
        }
        catch(error) {
            console.error("fetch categories error:", error);
        } finally {
            setLoadingCategories(false);
        }
    }

    // fetch vendors for selected category
    async function fetchVendors(categoryId?: string){
        if(!categoryId) {
            setVendors([]);
            return;
        }
        try {
            setLoadingVendors(true);
            const response = await fetch(`/api/vendors?categoryId=${encodeURIComponent(categoryId)}`);
            const json = await response.json();
            if(!Array.isArray(json)){
                console.error("Unexpected Vendors payload:", json);
                setVendors([]);
                return;
            }
            setVendors(json);
        }
        catch(error) {
            console.error("fetchVendors error:", error)
        }
        finally{
            setLoadingVendors(false);
        }
    }

    useEffect(() => {
        fetchCategories();
        // es lint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetchVendors(selectedCategory._id);
        }
        else {
            setVendors([]);
        } 
    }, [selectedCategory]);

    // create category
    async function handleCreateCategory(e?: React.FormEvent) {
        e?.preventDefault();
        if(!catForm.name.trim()) {
            return alert("Category Name is Required");
        }
        try {
            const response = await fetch("/api/vendorCategories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(catForm),
            });
            const json = await response.json();
            if(!response.ok) {
                alert(json.error || "Failed to create category");
                return;
            }
            // append new category
            if(json?.data) {
                setCategories((prev) => [json.data, ...prev]);
                setSelectedCategory(json.data);
            }
            else {
                // fallback to re-fetch
                await fetchCategories();
            }
            setCatForm({name: "", description: "", type: "Expense", color:"blue"});
            setShowCreateModal(false);
        }
        catch(error) {
            console.error("createCategory error:", error);
            alert("Failed to create vendor category");
        }
    }

    // Delete Category
    async function handleDeleteCategory(id: string) {
        if(!confirm("Delete this category? this will not delete vendors automatically."))
            return;
        try {
            const response = await fetch("/api/vendorCategories", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id}),
            });

            const json = await response.json();
            if(!response.ok) {
                alert(json.error || "Failed to Delete");
                return;
            }

            // remove from UI and clear vendors if it was selected
            setCategories((prev) => prev.filter((c) => c._id !== id));
            if(selectedCategory?._id === id){
                setSelectedCategory(null);
                setVendors([]);
            }
        }
        catch(error) {
            console.error("delete category error:", error);
            alert("failed to delete category");
        }
    }

    // create vendor for selected category
    async function handleCreateVendor(e?: React.FormEvent) {
        e?.preventDefault();
        if (!selectedCategory) {
            return alert("Please select a category first");
        }
        if (!vendorForm.name?.trim()) {
            return alert("Vendor Name required");
        }
        try {
            const payload = {
                ...vendorForm,
                categoryId: selectedCategory._id,
            };
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
            // append created vendor(json.data) or refetch
            if(json?.data) {
                setVendors((prev) => [json.data, ...prev]);
            }
            else {
                await fetchVendors(selectedCategory._id);
            }
            setVendorForm({
                name: "",
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
            console.error("createVendor Error:", error);
            alert("Failed to create vendor");
        }
    }

    // Delete Vendor
    async function handleDeleteVendor(id: string) {
        if(!confirm("Delete this vendor?")) return;
        try {
            const response = await fetch("/api/vendors", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id}),
            });
            const json = await response.json();
            if(!response.ok) {
                alert(json.error || "Failed to Delete vendor");
                return;
            }
            setVendors((prev) => prev.filter((v) => v._id !== id)); 
        }
        catch(error) {
            console.error("deleteVendor Error:", error);
            alert("Failed to delete vendor");
        }   
    }
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">
                    Vendor Categories
                    </h1>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowCreateModal(true)}
                    >
                        <Plus className="h-4 w-4 mr-2"/> Add Category
                    </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loadingCategories?(
                    <div>Loading ...</div>
                ) : categories.length === 0 ? (
                    <div className="text-sm text-gray-500">No categories yet.</div>
                ): (
                    categories.map((cat) => (
                    <Card
                    key={cat._id}
                    className={`p-4 rounded-2xl shadow-sm border ${cat.color ?? "bg-gray-50"}`} 
                    >
                        <CardContent className="p-6">
                            {/* Title + Actions */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="cursor-pointer" onClick={() => setSelectedCategory(cat)}>
                                <h2 className="font-semibold text-lg">
                                    {cat.name}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {cat.description || "No description provided"}
                                </p>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                    title="Edit (Not implemented)"
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => alert("Edit category not implemented in this version")}
                                    >
                                        <Pencil className="h-4 w-4"/>
                                    </button>

                                    <button 
                                    title="Delete"
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => handleDeleteCategory(cat._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Description 
                           <p className="text-sm text-gray-600 mb-3">
                                {cat.description}
                            </p> */}

                            {/* Type Tag */}
                            <div className="mt-3">
                                 <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full $ {
                                cat.type === "Income"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                            >
                                {cat.type === "Income" ? "Income" : "Expense" }
                            </span>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
            </div>

            {/* Vendors panel for selected category */}
            <div className="mt-6 border rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            {selectedCategory ? `${selectedCategory.name} vendors` : "Select a category"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Manage vendors for realistic transaction generation
                        </p>
                    </div>

                    <div>
                        <Button
                        onClick={() => {
                            if (!selectedCategory)
                                return alert("Select a category first");
                            setShowVendorModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Add Vendor
                        </Button>
                    </div>
                </div>

                <div>
                    <input 
                    type="text"
                    placeholder="Search Vendors..."
                    className="w-full rounded-full border pl-4 pr-4 py-2 text-sm shadow-sm"
                    onChange={(e) => {
                        const q = e.target.value.toLowerCase().trim();
                        if(!q) {
                            if(selectedCategory) fetchVendors(selectedCategory._id);
                        }
                        else {
                            setVendors((prev) => prev.filter((v) => v.name.toLowerCase().includes(q)));
                        }
                    }}
                    />
                </div>

                <div className="mt-8 min-h-[140px]">
                    {
                        loadingVendors ?(
                            <div>Loading Vendors...</div>
                        ): !selectedCategory ? (
                            <p className="text-gray-500">
                                Select a category above to view vendors.
                            </p>
                        ) : vendors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <svg xmlns="https://www.w3.org/2000/svg" className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293L12 3 9.293 4.707A1 1 0 018.586 5H4a2 2 0 00-2 2z"/>
                                </svg>
                                <div>
                                    No Vendors found in {selectedCategory?.name}
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
                                                    <button className="text-sm text-red-600" onClick={() => handleDeleteVendor(String(v._id))}>
                                                        <Trash2 />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="text-sm text-gray-700 mt-2 space-y-1">
                                                <div>
                                                    Frequency: {v.frequencyPerMonth ?? "-"} time(s) /month
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
                        )}
                </div>
            </div>

            {/* Create Category Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Create Vendor Category
                        </h2>
                        <form 
                        className="space-y-4"
                        onSubmit={handleCreateCategory}
                        >
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input 
                                type="text" 
                                name="name"
                                value={catForm.name}
                                onChange={(e) => setCatForm((s) => ({...s, name:e.target.value}))}
                                placeholder="e.g., Cloud Services"
                                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                name="description"
                                value={catForm.description}
                                onChange={(e) => setCatForm((s) => ({...s, description: e.target.value}))}
                                placeholder="Brief description of this category"
                                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            {/* Category Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Type
                                </label>
                                <select
                                name="type"
                                value={catForm.type}
                                onChange={(e) => setCatForm((s) => ({...s, type: e.target.value}))}
                                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="Expense">
                                        Expense - For Debit Vendors
                                    </option>

                                    <option value="Income">
                                        Income - For Credit Vendors 
                                    </option>
                                    </select>
                            </div>

                            {/* Color Theme */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color Theme
                                </label>
                                <select
                                name="color"
                                value={catForm.color}
                                onChange={(e) => setCatForm((s) => ({...s, color:e.target.value}))}
                                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                >
                                    <option value="bg-gray-50">
                                        Grey
                                    </option>

                                    <option value="bg-blue-50">
                                        Blue
                                    </option>

                                    <option value="bg-green-50">
                                        Green
                                    </option>

                                    <option value="bg-yellow-100">
                                        Yellow
                                    </option>

                                    <option value="bg-purple-50">
                                        Purple
                                    </option>

                                    <option value="bg-red-50">
                                        Red
                                    </option>

                                    <option value="bg-indigo-50">
                                        Indigo
                                    </option>                                    
                                    </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" className="px-4 py-2 rounded-md border text-sm" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm">
                                    Create Category
                                </button>
                            </div>
                        </form>
                        </div>
                        </div>
            )}

            {/* Create Vendor Model */}
            {
                showVendorModal && selectedCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Add Vendor to {selectedCategory.name}
                            </h2>
                            <form onSubmit={handleCreateVendor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vendor Name
                                    </label>
                                    <input 
                                    name="name"
                                    value={vendorForm.name}
                                    onChange={(e) => setVendorForm((s) => ({...s, name:e.target.value}))}
                                    type="text" 
                                    placeholder="e.g. Amazon Web Services"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Outgoing Min
                                        </label>
                                        <input
                                        name="outgoingMin"
                                        value={String(vendorForm.outgoingMin ?? "")}
                                        onChange={(e) => setVendorForm((s) => ({...s, outgoingMin: e.target.value}))}
                                        type="number"
                                        placeholder="e.g.500"
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Outgoing Max
                                        </label>
                                        <input
                                        name="outgoingMax"
                                        value={String(vendorForm.outgoingMax ?? "")}
                                        onChange={(e) => setVendorForm((s) => ({...s, outgoingMax:e.target.value}))}
                                        type="number"
                                        placeholder="e.g. 50000"
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                        value={String (vendorForm.incomingMin ?? "")}
                                        onChange={(e) => setVendorForm((s) => ({...s, incomingMin:e.target.value}))}
                                        type="number"
                                        placeholder="e.g. 100"
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Incoming Max
                                        </label>
                                        <input
                                        name="incomingMax"
                                        value={String(vendorForm.incomingMax ?? "")}
                                        onChange={(e) => setVendorForm((s) => ({...s, incomingMax:e.target.value}))}
                                        type="number"
                                        placeholder="e.g.10000"
                                        className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Frequency(Per Month)
                                    </label>
                                    <input
                                    name="frequencyPerMonth"
                                    value={String(vendorForm.frequencyPerMonth ?? "")}
                                    onChange={(e) => setVendorForm((s) => ({...s, frequencyPerMonth:e.target.value}))}
                                    type="number" 
                                    placeholder="e.g. 3"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Weekend Activity (%)
                                    </label>
                                    <input 
                                    name="weekendActivity"
                                    value={String(vendorForm.weekendActivity ?? "")}
                                    onChange={(e) => setVendorForm((s) => ({...s, weekendActivity:e.target.value}))}
                                    type="number"
                                    placeholder="e.g. 20"
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                    type="button"
                                    className="px-4 py-2 rounded-md border text-sm" onClick={() => setShowVendorModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm"
                                    >
                                        Add Vendor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
}