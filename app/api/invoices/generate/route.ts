import clientPromise from "@/lib/db";
import jsPDF from "jspdf";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { companyId, transactionIds, templateName } = await req.json();
  const selectedTransactionIds = transactionIds;

  if (!companyId || !selectedTransactionIds || !templateName) {
    return NextResponse.json({
      success: false,
      message: "Missing Parameters",
    });
  }

  const client = await clientPromise;
  const db = client.db("myAccountDB");

  // Fetch Statement Data
  const statement = await db.collection("bankStatements").findOne({
    companyId: companyId,
  });

  if (!statement) {
    return NextResponse.json({
      success: false,
      message: "Statement not found",
    });
  }

  // DEBUG: log ids to verify they match
  console.log(
    "selectedTransactionIds from body:",
    selectedTransactionIds
  );
  console.log(
    "statement.transactions ids:",
    statement.transactions.map((t: any) => String(t._id))
  );

  // Filter selected transactions (compare as strings)
  const selectedTransactions = statement.transactions.filter((t: any) =>
    selectedTransactionIds.includes(String(t._id))
  );

  console.log(
    "selectedTransactions length:",
    selectedTransactions.length
  );

  if (selectedTransactions.length === 0) {
    return NextResponse.json({
      success: false,
      message: "No matching transactions found for given IDs",
    });
  }

  // Fetch Templates from Database
  const template = await db.collection("templates").findOne({
    name: templateName,
  });

  if (!template) {
    return NextResponse.json({
      success: false,
      message: "Template not found",
    });
  }

  // Replace placeholders in HTML Template
  let htmlContent = template.htmlFile;
  htmlContent = htmlContent.replace(
    /{{bankName}}/g,
    statement.accountInfo.bankName
  );
  htmlContent = htmlContent.replace(
    /{{accountHolder}}/g,
    statement.accountInfo.accountHolder
  );
  htmlContent = htmlContent.replace(
    /{{accountNumber}}/g,
    statement.accountInfo.accountNumber
  );
  htmlContent = htmlContent.replace(
    /{{closingBalance}}/g,
    statement.accountInfo.closingBalance
  );

  const txnHtml = selectedTransactions
    .map(
      (txn: any) => `
    <tr>
      <td>
        <input type="checkbox" class="txn-checkbox" data-id="${txn._id}"/>
      </td>
      <td>${txn.date}</td>
      <td>${txn.description}</td>
      <td class="${txn.credit ? "Income" : "Expense"}">
        ${txn.credit || txn.debit}
      </td>
      <td>${txn.balance}</td>
      <td>${txn.credit ? "Income" : "Expense"}</td>
    </tr>
  `
    )
    .join("");

  htmlContent = htmlContent.replace(/{{transactions}}/g, txnHtml);

  // generate PDF using jsPDF (optional for DB insert)
  const doc = new jsPDF();
  doc.html(htmlContent, {
    callback: (doc) => {
      const pdf = doc.output("blob");
      // you might store or send pdf later
    },
  });

  const totalAmount = selectedTransactions.reduce(
    (sum: number, t: any) => sum + (t.amount ?? 0),
    0
  );

  const invoiceDoc = {
    companyId,
    templateName,
    createdAt: new Date(),
    periodStart: statement.accountInfo.periodStart,
    periodEnd: statement.accountInfo.periodEnd,
    transactions: selectedTransactions,
    totalAmount,
  };

  const result = await db.collection("invoices").insertOne(invoiceDoc);
  console.log("Inserted invoice with _id:", result.insertedId);

  return NextResponse.json({
    success: true,
    html: htmlContent,
    invoiceId: result.insertedId.toString(),
  });
}
