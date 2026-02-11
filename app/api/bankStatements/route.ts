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
    try {
        const body = await req.json();
    const client = await clientPromise;
    const db = await client.db("myAccountDB");
    const doc = {
        companyId: body.companyId,
        companyName: body.companyName,
        generatorId: body.generatorId,
        periodStart: body.periodStart,
        periodEnd: body.periodEnd,
        createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),

        transactions: body.transactions || [],
        transactionCount: body.transactionsCount ?? (body.transactions?.length || 0),
        openingBalance: body.openingBalance,
        closingBalance: body.closingBalance,
    };
    await db.collection("bankStatements").insertOne(doc);

    return NextResponse.json({
        success: true
    });
    }
    catch(error: any) {
        console.error("bankStatements POST error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}