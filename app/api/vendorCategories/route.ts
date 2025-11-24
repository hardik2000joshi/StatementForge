// Backend API for Vendor Categories Page
// POST- Add new category
// Delete- remove the category

import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

function toClientCategory(doc: any) {
    if(!doc) return doc;
    return {
        ...doc,
        _id: doc._id?.toString?.() ?? doc._id,
    };
}

// GET: Lists all categories
export async function GET(){
    try{
    const client = await clientPromise;
    const db = client.db("myAccountDB");
    const categories = await db.collection("vendorCategories").find({}).toArray();
    const safe = categories.map(toClientCategory);
    return NextResponse.json(safe);
    } 
    catch(error) {
        console.error("Get Error:", error);
        return NextResponse.json({
            error: "Failed to fetch categories"
        }, {
            status: 500
        });
    }
}

// POST: create new category
export async function POST(req: Request) {
    try{
    const data = await req.json();
    const {name, description="", type, color="gray"} = data ?? {};
    if(!name || typeof name !== "string") {
        return NextResponse.json({error: "Name required"}, {status: 400});
    } 
    if (!type || !["Income", "Expense"].includes(type)) {
        return NextResponse.json(
            {error: "Invlid or missing category type"},
            {status: 400}
        );
    }   
    
const client = await clientPromise;
const db = client.db("myAccountDB");

const result = await db.collection("vendorCategories").insertOne({
    name,
    description,
    type, 
    color,
    createdAt: new Date(),
});

const created = await db.collection("vendorCategories").findOne({
    _id: result.insertedId
});

return NextResponse.json({
    message: "Category created successfully",
    data: toClientCategory(created)
}, {
    status: 201
});
}

catch (error) {
    console.error("Post /api/vendorCategoriesError:", error);
    return NextResponse.json({
        error: "Failed to create category"
    }, {
        status: 500
    });
}
}

// Delete: Delete category
export async function DELETE(req: Request){
    try {
          const {id} = (await req.json()) ?? {};
    if (!id) return NextResponse.json({
        error: "ID required"
    }, {
        status: 400
    });
    const client = await clientPromise;
    const db = client.db("myAccountDB");
    const result = await db.collection("vendorCategories").deleteOne({
        _id: new ObjectId(String(id)),
    });

     if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

     return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    }
    catch(error) {
        console.error("Delete Error:", error);
        return NextResponse.json({
            error: "Failed to delete category"
        }, {
            status: 500
        });
    }
}
