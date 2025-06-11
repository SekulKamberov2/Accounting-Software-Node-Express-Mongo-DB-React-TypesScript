 # SQL

 ```sql

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'AccountingDB') 
BEGIN 
   CREATE DATABASE AccountingDB; 
END 
  
USE AccountingDB; 
 
BEGIN TRANSACTION;

BEGIN TRY
    
    CREATE TABLE Users (
        Id INT IDENTITY PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) NOT NULL, -- e.g., admin, accountant
        RefreshToken NVARCHAR(MAX) NULL,
        RefreshTokenExpiry DATETIME NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        Picture NVARCHAR(MAX) NULL;
    );
 
    CREATE TABLE Invoices (
        Id INT IDENTITY PRIMARY KEY,
        CustomerId INT NOT NULL,
        Date DATE NOT NULL,
        TaxRate FLOAT NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
        -- MAY BE FK to Customers if needed
    );
 
    CREATE TABLE InvoiceItems (
        Id INT IDENTITY PRIMARY KEY,
        InvoiceId INT NOT NULL FOREIGN KEY REFERENCES Invoices(Id) ON DELETE CASCADE,
        Description NVARCHAR(255) NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice FLOAT NOT NULL
    );
 
    CREATE TABLE Payments (
        Id INT IDENTITY PRIMARY KEY,
        InvoiceId INT NOT NULL FOREIGN KEY REFERENCES Invoices(Id) ON DELETE CASCADE,
        Amount FLOAT NOT NULL,
        Date DATE NOT NULL,
        Method NVARCHAR(50) NOT NULL -- e.g. credit_card, cash
    );
 
    CREATE TABLE Accounts (
        Id INT IDENTITY PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Type NVARCHAR(50) NOT NULL, -- e.g., Asset, Liability, Expense, Revenue, Equity
        Code NVARCHAR(20) UNIQUE NOT NULL
    );
 
    CREATE TABLE JournalEntries (
        Id INT IDENTITY PRIMARY KEY,
        Date DATE NOT NULL,
        Description NVARCHAR(255),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
 
    CREATE TABLE JournalEntryLines (
        Id INT IDENTITY PRIMARY KEY,
        JournalEntryId INT NOT NULL FOREIGN KEY REFERENCES JournalEntries(Id) ON DELETE CASCADE,
        AccountId INT NOT NULL FOREIGN KEY REFERENCES Accounts(Id),
        Debit FLOAT DEFAULT 0,
        Credit FLOAT DEFAULT 0
    );
 
    CREATE TABLE Expenses (
        Id INT IDENTITY PRIMARY KEY,
        Date DATE NOT NULL,
        VendorId INT NOT NULL,
        Amount FLOAT NOT NULL,
        Description NVARCHAR(255),
        AccountId INT NOT NULL FOREIGN KEY REFERENCES Accounts(Id)
    );
 
    CREATE TABLE Vendors (
        Id INT IDENTITY PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        ContactEmail NVARCHAR(255),
        Phone NVARCHAR(20)
    );
 
    CREATE TABLE BankTransactions (
        Id INT IDENTITY PRIMARY KEY,
        Date DATE NOT NULL,
        Description NVARCHAR(255),
        Amount FLOAT NOT NULL,
        AccountId INT NOT NULL FOREIGN KEY REFERENCES Accounts(Id)
    );
 
    CREATE TABLE Taxes (
        Id INT IDENTITY PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL,
        Rate FLOAT NOT NULL -- e.g., 0.15 for 15%
    );
 
    CREATE TABLE RecurringInvoices (
        Id INT IDENTITY PRIMARY KEY,
        CustomerId INT NOT NULL,
        Interval NVARCHAR(50) NOT NULL, -- e.g., monthly, yearly
        StartDate DATE NOT NULL
    );

    CREATE TABLE RecurringInvoiceItems (
        Id INT IDENTITY PRIMARY KEY,
        RecurringInvoiceId INT NOT NULL FOREIGN KEY REFERENCES RecurringInvoices(Id) ON DELETE CASCADE,
        Description NVARCHAR(255) NOT NULL,
        Quantity INT NOT NULL,
        UnitPrice FLOAT NOT NULL
    );

    COMMIT TRANSACTION;
    PRINT 'All tables created successfully.';
END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Error occurred: ' + ERROR_MESSAGE();
END CATCH;

INSERT INTO Users (Name, Email, PasswordHash, Role, RefreshToken, RefreshTokenExpiry)
VALUES
('Alice Johnson', 'alice@example.com', 'hash1', 'admin', NULL, NULL),
('Bob Smith', 'bob@example.com', 'hash2', 'accountant', NULL, NULL),
('Carol Davis', 'carol@example.com', 'hash3', 'user', NULL, NULL),
('David Wilson', 'david@example.com', 'hash4', 'user', NULL, NULL),
('Eve Brown', 'eve@example.com', 'hash5', 'user', NULL, NULL),
('Frank Moore', 'frank@example.com', 'hash6', 'accountant', NULL, NULL),
('Grace Lee', 'grace@example.com', 'hash7', 'admin', NULL, NULL),
('Hank Taylor', 'hank@example.com', 'hash8', 'user', NULL, NULL),
('Ivy Anderson', 'ivy@example.com', 'hash9', 'user', NULL, NULL),
('Jack White', 'jack@example.com', 'hash10', 'accountant', NULL, NULL);


INSERT INTO Vendors (Name, ContactEmail, Phone)
VALUES
('Vendor A', 'contact@vendora.com', '123-456-7890'),
('Vendor B', 'contact@vendorb.com', '234-567-8901'),
('Vendor C', 'contact@vendorc.com', '345-678-9012'),
('Vendor D', 'contact@vendord.com', '456-789-0123'),
('Vendor E', 'contact@vendore.com', '567-890-1234'),
('Vendor F', 'contact@vendorf.com', '678-901-2345'),
('Vendor G', 'contact@vendorg.com', '789-012-3456'),
('Vendor H', 'contact@vendorh.com', '890-123-4567'),
('Vendor I', 'contact@vendori.com', '901-234-5678'),
('Vendor J', 'contact@vendorj.com', '012-345-6789');


INSERT INTO Accounts (Name, Type, Code)
VALUES
('Cash', 'Asset', '1000'),
('Accounts Receivable', 'Asset', '1100'),
('Office Supplies', 'Expense', '5000'),
('Sales Revenue', 'Revenue', '4000'),
('Rent Expense', 'Expense', '5100'),
('Accounts Payable', 'Liability', '2000'),
('Bank Loan', 'Liability', '2100'),
('Owner Equity', 'Equity', '3000'),
('Utilities Expense', 'Expense', '5200'),
('Service Revenue', 'Revenue', '4100');


INSERT INTO Taxes (Name, Rate)
VALUES
('VAT', 0.15),
('GST', 0.10),
('Sales Tax', 0.07),
('Service Tax', 0.05),
('Luxury Tax', 0.20),
('Excise Tax', 0.12),
('Import Duty', 0.08),
('Export Duty', 0.06),
('Environmental Tax', 0.03),
('Tourism Tax', 0.04);


INSERT INTO Invoices (CustomerId, Date, TaxRate)
VALUES
(1, '2025-01-01', 0.15),
(2, '2025-01-10', 0.10),
(3, '2025-01-15', 0.07),
(1, '2025-02-01', 0.15),
(2, '2025-02-10', 0.10),
(3, '2025-02-15', 0.07),
(1, '2025-03-01', 0.15),
(2, '2025-03-10', 0.10),
(3, '2025-03-15', 0.07),
(1, '2025-04-01', 0.15);


INSERT INTO InvoiceItems (InvoiceId, Description, Quantity, UnitPrice)
VALUES
(1, 'Consulting Services', 10, 100.00),
(1, 'Software License', 5, 200.00),
(2, 'Hardware Setup', 3, 150.00),
(3, 'Maintenance Service', 12, 50.00),
(4, 'Consulting Services', 7, 110.00),
(5, 'Software License', 6, 210.00),
(6, 'Hardware Setup', 2, 140.00),
(7, 'Maintenance Service', 10, 55.00),
(8, 'Consulting Services', 8, 105.00),
(9, 'Software License', 4, 220.00);


INSERT INTO Payments (InvoiceId, Amount, Date, Method)
VALUES
(1, 1500.00, '2025-01-05', 'credit_card'),
(2, 450.00, '2025-01-12', 'cash'),
(3, 600.00, '2025-01-20', 'credit_card'),
(4, 770.00, '2025-02-05', 'bank_transfer'),
(5, 1260.00, '2025-02-12', 'credit_card'),
(6, 280.00, '2025-02-20', 'cash'),
(7, 550.00, '2025-03-05', 'credit_card'),
(8, 550.00, '2025-03-12', 'bank_transfer'),
(9, 880.00, '2025-03-20', 'credit_card'),
(10, 1200.00, '2025-04-05', 'cash');


INSERT INTO JournalEntries (Date, Description)
VALUES
('2025-01-01', 'Invoice 1 created'),
('2025-01-10', 'Invoice 2 created'),
('2025-01-15', 'Invoice 3 created'),
('2025-02-01', 'Invoice 4 created'),
('2025-02-10', 'Invoice 5 created'),
('2025-02-15', 'Invoice 6 created'),
('2025-03-01', 'Invoice 7 created'),
('2025-03-10', 'Invoice 8 created'),
('2025-03-15', 'Invoice 9 created'),
('2025-04-01', 'Invoice 10 created');

INSERT INTO JournalEntryLines (JournalEntryId, AccountId, Debit, Credit)
VALUES
(1, 2, 1000.00, 0),
(1, 4, 0, 1000.00),
(2, 2, 500.00, 0),
(2, 4, 0, 500.00),
(3, 2, 600.00, 0),
(3, 4, 0, 600.00),
(4, 2, 700.00, 0),
(4, 4, 0, 700.00),
(5, 2, 1200.00, 0),
(5, 4, 0, 1200.00);

INSERT INTO Expenses (Date, VendorId, Amount, Description, AccountId)
VALUES
('2025-01-05', 1, 300.00, 'Office Supplies', 1),
('2025-01-15', 2, 1200.00, 'Rent', 2),
('2025-02-01', 3, 450.00, 'Internet Bill', 3),
('2025-02-10', 4, 200.00, 'Utilities', 3),
('2025-02-20', 5, 150.00, 'Cleaning', 2),
('2025-03-01', 6, 500.00, 'Maintenance', 1),
('2025-03-10', 7, 100.00, 'Office Snacks', 1),
('2025-03-15', 8, 250.00, 'Printing', 1),
('2025-04-01', 9, 300.00, 'Phone Bill', 3),
('2025-04-05', 10, 700.00, 'Software Subscription', 1);

INSERT INTO BankTransactions (Date, Description, Amount, AccountId)
VALUES
('2025-01-05', 'Deposit', 5000.00, 1),
('2025-01-10', 'Withdrawal', -2000.00, 1),
('2025-01-15', 'Deposit', 3000.00, 1),
('2025-02-01', 'Withdrawal', -1500.00, 1),
('2025-02-10', 'Deposit', 4000.00, 1),
('2025-02-15', 'Withdrawal', -1000.00, 1),
('2025-03-01', 'Deposit', 3500.00, 1),
('2025-03-10', 'Withdrawal', -1800.00, 1),
('2025-03-15', 'Deposit', 2700.00, 1),
('2025-04-01', 'Withdrawal', -2200.00, 1);


INSERT INTO RecurringInvoices (CustomerId, Interval, StartDate)
VALUES
(1, 'monthly', '2025-01-01'),
(2, 'yearly', '2025-01-01'),
(3, 'monthly', '2025-02-01'),
(1, 'yearly', '2025-03-01'),
(2, 'monthly', '2025-04-01'),
(3, 'monthly', '2025-05-01'),
(1, 'monthly', '2025-06-01'),
(2, 'yearly', '2025-07-01'),
(3, 'monthly', '2025-08-01'),
(1, 'yearly', '2025-09-01');


INSERT INTO RecurringInvoiceItems (RecurringInvoiceId, Description, Quantity, UnitPrice)
VALUES
(1, 'Monthly Consulting', 10, 100.00),
(1, 'Monthly Support', 5, 50.00),
(2, 'Annual Maintenance', 1, 1200.00),
(3, 'Monthly Consulting', 8, 110.00),
(4, 'Annual License', 1, 2000.00),
(5, 'Monthly Support', 6, 55.00),
(6, 'Monthly Consulting', 7, 105.00),
(7, 'Monthly Support', 4, 60.00),
(8, 'Annual Maintenance', 1, 1300.00),
(9, 'Monthly Consulting', 9, 115.00);

# Contents:
1.Authentication
2.User Management
3.Invoicing
4.Payments
5.Chart of Accounts
6.Journal Entries
7.Financial Reports
8.Expenses
9.Vendors
10.Bank Transactions
11.Tax Management 

## Routes:
1. POST /api/auth/login
2. POST /api/auth/register
3. POST /api/auth/refresh
4. GET /api/users
5. GET /api/users/:id
6. POST /api/invoices
7. GET /api/invoices
8. GET /api/invoices/:id 
9. PUT /api/invoices/:id
10. DELETE /api/invoices/:id
11. POST /api/payments
12. GET /api/payments
13. GET /api/accounts
14. POST /api/accounts
15. POST /api/journal-entries
16. GET /api/journal-entries
17. GET /api/reports/profit-loss?start_date=2025-01-01&end_date=2025-06-09
18. GET /api/reports/balance-sheet?date=2025-06-09
19. POST /api/expenses
20. GET /api/expenses?start=2025-01-01&end=2025-06-09
21. GET /api/vendors
22. POST /api/vendors
23. POST /api/bank-transactions/import
24. GET /api/bank-transactions
25. POST /api/taxes
26. GET /api/taxes
27. POST /api/recurring-invoices
{
  "customer_id": 1,
  "interval": "monthly",
  "start_date": "2025-06-01",
  "items": [
    { "description": "Hosting Subscription", "quantity": 1, "unit_price": 50 }
  ]
}
