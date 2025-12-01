import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
  const generatorId = params.id;
  const client = await clientPromise;
  const db = client.db("myAccountDB");
  try {

    // Get companyId from query
    const url = new URL(req.url);
    console.log("Incoming request to Bank Statements API");
    console.log("URL:", req.url);
    console.log("Params Id:", params.id);
    console.log("Company ID query:", url.searchParams.get("companyId"));

    const companyId = url.searchParams.get("companyId");
    if (!companyId) {
      return NextResponse.json({ message: "Missing companyId parameter" }, { status: 400 });
    }

    // Fetch template
    const template = await db.collection("templates").findOne({category: "Bank Statement"});
    if (!template) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 });
    }

    // Fetch company
    const company = await db.collection("companies").findOne({ _id: new ObjectId(companyId) });
    if (!company) {
      return NextResponse.json({ message: "Company not found" }, { status: 404 });
    }

    const generatorCollection = db.collection("generator");

    let transactions: any[] = [];
    let openingBalance = 0;

    if (generatorId === "all") {
      console.log("Fetching all generator documents...");
      // merge all generator docs
    const generatorDocs = await generatorCollection.find({
      company: company.companyName
    }).toArray();

    if(!generatorDocs.length) {
      return NextResponse.json({
        message: "No Statements found"
      }, {
        status: 404
      });
    }

    // flatten all transactions
    transactions = generatorDocs.flatMap((doc) => doc.transactions || []);

    // use latest for opening balance
    const latest = generatorDocs.sort((
      a,b
    ) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    openingBalance = Number(latest.openingBalance ?? 0);
    }
    else {
       // fetch single generator doc
       console.log("🔹 Generator ID:", generatorId);
       console.log("🔹 Company Name (from DB):", company.companyName);
    const generatorDoc = await generatorCollection.findOne({
      _id: new ObjectId(generatorId),
      company: company.companyName, // match company name
    });

    if(!generatorDoc) {
      return NextResponse.json({
        message: "Generator not found"
      }, {
        status: 404
      });
    }
    console.log("Generator ID:", generatorId);
    
    transactions = generatorDoc.transactions || [];
    openingBalance = Number(generatorDoc.openingBalance ?? 0);
    }

    // common balance and period logic
    let sortedTxns = transactions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const userPeriodStart = url.searchParams.get("periodStart");
    const userPeriodEnd = url.searchParams.get("periodEnd");

    const totalTransactions = sortedTxns.length;
    const periodStart = userPeriodStart
    ? new Date (userPeriodStart).toLocaleDateString()
    : totalTransactions
      ? new Date(sortedTxns[0].date).toLocaleDateString()
      : "";

    const periodEnd = userPeriodEnd
    ? new Date (userPeriodEnd).toLocaleDateString()
    :totalTransactions
      ? new Date(sortedTxns[sortedTxns.length - 1].date).toLocaleDateString()
      : "";

    // Compute running balance per transaction
    let runningBalance = openingBalance;
    sortedTxns= sortedTxns.map((t) => {
      const amount = Number(t.amount) || 0;

      if (t.type === "credit") {
        runningBalance += amount;
      }
      
      else {
        runningBalance -= amount;
      } 

      return {
        ...t,
        amount,
        balance: runningBalance,
      };
    });
    const closingBalance = runningBalance;

    // Build transaction rows dynamically
    const txnHtml = sortedTxns
      .map(
        (t) => {
          const formattedDate = new Date(t.date).toLocaleDateString("en-GB");
          return `
          <tr class="selectable">
            <td>
            ${formattedDate}
            </td>
            <td>
            ${t.description || "-"}
            </td>
            <td class="${t.type==="credit" ? "amount-credit" : "amount-debit"}">
            ${t.type === "credit" ? "+" : "-"} £${t.amount}
            </td>
            <td class="balance">
            £${t.balance}
            </td>
             <td>
             ${t.type === "credit" ? "Income" : "Expense"}
             </td>
          </tr>
        `;
        }
)
      .join("");

    // Replace placeholders in HTML
    let htmlContent = template.htmlFile || "";
    htmlContent = htmlContent.replace(/{{companyName}}/g, company.companyName || "");
    htmlContent = htmlContent.replace(/{{bankName}}/g, company.bankName || "");
    htmlContent = htmlContent.replace(/{{accountNumber}}/g, company.accountNumber || "");
    htmlContent = htmlContent.replace(/{{periodStart}}/g, periodStart);
    htmlContent = htmlContent.replace(/{{periodEnd}}/g, periodEnd);
    htmlContent = htmlContent.replace(/{{totalTransactions}}/g, totalTransactions.toString());
    htmlContent = htmlContent.replace(/{{openingBalance}}/g, openingBalance.toString());
    htmlContent = htmlContent.replace(/{{closingBalance}}/g, closingBalance.toString());
    htmlContent = htmlContent.replace(/{{transactions}}/g, txnHtml);

    // Remove leftover Handlebars placeholders
    htmlContent = htmlContent
    .replace(/{{#each [^}]+}}/g, "")
  .replace(/{{\/each}}/g, "")
  .replace(/{{#if [^}]+}}/g, "")
  .replace(/{{\/if}}/g, "");

    // Inject CSS if exists
    if (template.cssFile) {
      htmlContent = htmlContent.replace("</head>", `<style>${template.cssFile}</style></head>`);
    }
    
    return NextResponse.json(
      {
        html: htmlContent,
        css: template.cssFile || "",
        company,
        transactions: sortedTxns,
        openingBalance,
        closingBalance,
        periodStart,
        periodEnd,
        totalTransactions,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error generating bank statement:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}