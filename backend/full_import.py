from seed_medicines import import_medicines_from_csv
import time

print("🚀 Full import of ~253,973 medicines. Do not close this window.\n")
start = time.time()
import_medicines_from_csv(force_reimport=True, max_rows=None)
print(f"\n⏱️  Done in {(time.time() - start) / 60:.1f} minutes")