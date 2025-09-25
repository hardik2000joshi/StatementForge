"use client";

import {Building2, File, FileText, Globe, Mail, PenTool, UserIcon } from "lucide-react";
import { useState } from "react";

// Mock data to stimulate user details and activity
const mockUser = {
    name: "John Doe",
    email: "john.doe@finhelper.com",
    role: "QA Head",
    organization: "Finhelper, Inc.",    
};

const mockActivity = [
    {
        type: "Statement Generated",
        company: "Webnatics LTD",
        date: "2024-09-18",
        transactions: "150"
    },
    {
        type: "Template Uploaded",
        template: "UK-Standard-Statement",
        date: "2024-09-17"
    },
    {
        type: "Company Updated",
        company: "Fintech Solutions",
        date: "2024-09-16"
    },
    {
        type: "Statement Generated",
        company: "Paymate India Ltd",
        date: "2024-09-15",
        transactions: "85"
    },
];

const mockSummary = {
    companiesCreated: 3,
    templatesUploaded: 5,
    statementsGenerated: 20,
};

export default function UserPage() {
    const [currency, setCurrency] = useState("USD");
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="flex-1 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4"> 
                <UserIcon className="h-8 w-8 text-blue-600"/>
                <h1 className="text-3xl font-bold text-gray-900">
                    User Profile
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-50">

                {/* Account Details */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                        Account Details
                    </h2>

                    <div className="space-y-3 text-gray-600">

                        <div className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                            <span>
                                {mockUser.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>
                                {mockUser.email}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>
                                {mockUser.organization}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                                Role:
                            </span>
                            <span>
                                {mockUser.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Settings & Preferences */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5 text-gray-500" />
                        Preferences
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label 
                            htmlFor="currency"
                            className="block text-sm font-medium text-gray-700"
                            >
                                Display Currency
                            </label>
                            <select 
                            id="currency"
                            name="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                                <option value="usd">
                                    USD
                                </option>
                                <option value="eur">
                                    EUR
                                </option>
                                <option value="gbp">
                                    GBP
                                </option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                                Dark Mode
                            </span>
                            <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                darkMode ? "bg-blue-600" : "bg-gray-200"
                            }`}
                            >
                                <span 
                                className={
                                    `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        darkMode ? "translate-x-6" : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                </div>

                {/* Summary Statistics */}

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4"> 
                        <FileText className="h-5 w-5 text-gray-500"/>
                        Summary
                    </h2>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">
                                {mockSummary.companiesCreated}
                            </p>

                            <p className="text-sm text-gray-600">
                                Companies
                            </p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">
                                {mockSummary.templatesUploaded}
                            </p>

                            <p className="text-sm text-gray-600">
                                Templates
                            </p>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg col-span-2">
                            <p className="text-3xl font-bold text-blue-600">
                                {mockSummary.statementsGenerated}
                            </p>

                            <p className="text-sm text-gray-600">
                                Statements
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="ftext-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <PenTool className="h-5 w-5 text-gray-500"/>
                        Quick Actions
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        <button className="flex items-center justify-between p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="text-sm font-medium text-gray-800">
                                Generate New Statement
                            </span>

                            <PenTool className="h-5 w-5 text-gray-500" />
                        </button>

                        <button className="flex items-center justify-between p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="text-sm font-medium text-gray-800">
                                Manage Companies
                            </span>

                            <Building2 className="h-5 w-5 text-gray-500" />
                        </button>

                        <button className="flex items-center justify-between p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="text-sm font-medium text-gray-800">
                                Manage Templates
                            </span>

                            <FileText className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 lg:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <File className="h-5 w-5 text-gray-500" />
                        Recent Activity
                    </h2>

                    <ul className="divide-y divide-gray-200">
                        {
                            mockActivity.map((activity, index) => (
                                <li
                                key={index}
                                className="py-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {activity.type}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {activity.company ? `Company: ${activity.company}` : `Template: ${activity.template}`}
                                            </span>
                                        </div>

                                        <span className="text-xs text-gray-400">
                                            {activity.date}
                                        </span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Authentication & Security */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <UserIcon className="h-5 w-5 text-gray-600" />
                        Authentication
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-gray-600">
                            <span className="text-sm font-medium">
                                Last Login:
                            </span>

                            <span className="text-sm text-gray-500">
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>

                        <button className="w-full text-center py-2 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition:colors">
                            Change Password
                        </button>

                        <button className="w-full text-center py-2 px-4 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors">
                            Log Out                            
                        </button>
                    </div>
                </div>
        </div>
    );
}   

