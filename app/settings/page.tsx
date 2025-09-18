"use client";

import { ArrowLeft, CircleChevronDown, Currency, Info, Settings } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Currency {
    value: string;
    label: string;
}

export default function SettingsPage(){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>({
        value: "GBP",
        label: "£ British Pound (GBP)",
    });

    const currencies: Currency[] = [
        {
            value: "GBP",
            label: "£ British Pound (GBP)"
        },
        {
            value: "USD",
            label: "$ US Dollar (USD)"
        },
        {
            value: "EUR",
            label: "€ Euro (EUR)"
        },
        {
            value: "JPY",
            label: "¥ Japanese Yen (JPY)"
        },
        {
            value: "CAD",
            label: "C$ Canadian Dollar (CAD)"
        },
        {
            value: "AUD",
            label: "A$ Australian Dollar (AUD)"
        },
        {
            value: "CHF",
            label: "CHF Swiss Franc (CHF)"
        },
        {
            value: "CNY",
            label: "¥ Chinese Yuan (CNY)"
        },
    ];

    const handledCurrencySelect = (currency: Currency) => {
        setSelectedCurrency(currency);
        setIsDropdownOpen(false);
    };

    return (
        <div className="p-6">
            <header className="flex items-center gap-2 text-gray-500 mb-6">
                <Link href="/companies" 
                className="flex items-center gap-2 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft  
                    className="h-4 w-4"
                    />
                    Back to Dashboard
                </Link>

                <div className="flex items-center gap-2 ml-4 text-gray-900">
                    <Settings className="h-5 w-5"/>
                    <h1 className="text-xl font-semibold">
                        Settings
                    </h1>
                </div>
            </header>

            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    Currency Settings
                </h2>
                <p className="text-gray-600 mb-6">
                    Configure the default currency for all financial displays and calculations
                </p>

                <div className="mb-6 p-4 border rounded-md bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                        System Currency
                    </p>

                    <div className="relative">
                         {/* This div acts as the styled dropdown button */}
                         <div
                         className="flex items-center justify-between border border-gray-300 p-2 rounded-lg bg-white w-full text-base font-normal text-gray-700 cursor-pointer"
                         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                         >
                            <span>
                                {selectedCurrency.label}
                            </span>
                            <CircleChevronDown
                             className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                             />
                         </div>

                         {/* The Dropdown Options */}
                         {
                            isDropdownOpen && (
                                <ul 
                                className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto"
                                >
                                    {currencies.map((currency) => (
                                        <li
                                        key={currency.value}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handledCurrencySelect(currency)}
                                        >
                                            {currency.label}
                                        </li>
                                    ))}
                                </ul>
                            )
                         }
                    </div>
                </div>

                <div className="mb-6 p-4 border-grey rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview
                    </p>

                    <div className="flex justify-between items-center text-sm mb-1">
                        <span>
                            Small amount:
                        </span>
                        <span>
                            £15.50
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-1">
                        <span>
                            Medium amount:
                        </span>
                        <span>
                            £1,250.75
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span>
                            Large amount:
                        </span>
                        <span>
                            £125,000.00
                        </span>
                    </div>
                </div>

                <div className="flex items-start p-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md">
                    <Info className="h-5 w-5 mr-2"/>
                    <div>
                        <p className="font-semibold mb-1">
                            Currency Change Notice
                        </p>
                        <p>
                            Changing the system currency will affect all new statements and displays. Existing statements will retain their original currency settings.
                        </p>
                    </div>
                </div>

                {/* Application Information */}
                <div className="p-6 bg-white rounded-lg shadow-md mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Application Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">
                                Version:
                            </p>
                            <p className="font-medium text-gray-900">
                                1.0.0
                                </p>
                        </div>

                        <div>
                            <p className="text-gray-600">
                                Environment:
                            </p>
                            <p className="font-medium text-gray-900">
                                Development
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-600">
                                Last Updated:
                            </p>
                            <p className="font-medium text-gray-900">
                                9/18/2025
                            </p>
                        </div>

                        <div>
                            <p className="text-gray-600">
                                Current Theme:
                            </p>
                            <p className="font-medium text-gray-900">
                                Light
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}