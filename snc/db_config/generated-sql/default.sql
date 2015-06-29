
-----------------------------------------------------------------------
-- item
-----------------------------------------------------------------------

DROP TABLE IF EXISTS [item];

CREATE TABLE [item]
(
    [id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    [purchase_order_id] INTEGER,
    [upc] VARCHAR(255),
    [qty] INTEGER,
    [discount] DOUBLE,
    UNIQUE ([id])
);

-----------------------------------------------------------------------
-- purchase_order
-----------------------------------------------------------------------

DROP TABLE IF EXISTS [purchase_order];

CREATE TABLE [purchase_order]
(
    [id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    [filename] VARCHAR(255),
    [store] VARCHAR(255),
    [is_sync] VARCHAR(255),
    [customer_code] VARCHAR(255),
    [delivery_date] DATETIME,
    [number] VARCHAR(255) NOT NULL,
    UNIQUE ([number])
);
