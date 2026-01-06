import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try{
        const {searchParams} = new URL(req.url);
        const template = searchParams.get("template");

        if(!template) {
            return NextResponse.json({
                error: "Template not exists"
            }, {
                status: 400
            });
        }

        const client = await clientPromise;
        const db = client.db("myAccountDB");

        // find the latest statement from template as we don't have a template field in bank statements
        const statement = await db.collection("bankStatements")
        .find({})
        .sort({date: -1})
        .limit(1)
        .toArray();

        if(!statement || statement.length === 0) {
            return NextResponse.json({statement: null});
        }

        // return only one(the newest)
        return NextResponse.json({statement: statement[0]});
    }
    catch(error){
        console.error("Error fetching statement:", error);
        return NextResponse.json({
            error: "Failed to fetch latest statement"
        }, {
            status: 500
        });
    }
}