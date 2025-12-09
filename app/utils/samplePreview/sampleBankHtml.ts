export const sampleBankHTML = ` 
<!DOCTYPE html>
<html>
<head>
<title> Sample Bank Statement </title>
</head>
<body>
<div class="bank-statement">
            <!-- Header Section -->
            <div class="statement-header">
                <div class="header-left">
                 <h1 class="bank-name">
                        {{bankName}}
            </h1>
                <p>
                <strong>
                Account Holder:
                </strong>
                    Webnatics Ltd.
            </p>
            <p>
                <strong>
                Account Number: 
                </strong>
                    1234567890
            </p>
                </div>

                <div class="header-right">
                    <p>
                        <strong>
                            Statement Period:
                        </strong>
                    </p>
                    <p>
                        12/01/2025-12/07/2025
                    </p>
                </div>
            </div>

            <!-- Summary Section -->
            <div class="statement-summary">
                <div>
                    <strong>
                        Transactions:
                    </strong>
                    10
                </div>
                <div>
                    <strong>
                        Opening Balance:
                    </strong>
                    60000
                </div>
                <div>
                    <strong>
                        Closing Balance
                    </strong>
                    58700
                </div>
            </div>

            <!-- Transaction Table -->
            <h2 class="section-title">
                Transaction Details
            </h2>

            <table class="transactions-table">
            <thead>
            <tr>
                <th>
                    Date
                </th>
                <th>
                    Description
                </th>
                <th>
                    Amount
                </th>
                <th>
                    Balance
                </th>
                <th>
                    Type
                </th>
            </tr>
            </thead>

            <tbody>
                {{transactions}}
                </tbody>
                </table>
                </div>
</body>
</html>
`