import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myAccountDB");

    // 1) Read all invoices from Mongo, newest first
    const docs = await db
      .collection("invoices")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // 2) Normalize each document into the shape the UI expects
    const data = docs.map((e: any) => ({
      id: e._id.toString(), // string id for the frontend
      title:
        e.transactions?.[0]?.description || // first txn description if present
        e.templateName || // fallback: template name
        "Invoice",
      date: e.periodStart || e.createdAt, // main date to display
      created: e.createdAt,
      amount: e.totalAmount ?? 0, // ensure number, even if missing
      transactions: e.transactions || [],
      companyId: e.companyId,
      periodStart: e.periodStart,
      periodEnd: e.periodEnd,
    }));

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Fetch Invoices Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load invoices",
      },
      { status: 500 }
    );
  }
}
