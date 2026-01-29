import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Fetch single generator stateemnt by ID
export async function GET(_req: Request, ctx: {params: Promise<{id: string}>}) {
    try {
        const {id} = await ctx.params;
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
      let statementRecord = await db.collection("bankStatements").findOne({
            generatorId: id  // Match generatorId field
        });

        
        if (!statementRecord) {
            // FALLBACK: Check generator collection too
            statementRecord = await db.collection("generator").findOne({
                _id: new ObjectId(id)
            });
        }


        if (!statementRecord) {
            return NextResponse.json({
                success: false,
                message: "Generator not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
              statement: statementRecord,
                periodStart: statementRecord.periodStart,
                periodEnd: statementRecord.periodEnd
            }
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

export async function PUT(req: Request, { params }: {params: {id: string}}) {
  try {

    const { id } = params;
    const { mergedHtml } = await req.json();  

    if (!mergedHtml) {
      return NextResponse.json(
        { success: false, message: "mergedHtml missing"},
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myAccountDB");

    const result = await db.collection("generator").findOneAndUpdate(
      {_id: new ObjectId(id) },
      {
        $set: { "statement.html": mergedHtml }
      },
      {returnDocument: "after"}
    );

    if (!result || !result.value) {
  return NextResponse.json(
    { success: false, message: "Generator not found" },
    { status: 404 }
  );
}
    return NextResponse.json({ 
        success: true, 
        data: result.value 
    });
  } 
  catch (error) {
    console.error("UPDATE GENERATOR ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}