// backend code for industries tab

import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// GET - used to get industries from database
export async function GET() {
    try {
    const client = await clientPromise;
    const db = client.db("myAccountDB");
    const docs = await db.collection("industries")
    .find({})
    .sort({createdAt: -1})
    .toArray();

    const data = docs.map((e: any) => ({
        id: e._id.toString(),
        name: e.name,
        description: e.description ?? "",
        }));

        return NextResponse.json({
            success: true,
            data
        });
    }
    catch(error) {
        console.error("GET: /app/api/industries error:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to load selected industries"
        }, {
            status: 500
        });
    }
}

    // POST: Create new industries
    export async function POST(req: Request) {
        try {
            const body = await req.json();
            const name = String(body.name || "").trim();
            const description = String(body.description || "").trim();

            if(!name) {
                return NextResponse.json({
                    success: false,
                    message: "Industry name is required"
                }, {
                    status: 400
                });
            }

            const client = await clientPromise;
            const db = client.db("myAccountDB");
            const docs = await db.collection("industries").findOne({
                name
            });
            if(docs) {
                return NextResponse.json({
                    success: false,
                    message: "Industry with this name already exists"
                }, {
                    status: 400
                });
            }

            const document = {
                name,
                description,
                createdAt: new Date(),
            };
            const result = await db.collection("industries").insertOne(document);

            return NextResponse.json({
                success: true,
                data: {
                    id: result.insertedId.toString(),
                    name,
                    description,
                },
            });
        }
        catch(error) {
            console.error("POST /app/api/industries error:", error);
            return NextResponse.json({
                success: false,
                message: "Failed to create industry"
            }, {
                status: 500
            });     
        }
    }

    export async function DELETE(req: Request) {
        try {
            const {id} = await req.json();
            if(!id) {
                return NextResponse.json({
                    success: false,
                    message: "Industry ID is required",
                }, {
                    status: 400
                });
            }
            const client = await clientPromise;
            // Database- myAccountDB
            const db = client.db("myAccountDB");
            // Collection name
            const docs = await db.collection("industries").deleteOne({
                _id: new ObjectId(id)
            });

            // deletedCount used to confirm that how many documents or records were successfully removed from the database.
            if (docs.deletedCount === 0) {
                return NextResponse.json({
                    success: false,
                    message: "Industry not found"
                }, {
                    status: 404
                });
            }

            return NextResponse.json({
                success: true,
                message: "Industry deleted successfully"
            });
        }
        catch(error) {
            console.error("DELETE /api/industries error:", error);
            return NextResponse.json({
                success: false,
                message: "Failed to delete industry"
            }, {
                status: 500
            });
        }
    }

    // PATCH - to upadate industry name/ description(industry details)
    export async function PATCH(req:Request) {
        try {
            const body = await req.json();
            // storing industry id, name and description in body in db
            const {id, name, description} = body;
            if(!id) {  // if industry id not found in db then it throws an error 400
                return NextResponse.json({
                    success: false,
                    message: "Industry ID is required"
                }, {
                    status: 400
                });
            }

            if(!name?.trim()) {
                return NextResponse.json({
                    success: false,
                    message: "Industry name is required"
                }, {
                    status: 400
                });
            }

            const client = await clientPromise;
            const db = client.db("myAccountDB");

            // check if name already exists (excluding current Industry)            
            const existing = await db.collection("industries").findOne({
                name: name.trim(),
                _id: {$ne: id} // Not equal to current ID
            });

            if (existing) {
                return NextResponse.json({
                    success: false,
                    message: "Industry with this name already exists"
                }, {
                    status: 400
                });
            }

            const result = await db.collection("industries").updateOne({
                _id: id
            }, {
                $set: {
                    name: name.trim(),
                    description: description?.trim() || "",
                    updatedAt: new Date()
                }
            });

            if(result.matchedCount === 0) {
                return NextResponse.json({
                    success: false,
                    message: "Industry not found"
                }, {
                    status: 404
                });
            }
            // else industry updated successfully
            return NextResponse.json({
                success: true,
                message: "Industry updated successfully"
            });
        }
        catch(error){
            console.error("PATCH /api/industries error:", error);
            return NextResponse.json({
                success: false,
                message: "Failed to update industry"
            }, {
                status: 500
            });
        }
    }
