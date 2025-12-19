export const sampleInvoiceCSS = `
body {
font-family: 'Segoe UI', Roboto, sans-serif;
padding: 20px;
background-color: #f9fafb;
margin: 0;
}

.invoice {
background-color: #fff;
border-radius: 12px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
padding: 24px;
max-width: 900px;
margin: auto;
}

.invoice-header {
display: flex;
justify-content: space-between;
border-bottom: 2px solid #2563eb;
padding-bottom: 12px;
margin-bottom: 20px;
}

.company-name {
margin: 0 0 4px 0;
font-size: 1.5rem;
color: #2563eb;
}

.invoice-meta p {
margin: 0;
text-align: right;
}

.invoice-to {
margin-bottom: 20px;
}

.section-title {
border-bottom: 2px solid #2563eb;
font-size: 1.2rem;
margin-bottom: 12px;
color: #1e293b;
padding-bottom: 4px;
}

.invoice-table {
width: 100%;
border-collapse: collapse;
font-size: 0.9rem;
}

.invoice-table th {
background-color: #f3f4f6;
font-weight: 600;
}

.invoice-table th,
.invoice-table td {
border: 1px solid #e5e7eb;
padding: 8px 10px;
text-align: left;
}

.invoice-table td:nth-child(2),
.invoice-table td:nth-child(3),
.invoice-table td:nth-child(4) {
text-align: right;
}

.invoice-summary {
margin-top: 16px;
text-align: right;
display: flex;
flex-direction: column;
gap: 4px;
}
`;