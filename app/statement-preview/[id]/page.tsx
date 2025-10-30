"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Template {
    _id? : string;
    name: string;
    category: string;
    htmlFile?: string;
    cssFile?: string;
}

export default function statementPreviewPage({params}: {params: {id: string}}) {
    const [data, setData] = useState<any>(null);
    const [template, setTemplate] = useState<Template | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const templateName = searchParams.get("template") || "Bank Statement";

    useEffect(() => {
        // fetching the data
        const fetchData = async() => {
            setIsLoading(true);
            try {
                // fetch generator statement
                const response = await fetch(`/api/generator/${params.id}`);
                const json = await response.json();
                if (!json.success) {
                    throw new Error("Statement not found");
                }
                    setData(json.data);

                    // fetch template
                    const tResponse = await fetch(`/api/templates?name=${encodeURIComponent(templateName)}`);
                    const tjson = await tResponse.json();
                    if (tjson.success && tjson.data.length>0) {
                        setTemplate(tjson.data[0]);
                    }
                }

            catch(err) {
                console.error("Error fetching data:", err) ;
            }

            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [params.id, templateName]);

    if(isLoading) {
        return <div className="p-10 text-center">
            Loading Statement Preview...
        </div>;
    }
    if (!data || !template) {
        return <div className="p-10 text-center text-red-600">
            Statement  or Template not found
        </div>;
    }

    // Merge template html and data
    let htmlContent = template.htmlFile || "";
    htmlContent = htmlContent.replace(/{{bankName}}/g, data.company || "");
    htmlContent = htmlContent.replace(/{{accountNumber}}/g, data.accountNumber || "");
    htmlContent = htmlContent.replace(/{{periodStart}}/g, data.periodStart || "");
    htmlContent = htmlContent.replace(/{{periodEnd}}/g, data.periodEnd || "");
    htmlContent = htmlContent.replace(/{{openingBalance}}/g, data.openingBalance || "");
    htmlContent = htmlContent.replace(/{{closingBalance}}/g, data.closingBalance || "");
    htmlContent = htmlContent.replace(/{{totalTransactions}}/g, data.totalTransactions?.toString() || "");

    // inject css inline
    if (template.cssFile)
        htmlContent = htmlContent.replace("</head>", `<style>${template.cssFile}</style></head>`);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">
                Statement Preview
            </h1>
            <div dangerouslySetInnerHTML={{__html: htmlContent}}/>
        </div>
    );
} 