"use client";

import { HtmlContext } from "next/dist/shared/lib/html-context.shared-runtime";
import { useEffect, useState } from "react";

// Define data structures for dynamic fetching
interface AccountInfo {
    bankName: string;
    branch: string;
    contact: string;
    accountHolder: string;
    accountNumber: string;
    statementPeriod: string;
    closingBalance: string;
    totalDebits: string;
}

interface Transaction {
    id: string;
    date: string;
    description: string;
    debit: string;
    credit: string;
    balance: string;
}

interface statementData {
    accountInfo: AccountInfo;
    transactions: Transaction[];
}

interface Template {
    _id?: string;
    name: string;
    category: string;
    htmlFile?: string;
    cssFile?: string;
}

    interface Props {
        templateName: string;
        selectedCompanyId: string;
    }

    export default function BankStatementTemplatePage({templateName, selectedCompanyId}: Props) {
    const [statementData, setStatementData] = useState<statementData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [template, setTemplate] = useState<Template | null>(null); // new state
    
    // state for user selection
    const [selectedIds, setSelectedIds] = useState<string[]>([]); 

    // Dynamic data fetching
    useEffect(() => {
        if (!selectedCompanyId || !templateName)
            return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const statementRes = await fetch(`/api/bankStatements/currentPeriod?companyId=${selectedCompanyId}`);
                if(!statementRes.ok) {
                    throw new Error("Failed to load statement");
                }
               const statementData:statementData = await statementRes.json();
               setStatementData(statementData);

               // fetch template by name
               const templateRes = await fetch(`api/templates?name=${encodeURIComponent(templateName)}`);
               const templateJson = await templateRes.json();
               if(templateJson.success && templateJson.data.length>0) {
                setTemplate(templateJson.data[0]);
               } else {
                setTemplate(null);
               }
            }
            catch(err) {
                console.error("Error fetching statement:", err);
                setStatementData(null);
                setTemplate(null);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [selectedCompanyId, templateName]);

    // Selection Handler
    const handleSelect = (id: string, isChecked: boolean) => {
        setSelectedIds(prev => 
            isChecked ? [...prev, id] : prev.filter(tid => tid !== id)
        );
    };

    // Invoice Generation Handler
    const handleGenerateInvoice = async () => {
        if (!statementData || selectedIds.length === 0) 
            return;
        // Full transaction objects that were selected
        const itemsToInvoice = statementData.transactions.filter(t => selectedIds.includes(t.id));

        try {
            const res = await fetch('/api/invoices/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transactions: itemsToInvoice,
                    companyId: selectedCompanyId, templateName
                })
            }); 
            if(!res.ok)
                throw new Error("Failed to generate invoice");

            const data = await res.json();
            alert(`Invoice generated successfully for ${itemsToInvoice.length} transaction(s)!`);
            console.log("Invoice Data:", data); 
        }
        catch (err) {
            console.error(err);
            alert("Error generating invoice.");
        }
        // send `itemsToInvoice` data to your backend API
        console.log("Invoice items ready to be sent to backend:", itemsToInvoice);
    };

    if (isLoading) {
        return(
        <div className="p-10 text-center text-lg">
            Loading Bank Statement Data...
        </div>
        );
    }

     if(!statementData) {
        return(
        <div className="p-10 text-center text-red-600">
            Failed to load statement data. Please ensure the 'Bank Statement' collection exists in your 'database'.
        </div>
        );
    }


    if (!template || !template.htmlFile){
        alert("Template HTML Not Found");
        return;
    }

    const {accountInfo, transactions} = statementData;
        const selectedCount = selectedIds.length;
    if (template.htmlFile) {
        let htmlContent = template.htmlFile;
    htmlContent = htmlContent.replace(/{{companyName}}/g, statementData.accountInfo.accountHolder);
    htmlContent = htmlContent.replace(/{{bankName}}/g, statementData.accountInfo.bankName);
    htmlContent = htmlContent.replace(/{{accountNumber}}/g, statementData.accountInfo.accountNumber);
    htmlContent = htmlContent.replace(/{{statementPeriod}}/g, statementData.accountInfo.statementPeriod);
    htmlContent = htmlContent.replace(/{{openingBalance}}/g, statementData.accountInfo.totalDebits);
    htmlContent = htmlContent.replace(/{{closingBalance}}/g, statementData.accountInfo.closingBalance);

    // Replace transactions placeholder
    const txnHTML = transactions.map(txn => `
        <tr>
            <td>
                ${txn.date}
            </td>
            <td>
                ${txn.description}
            </td>
            <td className="${txn.debit ? 'Expense' : txn.credit ? 'Income' : ''}">
                ${txn.debit || txn.credit}
            </td>
            <td>
                ${txn.balance}
            </td>
            <td>
                ${txn.credit ? "Income" : "Expense"}
            </td>
        </tr>
    `).join('');

    htmlContent = htmlContent.replace(/{{transactions}}/g, txnHTML);

    // Inject CSS dynamically
    if (template.cssFile) {
        htmlContent = htmlContent.replace('</head>', `<style>${template.cssFile}</style></head>`);
    }
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
            {/* Add Generate Invoice Button */}
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg border mb-6">
                <div className="font-medium text-gray-700">
                    <span className="text-blue-600 font-bold">
                        {selectedCount}
                    </span>
                    transaction
                    {selectedCount !== 1 ? 's' : ''}
                    selected
                </div>

                <button 
                onClick={handleGenerateInvoice}
                disabled={selectedCount === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition $ {
                    selectedCount>0 ? 'bg-blue-600 hover:bg-blue-700' : "bg-gray-400 cursor-not-allowed"}`}
                >
                    Generate Invoice
                </button>
            </div>

            <h1 className="text-2xl font-bold text-center mb-4">
                {templateName} - Statement of Account
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* From: Bank Details: (The Issuer) */}
                <div className="p-3 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2 text-blue-700">
                        Bank Information (From)
                    </h3>
                    <p>
                        <strong>
                            Bank Name:
                        </strong>
                        {accountInfo.bankName}
                    </p>

                    <p>
                        <strong>
                            Branch:
                        </strong>
                        {accountInfo.branch}
                    </p>

                    <p>
                        <strong>
                            Contact:
                        </strong>
                        {accountInfo.contact}
                    </p>
                </div>

                {/* To: Customer Details (The Recepient) */}
                <div className="p-3 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold text-lg mb-2 text-green-700">
                        Account Holder (To)
                    </h3>

                        <p>
                <strong>
                    Account Holder:
                </strong>
                {accountInfo.accountHolder}
            </p>

            <p>
                <strong>
                    Account Number:
                </strong>
                {accountInfo.accountNumber}
            </p>

            <p>
                <strong>
                    Statement Period:
                    </strong> 
                    {accountInfo.statementPeriod}
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Transaction History
            </h3>

                    <table className="w-full border-collapse mt-6 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 w-10">
                                    Select
                                </th>

                                <th className="border px-4 py-2">
                                    Date
                                </th>

                                <th className="border px-4 py-2">
                                    Description
                                </th>

                                <th className="border px-4 py-2">
                                    Debit(Withdrawl)
                                </th>

                                <th className="border px-4 py-2">
                                    Credit(Deposit)
                                </th>

                                <th className="border px-4 py-2">
                                    Balance
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                (transactions).map((txn: Transaction) => (
                                    <tr key={txn.id} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2 text-center">
                                            {/* Checkbox for selection */}
                                            <input 
                                            type="checkbox"
                                            checked={selectedIds.includes(txn.id)} 
                                            onChange={(e) => handleSelect(txn.id, e.target.checked)}
                                            // Disable selection for non-transactional Opening balance
                                            disabled = {txn.description === "OpeningBalance"}
                                            />  
                                        </td>

                                        <td className="border px-4 py-2">
                                            {txn.date}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {txn.description}
                                        </td>

                                        <td className={`border px-4 py-2 ${txn.debit ? 'Expense' : ''}`}>
                                            {txn.debit}
                                        </td>

                                        <td className={`border px-4 py-2 ${txn.credit ? 'Income' : ''}`}>
                                            {txn.credit}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {txn.balance}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    <div className="mt-6 text-sm p-4 bg-gray-100 rounded-lg">
                        <h4 className="font-semibold mb-2">
                            Summary
                        </h4>

                        <p>
                            Closing Balance: ${accountInfo.closingBalance}
                        </p>

                        <p>
                            Total Debits:${accountInfo.totalDebits}
                        </p>
                    </div>

        </div>
    );
}