"use client";

import { sampleBankCSS } from "@/app/utils/samplePreview/sampleBankCSS";
import { sampleBankHTML } from "@/app/utils/samplePreview/sampleBankHtml";
import { Sample_Invoice } from "@/app/utils/samplePreview/sampleInvoice";
import { sampleInvoiceCSS } from "@/app/utils/samplePreview/sampleInvoiceCSS";
import { sampleInvoiceHTML } from "@/app/utils/samplePreview/sampleInvoiceHtml";
import { Sample_Transactions } from "@/app/utils/samplePreview/sampleTransaction";
import React,{ useEffect, useState } from "react";

export default function TemplatePreviewPage({ params }: { params: Promise<{ template: string }> }) {
    const resolvedParams = React.use(params);
    const templateName = decodeURIComponent(resolvedParams.template);

    const [html, setHtml] = useState<string>("Loading...");
    const [css, setCss] = useState<string>("");

    useEffect(() => {
        const isInvoiceTemplate = templateName.toLowerCase().includes("invoice");

        if(!isInvoiceTemplate) {
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
        return;
        }

        // Invoice Preview
        const subtotal = Sample_Invoice.items.reduce(
            (sum, item) => sum + Number(item.qty) * Number(item.price), 0
        );
        const taxAmount = subtotal * Sample_Invoice.taxRate;
        const total = subtotal + taxAmount;

        let htmlContent = sampleInvoiceHTML;

        htmlContent = htmlContent
        .replace(/{{companyName}}/g, Sample_Invoice.companyName)
        .replace(/{{companyAddress}}/g, Sample_Invoice.companyAddress)
        .replace(/{{invoiceNumber}}/g, Sample_Invoice.invoiceNumber)
        .replace(/{{date}}/g, Sample_Invoice.date)
        .replace(/{{dueDate}}/g, Sample_Invoice.dueDate)
        .replace(/{{clientName}}/g, Sample_Invoice.clientName)
        .replace(/{{clientAddress}}/g, Sample_Invoice.clientAddress)
        .replace(/{{subtotal}}/g, subtotal.toFixed(2))
        .replace(/{{taxRate}}/g, String(Sample_Invoice.taxRate*100))
        .replace(/{{taxAmount}}/g, taxAmount.toFixed(2))
        .replace(/{{total}}/g, total.toFixed(2));

        const itemsHtml = Sample_Invoice.items.map(
            (item) => `
            <tr>
            <td>
            ${item.description}
            </td>
            <td style="text-align:right">
            ${item.qty}
            </td>
            <td style="text-align:right">
            ${Number(item.price).toFixed(2)}
            </td>
            <td style="text-align:right">
            ${(Number(item.qty) * Number(item.price)).toFixed(2)}
            </td>
            </tr>
            `
        ).join("");
        htmlContent = htmlContent.replace(/{{items}}/g, itemsHtml);

        // inject invoice css
        htmlContent = htmlContent.replace(
            "</head>",
            `<style>${sampleInvoiceCSS}</style></head>`
        );

        setHtml(htmlContent);
        setCss(""); // extra CSS already injected into htmlContent
    }, [templateName]);

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
  