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
            let transactions = await db.collection("bankStatements").find
            ({companyId}).toArray();

            if (!transactions.length) {
            const openingBalance = Number(company.openingBalance ?? 0);
            let balance = openingBalance;
            const categories = ["Groceries", "Bills", "Salary", "Shopping", "Food"];
            const txnsPerWeek = 10;

            const newTxns = [];
            for (let i = 0; i < txnsPerWeek; i++) {
                const isCredit = Math.random() > 0.5;
                const amount = Math.floor(Math.random() * 1000) + 50;
                const type = isCredit ? "credit" : "debit";
                balance += isCredit ? amount : -amount;

                
                newTxns.push({
                    companyId,
                    date: new Date(Date.now() - (txnsPerWeek - i) * 24 * 60 * 60 * 1000)
                        .toISOString().split('T')[0],
                    description: categories[Math.floor(Math.random() * categories.length)],
                    type,
                    amount,
                    balance
                });
            }

            // Insert dynamically generated transactions into DB
            const result = await db.collection("bankStatements").insertMany(newTxns);
            transactions = newTxns.map((txn, idx) => ({
        ...txn,
        _id: result.insertedIds[idx]
    })); 
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

            const template = await db.collection("templates").findOne({category: "Bank Statement"});
            if (!template) {
                return NextResponse.json({
                    message: "No Bank Statement Template found"
                },{
                    status: 404
                });
            }

            // prepare transactions HTML for {{transactions}}
            const txnHtml = sorted.map(t => `
                <tr>
                <td>
                 ${t.date}
                 </td>
                 <td>
                 ${t.description}
                 </td>
                 <td>
                 ${t.type}
                 </td>
                 <td>
                 ${t.amount}
                 </td>
                `).join("");

                // Replace placeholders inside HTML Template
                let htmlContent = template.htmlFile;
                htmlContent = htmlContent.replace(/{{companyName}}/g, company.companyName || "");
                htmlContent = htmlContent.replace(/{{accountNumber}}/g, company.accountNumber || "");
                htmlContent = htmlContent.replace(/{{accountHolderName}}/g, company.accountHolderName || "");
                htmlContent = htmlContent.replace(/{{bankName}}/g, company.bankName || "");
                htmlContent = htmlContent.replace(/{{statementPeriod}}/g, accountInfo.statementPeriod);
                htmlContent =htmlContent.replace(/{{openingBalance}}/g, company.openingBalance);
                htmlContent = htmlContent.replace(/{{closingBalance}}/g, accountInfo.closingBalance);
                htmlContent = htmlContent.replace(/{{totalDebits}}/g, accountInfo.totalDebits);
                htmlContent = htmlContent.replace(/{{transactions}}/g, txnHtml);

                 if (template.cssFile) htmlContent = htmlContent.replace('</head>', `<style>${template.cssFile}</style></head>`);

            // Return Combined Data
            return NextResponse.json({
                html: htmlContent,
                css: template.cssFile || "",
                company,
                accountInfo, 
                transactions: sorted
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