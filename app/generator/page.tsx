    "use client";

    import Button from "@/components/ui/Button";
    import { Download, DownloadIcon, Eye, Save, Trash2, X } from "lucide-react";
    import { useState } from "react";
    import { toast } from "sonner";

    interface Generation {
        id: string;
        transactions: number;
        date: string;
    }

    interface Preset {
        name: string;
        description: string;
        badge: string;
        createdAt: Date;
    }

    interface GenerationRules {
        openingBalance: number;
  txnsPerWeek: number;
  outgoingMin: number;
  outgoingMax: number;
  incomingMin: number;
  incomingMax: number;
  categories: string[];
  style: "basic" | "detailed" | "minimal";
}


    export default function GeneratorPage () {
        const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]); 
        const [showModal, setShowModal] = useState(false);
        const [showLoadModal, setShowLoadModal] = useState(false);

        // form state
        const [presetName, setPresetName] = useState("");
        const [presetDesc, setPresetDesc] = useState("");
        
        // saved presets
        const [presets, setPresets] = useState<Preset[]>([]);
        const [statementType, setStatementType] = useState("basic");

        // Transactions Rules state
        const [rules, setRules] = useState<GenerationRules>({
            openingBalance: 5000,
            txnsPerWeek: 10,
            outgoingMin: 5,
            outgoingMax: 500,
            incomingMin: 100,
            incomingMax: 1000,
            categories: [
                "Shopping",
                "Bills",
                "Groceries",
                "Food"
            ],
            style: "basic" as "basic" | "detailed" | "minimal",
        });

        // Loading State
        const [loading, setLoading] = useState(false);

        // Handle Save Preset
        const handleSavePreset = () => {
            if (!presetName.trim())
                return alert ("Preset Name is reaquired");
        

        const newPreset: Preset = {
            name: presetName.trim(),
            description: presetDesc.trim(),
            badge: `${rules.txnsPerWeek} txns/week`,
            createdAt: new Date(),
        };

        setPresets((prev) => [...prev, newPreset]);
        setPresetName("");
        setPresetDesc("");
        setShowModal(false);
    };

    const handleLoadPreset = (preset: Preset) => {
        toast.success("Preset Loaded", {
            description: `Settings from "${preset.name}" have been applied.`,
        });
        setShowLoadModal(false);
    };

    const [summary, setSummary] = useState<{
        count: number,
        openingBalance: number,
        closingBalance: number,
        netChange: number,
        period: string;
    } | null> (null);

    // Generate Statement
    const handleGenerateStatement = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/generator", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    rules
                }),
            });

            const data = await res.json();
            if (data.success) {
                const txns = data.statement?.transactions || [];

                if (!Array.isArray(txns) || txns.length === 0) {
                    throw new Error("No transactions returned from API");
                }

                const sorted = [...txns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                // opening balance (can be configurable instead of fixed)
                const openingBalance = Number(rules.openingBalance ?? 5000);
                let balance = openingBalance;

                for (const t of sorted) {
                    if(t.type === "credit") balance += t.amount;
                    else balance -= t.amount;
                }

                const closingBalance = balance;
                const netChange = closingBalance - openingBalance;

                // update summary dynamically
                 setSummary({
        count: txns.length,
        openingBalance,
        closingBalance,
        netChange,
        period: `${new Date(sorted[0].date).toLocaleDateString()} - ${new Date(
          sorted[sorted.length - 1].date
        ).toLocaleDateString()}`,
      });
      
            // Add to recent generations list
            setRecentGenerations((prev) => [
                {
                    id: data.id,
                    transactions: data.statement.transactions.length,
                    date: new Date(data.statement.createdAt).toLocaleString(),
                },
                ...prev,
            ]);

            toast.success("Statement Generated!", {
                description: `${data.statement.transactions.length} transactions created.`,
            });
        }
    }

        catch(err: any) {
            toast.error("Failed to generate statement", {
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

        return (
            <div className="p-6 space-y-6">
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
                        onClick={() => setShowModal(true)}
                        >
                            <Save className="w-4 h-4" />
                            Save Preset
                        </Button>

                        <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => setShowLoadModal(true)}
                        >
                            <Download className="w-4 h-4"/>
                            Load Preset
                        </Button>
                    </div>

                    {/* Show Saved Presets */}

                    {presets.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-md font-medium mb-2">
                                Saved Presets
                            </h3>
                            <ul className="space-y-2">
                                {presets.map((p, i) => (
                                    <li
                                    key={i}
                                    className="rounded-lg border p-3 bg-white shadow-sm"
                                    >
                                        <div className="font-semibold">
                                            {p.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {p.description}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
                            <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                Save Generation Preset
                            </h2>
                            <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preset Name
                                    </label>
                                    <input 
                                    type="text"
                                    value={presetName}
                                    onChange={(e) => setPresetName(e.target.value)}
                                    placeholder="e.g., Monthly High Activity"
                                    className="w-full border rounded-full px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description (optional)
                                    </label>

                                    <textarea 
                                    value={presetDesc}
                                    onChange={(e) => setPresetDesc(e.target.value)}
                                    placeholder="Describe when to use this preset..."
                                    className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows={3}
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex justify-end gap-3">
                                <Button 
                                variant="outline"
                                onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </Button>

                                <Button 
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={handleSavePreset}
                                >
                                    Save Preset
                                </Button>
                            </div>
                        </div>
                        </div>
                )}

                {/* Load Preset Modal */}
                {showLoadModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
                        <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">
                                Load Generation Preset
                            </h2>
                            <button
                            onClick={() => setShowLoadModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                            </div>

                            {presets.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No presets saved yet.
                                </p>
                            ): (
                                <div className="space-y-3">
                                    {presets.map((p, i) => (
                                        <div
                                        key={i}
                                        onClick={() => handleLoadPreset(p)}
                                        className="flex justify-between items-start rounded-xl border bg-gray-50 p-4 shadow-sm"
                                        >
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold">
                                                        {p.name}
                                                    </span>
                                                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                                                        25 txns/week
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600">
                                                    {p.description}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    Created {new Date().toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                            onClick={() => 
                                                setPresets((prev) => prev.filter((_, idx) => idx !== 1))
                                            }
                                            className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Footer Button */}
                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                variant="outline"
                                onClick={() => setShowLoadModal(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                <br />

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
                                
                                <select 
                                value={statementType}
                                onChange={(e) => setStatementType(e.target.value)}
                                className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm">
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

                {/* Transaction Generation Rules */}
                <div className="mt-8 border rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">
                        Transaction Generation Rules
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Configure realistic transaction patterns and amounts
                    </p>

                    {/* Balance Config */}
                    <div className="grid gap-6 sm:grid-cols-2 mb-6">
                        
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4">
                                Balance Configuration
                            </h4>
                            <label className="block text-sm font-medium text-gray-700">
                                Opening Balance (£)
                            </label>
                            <input 
                            type="number" 
                            placeholder="250"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mt-10">
                                Target Closing Balance (£)
                            </label>
                            <input 
                            type="number" 
                            placeholder="280"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                    </div>

                    {/* Transactions per week & Weekend Activity */}
                    <div className="grid gap-6 sm:grid-cols-2 mb-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-4">
                                Transaction Patterns
                            </h4>
                            <label className="block text-sm font-medium text-gray-700">
                                Transactions per Week
                            </label>
                            <input 
                            type="number" 
                            min={1}
                            max={50}
                            value={rules.txnsPerWeek}
                            onChange={(e) => setRules({
                                ...rules, txnsPerWeek: Number(e.target.value)
                            })}
                            className="w-full mt-1 rounded-lg border-gray-300 shadow-sm text-sm"
                            />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mt-10">
                                    Weekend Activity (%)
                                </label>
                                <input 
                                type="range" 
                                min="0"
                                max="100"
                                defaultValue="15"
                                className="w-full mt-2"
                                />
                                {/*<div className="text-sm text-gray-600">
                                    15%
                                </div> */}
                            </div>
                    </div>

                    {/* Transaction Amount Ranges */}

                    <div className="grid gap-6 sm:grid-cols-2 mb-6">    
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Outgoing: Min Amount (£)
                            </label>
                            <input 
                            type="number" 
                            value={rules.outgoingMin}
                            onChange={(e) => setRules({
                                ...rules, outgoingMin: Number(e.target.value)
                            })}
                            placeholder="5"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Outgoing: Max Amount (£)
                            </label>
                            <input 
                            type="number"
                            value={rules.outgoingMax}
                            onChange={(e) => setRules({
                                ...rules, 
                                outgoingMax: Number(e.target.value)
                            })}
                            placeholder="500"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Incoming: Min Amount (£)
                            </label>
                            <input 
                            type="number"
                            value={rules.incomingMin}
                            onChange={(e) => setRules({
                                ...rules,
                                incomingMin: Number(e.target.value)
                            })}
                            placeholder="100"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Incoming: Max Amount (£)
                            </label>
                            <input 
                            type="number"
                            value={rules.incomingMax}
                            onChange={(e) => setRules({
                                ...rules,
                                incomingMax: Number(e.target.value)
                            })}
                            placeholder="1000"
                            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
                            />
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button  
                    onClick={handleGenerateStatement}
                    disabled={loading}                  
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md flex items-center justify-center gap-2">
                        {loading ? "Generating..." : "Generate Statement"}
                    </button>
                    <br />

                    {/* Generation Summary */}
                    <div className="rounded-2xl border p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">
                            Generation Summary
                        </h2>

                        {!summary ? (
                            <p className="text-gray-500 text-sm text-center">
                                No summary yet.
                            </p>
                        ) : (
                            <>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">
                                    {summary.count}
                                </p>

                                <p className="text-gray-500">
                                Transactions Generated
                            </p>
                            </div>

                            <div className="mt-6 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>
                                    Period
                                </span>
                                <span>
                                {summary.period}
                                </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>
                                        Opening Balance
                                    </span>

                                    <span>
                                        £{summary.openingBalance.toFixed(2)}
                                    </span>
                                </div>

                                 <div className="flex justify-between text-green-600 font-semibold">
                                <span>
                                    Closing Balance
                                </span>

                                <span>
                                    £{summary.closingBalance.toFixed(2)}
                                </span>
                            </div>

                            <div className={`flex justify-between font-semibold ${
                                summary.netChange >=0 ? "text-green-600" : "text-red-600"
                            }`}
                            >
                                <span>Net Change</span>
                                <span>
                                    {summary.netChange >= 0 ? "+" : "-"}£
                                    {Math.abs(summary.netChange).toFixed(2)}
                                    </span>
                            </div>
                            </div>
                            </>
                    )}
                        </div>
                    </div>
                    <br />

                    {/* Recent Generations */}
                    <div className="rounded-2xl border p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">
                            Recent Generations
                        </h2>
                        {recentGenerations.length === 0 ? (
                            <p className="text-gray-500 text-sm">
                                No Statements yet.
                            </p>
                        ): (
                            <div className="space-y-3">
                            {recentGenerations.map((gen, index) => (
                                <div
                                key={gen.id}
                                className={`flex justify-between items-center p-3 rounded-lg ${
                                    index === 0 ? "bg-blue-50" : "hover: bg-gray-50"
                                }`}
                                >
                                    <div>
                                        <p className="font-medium">
                                            Statement <span className="text-gray-500">
                                                #{gen.id}
                                                </span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {gen.transactions} transactions - {gen.date}
                                        </p>

                                    </div>

                                    <div className="flex gap-3">
                                        <Eye className="text-blue-600 cursor-pointer"/>
                                        <DownloadIcon className="text-blue-600 cursor-pointer"/>

                                    </div>
                                    </div>
                            ))}
                        </div>
                        )}   
                        

                        <div className="mt-4 text-center">
                            <Button variant="outline">
                                View More Exports & History
                            </Button>
                        </div>
                    </div>
                </div>
        );
    }