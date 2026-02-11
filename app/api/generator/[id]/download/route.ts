import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import {ObjectId} from "mongodb";
import puppeteer from 'puppeteer';
import fs from "fs";
import path from "path";

interface Transaction {
    date?: string;
    description?: string;
    amount: number;
    type: 'credit' | 'debit';
    balance?: number;
}
export async function GET(request: NextRequest, {params}: {params: {id: string}}) {
    try {
        const {id} = params;
        const client = await clientPromise;
        const db = client.db("myAccountDB");
        
        let statementRecord = await db.collection("bankStatements").findOne({
            generatorId: id
        });

        if (!statementRecord) {
            statementRecord = await db.collection("generator").findOne({
                _id: new ObjectId(id)
            });
        }

        if (!statementRecord) {
            return NextResponse.json({
                error: "Statement not found"
            }, {
                status: 404
            });
        }

        const htmlTemplate = fs.readFileSync(
            path.join(process.cwd(), 'app/Templates/basic_invoice_template.html'),
            'utf-8'
        );

        const cssContent = fs.readFileSync(
            path.join(process.cwd(), 'app/Templates/basic_invoice_template.css'),
            'utf-8'
        );

        const openingBalanceNum = Number(statementRecord.openingBalance || 0);
        const transactionsWithBalance = statementRecord.transactions.map((t: any, index: number) => {

            let runningBalance = openingBalanceNum;
            // Calculate running balance up to this transaction
            for(let i=0; i<=index; i++) {
                const prevTxn: any = statementRecord.transactions[i];
                if (prevTxn.type === "credit") {
                    runningBalance += Number(prevTxn.amount || 0);
                }
                else {
                    runningBalance -= Number(prevTxn.amount || 0);
                }
            }

            return {
                ...t, balance: runningBalance.toFixed(2)
            };
        })

        let transactionsHTML = '';
        if (transactionsWithBalance.length > 0) {
            transactionsHTML = transactionsWithBalance.map((t: any) => `
            <tr class="${t.type === 'credit' ? 'selectable' : 'selectable'} 
            ${t.selected ? 'selected-row' : ''}">
            <td>
            <input type="checkbox" ${t.selected ? 'checked' : ''} disabled>
            </td>
            <td>
            ${t.date || ""}
            </td>
            <td>
            ${t.description || ""}
            </td>
            <td class="amount ${t.type || 'debit'}">
            ${t.amount || ''}
            </td>
            <td class="balance">
            £${t.balance}
            </td>
            <td>
            ${t.type || ""}
            </td>
            </tr>
            `).join('');
        }
        else {
            transactionsHTML = '<tr><td colspan="6" style="text-align: center">No transactions found</td></tr>';
        }

        const finalHtml = htmlTemplate
        .replace('{{bankName}}', statementRecord.bankName || '')
        .replace('{{companyName}}', statementRecord.companyName || '')
        .replace('{{accountNumber}}', statementRecord.accountNumber)
        .replace('{{periodStart}}', statementRecord.periodStart || '')
        .replace('{{periodEnd}}', statementRecord.periodEnd || '')
        .replace('{{totalTransactions}}', (statementRecord.transactions?.length || 0).toString())
        .replace('{{openingBalance}}', statementRecord.openingBalance || '0.00')
        .replace('{{closingBalance}}', statementRecord.closingBalance || '0.00')
        .replace('{{transactions}}', transactionsHTML)

        // Inline CSS
        .replace('</head>', `<style>${cssContent}</style></head>`);  // injects external css file directly into html <head> for PDF generation

        // Puppeteer generates PDF from your HTML
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',  // For dev only
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        await page.setContent(finalHtml, {waitUntil: 'networkidle0'})
        // Pure Buffer - No external libs needed
        const pdfBuffer = Buffer.from(await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '10px',
                right: '10px'
            }
        }));

        await browser.close();

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="bank-statement-${id}.pdf"`,
            },
        });
    } catch (error: any) {
        console.error("PDF Generation Error: ", error);
        return NextResponse.json({ error: `Download failed: ${error.message}`}, { status: 500 });
    }
}
