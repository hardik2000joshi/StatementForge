import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {transactionIds, companyId, periodStart, periodEnd} = await req.json();

        if(!transactionIds || transactionIds.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No transactions selected"
            });
        }

        const client = await clientPromise;
        const db = client.db("myAccountDB");

        const statement = await db.collection("bankStatements")
        .findOne({
            companyId,
            "accountInfo.periodStart": periodStart,
            "accountInfo.periodEnd": periodEnd,
            });

            if (!statement) {
                return NextResponse.json({
                    success: false,
                    message: "Statement not found"
                });
            }

            const allTxns = statement.transactions || [];

            // filter by ids you stored in the statement
            const selectedTransactions = allTxns.filter((t:any) =>
                transactionIds.includes(String(t.id ?? t._id))
            );

            const totalAmount = selectedTransactions.reduce(
                (sum: number, t:any) => sum + Number(t.amount || t.credit || -t.debit || 0), 0
            );

        // create new invoice entry
        const invoice = {
            companyId,
            createdAt: new Date(),
            periodStart,
            periodEnd,
            transactions: selectedTransactions,
            totalAmount,
        };

        const result = await db.collection("invoices").insertOne(invoice);

        return NextResponse.json({
            success: true,
            invoiceId: result.insertedId.toString()
        });
    }
    catch(error) {
        console.error("Invoice Creation Error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        });
    }
}