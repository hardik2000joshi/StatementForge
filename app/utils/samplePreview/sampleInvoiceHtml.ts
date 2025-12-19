export const sampleInvoiceHTML = `
<!DOCTYPE html>
<html>
<head>
<title>Sample Invoice</title>
</head>
<body>
<div class="invoice">
    <div class="invoice-header">
      <div>
      <h1 class="company-name">{{companyName}}</h1>
      <p>{{companyAddress}}</p>
      </div>
      <div class="invoice-meta">
      <p>
      <strong>
      Invoice #:
      </strong>
      {{invoiceNumber}}
      </p>
      <p>
      <strong>
      Date:
      </strong>
      {{date}}
      </p>
      <p>
      <strong>
      Due Date:
      </strong>
      {{dueDate}}
      </p>
      </div>
      </div>

      <div class="invoice-to">
      <h3>Bill To:</h3>
      <p>{{clientName}}</p>
      <p>{{clientAddress}}</p>
      </div>

      <h2 class="section-title">
      Items
      </h2>

      <table class="invoice-table">
      <thead>
      <tr>
      <th>
      Description
      </th>
      <th>
      Qty
      </th>
      <th>
      Price
      </th>
      <th>
      Total
      </th>
      </tr>
      </thead>

      <tbody>
      {{items}}
      </tbody>
      </table>

      <div class="invoice-summary">
      <div>
      <strong>
      Subtotal:
      </strong>
      {{subtotal}}
      </div>
      <div>
      <strong>
      Tax ({{taxRate}}%): 
      </strong>
      {{taxAmount}}
      </div> 
      <div>
      <strong>
      Total:
      </strong>
      {{total}}
      </div>
      </div>
      </div>
</body>
</html>
`;