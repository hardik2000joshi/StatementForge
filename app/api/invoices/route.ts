import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const docs = await db.collection("invoices")
        .find({})
        .sort({createdAt: -1})
        .toArray();

        const data = docs.map((e: any) => ({
            id: e._id.toString(),
            title: e.transactions?.[0]?.description || "Invoice",
            date: e.periodStart,
            created: e.createdAt,
            amount: e.totalAmount,
            transactions: e.transactions || [],
        }));
        
        return NextResponse.json({
            success: true,
            data
        });
    }
    catch(error) {
        console.error("Fetch Invoices Error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to load invoices",
        });
    }
}