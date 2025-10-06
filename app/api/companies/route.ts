import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import {ObjectId} from "mongodb";


// Get All Companies
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const companies = await db.collection("companies").find().toArray();

        return NextResponse.json({
            success: true,
            data: companies,
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: "Failed to fetch Companies"
        }, {
            status: 500
        });
    }
}

// New Company Created
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const result = await db.collection("companies").insertOne({
            ...body,
            createdAt: new Date(),
        });
        return NextResponse.json(
            {
                success: true,
                insertedId: result.insertedId
        });
    }

    catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to create company"
            }, {
                status: 500
            }
        );
    }
}

// Update a company
export async function PUT(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json({
                success: false,
                error: "Missing ID"
            }, {
                status: 400
            });
        }

        const body = await req.json();
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const result = await db.collection("companies").findOneAndUpdate(
            {
                _id: new ObjectId(id)
            },
            {
                $set: body
            }, // only update required field
            {
                returnDocument: "after"
            }, // return updated doc
        );

        if (!result ||result.value) {
            return NextResponse.json( {
                 success: false,
                error: "Company not found"
            },
            {
                status: 404
            }
            );
        }
        return NextResponse.json({
            success: true,
            data: result.value,
        });
    }
    catch(error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: "Failed to update company"
        }, {
            status: 500
        });
    }
}

// Deleting a company
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if(!id) {
            return NextResponse.json({
                success: false,
                error: "Missing ID",
            }, {
                status: 400,
            });
        }

        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const result = await db.collection("companies").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Company Not found"
                }, {
                    status: 404
                });
        }

        return NextResponse.json({
            success: true
        });
    }

    catch(error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: "Failed to Create Company"
        },
        {
            status: 500
        });
    }
}