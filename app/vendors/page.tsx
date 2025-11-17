"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";
import { ArrowDownRight, ArrowUpRight, Plus, Search, Tag } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/ui/Button";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

export default function VendorsPage() {
    const [vendors, setVendors] = useState<{
        name: string;
        category: string;
        frequencyPerMonth: string;
        outgoingMin: string;
        outgoingMax: string;
        incomingMin: string;
        incomingMax: string;
        weekendActivity: string;
    }[]
    >([]);

    const [form, setForm] = useState({
        name: "",
        category: "",
        frequencyPerMonth: "",
        outgoingMin: "",
        outgoingMax: "",
        incomingMin: "",
        incomingMax: "",
        weekendActivity: "",
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleAddVendor = () => {
        if (!form.name || !form.category) return alert("Please fill vendor name and category");
        setVendors([...vendors, form]);
        setForm({
            name: "",
            category: "",
            frequencyPerMonth: "",
            outgoingMin: "",
            outgoingMax: "",
            incomingMin: "",
            incomingMax: "",
            weekendActivity: "",
        });
    };

    const [selectedCategory, setSelectedCategory] = useState<string | null> (null);
    const [selectedVendorGroup, setSelectedVendorGroup] = useState<string | null> (null);

    return (    
        <div className="p-6 space-y-6">
            <Card>
               <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                    Vendors
                    </CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus size={16} />
                                Add Vendor
                            </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Add New Vendor
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-3">
                                        <div>
                                            <Label>Vendor Name</Label>
                                            <Input
                                            name="name"
                                            placeholder="e.g. Amazon Web Services"
                                            value={form.name}
                                            onChange={handleInput}
                                            />
                                        </div>

                                        <div>
                                            <Label>Vendor Category</Label>
                                            <Input 
                                            name="category"
                                            placeholder="e.g. Cloud Services"
                                            value={form.category}
                                            onChange={handleInput}
                                             />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>
                                                    Outgoing Min
                                                </Label>
                                                <Input
                                                name="outgoingMin"
                                                type="number"
                                                placeholder="e.g.500"
                                                value={form.outgoingMin}
                                                onChange={handleInput}
                                                />
                                            </div>

                                            <div>
                                                <Label>
                                                    Outgoing Max
                                                </Label>
                                                <Input 
                                                name="outgoingMax"
                                                type="number"
                                                placeholder="e.g.50000"
                                                value={form.outgoingMax}
                                                onChange={handleInput}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label>
                                                    Incoming Min
                                                </Label>
                                                <Input
                                                name="incomingMin"
                                                type="number"
                                                placeholder="e.g. 100"
                                                value={form.incomingMin}
                                                onChange={handleInput}
                                                 />
                                            </div>
                                            <div>
                                                <Label>
                                                    Incoming Max
                                                </Label>
                                                <Input
                                                name="incomingMax"
                                                type="number"
                                                placeholder="e.g. 10000"
                                                value={form.incomingMax} 
                                                onChange={handleInput}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>
                                                Frequency (Per Month)
                                            </Label>
                                            <Input
                                            name="frequencyPerMonth"
                                            type="number"
                                            placeholder="e.g. 1"
                                            value={form.frequencyPerMonth}
                                            onChange={handleInput}
                                             />
                                        </div>

                                        <div>
                                            <Label>
                                                Weekend Activity(%)
                                            </Label>
                                            <Input 
                                            name="weekendActivity"
                                            type="number"
                                            placeholder="e.g. 20"
                                            value={form.weekendActivity}
                                            onChange={handleInput}
                                            />
                                        </div>

                                        <Button onClick={handleAddVendor} className="w-full">
                                            Save Vendor
                                        </Button>
                                    </div>
                            </DialogContent>
                    </Dialog>
               </CardHeader>

               <CardContent>
                {
                    vendors.length === 0 ?(
                        <p className="text-sm text-ghray-500">
                            No Vendors added yet
                        </p>
                    ) :(
                        <div className="grid gap-3">
                            {
                                vendors.map((v, a) => (
                                    <div
                                    key={a}
                                    className="border p-3 rounded-lg bg-gray-50 flex flex-col"
                                    >
                                        <div className="font-medium">
                                            {v.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Category: {v.category}
                                        </div>
                                        <div className="text-sm text-gray-700 space-y-1">
                                            <div>
                                                Frequency: {v.frequencyPerMonth} time(s) /month
                                            </div>
                                            <div>
                                                outgoing: ₹{v.outgoingMin} - ₹{v.outgoingMax} 
                                            </div>
                                            <div>
                                                Incoming: ₹{v.incomingMin} - ₹{v.incomingMax}
                                            </div>
                                            <div>
                                                Weekend Activity: {v.weekendActivity}%
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    ) }
               </CardContent>
               </Card>
        

        {/*
                {selectedVendorGroup && (
            <div className="rounded-2xl border p-6 bg-white">
            */}
            {/* Header */}
            {/*<div className="flex items-center justify-between mb-4">
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
            </div>*/}

            {/* Search Bar */}

            {/*<div>
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3"/>
                <input 
                type="text"
                placeholder="Search vendors..." 
                className="w-full rounded-full border pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>*/}

            {/* Empty State */}
           {/* <div className="flex flex-col items-center justify-center text-gray-500 py-12">
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
        </div>*/}
        </div>
    );
}