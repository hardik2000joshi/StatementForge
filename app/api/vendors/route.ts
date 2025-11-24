 // Backend (API) code of vendors 
// derive categories from vendor categories page 

import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Convert vendor doc and nested category fields to client-friendly objects
function toClientVendor(doc: any){
    if(!doc) {
        return doc;
    } 
    // category - may be embedded from aggregation(array); normalize it:
    const category = doc.category && Array.isArray(doc.category) && doc.category[0] ? doc.category[0] : doc.category;
    return {
        ...doc,
        _id: doc._id?.toString?.()??doc._id,
        categoryId: doc.categoryId?.toString?.() ?? (category?._id?.toString?.() ?? doc.categoryId),
        category: category
        ?{
            ...category,
            _id: category._id?.toString?.() ?? category._id,
        }
        : undefined,
    };
}
// Get All vendors
// Await can only be used within an async function
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const categoryId = url.searchParams.get("categoryId") ||null;

        const client = await clientPromise;
        const db = client.db("myAccountDB");

        const match: any = {};
        if(categoryId) match.categoryId = new ObjectId(String(categoryId));

        const pipeline: any[] = [
            {$match: match},
            {
                $lookup: {
                    from: "vendorCategories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
        ];

        const items = await db.collection("vendors").aggregate(pipeline).toArray();
        const safe = items.map(toClientVendor);
        return NextResponse.json(safe);
    }
    catch(error) {
        console.error("GET: /api/vendors error:", error);
        return NextResponse.json({
            error: "Failed to fetch vendors"
        }, {
            status: 500
        });
    }
} // Get request finished

// Create new Vendor - POST
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const {
            name,
            categoryId,
            frequencyPerMonth,
            outgoingMin, // Min outgoing Amount
            outgoingMax, // Max Amount
            incomingMin, // Min Incoming Amount
            incomingMax, // Max Amount
            weekendActivity,
        } = data ?? {};

        if (!name || !categoryId) {
            return NextResponse.json({
                error: "Name and Category are required"
            }, {
                status: 400  // not found
            });
        }

        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const result = await db.collection("vendors").insertOne({
            name,
            categoryId : new ObjectId(String(categoryId)),
            frequencyPerMonth,
            outgoingMin,
            outgoingMax,
            incomingMin,
            incomingMax,
            weekendActivity,
            createdAt: new Date(),
        });

        const created = await db.collection("vendors").aggregate([
            {$match: {_id: result.insertedId}},
            {
                $lookup: {
                    from: "vendorCategories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
        ])
        .next();

        return NextResponse.json({
            message: "Vendor added successfully",
            data: toClientVendor(created)
        }, {
            status: 201
        });
    }
    catch(error) {
        console.error("POST: /api/vendors Error:", error);
        return NextResponse.json({
            error: "Failed to create vendor"
        }, {
            status: 500
        });
    }
}    // Post Request finished

// Delete Vendor
export async function Delete(req: Request) {
    try {
        const {id} = (await req.json()) ?? {};
        if (!id) {
            return NextResponse.json({
                error: "ID required"
            }, {
                status: 400
            });
        }
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const result = await db.collection("vendors").deleteOne({
            _id: new ObjectId(String(id)),
        });
        if(result.deletedCount === 0) {
            return NextResponse.json({
                error: "Vendor not found"
            }, {
                status: 404
            });
        }

        return NextResponse.json({
            message: "Vendor deleted successfully"
        }, {
            status: 200
        });
    }

    catch(error) {
        console.error("Delete: /api/vendors Error:", error);
        return NextResponse.json({
            error: "Failed to delete vendor"
        }, {
            status: 500
        });
    }
}