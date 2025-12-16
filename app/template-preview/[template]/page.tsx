"use client";

import { sampleBankCSS } from "@/app/utils/samplePreview/sampleBankCSS";
import { sampleBankHTML } from "@/app/utils/samplePreview/sampleBankHtml";
import { Sample_Transactions } from "@/app/utils/samplePreview/sampleTransaction";
import React,{ useEffect, useState } from "react";

export default function TemplatePreviewPage({ params }: { params: Promise<{ template: string }> }) {
    const resolvedParams = React.use(params);
    const templateName = decodeURIComponent(resolvedParams.template);

    const [html, setHtml] = useState<string>("Loading...");
    const [css, setCss] = useState<string>("");

    useEffect(() => {
        let htmlContent = sampleBankHTML;

        // Insert sample transactions
        const rows = Sample_Transactions.map((t: any) => {
            const formattedDate = new Date(t.date).toLocaleDateString("en-GB");
            const amount = Number(t.amount)
            const isDebit = amount < 0;

            return `
            <tr>
            <td>
            ${formattedDate}
            </td>
            <td> 
            ${t.description}
            </td>
            <td style ="text-align:right">
            ${isDebit ? "-" : "+"}£ ${Math.abs(amount)}
            </td>
            <td style="text-align:right">
            £${t.balance}
             </td>
            <td> 
            ${isDebit ? "Expense" : "Income"}
            </td>
            </tr>
            `;
        }).join("");

        htmlContent = htmlContent.replace(/{{transactions}}/g, rows);

        // fill dummy values
        htmlContent = htmlContent
        .replace(/{{companyName}}/g, "Webnatics Ltd.")
        .replace(/{{bankName}}/g, "HSBC Bank")
        .replace(/{{accountNumber}}/g, "1234567890")
        .replace(/{{periodStart}}/g, "01/01/2025")
        .replace(/{{periodEnd}}/g, "07/01/2025")
        .replace(/{{openingBalance}}/g, "50000")
        .replace(/{{closingBalance}}/g, "47500")
        .replace(/{{totalTransactions}}/g, Sample_Transactions.length.toString());

        setHtml(htmlContent);
        setCss(sampleBankCSS);
    }, []);

    return(
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">
               Template Preview- {templateName}
            </h1>

             < style dangerouslySetInnerHTML={{__html: css}}/>
             < div dangerouslySetInnerHTML={{__html: html}}/>
        </div>
    );
}
  