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

// params is a Promise in Next.js 13/14/15 client components when passed server-side
export default function StatementPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params) as { id: string };
  const generatorId = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // The server-built HTML to render (comes from /api/bankStatements/{id})
  const [renderHtml, setRenderHtml] = useState<string | null>(null);

  // Optional: template metadata (not required for rendering since bankStatements returns html)
  const [templateMeta, setTemplateMeta] = useState<Template | null>(null);

  const searchParams = useSearchParams();
  const templateName = searchParams.get("template") || "Bank Statement";

  useEffect(() => {
    const fetchPreview = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const companyId = new URLSearchParams(window.location.search).get("companyId");
        if (!companyId) throw new Error("Missing companyId in URL");

        // 1) fetch generator doc to get saved periodStart/periodEnd
        const genRes = await fetch(`/api/generator/${generatorId}`);
        const genJson = await genRes.json();
        if (!genRes.ok) {
          throw new Error(genJson?.message || genJson?.error || "Failed to load generator");
        }
        // generator endpoint shape: { success: true, data: { ... } } or { success:false }
        const genData = genJson.data?.statement ?? genJson.data ?? genJson;
        const periodStart = genData?.periodStart;
        const periodEnd = genData?.periodEnd;
        if (!periodStart || !periodEnd) {
          throw new Error("Generator has missing periodStart/periodEnd");
        }

        // 2) ask bankStatements endpoint to render full HTML server-side (this returns html with transactions)
        const bankUrl = `/api/bankStatements/${encodeURIComponent(generatorId)}?companyId=${encodeURIComponent(
          companyId
        )}&periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`;

        const bankRes = await fetch(bankUrl);
        const bankJson = await bankRes.json();
        if (!bankRes.ok) {
          throw new Error(bankJson?.message || bankJson?.error || "Failed to fetch bank statement");
        }

        // bankJson should have html (server-produced full HTML), css (optional), and other data
        // prefer bankJson.html (or bankJson.htmlContent, bankJson.htmlFile — adjust if your API uses a different name)
        const htmlFromServer = bankJson?.html ?? bankJson?.htmlContent ?? bankJson?.htmlFile ?? null;
        if (!htmlFromServer) {
          // fallback: if bankJson returned html under a different key, we still try to use bankJson.html
          // but if nothing present, build a minimal HTML (unlikely if your backend already returns it)
          throw new Error("Bank statement HTML not returned from server");
        }

        // 3) set the server-produced HTML for rendering
        setRenderHtml(htmlFromServer);

        // 4) optionally load template metadata (not required to render; useful for showing template title, etc.)
        try {
          const tRes = await fetch(`/api/templates?name=${encodeURIComponent(templateName)}`);
          const tJson = await tRes.json();
          if (tRes.ok && tJson.success && Array.isArray(tJson.data) && tJson.data.length > 0) {
            setTemplateMeta(tJson.data[0]);
          } else {
            setTemplateMeta(null);
          }
        } catch (tErr) {
          // ignore template fetch errors for rendering
          setTemplateMeta(null);
        }
      } catch (err: any) {
        console.error("Error loading statement preview:", err);
        setErrorMessage(err?.message ?? "Failed to load statement preview");
        setRenderHtml(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [generatorId, templateName]);

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
      {/* render server-produced HTML directly (this will include transactions) */}
      <div dangerouslySetInnerHTML={{ __html: renderHtml }} />
    </div>
  );
}

