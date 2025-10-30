import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Fetch single generator stateemnt by ID
export async function GET(_req: Request, {params}: {params: {id: string}}) {
    try {
        const {id} = params;
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Missing ID"
            }, {
                status: 400
            });
        }
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const statement = await db.collection("generator").findOne({
            _id: new ObjectId(id)
        });

        if(!statement) {
            return NextResponse.json({
                success: false,
                message: "Statement not found"
            }, {
                status: 404
            });
        }

        return NextResponse.json({
            success: true,
            data: statement
        });
    }

    catch(err) {
        console.error("Error fetching statement:", err);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {
            status: 500
        });
    } 
}