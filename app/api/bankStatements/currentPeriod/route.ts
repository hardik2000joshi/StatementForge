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

    const sortedTxns = transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const totalTransactions = sortedTxns.length;
    const periodStart = totalTransactions
      ? new Date(sortedTxns[0].date).toLocaleDateString()
      : "-";
    const periodEnd = totalTransactions
      ? new Date(sortedTxns[totalTransactions - 1].date).toLocaleDateString()
      : "-";

      // Compute running balance
      let runningBalance = openingBalance;
      
      sortedTxns.forEach((t) => {
        if (t.type === "credit") {
            runningBalance += t.amount;
        }
        else {
            runningBalance -= t.amount;
        }
  t.balance = runningBalance;
});

            // prepare transactions HTML for {{transactions}}
            const txnHtml = sortedTxns.map((t) => `
                <tr>
                <td>
                <input type="checkbox" class="txn-checkbox"/>
                </td>
                <td>
                 ${new Date(t.date).toLocaleDateString("en-GB")}
                 </td>
                 <td>
                 ${t.description}
                 </td>
                    <td class="${
          t.type === "credit" ? "amount-credit" : "amount-debit"
        }">
          ${t.type === "credit" ? "+" : "-"}£${t.amount}
        </td>
                 <td class="balance">
                 £${t.balance}
                 </td>
                 <td>
                 ${t.type === "credit" ? "Income" : "Expense"}
                 </td>
                 </tr>
                `).join("");

                // Replace placeholders inside HTML Template
                let htmlContent = template.htmlFile;
                htmlContent = htmlContent.replace(/{{companyName}}/g, company.companyName || "");
                htmlContent = htmlContent.replace(/{{bankName}}/g, company.bankName || "");
                htmlContent = htmlContent.replace(/{{accountNumber}}/g, company.accountNumber || "");
                htmlContent = htmlContent.replace(/{{periodStart}}/g, periodStart);
                htmlContent = htmlContent.replace(/{{periodEnd}}/g, periodEnd);
                htmlContent = htmlContent.replace(/{{totalTransactions}}/g, totalTransactions.toString());
                htmlContent =htmlContent.replace(/{{openingBalance}}/g, openingBalance.toString());
                htmlContent = htmlContent.replace(/{{closingBalance}}/g, balance.toString());
            htmlContent = htmlContent.replace(/{{transactions}}/g, txnHtml);

                 if (template.cssFile) htmlContent = htmlContent.replace('</head>', `<style>${template.cssFile}</style></head>`);
                 
            // Return Combined Data
            return NextResponse.json({
                html: htmlContent,
                css: template.cssFile || "",
                company, 
                transactions: sortedTxns,
                openingBalance,
                closingBalance: balance,
                periodStart,
                periodEnd,
                totalTransactions,
            },{
                status: 200
            });       
        }
        
        catch(err: any) {
            console.error("Error generating current period statement", err);
            return NextResponse.json({
                message: "Internal Server Error",
                error: err.message
            },
            {
                status: 500
            });
        }
    }