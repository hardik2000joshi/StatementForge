"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Template {
  _id?: string;
  name: string;
  category: string;
  htmlFile?: string; // template HTML with placeholders
  cssFile?: string;
  htmlContent?: string; // some variants
}

export default function StatementPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params) as { id: string };
  const generatorId = resolvedParams.id; // may be present even for template preview
  const searchParams = useSearchParams();
  const templateName = searchParams.get("template") || "Bank Statement";
  const companyId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("companyId") : null;
  const isTemplateView = searchParams.has("template"); // true when ?template=... present

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [renderHtml, setRenderHtml] = useState<string | null>(null);
  const [templateMeta, setTemplateMeta] = useState<Template | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setRenderHtml(null);

      if (!companyId) {
        setErrorMessage("Missing companyId in URL query (companyId is required).");
        setIsLoading(false);
        return;
      }

      try {
        // TEMPLATE PREVIEW
        // When user clicks "View" on a template, we want to show a realistic bank statement
        // using existing generator data + the selected template.
        if (isTemplateView) {
          // Use your existing bankStatements API in 'all' mode to get transactions + balances
          // (your backend already supports generatorId === "all" and returns transactions array).
          const bankRes = await fetch(`/api/bankStatements/all?companyId=${encodeURIComponent(companyId)}`);
          const bankJson = await bankRes.json();
          if (!bankRes.ok) {
            throw new Error(bankJson?.message || bankJson?.error || "Failed to get bank statement sample for template preview");
          }

          // fetch the template by name
          const tRes = await fetch(`/api/templates?name=${encodeURIComponent(templateName)}`);
          const tJson = await tRes.json();
          if (!tRes.ok || !tJson.success || !Array.isArray(tJson.data) || tJson.data.length === 0) {
            throw new Error("Template not found for preview");
          }
          const tpl: Template = tJson.data[0];
          setTemplateMeta(tpl);

          // Build transactions HTML string from server data (array)
          const data = bankJson;
          const txns = Array.isArray(data.transactions) ? data.transactions : [];

          const transactionsHtml = txns
            .map((t: any) => {
              const date = new Date(t.date).toLocaleDateString("en-GB");
              const desc = t.description ?? "-";
              const amount = Number(t.amount ?? 0);
              const sign = t.type === "credit" ? "+" : "-";
              const amountText = `${sign} £${amount}`;
              const balanceText = t.balance != null ? `£${Number(t.balance)}` : "";
              const typeText = t.type === "credit" ? "Income" : "Expense";
              return `<tr class="selectable">
                <td>${date}</td>
                <td>${desc}</td>
                <td class="${t.type === "credit" ? "amount-credit" : "amount-debit"}">${amountText}</td>
                <td class="balance">${balanceText}</td>
                <td>${typeText}</td>
              </tr>`;
            })
            .join("");

          // Merge template HTML placeholders with server data
          let htmlContent = tpl.htmlFile ?? tpl.htmlContent ?? "";

          // replace common placeholders
          htmlContent = htmlContent.replace(/{{companyName}}/g, data.company?.companyName ?? "");
          htmlContent = htmlContent.replace(/{{bankName}}/g, data.company?.bankName ?? "");
          htmlContent = htmlContent.replace(/{{accountNumber}}/g, data.company?.accountNumber ?? "");
          htmlContent = htmlContent.replace(/{{periodStart}}/g, data.periodStart ?? "");
          htmlContent = htmlContent.replace(/{{periodEnd}}/g, data.periodEnd ?? "");
          htmlContent = htmlContent.replace(/{{openingBalance}}/g, String(data.openingBalance ?? ""));
          htmlContent = htmlContent.replace(/{{closingBalance}}/g, String(data.closingBalance ?? ""));
          htmlContent = htmlContent.replace(/{{totalTransactions}}/g, String(data.totalTransactions ?? txns.length ?? 0));
          // replace transactions placeholder with final rows string
          htmlContent = htmlContent.replace(/{{transactions}}/g, transactionsHtml);

          // inject CSS if provided in template
          if (tpl.cssFile) {
            if (htmlContent.includes("</head>")) {
              htmlContent = htmlContent.replace("</head>", `<style>${tpl.cssFile}</style></head>`);
            } else {
              htmlContent = `<style>${tpl.cssFile}</style>` + htmlContent;
            }
          }

          setRenderHtml(htmlContent);
          setIsLoading(false);
          return;
        }

        // ------------------------
        // GENERATED STATEMENT PREVIEW
        // ------------------------
        // Normal flow when a generatorId is provided and we want to show that generator's statement.
        const genRes = await fetch(`/api/generator/${encodeURIComponent(generatorId)}`);
        const genJson = await genRes.json();
        if (!genRes.ok) {
          throw new Error(genJson?.message || genJson?.error || "Failed to load generator");
        }

        const genData = genJson.data?.statement ?? genJson.data ?? genJson;
        const periodStart = genData?.periodStart;
        const periodEnd = genData?.periodEnd;
        if (!periodStart || !periodEnd) {
          throw new Error("Generator has missing periodStart/periodEnd");
        }

        // ask bankStatements route for HTML (server builds it using its template logic)
        const bankUrl = `/api/bankStatements/${encodeURIComponent(generatorId)}?companyId=${encodeURIComponent(companyId)}&periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`;
        const bankRes2 = await fetch(bankUrl);
        const bankJson2 = await bankRes2.json();

        if (!bankRes2.ok) {
          throw new Error(bankJson2?.message || bankJson2?.error || "Failed to load bank statement for generator");
        }

        // Prefer server-provided HTML if present (keeps visual parity with generator flow),
        // but if server returns data + transactions only, we can still merge with template client-side.
        const serverHtml = bankJson2?.html ?? bankJson2?.htmlContent ?? bankJson2?.htmlFile ?? null;
        if (serverHtml) {
          setRenderHtml(serverHtml);
          setTemplateMeta(null); // server HTML already includes template
          setIsLoading(false);
          return;
        }

        // If server didn't return HTML, fetch the template requested (templateName may be default)
        const tRes2 = await fetch(`/api/templates?name=${encodeURIComponent(templateName)}`);
        const tJson2 = await tRes2.json();
        const tpl2: Template | null = tJson2?.success && Array.isArray(tJson2.data) && tJson2.data.length > 0 ? tJson2.data[0] : null;
        if (!tpl2) {
          // fallback: just render simple table from bankJson2
          const fallbackRows = (bankJson2.transactions || []).map((t: any) => {
            const date = new Date(t.date).toLocaleDateString("en-GB");
            const desc = t.description ?? "-";
            const amount = Number(t.amount ?? 0);
            const sign = t.type === "credit" ? "+" : "-";
            const amountText = `${sign} £${amount}`;
            const balanceText = t.balance != null ? `£${Number(t.balance)}` : "";
            const typeText = t.type === "credit" ? "Income" : "Expense";
            return `<tr class="selectable">
              <td>${date}</td><td>${desc}</td><td>${amountText}</td><td>${balanceText}</td><td>${typeText}</td>
            </tr>`;
          }).join("");
          const fallbackHtml = `<div><h3>Statement Preview</h3><table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Balance</th><th>Type</th></tr></thead><tbody>${fallbackRows}</tbody></table></div>`;
          setRenderHtml(fallbackHtml);
          setIsLoading(false);
          return;
        }

        // Merge tpl2 with bankJson2 data (same approach as template preview)
        const txns2 = Array.isArray(bankJson2.transactions) ? bankJson2.transactions : [];
        const transactionsHtml2 = txns2.map((t: any) => {
          const date = new Date(t.date).toLocaleDateString("en-GB");
          const desc = t.description ?? "-";
          const amount = Number(t.amount ?? 0);
          const sign = t.type === "credit" ? "+" : "-";
          const amountText = `${sign} £${amount}`;
          const balanceText = t.balance != null ? `£${Number(t.balance)}` : "";
          const typeText = t.type === "credit" ? "Income" : "Expense";
          return `<tr class="selectable"><td>${date}</td><td>${desc}</td><td class="${t.type === "credit" ? "amount-credit" : "amount-debit"}">${amountText}</td><td class="balance">${balanceText}</td><td>${typeText}</td></tr>`;
        }).join("");

        let htmlContent2 = tpl2.htmlFile ?? tpl2.htmlContent ?? "";
        htmlContent2 = htmlContent2.replace(/{{companyName}}/g, bankJson2.company?.companyName ?? "");
        htmlContent2 = htmlContent2.replace(/{{bankName}}/g, bankJson2.company?.bankName ?? "");
        htmlContent2 = htmlContent2.replace(/{{accountNumber}}/g, bankJson2.company?.accountNumber ?? "");
        htmlContent2 = htmlContent2.replace(/{{periodStart}}/g, bankJson2.periodStart ?? "");
        htmlContent2 = htmlContent2.replace(/{{periodEnd}}/g, bankJson2.periodEnd ?? "");
        htmlContent2 = htmlContent2.replace(/{{openingBalance}}/g, String(bankJson2.openingBalance ?? ""));
        htmlContent2 = htmlContent2.replace(/{{closingBalance}}/g, String(bankJson2.closingBalance ?? ""));
        htmlContent2 = htmlContent2.replace(/{{totalTransactions}}/g, String(bankJson2.totalTransactions ?? txns2.length ?? 0));
        htmlContent2 = htmlContent2.replace(/{{transactions}}/g, transactionsHtml2);
        if (tpl2.cssFile) {
          if (htmlContent2.includes("</head>")) {
            htmlContent2 = htmlContent2.replace("</head>", `<style>${tpl2.cssFile}</style></head>`);
          } else {
            htmlContent2 = `<style>${tpl2.cssFile}</style>` + htmlContent2;
          }
        }
        setRenderHtml(htmlContent2);
        setTemplateMeta(tpl2);
        setIsLoading(false);
      } catch (err: any) {
        console.error("StatementPreview error:", err);
        setErrorMessage(err?.message ?? "Failed to load statement preview");
        setRenderHtml(null);
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatorId, isTemplateView, templateName, companyId]);

  if (isLoading) {
    return <div className="p-10 text-center">Loading Statement Preview...</div>;
  }

  if (errorMessage) {
    return (
      <div className="p-10">
        <div className="text-red-600 font-semibold mb-2">Error</div>
        <div className="text-sm text-gray-700">{errorMessage}</div>
      </div>
    );
  }

  if (!renderHtml) {
    return <div className="p-10 text-center text-red-600">Statement or Template not found</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Statement Preview</h1>
      <div dangerouslySetInnerHTML={{ __html: renderHtml }} />
    </div>
  );
}
