import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const {id} = params;
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        
        const statementRecord = await db.collection("bankStatements").findOne({
            generatorId: id
        });

        if (!statementRecord) {
            return NextResponse.json({ error: "Statement not found" }, { status: 404 });
        }

        // ✅ Pure Buffer - No external libs needed
        const pdfBuffer = Buffer.from(`
            %PDF-1.4
            1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 
            3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj 
            4 0 obj<</Length 100>>stream
            BT /F1 24 Tf 100 700 Td (${statementRecord.companyName}) Tj 100 670 Td (Statement) Tj ET
            endstream endobj 5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj 
            xref 0 6 0000000000 65535 f 0000000010 00000 n 0000000075 00000 n 0000000120 00000 n 0000000250 00000 n 0000000350 00000 n 
            trailer<</Size 6/Root 1 0 R>>startxref 450 %%EOF
        `, 'binary');

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="statement-${id}.pdf"`,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: "Download failed" }, { status: 500 });
    }
}
