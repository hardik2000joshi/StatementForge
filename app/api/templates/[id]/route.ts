import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("myAccountDB");

    const result = await db.collection("templates").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, {params}: {params: {id:string}}) {
  try {
    const {id} = params;
    const body = await req.json();
    const {htmlFile, cssFile} = body;

    if (!htmlFile && !cssFile) {
      return NextResponse.json({
        success: false,
        error: "Nothing to update"
      }, {
        status: 400
      });
    }

    const client = await clientPromise;
    const db = client.db("myAccountDB");
    const updateObj: any = {};
    if (htmlFile) updateObj.htmlFile = htmlFile;
    if (cssFile)  updateObj.cssFile = cssFile;

    const result = await db.collection("templates").updateOne(
      {_id: new ObjectId(id)},
      {$set: updateObj}
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Template not found"
      }, {
        status: 404
      });
    }
    return NextResponse.json({success: true});
  }
  catch(error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: "Failed to update Template"
    },{
      status: 500
    });
  }
}