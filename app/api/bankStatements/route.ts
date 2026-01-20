// Backend Code for bank statement API - For Recent Generations UI

import clientPromise from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET(req: Request) {

    try {
        const {searchParams} = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "5");
        const client = await clientPromise;
        const db = client.db("myAccountDB");

        const statements = await db.collection("bankStatements").find({})
        .sort({createdAt: -1})
        .limit(limit)
        .toArray();

        const data = statements.map((s: any) => ({
            id: s.generatorId || s._id.toString(),
            companyName: s.companyName,
            transactions: s.transactionCount || 0, // Map transactionCount - transactions
            date: new Date(s.createdAt).toLocaleDateString("en-GB"),
            pdfUrl: "",
            periodStart: s.periodStart,
            periodEnd: s.periodEnd,
        }));

        return NextResponse.json({
            success: true,
            data
        });
    }
    catch(error: any) {
        console.error("API Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
    

export async function POST(req: Request) {
    const body = await req.json();
    const client = await clientPromise;
    const db = await client.db("myAccountDB");
    const statement = await db.collection("bankStatements").insertOne(body);
    return NextResponse.json({
        success: true
    });
}