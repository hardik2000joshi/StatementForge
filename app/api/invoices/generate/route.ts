import clientPromise from "@/lib/db";
import jsPDF from "jspdf";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    const { companyId, selectedTransactionIds, templateName } = await req.json();

    if (!companyId || !selectedTransactionIds || !templateName) {
        return NextResponse.json({
            success: false,
            message: "Missing Parameters"
        });
    }

    const client = await clientPromise;
    const db = client.db("myAccountDB");

    // Fetch Statement Data
    const statement = await db.collection("bankStatements").findOne({
        companyId: companyId
    });
    if (!statement) {
        return NextResponse.json({
            success: false,
            message: "Statement not found"
        });
    }

    // Filter selected transactions
    const selectedTransactions = statement.transactions.filter((t: any) =>
        selectedTransactionIds.includes(t.id)
    );

    // Fetch Templates from Database
    const template = await db.collection("templates").findOne({
        name: templateName
    });
    if (!template)
        return NextResponse.json({
            success: false,
            message: "Template not found"
        });

    // Replace placeholders in HTML Template
    let htmlContent = template.htmlFile;
    htmlContent = htmlContent.replace(/{{bankName}}/g, statement.accountInfo.bankName);
    htmlContent = htmlContent.replace(/{{accountHolder}}/g, statement.accountInfo.accountHolder);
    htmlContent = htmlContent.replace(/{{accountNumber}}/g, statement.accountInfo.accountNumber);
    htmlContent = htmlContent.replace(/{{closingBalance}}/g, statement.accountInfo.closingBalance);

    const txnHtml = selectedTransactions.map((txn: any) => `
    <tr>
     <td>
     <input type="checkbox" class="txn-checkbox" data-id="${txn.id}"/>
     </td>
    <td>
    ${txn.date}
    </td>
    <td>
    ${txn.description}
    </td>
    <td class="${txn.credit ? 'Income' : 'Expenese'}">
    ${txn.credit || txn.debit}
    </td>
    <td>
    ${txn.balance}
    </td>
    <td>
    ${txn.credit ? 'Income' : 'Expense'}
    </td>
    </tr>
    `).join('');

    htmlContent = htmlContent.replace(/{{transactions}}/g, txnHtml);

    // generate PDF using jsPDF
    const doc = new jsPDF();
    doc.html(htmlContent, {
        callback: (doc) => {
            const pdf =doc.output("blob");
        }
    });

    return NextResponse.json({
        success: true,
        html: htmlContent
    });
}