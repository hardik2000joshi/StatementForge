"use client";

import { Edit, Eye, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface Template {
    id: number;
    name: String;
    category: String;
    file?: File | null;
}

export default function TemplatesPage() {
    const [search, setSearch] = useState("");
    const [templates, setTemplate] = useState<Template[]>([
        {
            id: 1,
            name: "Basic Bank Statement",
            category: "Bank Statement"
        },
    ]);

    // Add Template
    const handleAddTemplate = () => {
        const newTemplate: Template = {
            id: Date.now(),
            name: `New Template ${templates.length + 1}`,
            category: "Custom",
        };
        setTemplate([...templates, newTemplate]);
    };

    // Delete Template

    const handleDelete = (id: number) => {
        setTemplate(templates.filter((t) => t.id !== id));
    };

    //upload/Edit File
    const handleFileChange = (id: number, file: File) => {
        setTemplate(
            templates.map((t) => 
                t.id === id ? {...t, file} : t
            )
        );
    };

    // Filtered Templates
    const filteredTemplates = templates.filter((t) => 
        t.name.toLowerCase().includes(search.toLowerCase())
    );



    return (
    <div className="p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-4">
            Templates
        </h2>
        <button
        onClick={handleAddTemplate}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
            <Plus className="h-5 w-5" />
            Add Template
            </button>   
        </div>

        {/* Search */}
        <div className="mb-6">
            <input 
            type="text" 
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/*Template List */}
        <div className="space-y-4">
            {filteredTemplates.map((template) => (
                <div
                key={template.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                >
                    <div>
                        <div className="font-semibold">
                            {template.name}
                            </div>
                            <div className="text-sm text-gray-600">
                                {template.category}
                            </div>
                            {
                                template.file && (
                                    <div className="text-xs text-green-600 mt-1">
                                        uploaded: {template.file.name}
                                    </div>
                                )
                            }
                    </div>

                    <div className="flex gap-3 items-center">
                        <button className="text-green-600 hover: text-green-800">
                            <Eye className="h-5 w-5" />
                        </button>

                        <label className="cursor-pointer text-blue-600 hover:text-blue-800">
                            <Edit className="h-5 w-5" />
                            <input type="file"
                            accept=".pdf, .png, .jpg"
                            className="hidden"
                            onChange={(e) => 
                                e.target.files && handleFileChange(template.id, e.target.files[0])
                            }
                            />
                        </label>

                        {/* Delete */}
                        <button
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover: text-red-800"
                        >
                            <Trash className="h-5 w-5" />
                        </button>

                    </div>
                </div>
            ))}

            {filteredTemplates.length === 0 && (
          <p className="text-gray-500 text-sm">No templates found.</p>
        )}
        </div>
    </div>
);
}

