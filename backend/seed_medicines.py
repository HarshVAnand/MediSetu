"""
Import A-Z Medicines Dataset of India into MongoDB.
"""

import pandas as pd
import os
from datetime import datetime
from db import db

CSV_FILENAME = "A_Z_medicines_dataset_of_India.csv"


def import_medicines_from_csv(force_reimport=False, max_rows=None):
    csv_path = os.path.join(os.path.dirname(__file__), CSV_FILENAME)

    if not os.path.exists(csv_path):
        print(f"❌ CSV not found: {csv_path}")
        print("   Put A_Z_medicines_dataset_of_India.csv in the backend folder.")
        return

    existing_count = db.medicines.count_documents({})
    if existing_count > 0 and not force_reimport:
        print(f"ℹ️  Already have {existing_count} medicines. Skipping.")
        print("   Use force_reimport=True to replace them.")
        return

    if force_reimport and existing_count > 0:
        print(f"🗑️  Clearing {existing_count} existing medicines...")
        db.medicines.delete_many({})

    print(f"📂 Reading CSV: {csv_path}")

    chunk_size = 5000
    total_inserted = 0
    total_skipped = 0

    reader = pd.read_csv(
        csv_path,
        chunksize=chunk_size,
        nrows=max_rows,
        encoding="utf-8",
        on_bad_lines="skip"
    )

    print(f"⏳ Importing in batches of {chunk_size}...\n")

    for chunk_num, chunk_df in enumerate(reader, 1):
        documents = []

        for _, row in chunk_df.iterrows():
            try:
                name = clean_str(row.get("name"))
                if not name:
                    total_skipped += 1
                    continue

                comp1 = clean_str(row.get("short_composition1"))
                comp2 = clean_str(row.get("short_composition2"))
                parts = [c for c in [comp1, comp2] if c]
                generic_name = " + ".join(parts) if parts else name

                doc = {
                    "medicine_name": name,
                    "generic_name": generic_name,
                    "drug_class": clean_str(row.get("type")) or "General",
                    "manufacturer": clean_str(row.get("manufacturer_name")),
                    "price": clean_float(row.get("price(₹)")),
                    "pack_size": clean_str(row.get("pack_size_label")),
                    "is_discontinued": str(row.get("Is_discontinued")).strip().lower() == "true",
                    "rxcui": str(clean_str(row.get("id")) or ""),
                    "composition1": comp1,
                    "composition2": comp2,
                    "imported_at": datetime.utcnow(),
                    "source": "az_india_dataset",
                }
                doc = {k: v for k, v in doc.items() if v not in (None, "", "nan")}
                documents.append(doc)
            except Exception:
                total_skipped += 1

        if documents:
            db.medicines.insert_many(documents, ordered=False)
            total_inserted += len(documents)

        print(f"   ✅ Batch {chunk_num}: {total_inserted:,} inserted...")

    final_count = db.medicines.count_documents({})
    print(f"\n✅ IMPORT COMPLETE!")
    print(f"   Total medicines in database: {final_count:,}")
    print(f"   Skipped rows: {total_skipped:,}")


def clean_str(value):
    if value is None or pd.isna(value):
        return None
    s = str(value).strip()
    return s if s.lower() != "nan" else None


def clean_float(value):
    if value is None or pd.isna(value):
        return None
    try:
        return round(float(value), 2)
    except (ValueError, TypeError):
        return None


if __name__ == "__main__":
    print("🧪 TEST RUN: first 500 rows only\n")
    import_medicines_from_csv(force_reimport=True, max_rows=500)