import clientPromise from "@/lib/db";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    {params} : {params: {id: string}}
) {
    try {
        const {id} = params;
        if(!ObjectId.isValid(id)){
            return NextResponse.json({
                success: false,
                message: "Invalid Company Id"
            }, {
                status: 400
            });
        }

        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const company = await db.collection("companies").findOne({
            _id: new ObjectId(id)
        });

        if (!company) {
            return NextResponse.json({
                success: false,
                message: "company not found"
            }, {
                status: 404
            });
        }
        return NextResponse.json({
            success: true,
            data: company
        });
    }
    catch(error) {
        console.error("Error fetching company:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch company"
        }, {
            status: 500
        });
    }
}

