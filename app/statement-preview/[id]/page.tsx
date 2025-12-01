"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Template {
    _id? : string;
    name: string;
    category: string;
    htmlFile?: string;
    cssFile?: string;
}

// in Next.js 15+ when we mark component as "use client", params is a promise.
// And when params is promise, we must unwrap it using React.use().

export default function statementPreviewPage({params}: {params: Promise<{id: string}>;}) {
     const resolvedParams = React.use(params) as { id: string };
    const [data, setData] = useState<any>(null);
    const [template, setTemplate] = useState<Template | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mergedHtml, setMergedHtml] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const templateName = searchParams.get("template") || "Bank Statement";
    const generatorId = resolvedParams.id;

    
    useEffect(() => {
        // fetching the data
        const fetchData = async() => {
            setIsLoading(true);
            try {
                const companyId = new URLSearchParams(window.location.search).get("companyId");
                if(!companyId) {
                    throw new Error("Missing Company Id");
                }

                // Fetch generator document to get saved periodStart/periodEnd
                const gen = await fetch (`/api/generator/${generatorId}`);
                const genJson = await gen.json();
                 if (!gen.ok) {
                    throw new Error(genJson.message || genJson.error || "Failed to load generator");
                }

                const genData = genJson.data?.statement ?? genJson.data ?? genJson;
                const periodStart = genData.periodStart;
                const periodEnd = genData.periodEnd;

                // fetch bank statement html
                const bankResponse = await fetch(`/api/bankStatements/${generatorId}?companyId=${encodeURIComponent(companyId)}&periodStart=${encodeURIComponent(periodStart)}&periodEnd=${encodeURIComponent(periodEnd)}`);
                // json response
                const bankJson = await bankResponse.json();
                // if response is not valid or fine: error occured- json error or failed to load statement
                // ||(or) logical or operator
                if(!bankResponse.ok){
                    throw new Error(bankJson.message || bankJson.error || "Failed to load bank statement");
                }
                    setData(bankJson);

                    // fetch template
                    const tResponse = await fetch(`/api/templates?name=${encodeURIComponent(templateName)}`);
                    const tjson = await tResponse.json();
                    if (tjson.success && Array.isArray(tjson.data) && tjson.data.length > 0) {
                        setTemplate(tjson.data[0]);
                    }
                    else {
                        setTemplate(null);
                    }
                }

            catch(err: any) {
                console.error("Error loading preview:", err);
                // optionally show UI feedback
            }

            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [generatorId, templateName]);

    // Merge template and data after both are loaded
  useEffect(() => {
    if (!data || !template) {
      setMergedHtml(null);
      return;
    }

    let htmlContent = template.htmlFile || "";

    htmlContent = htmlContent.replace(/{{bankName}}/g, data.company || "");
    htmlContent = htmlContent.replace(/{{accountNumber}}/g, data.accountNumber || "");
    htmlContent = htmlContent.replace(/{{periodStart}}/g, data.periodStart || "");
    htmlContent = htmlContent.replace(/{{periodEnd}}/g, data.periodEnd || "");
    htmlContent = htmlContent.replace(/{{openingBalance}}/g, data.openingBalance || "");
    htmlContent = htmlContent.replace(/{{closingBalance}}/g, data.closingBalance || "");
    htmlContent = htmlContent.replace(/{{totalTransactions}}/g, data.totalTransactions?.toString() || "");

     // Inject template CSS if present
    if (template.cssFile) {
      // insert stylesheet just before </head> if exists, otherwise prepend
      if (htmlContent.includes("</head>")) {
        htmlContent = htmlContent.replace("</head>", `<style>${template.cssFile}</style></head>`);
      } else {
        htmlContent = `<style>${template.cssFile}</style>` + htmlContent;
      }
    }

     setMergedHtml(htmlContent);
  }, [data, template]);

  useEffect(() => {
    if (!mergedHtml) return;
    const saveHtml = async () => {
        try {
            await fetch(`/api/generator/${generatorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: mergedHtml }),
      });
        }
        catch (err) {
      console.error("Failed to save merged HTML:", err);
    }
    };

    saveHtml();
  }, [mergedHtml, generatorId]);

    if(isLoading) {
        return (
        <div className="p-10 text-center">
            Loading Statement Preview...
        </div>
        );
    }

     if (!mergedHtml) {
    return <div className="p-10 text-center text-red-600">Statement or Template not found</div>;
  }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">
                Statement Preview
            </h1>
            <div dangerouslySetInnerHTML={{__html: data.html}}/>
        </div>
    );
}