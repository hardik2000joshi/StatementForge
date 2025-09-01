"use client";

import Button from "@/components/ui/Button";
import { Download, Save } from "lucide-react";
import { useState } from "react";

export default function GeneratorPage () {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [template, setTemplate] = useState("");

    return (
        <div className="p-6 space y-6">
            <div className="rounded-2xl border bg-gray-50 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Generation Presets
                </h2>

                <p className="text-sm text-gray-600">
                    Save and load your preferred generation settings
                </p>

                <div className="mt-4 flex gap-3">
                    <Button
                    variant = "outline" 
                    className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Preset
                    </Button>

                    <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    >
                        <Download className="w-4 h-4"/>
                        Load Preset
                    </Button>
                </div>
            </div>

            {/* Smart Statement Generator */}
            <div className="rounded-2xl border bg-gray-50 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                    Smart Statement Generator
                </h2>
                <p className="text-sm text-gray-600">
                    Configure parameters for realistic transaction generation
                </p>

                <form 
                className="mt-4 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium tex-gray-700">
                            Company
                        </label>

                        <select className="mt-1 w-full rounded-full border-gray-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none">
                            <option value="Webnatics Ltd">
                                Webnatics Ltd
                            </option>
                            <option value="Polytechnics">
                                Polytechnics
                            </option>
                        </select>
                    </div>

                    {/* Statement Period */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Statement Period
                        </label>
                        <div className="mt-3 grid gap-6 sm:grid-cols-3">
                            <div>
                                <div className="mb-1 text-sm font-medium text-gray-700">
                                    From Date
                                </div>
                            <input 
                            type="date"
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                            </div>

                            <div>
                                <div className="mb-1 text-sm font-medium text-gray-700">
                                    To Date
                                </div>
                            <input type="date" 
                            className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 text-sm"
                            />
                            </div>

                            <div>
                                <div className="mb-1 text-sm font-medium text-gray-700">
                                    Template
                                </div>
                            
                            <select className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
                                    <option value="basic">
                                        Basic Bank Statement
                                        </option>

                                        <option value="detailed">
                                            Detailed Bank Statement
                                        </option>

                                        <option value="minimal">
                                            Minimal Bank Statement
                                        </option>
                            </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}   