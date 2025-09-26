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
            description: "ATM Withdrawl",
            debit: "2000",
            credit: "-",
            balance: "48000"
        },

        {
            date: "2025-09-05",
            description: "Salary Credit",
            debit: "-",
            credit:"50000",
            balance: "98000"
        },

        {
            date: "2025-09-12",
            description: "Online Purchase",
            debit: "3800",
            credit: "-",
            balance: "95000"
        },
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">
                {templateName}
            </h1>
            <p>
                <strong>
                    Account Number:
                </strong>
                1234567890
            </p>
            <p>
                <strong>
                    Account Holder:
                </strong>
                John Doe:
            </p>
             <p>
                <strong>
                    Period:
                    </strong> 
                    Sept 2025
                    </p>

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
                                    Debit
                                </th>

                                <th className="border px-4 py-2">
                                    Credit
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

        </div>
    );
}