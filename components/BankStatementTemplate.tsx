"use client";

interface Transaction {
    date: string;
    description: string;
    debit: string;
    credit: string;
    balance: string;
}

export default function BankStatementTemplatePage({templateName}: {templateName: string}) {
    // sample data
    const transactions: Transaction[] = [
        {
            date: "2025-09-01",
            description: "Opening Balance",
            debit: "-",
            credit: "-",
            balance: "50, 000.00"
        },

        {
            date: "2025-09-02",
            description: "Direct Deposit - Salary",
            debit: "-",
            credit:"15500.00",
            balance: "65500.00"
        },

        {
            date: "2025-09-03",
            description: "ATM Withdrawl - Main Street",
            debit: "2,000.00",
            credit: "-",
            balance: "63,500.00"
        },

        {
            date: "2025-09-05",
            description: "Online Purchase - Amazon",
            debit: "3,800.00",
            credit: "-",
            balance: "59,700.00"
        },

        {
            date: "2025-09-08",
            description: "Credit Card Payment",
            debit: "5,000.00",
            credit: "-",
            balance: "54,700.00"
        },

        {
            date: "2025-09-12",
            description: "Interest Credit",
            debit: "-",
            credit: "15.50",
            balance: "54,715.50" 
        },

        {
            date: "2025-09-15",
            description: "Bill Payment - Electric Co.",
            debit: "250.00",
            credit: "-",
            balance: "54,465.50"
        },

        {
            date: "2025-09-20",
            description: "Deposit - Check",
            debit: "-",
            credit: "1,200.00",
            balance: "55,665.50",
        },

        {
            date: "2025-09-25",
            description: "Bank Service Fee",
            debit: "5.00",
            credit: "-",
            balance: "55,660.50"
        },
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
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
                        Global Trust Bank
                    </p>

                    <p>
                        <strong>
                            Branch:
                        </strong>
                        Downtown Branch
                    </p>

                    <p>
                        <strong>
                            Contact:
                        </strong>
                        1-800-555-1234
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
                John Doe:
            </p>

            <p>
                <strong>
                    Account Number:
                </strong>
                1234567890
            </p>

            <p>
                <strong>
                    Statement Period:
                    </strong> 
                    Sept 2025
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Transaction History
            </h3>

                    <table className="w-full border-collapse mt-6 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">
                                    Date
                                </th>

                                <th className="border px-4 py-2">
                                    Description
                                </th>

                                <th className="border px-4 py-2">
                                    Debit (Withdrawl)
                                </th>

                                <th className="border px-4 py-2">
                                    Credit (Deposit)
                                </th>

                                <th className="border px-4 py-2">
                                    Balance
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                transactions.map((txn, idx) => {
                                    return(
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">
                                            {txn.date}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {txn.description}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {txn.debit}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {txn.credit}
                                        </td>

                                        <td className="border px-4 py-2">
                                            {txn.balance}
                                        </td>
                                    </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <div className="mt-6 text-sm p-4 bg-gray-100 rounded-lg">
                        <h4 className="font-semibold mb-2">
                            Summary
                        </h4>

                        <p>
                            Closing Balance: $55,660.50
                        </p>

                        <p>
                            Total Debits:$11,055.00
                        </p>
                    </div>

        </div>
    );
}