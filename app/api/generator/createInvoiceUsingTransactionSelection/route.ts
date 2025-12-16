import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

        const transactions = await db.collection("bankStatements")
        .find({
            _id: {
                $in: transactionIds.map((
            id: string) => new ObjectId(id)
        )}})
        .toArray(); 

        // create new invoice entry
        const invoice = {
            companyId,
            createdAt: new Date(),
            periodStart,
            periodEnd,
            transactions,
            totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0)
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