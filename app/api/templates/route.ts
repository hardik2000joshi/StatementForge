import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const templates = await db.collection("templates").find().toArray();

        return NextResponse.json({
            success: true,
            data: templates
        });
    }

    catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch Templates"
        }, {
            status: 500
        });
    }
}

