import clientPromise from "@/lib/db";
import {ObjectId} from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id:string}}) {
    try {
        const templateId = params.id;
        const client = await clientPromise;
        const db = client.db("myAccountDB");

        // Get Template
        const template = await db.collection("templates").findOne({_id: new ObjectId(templateId)});
        if (!template) {
            return NextResponse.json({
                message: "Template not found"
            }, {
                status: 404
            });
        }

        // Get Company Id for Query Params
        const url = new URL(req.url);
        const companyId = url.searchParams.get("companyId");
        if (!companyId) {
            return NextResponse.json(
                {message: "Missing companyId parameter"},
                {status: 400}
            );
        }

        // Fetch Company Info dynamically
        const company = await db.collection("companies").findOne({_id: new ObjectId(companyId)});
        if (!company){
            return NextResponse.json(
                {message: "Company not found"},
                {status: 404}
            );
        }
        // Fetch Transactions for this company
        const transactions = await db.collection("Bank Statement").find({
            companyId: company._id.toString()
        }).toArray();

        // compute statement period, opening/closing balance
        let openingBalance = Number(company.openingBalance ?? 0);
        let balance = openingBalance;
        let totalDebits = 0;

        const sortedTransactions = transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        sortedTransactions.forEach(t => {
            if(t.type === "credit")
                balance += t.amount;
            else {
                balance -= t.amount;
            }
        });

        const statementPeriod = sortedTransactions.length
        ? `${new Date(sortedTransactions[0].date).toLocaleDateString()} - ${new Date(sortedTransactions[sortedTransactions.length-1].date).toLocaleDateString()}`
        : "No Transactions";

        // Replace dynamic variables in HTML Template
        let htmlContent = template.htmlFile;
        htmlContent = htmlContent.replace(/{{companyName}}/g, company.companyName);
        htmlContent = htmlContent.replace(/{{accountNumber}}/g, company.accountNumber);
        htmlContent = htmlContent.replace(/{{accountHolderName}}/g, company.accountHolderName);
        htmlContent = htmlContent.replace(/{{bankName}}/g, company.bankName || "");
        htmlContent = htmlContent.replace(/{{statementPeriod}}/g, statementPeriod);
        htmlContent = htmlContent.replace(/{{openingBalance}}/g, openingBalance.toString());
        htmlContent = htmlContent.replace(/{{balance}}/g, balance.toString());
        htmlContent = htmlContent.replace(/{{totalDebits}}/g, totalDebits.toString());
        htmlContent = htmlContent.replace(/{{}}/g, JSON.stringify(sortedTransactions));

        // Return HTML & CSS
        return NextResponse.json({
            html: htmlContent,
            css: template.cssFile || "",
            transactions: sortedTransactions,
            company,
            statementPeriod,
            openingBalance,
            closingBalance: balance,
            totalDebits
        }, {status: 200});
        }
    catch(err) {
        console.error("Error generating statement", err);
        return NextResponse.json({
            message: "Internal Server Error"
        }, {
            status: 500
        });
    }
}