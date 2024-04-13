CREATE TABLE IF NOT EXISTS expenses(
    id SERIAL,
    date DATE PRIMARY KEY,
    expenses NUMERIC
)