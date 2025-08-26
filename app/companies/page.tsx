"use client";

import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([
        "Webnatics LTD",
        "Polytechnics",
    ]);
    const [newCompany, setNewCompany] = useState("");
    const [search, setSearch] = useState("");
    const [showInput, setShowInput] = useState(false);

    const handleAddCompany = () => {
        if (!showInput){
            setShowInput(true);
            return;
        }
        if (newCompany.trim() === "")
            return;
        setCompanies([...companies, newCompany.trim()]);
        setNewCompany("");
        setShowInput(false);
    };

    const filteredCompanies = companies.filter((c) => 
        c.toLowerCase().includes(search.toLowerCase())
    );
                  

return (
        <div className="p-6 space y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    Companies
                </h2>
                <div className="flex items-center gap-2">

                    <button 
                    onClick={handleAddCompany}
                    className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        {showInput ? "save": "Add Company"}
                    </button>
                </div>
            </div>

        {/* Show Input When Adding*/}
        {
            showInput && (
                <div className="flex gap-2">
                    <input 
                    type="text" 
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Enter Company Name"
                    className="border p-2 flex-1 rounded-lg"
                    />
                </div>
            )
        } 

        {/* Search */}
        <input type="text" 
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border w-full p-2 rounded-lg"
        />

        {/* Company List */}
        <ul>
            {filteredCompanies.map((c, index) => (
                <li
                key={index}
                className="flex justify-between items-center p-2 border-b"
                >
                    <span>
                        {c}
                    </span>
                    <div className="flex-gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                            <Edit className="h-4 w-4"/>
                        </button>

                        <button className="p-1 text-red-600 hover:text-red-800">
                            <Trash className="h-4 w-4"/>
                        </button>
                    </div>
            </li>
            ))}
            
        </ul>
    </div>
)
}