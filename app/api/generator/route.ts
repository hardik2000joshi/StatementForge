 import clientPromise from "@/lib/db";
import { error } from "console";
import {ObjectId} from "mongodb";
import { vendored } from "next/dist/server/route-modules/app-page/module.compiled";
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
function generateTransactions(rules: GenerationRules, fromDate: string, toDate:string, vendors:any[]){
    const transactions:any[] = [];
    const start = new Date(fromDate);
    const end = new Date(toDate);

    for(let i=0; i<rules.txnsPerWeek; i++) {
        // Decide is tranaction incoming or outgoing:
        const isCredit = i % 2 === 0;
        const amount = isCredit ? Math.floor(
            Math.random() * (rules.incomingMax - rules.incomingMin + 1) + rules.incomingMin
        ) : Math.floor(
            Math.random() * (rules.outgoingMax - rules.outgoingMin + 1) + rules.outgoingMin
        );
        const category = rules.categories[Math.floor(Math.random() * rules.categories.length)];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];

        // Generate random date between user selected range
        function randomDateSelection(start: Date, end: Date) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }

        const txnDate = randomDateSelection(start, end);
        // Format based on style
        if (rules.style === 'basic') {
            transactions.push({
                _id: new ObjectId(),
                date: txnDate,
                description: vendor.name,
                vendorId: vendor._id,
                amount,
                type: isCredit ? "credit" : "debit",
            });
        }
        else if(rules.style === "detailed") {
            transactions.push({
                _id: new ObjectId(),
                date: txnDate,
                description: vendor.name,
                vendorId: vendor._id,
                category: vendor.categoryId,
                amount,
                type: isCredit ? "credit" :"debit",
                balanceAfter:
                5000 +
                (isCredit ? amount: -amount),
            });
        }
        else if(rules.style === "minimal") {
            transactions.push({
                _id: new ObjectId(),
                date: txnDate,
                amount,
                vendorId: vendor._id,
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

        const fromDate: string = body.fromDate;
        const toDate: string = body.toDate;
        if(!fromDate || !toDate) {
            return NextResponse.json(
                {success: false, error: "fromDate and toDate are required"},
                {status: 400}
            );
        }
        const company = body.company || {
            companyName: "Webnatics Ltd",
            bankName: "Secure Bank Ltd",
            accountNumber: "12345678"
              };
              
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

        // fetch vendors from db:
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        const vendors = await db.collection("vendors").find({}).toArray();

        if (!vendors || vendors.length===0) {
            return NextResponse.json({
                success: false,
                error: "No vendors found"
                }, {
                    status: 400
                });
        }
        console.log("Request Body:", body);

        // Generate transactions within selected date range
        const transactions = generateTransactions(rules, fromDate, toDate, vendors);

        const openingBalance = 5000;
        const totalTransactions = transactions.length;

        // compute closing balance
        const closingBalance = transactions.reduce((balance, txn) => {
            if (txn.type === 'credit')
                return balance + txn.amount;
            if (txn.type === 'debit')
                return balance - txn.amount;
            return balance;
        }, openingBalance);


        // calculate periodStart and periodEnd dynamically from transactions
        const periodStart = fromDate;
        const periodEnd = toDate;
        const statement = {
            company,
            statementType,
            accountNumber: "",
            periodStart,
            periodEnd,
            openingBalance,
            closingBalance,
            totalTransactions,
            rules,
            transactions: transactions.map((t) => ({
                ...t,
                _id: t._id.toString(),
                date: t.date.toISOString(),
            })),
            createdAt: new Date(),
        };

       
        // Save generator in db
        const result = await db.collection("generator").insertOne(statement);
        // return response
        return NextResponse.json({
            success: true,
            data: {
                id: result.insertedId.toString(),
                statement,
            },
        });
    }
    catch (error:any) {
        console.error("Error Saving Statement:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Something went wrong",
            },
            {
                status: 500
            }
        );
    }
}









