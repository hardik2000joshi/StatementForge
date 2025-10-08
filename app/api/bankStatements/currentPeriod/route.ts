    import clientPromise from "@/lib/db";
    import { NextRequest, NextResponse } from "next/server";
    import { ObjectId } from "mongodb";

    export async function GET(req: NextRequest) {
        try {
            const client = await clientPromise;
            const db = client.db("myAccountDB");

            // Extract companyId from query params
            const url = new URL(req.url);
            const companyId = url.searchParams.get("companyId");
            if (!companyId) {
                return NextResponse.json(
                    {message: "Missing companyId parameter"},
                    {status: 400}
                );
            }

            // Fetch company info dynamically
            const company = await db.collection("companies").findOne({
                _id: new ObjectId(companyId),
            });
            if (!company){
                return NextResponse.json(
                    {message: "Company Not found"},
                    {status: 404}
                );
            }

            // Fetch transactions for this company
            const transactions = await db.collection("Bank Statement").find
            ({companyId: company._id.toString()}).toArray();

            if(!transactions || transactions.length === 0) {
                return NextResponse.json(
                    {
                        message: "No transactions found for this company."
                    },
                    {
                        status: 404
                    }
                );
            }

            // compute statement period, closing balance, total debits dynamically
            const sorted = transactions.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const openingBalance = Number(company.openingBalance ?? 0); 
            let balance = openingBalance;
            let totalDebits = 0;

            sorted.forEach(t => {
                if(t.type === "credit") {
                    balance += t.amount;
                }
                else {
                    balance -= t.amount;
                    totalDebits += t.amount;
                }
            });

            const statementPeriod = sorted.length
            ? `${new Date(sorted[0].date).toLocaleDateString()} - ${new Date(sorted[sorted.length-1].date).toLocaleDateString()}`
            : "No Transactions";

            // prepare account info structure dynamically from company:
            const accountInfo = {
                bankName: company.bankName || "",
                branch: company.branch || "",
                contact: company.contact || "",
                accountHolderName: company.accountHolderName || "",
                accountNumber: company.accountNumber || "",
                statementPeriod,
                closingBalance: balance.toString(),
                totalDebits: totalDebits.toString(),
            };

            // Return Combined Data
            return NextResponse.json({
                accountInfo, transactions: sorted
            },{
                status: 200
            });       
        }
        
        catch(error) {
            console.error("API error fetching statement:", error);
            return NextResponse.json({
                message: "Internal Server Error"
            },
            {
                status: 500
            });
        }
    }