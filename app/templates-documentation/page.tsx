"use client";

export default function TemplateDocumentationPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">
                Template Documentation
            </h1>

            <p className="text-gray-700 mb-8">
                This guide explains how to create and upload custom <code>.html</code> and <code>.css</code> templates <br />
                for invoices and and bank statements.
            </p>

            {/* Section: Placeholders */}
            <h2 className="text-2xl font-semibold mb-4">
                Available Placeholders
            </h2>

            <table className="w-full border border-gray-300 mb-8">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-2 text-left">
                            Placeholder
                        </th>
                        <th className="border px-4 py-2 text-left">
                            Description
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className="border px-4 py-2">
                            <code>
                                Company Name
                            </code>
                        </td>

                        <td className="border px-4 py-2">
                            The name of the company                        
                            </td>
                    </tr>

                    <tr>
                        <td className="border px-4 py-2">
                            <code>
                                Account Number
                            </code>
                        </td>

                        <td className="border px-4 py-2">
                            Customer account number
                        </td>
                    </tr>

                    <tr>
                        <td className="border px-4 py-2">
                            <code>
                                Transactions
                            </code>
                        </td>

                        <td className="border px-4 py-2">
                            <code>
                                A list of all transactions
                            </code>
                        </td>
                    </tr>

                    <tr>
                        <td className="border px-4 py-2">
                            <code>
                                Amount
                            </code>
                        </td>

                        <td className="border px-4 py-2">
                            Invoice or statement amount
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* Section: HTML Templates */}

            <h2 className="text-2xl font-semibold mt-6 mb-4">
                HTML Templates
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                    Use placeholders like <code>Company Name</code> or <code> transactions</code>.
                    </li>

                    <li>
                        Keep it clean with semantic HTML (div, table, span).
                    </li>

                    <li>
                        File size: up to 5MB, must be <code>.html</code>.
                    </li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-2">
                CSS Styling
            </h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>
                    Upload a <code>.css</code> file for styling.
                </li>
                <li>
                    Use <code>@media print</code> for PDF layouts.
                </li>
                <li>
                    File size: up to 2MB.
                </li>
            </ul>
        </div>
    );
}