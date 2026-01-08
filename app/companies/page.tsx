"use client";

import { Edit, FlagTriangleLeft, Plus, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import countryList from "react-select-country-list";

type Industry = {
    id: string;
    name: string;
    description?: string;
};

interface CountryOption {
    value: string;
    label: string;
}

interface Company {
    _id?: string;
    companyName: string;
    registrationNumber: string;
    industryType: string;
    vatNumber: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
    accountHolderName: string;
    accountNumber: string;
    sortCode: string;
    iban: string;
    bic: string;
    currency: string;
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        const res = await fetch("/api/companies");
        const data = await res.json();
        if (data.success) {
            setCompanies(data.data);
        }
        setLoading(false);
    };

    const addCompany = async (company: Company) => {
        const res = await fetch("/api/companies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(company),
        });
        const data = await res.json();
        if (data.success)
            fetchCompanies();
        resetForm();
        setShowModal(false);
        setToastMessage("Company Created Successfully");
        setShowToast(true);
    };

    const [industries, setIndustries] = useState<Industry[]>([]);
    const [loadingIndustries, setLoadingIndustries] = useState(true);
    const [selectedIndustryId, setSelectedIndustryId] = useState<string>("");

    /* useEffect easy syntax:  UseEffect(() => {
    // Used for side effect logic
    }, [dependencies])*/

    useEffect(() => {
        // contains side effect logic
        const fetchIndustries = async() => {
            try {
                setLoadingIndustries(true);
                const response = await fetch("/api/industries");
                const json = await response.json();
                if (!response.ok || !json.success) {   // if response failed or json response not succeed/also failed- then failed to load industries
                    console.error("Failed to load industries", json); // show json error then
                    return;
                }
                setIndustries(json.data || []);
            }
            catch(error) {
                console.error("Error to fetch industries", error); 
            }
            finally {
                setLoadingIndustries(false);
            }
        };

        fetchIndustries();
    }, []);
 
    const updateCompany = async(id: string, company: Company) => {
        const res = await fetch(`/api/companies?id=${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(company),
        });

        const data = await res.json();
        if (data.success) {
            fetchCompanies();
            resetForm();
            setEditingCompanyId(null);
            setShowModal(false);
            setToastMessage("Company Updated Successfully");
            setShowToast(true);
        }
    };

    const deleteCompany = async (id: string) => {
        const res = await fetch(`/api/companies?id=${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
            fetchCompanies();
        setToastMessage("Company Deleted Successfully");
        setShowToast(true);
        }
    };

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false); // New state for toast
    const [toastMessage, setToastMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

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

    const countryOptions: CountryOption[] = useMemo(
        () => countryList().getData() as CountryOption[],
        []
    );

    // New useEffect to handle toast visibility:
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 10000); // Toast disappears after 10 seconds
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const resetForm = () => {
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
    };

     const handleEditClick = (company: Company) => {
    setEditingCompanyId(company._id || null);
    setCompanyName(company.companyName);
    setRegistrationNumber(company.registrationNumber);
    setIndustryType(company.industryType);
    setVatNumber(company.vatNumber);
    setStreetAddress(company.streetAddress);
    setCity(company.city);
    setPostalCode(company.postalCode);
    setCountry(company.country);
    setAccountHolderName(company.accountHolderName);
    setAccountNumber(company.accountNumber);
    setSortCode(company.sortCode);
    setIban(company.iban);
    setBic(company.bic);
    setCurrency(company.currency);
    setShowModal(true);
  };

  const handleSave = () => {
    const companyData: Company = {
      companyName,
      registrationNumber,
      industryType,
      vatNumber,
      streetAddress,
      city,
      postalCode,
      country,
      accountHolderName,
      accountNumber,
      sortCode,
      iban,
      bic,
      currency,
    };

    if (editingCompanyId) {
        updateCompany(editingCompanyId, companyData);
    }
    else {
        addCompany(companyData);
    }
  };

    const handleDeleteClick = (company: Company) => {
      setShowDeleteModal(true);  // show Modal
      setCompanyToDelete(company);  // set which company to delete
    };


  const handleConfirmDelete = () => {
    if (companyToDelete?._id) {
      deleteCompany(companyToDelete._id);
      setShowDeleteModal(false);
      setCompanyToDelete(null);
    }
  };

    const filteredCompanies = companies.filter((c) =>
        c.companyName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    Companies
                </h2>

                <button
                    onClick={() => {
                        resetForm();
                        setEditingCompanyId(null);
                        setShowModal(true);
                    }}
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
                {filteredCompanies.map((c) => (
                    <li
                        key={c._id}
                        className="flex justify-between items-center p-2 border-b"
                    >
                        <span>
                            {c.companyName}
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditClick(c)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                            >
                                <Edit className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => handleDeleteClick(c)}
                                className="p-1 text-red-600 hover:text-red-800"
                            >
                                <Trash className="h-4 w-4" />
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
                            onClick={() => {
                                setShowModal(false);
                                resetForm();
                                setEditingCompanyId(null);
                            }}
                            className="absolute top-3 right-3 text-gray-800 hover:text-gray-800"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Title changes based on mode*/}
                        <h3 className="text-xl font-semibold mb-4">
                            {editingCompanyId ? "Edit Company" : "Add New Company"}
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
                                    value={selectedIndustryId}
                                    onChange={(e) => setSelectedIndustryId(e.target.value)}
                                    className="border p-2 rounded-lg w-full"
                                >
                                    <option value="">
                                        Select an industry
                                    </option>

                                    {loadingIndustries ? (
                                        <option disabled>
                                            Loading...
                                        </option>
                                    ): (
                                        industries.map((industry) => (
                                            <option
                                            key={industry.id} 
                                            value={industry.id}
                                            >
                                                {industry.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>


                            {/* vat number */}

                            <div className="flex flex-col">

                                <label className="text-sm font-medium mb-1">

                                    VAT Number

                                </label>

                                <input
                                    type="text"
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

                            {/* account holder name */}
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
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                    setEditingCompanyId(null);
                                }}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                {editingCompanyId ? "Update Company" : "Create Company"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 transition-all duration-300 ease-in-out z-50">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <h4 className="text-lg font-semibold text-gray-900">
                                Success
                            </h4>
                            <p className="text-sm text-gray-600">
                                {toastMessage}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowToast(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Model */}
            {showDeleteModal && companyToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 relative">
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{companyToDelete.companyName}" ? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => {
                                setShowDeleteModal(false);
                                setCompanyToDelete(null);
                            }}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
