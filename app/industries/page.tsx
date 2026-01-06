"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
type Industry = {
    id: string;
    name: string;
    description?: string;
};

type vendorCategory = {
    id: string;
    name: string;
    industryId: string;
}

// Modal component for adding a new industry
const AddIndustryModal = ({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (
        name: string,
        description: string
    ) => void;
}) => {
    const [newIndustryName, setNewIndustryName] = useState("");
    const [description, setDescription] = useState("");
    const handleCreate = () => {
        if (newIndustryName.trim()) {
            onCreate(newIndustryName.trim(), description.trim());
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
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
    const [industries, setIndustries] = useState<Industry[]>([]);
    const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingIndustry, setEditingIndustry] = useState <Industry | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const [vendorCategories, setVendorCategories] = useState<vendorCategory[]>([]);
    const router = useRouter();

    // Load industries on mount
    const refetchIndustries = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/industries");
            const json = await response.json();
            if (!response.ok || !json.success) {
                console.error("Failed to load industries", json);
                return;
            }
            setIndustries(json.data || []);
            // set first industry as active
            if (json.data && json.data.length > 0) {
                setActiveIndustry(json.data[0].id);
            }
            else {
                setActiveIndustry(null);
            }
        }
        catch (error) {
            console.error("Error loading industries:", error);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        refetchIndustries();
    }, []);


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await fetch("/api/vendorCategories");
                const json = await response.json();
                if (!response.ok) {
                    console.error("Failed to create vendorCategories", json);
                    return;
                }
                const mapped = (json as any[]).map((c) => ({
                    id: c._id,
                    name: c.name,
                    industryId: c.industryId ?? "",
                }));
                setVendorCategories(mapped);
            }
            catch (error) {
                console.error("Error loading vendorCategories", error);
            }
        };
        loadCategories();
    }, []);

    const handleDelete = async (industryId: string) => {
        setIndustries((prev) => prev.filter((industry) => industry.id !== industryId));
        if (activeIndustry === industryId) {
            setActiveIndustry(industries[0]?.id ?? null);
        }
        try {
            const response = await fetch(`/api/industries`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: industryId })
            });

            const result = await response.json();
            console.log('DELETE API response:', result);

            if (!result.success) {
                throw new Error(result.message || 'Delete failed');
            }
        }
        catch (error) {
            refetchIndustries();
            console.error("Delete failed:", error);
        }
    };

    const handleEdit = (industry: Industry) => {
        setEditingIndustry(industry);
        setEditName(industry.name);
        setEditDescription(industry.description || '')
    }

    const handleSaveEdit = async() => {
        if(!editingIndustry) return;

        setIndustries(prev => prev.map(ind => ind.id === editingIndustry.id 
            ?{
                ...ind,
                name: editName,
                description: editDescription
            }: ind
        ));

        try {
            const response = await fetch("/api/industries", {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({
                    id: editingIndustry.id,
                    name: editName.trim(),
                    description: editDescription.trim()
                })
            });
        }
        catch(error) {
            refetchIndustries();
            console.error("Edit failed:", error);
        }
        setEditingIndustry(null);
        setEditName('');
        setEditDescription('');
    };
    
    const handleAddIndustry = async (name: string, description: string) => {
        try {
            const response = await fetch("/api/industries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    description
                }),
            });
            const json = await response.json();
            if (!response.ok || !json.success) {
                alert(json.message || "Failed to create industry");
                return;
            }

            const created: Industry = json.data;
            setIndustries((prev) => [...prev, created]);
            setActiveIndustry(created.id);
            setIsModalOpen(false);
        }
        catch (error) {
            console.error("Create industry error", error);
            alert("Failed to create industry");
        }
    };

    const filteredCategories = activeIndustry == null
        ? vendorCategories
        : vendorCategories.filter((c) => c.industryId === activeIndustry);

        const getCategoryCountForIndustry = (industryId: string) => 
            vendorCategories.filter((c) => c.industryId === industryId).length;
   return ( 
        <div className="space-y-6 p-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Industries
                        </h2>
                        <p className="text-sm text-gray-500">
                            Browse vendor categories by industry type
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4" /> Add Industry
                    </button>
                </div>

                {
                    loading ? (
                        <p className="text-sm text-gray-500">
                            Loading Industries...
                        </p>
                    ) : industries.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No industries yet. Add one.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {industries.map((industry) => (
                                <div
                                    key={industry.id}
                                    onClick={() => setActiveIndustry(industry.id)}
                                    className={`flex items-center justify-between rounded-full px-4 py-2 cursor-pointer ${activeIndustry === industry.id
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-black hover:bg-gray-200"
                                        }`}
                                >
                                    <span>
                                        {industry.name}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="rounded-full px-2 py-0.5 text-xs font-semibold bg-black text-white"
                                        >
                                            {getCategoryCountForIndustry(industry.id)}
                                        </span>

                                        {/* Edit Option */}
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(industry);
                                        }}
                                        className="text-green-500 hover: text-green-700 p-1 rounded-full hover:bg-green-100"
                                        title="Edit Industry"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        {/* Manage Categories */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/vendorCategories?industryId=${industry.id}`);
                                            }}
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100" 
                                            title="Manage Categories"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        {/* Delete Option */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Delete this industry?')) {
                                                    handleDelete(industry.id);
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                                            title="Delete Industry"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
                {editingIndustry && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-6">
                                Edit Industry
                            </h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Industry Name *
                                </label>
                                <input 
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter industry name"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (optional)
                                </label>
                                <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                                placeholder="Enter industry description"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                onClick={() => {
                                    setEditingIndustry(null);
                                    setEditName('');
                                    setEditDescription('');
                                }}
                                className="px-4 py-2 text-gray-600 hover: text-gray-900"
                                >
                                    Cancel
                                </button>

                                <button 
                                onClick={handleSaveEdit}
                                disabled={!editName.trim()}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Vendors Section */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-2">
                    {activeIndustry
                        ? "Vendor categories for selected industry"
                        : "All Vendor Categories"
                    }
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    {activeIndustry
                        ? "Categories of vendors available for this industry"
                        : "All vendor categories across all industries"
                    }
                </p>

                {filteredCategories.length === 0 ? (
                    <p className="text-sm text-gray-500">
                        No Vendor Categories yet.
                    </p>
                ) : (
                    filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-xl border bg-gray-50 p-4 flex justify-between items-center mb-3"
                        >
                            <div>
                                <h3 className="font-medium">
                                    {category.name}
                                </h3>

                                {/*<p className="text-sm text-gray-500">
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
                        )}*/}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && <AddIndustryModal onClose={() => setIsModalOpen(false)} onCreate={handleAddIndustry} />}
        </div>
    );
}