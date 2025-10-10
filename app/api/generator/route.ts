 import clientPromise from "@/lib/db";
import {ObjectId} from "mongodb";
import { NextResponse } from "next/server";
interface GenerationRules {
    txnsPerWeek: number;
    outgoingMin: number;
    outgoingMax: number;
    incomingMin: number;
    incomingMax: number;
    categories: string[];
    style: "basic" | "detailed" | "minimal";
}
// Generate random transactions
function generateTransactions(rules: GenerationRules){
    const transactions:any[] = [];
    for(let i=0; i<rules.txnsPerWeek; i++) {
        // Decide is tranaction incoming or outgoing:
        const isCredit = i % 2 === 0;
        const amount = isCredit ? Math.floor(
            Math.random() * (rules.incomingMax - rules.incomingMin + 1) + rules.incomingMin
        ) : Math.floor(
            Math.random() * (rules.outgoingMax - rules.outgoingMin + 1) + rules.outgoingMin
        );
        const category = rules.categories[Math.floor(Math.random() * rules.categories.length)];
        // Define function randomDateInLastWeek
        function randomDateInLastWeek() {
            const now = new Date();
            const past = new Date();
            past.setDate(now.getDate() - 7);
            return new Date(
                past.getTime() + Math.random() + (now.getTime() - past.getTime())
            );
        }
        // Format based on style
        if (rules.style === 'basic') {
            transactions.push({
                _id: new ObjectId(),
                date: randomDateInLastWeek(),
                description: `Txn ${i+1}`,
                amount,
                type: i % 2 === 0 ? "credit" : "debit",
            });
        }
        else if(rules.style === "detailed") {
            transactions.push({
                _id: new ObjectId(),
                date: randomDateInLastWeek(),
                description: `${category} Purchase`,
                category,
                amount,
                type: i % 2 === 0 ? "credit" :"debit",
                balanceAfter:
                5000 +
                (i % 2 === 0 ? amount: -amount)
            });
        }
        else if(rules.style === "minimal") {
            transactions.push({
                _id: new ObjectId(),
                date: randomDateInLastWeek(),
                amount,
            });
        }
    }
    return transactions;
}
// API POST Request
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const rules : GenerationRules = body.rules;
        const company = body.company ?? "Unknown Company";
        const statementType = rules.style;
        if (!rules) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Rules are required"
                },
                {
                    status: 400
                });
        }
        console.log("Request Body:", body);
        const transactions = generateTransactions(rules);
        const statement = {
            company,
            statementType,
            rules,
            transactions: transactions.map((t) => ({
                ...t,
                _id: t._id.toString(),
                date: t.date.toISOString(),
            })),
            createdAt: new Date(),
        };
        // Save in db
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const result = await db.collection("generator").insertOne(statement);
        // return response
        return NextResponse.json({
            success: true,
            id: result.insertedId.toString(),
            statement,
        });
    }
    catch (error:any) {
        console.error("Error Saving Statement:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            {
                status: 500
            }
        );
    }
}









