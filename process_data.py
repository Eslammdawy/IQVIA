import pandas as pd
import json
import base64
import os

print("Reading Excel file...")
df = pd.read_excel("IQVIA.xlsx", sheet_name="Sheet1")
print(f"Initial raw rows: {len(df)}")

# Normalize column names: strip whitespace and replace internal newlines
df.columns = [str(c).replace('\n', ' ').strip() for c in df.columns]

# Drop Excel summary / Grand Total rows
df = df[~df['ATC4'].astype(str).str.strip().str.lower().isin(['grand total', 'total'])].copy()
df = df[df['Product'].notna() & (df['Product'].astype(str).str.strip() != '')].copy()
print(f"Rows after removing Grand Total / blanks: {len(df)}")

# Clean string columns
for col in ['ATC4', 'Product', 'Pack', 'Strength', 'NFC1']:
    df[col] = df[col].fillna('-').astype(str).str.strip()
    df.loc[df[col] == '', col] = '-'
    df.loc[df[col] == 'nan', col] = '-'

# Numeric columns
num_cols = [
    'Units MAT Jul 2023', 'Units MAT Jul 2024', 'Units MAT Jul 2025', 'Units MAT Jul 2026',
    'LC Value MAT Jul 2023', 'LC Value MAT Jul 2024', 'LC Value MAT Jul 2025', 'LC Value MAT Jul 2026'
]
for col in num_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

# Aggregation: Group by (ATC4, Product, NFC1, Strength) and sum
print("Aggregating rows...")
agg_df = df.groupby(['ATC4', 'Product', 'Pack', 'NFC1', 'Strength'], as_index=False)[num_cols].sum()
print(f"Aggregated to {len(agg_df)} peer rows.")

# Build compact data array
# Schema: [ATC4, Product, Pack, NFC1, Strength, U23, U24, U25, U26, V23, V24, V25, V26]
def clean_num(v):
    """Round to 2dp and convert whole numbers to int to avoid .0 in JSON."""
    v = round(float(v), 2)
    if v == int(v):
        return int(v)
    return v

# Round numeric columns in-place for efficiency
for col in num_cols:
    agg_df[col] = agg_df[col].round(2)

# Build rows using pandas vectorized access (faster than itertuples + getattr)
str_cols = ['ATC4', 'Product', 'Pack', 'NFC1', 'Strength']
str_data = agg_df[str_cols].values.tolist()
num_data = agg_df[num_cols].values.tolist()

data_rows = []
for s_row, n_row in zip(str_data, num_data):
    data_rows.append(s_row + [clean_num(v) for v in n_row])

with open("processed_data.json", "w", encoding="utf-8") as f:
    json.dump(data_rows, f, separators=(',', ':'))

print(f"Saved processed_data.json with {len(data_rows)} rows. Size: {os.path.getsize('processed_data.json') / 1024:.2f} KB")

# Summary statistics
top_atc4 = agg_df.groupby('ATC4')['LC Value MAT Jul 2026'].sum().sort_values(ascending=False).head(5)
top_prod = agg_df.groupby('Product')['LC Value MAT Jul 2026'].sum().sort_values(ascending=False).head(5)
print("\nTop 5 ATC4s by LC Value 2026:")
for atc, val in top_atc4.items():
    print(f"  {atc}: {val:,.2f}")
print("\nTop 5 Products by LC Value 2026:")
for prod, val in top_prod.items():
    print(f"  {prod}: {val:,.2f}")
