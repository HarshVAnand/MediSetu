"""
Run this FIRST to see the exact column names and sample data
in your CSV file before importing anything into MongoDB.
"""
import pandas as pd
import os

# ⚠️ CHANGE THIS to match your exact CSV filename
CSV_FILENAME = "A_Z_medicines_dataset_of_India.csv"

csv_path = os.path.join(os.path.dirname(__file__), CSV_FILENAME)

if not os.path.exists(csv_path):
    print(f"❌ File not found: {csv_path}")
    print("   Make sure the CSV is inside the 'backend' folder")
    print(f"   and the filename matches exactly (check for typos, spaces, .csv extension)")
else:
    # Read only first 5 rows - fast even for huge files
    df = pd.read_csv(csv_path, nrows=5)

    print("=" * 70)
    print("✅ CSV FOUND! Here are the details:")
    print("=" * 70)

    print(f"\n📋 COLUMN NAMES ({len(df.columns)} total):")
    for i, col in enumerate(df.columns, 1):
        print(f"   {i}. '{col}'")

    print(f"\n📊 SAMPLE DATA (first 3 rows):")
    print(df.head(3).to_string())

    print(f"\n📁 File size check:")
    size_mb = os.path.getsize(csv_path) / (1024 * 1024)
    print(f"   {size_mb:.2f} MB")

    # Count total rows (this reads the whole file, may take a moment for large files)
    print(f"\n🔢 Counting total rows (this may take a few seconds for large files)...")
    total_rows = sum(1 for _ in open(csv_path, encoding='utf-8', errors='ignore')) - 1
    print(f"   Total rows: {total_rows:,}")