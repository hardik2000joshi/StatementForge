"use client";

interface LineItem {
    description: string;
    qty: number;
    price: string;
    amount: string;
}
export default function InvoiceTemplatePage({templateName} : {templateName: string}) {
    // Sample Invoice Data
    const lineItems: LineItem[] = [
        {
            description: "DTH Recharge",
            qty: 1,
            price: "53.00",
            amount: "53.00"
        },

        {
            description: "IT Support Services (Hours)",
            qty: 2,
            price: "150.00",
            amount: "300.00"
        },

        {
            description: "Software License (Annual)",
            qty: 2,
            price: "120.00",
            amount: "240.00"
        },
        ];

        // Summary Data
        const subtotal = 593.00;
        const taxRate = 0.05;
        const taxAmount = subtotal * taxRate;
        const total = subtotal + taxAmount;
        
        return(
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto border border-gray-200">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-blue-700">
                        Invoice
                    </h1>
                    <div className="text-right">
                        <p>
                            Invoice No. 2025-620552
                        </p>

                        <p className="text-sm">
                            Date: 2025-08-20                        
                            </p>

                            <p className="text-sm">
                                Due: 2025-09-20
                            </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* From: Seller Details */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2 border-b">
                            FROM (Seller)
                        </h3>
                        <p>
                            Jim Stevenson
                        </p>
                        <p className="text-sm">
                            info@itopups.com
                        </p>
                        <p className="text-sm">
                            208 Swamp Fox Drive, Fort Mill SC, US
                        </p>
                    </div>

                    {/* To: Buyer Details */}
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2 border-b">
                            To (Buyer)
                        </h3>

                        <p>
                            IUNICONNECT TECHNOLOGIES
                        </p>

                        <p className="text-sm">
                            OfficeC1-1F, Ajman Free Zone, UAE
                        </p>
                    </div>
                </div>

                <table className="w-full border-collapse text-sm mb-8">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">
                                Description
                            </th>
                            <th className="border px-4 py-2 w-16">
                                QTY
                            </th>
                            <th className="border px-4 py-2 w-24 text-right">
                                Price
                            </th>
                            <th className="border px-4 py-2 w-24 text-right">
                                Amount
                            </th>
                            </tr>
                    </thead>

                    <tbody>
                        {lineItems.map((item, index) => (
                            <tr 
                            key={index} 
                            className="hover:bg-gray-500"
                            >
                                <td className="border px-4 py-2">
                                    {item.description}
                                </td>

                                <td className="border px-4 py-2 text-center">
                                    {item.qty}
                                </td>

                                <td className="border px-4 py-2 text-right">
                                    {item.price}
                                </td>

                                <td className="border px-4 py-2 text-right">
                                    {item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium">
                            Subtotal: 
                        </span>
                        <span>
                            ${subtotal.toFixed(2)}
                        </span> 
                    </div>

                    <div className="flex justify-between">
                        <span className="font-medium">
                            Tax (5.00%):
                        </span>
                        <span>
                            ${taxAmount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 border-blue-200">
                        <span>
                            TOTAL:
                        </span>
                        <span>
                            ${total.toFixed(2)} USD
                        </span>
                    </div>
                </div>
            </div>
            </div>
        );
    }

