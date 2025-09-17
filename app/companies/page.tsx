"use client";

import { Edit, Plus, Trash, X } from "lucide-react";
import { useMemo, useState } from "react";
import countryList from "react-select-country-list";

interface CountryOption {
    value: string;
    label: string;
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([
        "Webnatics LTD",
        "Polytechnics",
    ]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    
    // form states
    const [companyName, setCompanyName] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [industryType, setIndustryType] = useState("");
    const [vatNumber, setVatNumber] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [sortCode, setSortCode] = useState("");
    const [iban, setIban] = useState("");
    const [bic, setBic] = useState("");
    const [currency, setCurrency] = useState("");

    const countryOptions : CountryOption[] = useMemo(
        () => countryList().getData() as CountryOption[],
        []
    );
    const handleAddCompany = () => {
        if (!companyName.trim())
            return;

        setCompanies([...companies, companyName.trim()]);

            setCompanyName("");
            setRegistrationNumber("");
            setIndustryType("");
            setVatNumber("");
            setStreetAddress("");
            setCity("");
            setPostalCode("");
            setCountry("");
            setAccountHolderName("");
            setAccountNumber("");
            setSortCode("");
            setIban("");
            setBic("");
            setCurrency("");
            setShowModal(false);
    };

    const filteredCompanies = companies.filter((c) => 
        c.toLowerCase().includes(search.toLowerCase())
    );
                  

return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    Companies
                </h2>

                    <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus className="h-4 w-4" />
                        Add Company
                    </button>
            </div>

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
                    <div className="flex gap-2">
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

        {/* Modal */}

        {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                    {/* Close Button */}
                    <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-3 right-3 text-gray-800 hover:text-gray-800"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-4">
                        Add New Company
                    </h3>

                    {/* Section: Basic Information */}
                    <h4 className="text-lg font-medium mb-2">
                        Basic Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Company Name */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Company Name
                            </label>
                            <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="border p-2 rounded-lg w-full" 
                        />
                        </div>

                        {/* Registration Number */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Registration Number
                            </label>
                            <input 
                            type="text"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            className="border p-2 rounded-lg w-full" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* industry type */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Industry Type
                            </label>
                            <select
                            defaultValue=""
                            className="border p-2 rounded-lg w-full"
                            >
                            <option value="mobile">
                                Mobile Top-ups
                            </option>
                            <option value="polytech">
                                Polytechnics
                            </option>
                            </select>
                        </div>

                        {/* vat number */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                VAT Number
                            </label>
                            <input 
                            type="number"
                            value={vatNumber} 
                            onChange={(e) => setVatNumber(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                            />
                        </div>
                    </div>

                    {/* section: address information */}
                    <h5 className="text-lg font-medium mb-2">
                        Address Information
                    </h5>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                            Street Address
                        </label>
                        <input 
                        type="text" 
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                        />
                    </div>
                    <br />

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* city */}

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                City
                            </label>
                            <input 
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="border p-2 rounded-lg w-full" 
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Postal Code
                            </label>
                            <input 
                            type="text" 
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                            Country
                        </label>
                        <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                        >
                            <option value="">
                               Select Country
                            </option>

                            {countryOptions.map((c) => (
                                <option 
                                key={c.value}
                                value={c.value}
                                >
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br />

                    {/* section: Bank Details */}
                    <h5 className="text-lg font-medium mb-2">
                        Bank Details
                    </h5>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/*  account holder name */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Account Holder Name
                            </label>
                            <input 
                            type="text"
                            placeholder="Company legal name"
                            value={accountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value)} 
                            className="border p-2 rounded-lg w-full"
                            />
                        </div>

                        {/* account number */}                      
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Account Number
                            </label>
                            <input 
                            type="text"
                            placeholder="12345678"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* sort code */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Sort Code
                            </label>
                            <input 
                            type="text"
                            placeholder="12-34-56" 
                            value={sortCode}
                            onChange={(e) => setSortCode(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                            />
                        </div>

                        {/* IBAN */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                IBAN
                            </label>
                            <input 
                            type="text" 
                            placeholder="GB29 1234 5612 3456 7890"
                            value={iban}
                            onChange={(e) => setIban(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                            />
                        </div>
                    </div>
                    

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* BIC/SWIFT Code */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                BIC/SWIFT Code
                            </label>

                            <input 
                            type="text" 
                            placeholder="SECUGB2L"
                            value={bic}
                            onChange={(e) => setBic(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                            />
                        </div>

                        {/* currency */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">
                                Currency
                            </label>
                            <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="border p-2 rounded-lg w-full"
                            >
                                <option value="GBP">
                                    GBP- British Pound
                                </option>

                                <option value="EUR">
                                    EUR- Euro
                                </option>

                                <option value="USD">
                                    USD- US Dollar
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded-lg border hover:bg-gray-100" 
                        >
                            Cancel
                        </button>
                        <button
                        onClick={handleAddCompany}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Create Company
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}