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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, category, htmlFile, cssFile } = body;

        if (!name || !category) {
            return NextResponse.json({
                success: false,
                error: "Missing Fields"
            }, {
                status: 400
            });
        }

        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const result = await db.collection("templates").insertOne({
            name,
            category, // Invoice or Bank Statement
            htmlFile: htmlFile || null,
            cssFile: cssFile || null,
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            insertedId: result.insertedId
        });
    }

    catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: "Failed to Create Template"
        }, {
            status: 500
        });
    }
}

