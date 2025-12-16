"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Template {
  _id?: string;
  name: string;
  category: string;
  htmlFile?: string;
  cssFile?: string;
}

export default function StatementPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params) as { id: string };
  const generatorId = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [renderHtml, setRenderHtml] = useState<string | null>(null);
  const [templateMeta, setTemplateMeta] = useState<Template | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  
  const searchParams = useSearchParams();
  const templateName = searchParams.get("template") || "Bank Statement";

  // FETCH BANK STATEMENT HTML

  useEffect(() => {
    console.log("StatementPreviewPage EFFECT ON MOUNT");
    const fetchPreview = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const companyId = new URLSearchParams(window.location.search).get(
          "companyId"
        );
        if (!companyId) throw new Error("Missing companyId in URL");

        const genRes = await fetch(`/api/generator/${generatorId}`);
        const genJson = await genRes.json();

        if (!genRes.ok)
          throw new Error(
            genJson?.message || genJson?.error || "Failed to load generator"
          );

        const genData =
          genJson.data?.statement ?? genJson.data ?? genJson ?? {};
        const periodStart = genData?.periodStart;
        const periodEnd = genData?.periodEnd;

        if (!periodStart || !periodEnd)
          throw new Error("Generator missing periodStart/periodEnd");

        const bankUrl = `/api/bankStatements/${encodeURIComponent(
          generatorId
        )}?companyId=${encodeURIComponent(
          companyId
        )}&periodStart=${encodeURIComponent(
          periodStart
        )}&periodEnd=${encodeURIComponent(periodEnd)}`;

        const bankRes = await fetch(bankUrl);
        const bankJson = await bankRes.json();

        if (!bankRes.ok)
          throw new Error(
            bankJson?.message ||
            bankJson?.error ||
            "Failed to fetch bank statement"
          );

        const htmlFromServer =
          bankJson?.html ??
          bankJson?.htmlContent ??
          bankJson?.htmlFile ??
          null;

        if (!htmlFromServer)
          throw new Error("Bank statement HTML not returned from server");

        console.log("setRenderHtml called");
        setRenderHtml(htmlFromServer);

        // Normalize server txns for React
        const serverTxns = Array.isArray(bankJson.transactions)
          ? bankJson.transactions
          : [];

        const normalized = serverTxns.map((t: any) => ({
          ...t,
          _id: String(t._id),
        }));

        setTransactions(normalized);
        setSelectedTransactions([]); // reset selection
      } catch (err: any) {
        console.error("Error loading statement preview:", err);
        setErrorMessage(
          err?.message ?? "Failed to load statement preview"
        );
        setRenderHtml(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [generatorId]);

  // Single effect: listen to clicks and update selectedTransactions BY ID
useEffect(() => {
  if (!renderHtml || transactions.length === 0) return;

  const timer = setTimeout(() => {
    const table =
      document.querySelector<HTMLTableElement>(
        "table.transactions-table.statement-table"
      ) ||
      document.querySelector<HTMLTableElement>("table.transactions-table");

    if (!table) {
      console.warn("statement-table not found in HTML");
      return;
    }

    const handleChange = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const input = target.closest("input.txn-checkbox") as
        | HTMLInputElement
        | null;
      if (!input) return;

      // *** KEY CHANGE: use data-id like BankStatementTemplate.tsx ***
      const id = input.getAttribute("data-id");
      if (!id) return;

      setSelectedTransactions((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    };

    table.addEventListener("click", handleChange, true);

    // cleanup
    return () => {
      table.removeEventListener("click", handleChange, true);
    };
  }, 0);

  return () => clearTimeout(timer);
}, [renderHtml, transactions]);



  // GENERATE INVOICE
  const handleGenerateInvoice = async () => {
    if (selectedTransactions.length === 0) {
      alert("Select at least one transaction");
      return;
    }

    try {
      setGeneratingInvoice(true);

      const payload = {
        transactionIds: selectedTransactions,
        generatorId,
        templateName,
      };

      const response = await fetch("/api/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (!response.ok)
        throw new Error(
          json?.message || json?.error || "Invoice generator failed"
        );

      alert(`Invoice(s) generated successfully`);
      setSelectedTransactions([]);
    } catch (err: any) {
      alert(err?.message || "Failed to generate invoice");
    } finally {
      setGeneratingInvoice(false);
    }
  };

  // -------------------------
  // LOADING / ERROR STATES
  // -------------------------
  if (isLoading)
    return <div className="p-10 text-center">Loading Statement Preview...</div>;

  if (errorMessage)
    return (
      <div className="p-10">
        <div className="text-red-600 font-semibold mb-2">Error</div>
        <div className="text-sm text-gray-700">{errorMessage}</div>
      </div>
    );

  if (!renderHtml)
    return (
      <div className="p-10 text-center text-red-600">
        Statement or Template not found
      </div>
    );

  // -------------------------
  // FINAL UI (Correct Layout)
  // -------------------------
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Statement Preview</h1>

      {/* --------------------------
          INVOICE CONTROLS ABOVE TABLE
         -------------------------- */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white border rounded-lg shadow">
        <div className="text-sm font-semibold">
          {selectedTransactions.length === 0
            ? "No transactions selected"
            : `${selectedTransactions.length} transaction(s) selected`}
        </div>

        <button
          onClick={handleGenerateInvoice}
          disabled={selectedTransactions.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-40 flex items-center gap-2"
        >
          {generatingInvoice ? "Generating..." : "Generate Invoice"}
        </button>
      </div>

      {/* BANK STATEMENT HTML RENDER */}
      <div dangerouslySetInnerHTML={{ __html: renderHtml }} />
    </div>
  );
}


{/* Transaction selection + Generate Invoice 
      <div className="mt-6 p-4 border rounded-lg bg-white shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold mb-4">
            Generate Invoice
          </h2>
          <div className="text-sm text-gray-600">
            {selectedTransactions.length} selected
          </div>
        </div>

        {transactions.length === 0 ? (
          <p className="text-sm text-gray-500">
            No transactions available for invoice generation
          </p>
        ) : (
          <>
            <div>
              {transactions.map((tx) => (
                <label key={tx._id} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedTransactions.includes(tx._id)}
                    onChange={() => handleTransactionSelect(tx._id)}
                  />
                  <span>{tx.date} - {tx.description} - £{tx.amount}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* Selected count 
        {selectedTransactions.length > 0 && (
          <div className="mt-3 text-sm font-medium text-gray-700">
            Selected Transactions: {selectedTransactions.length}
          </div>
        )}

        {/* Generate Invoice button
        {selectedTransactions.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerateInvoice}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 shadow"
              disabled={generatingInvoice}
            >
              {generatingInvoice ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        )}
      </div> */}

