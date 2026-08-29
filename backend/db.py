"""
MongoDB connection with retries (Windows SSL handshake is flaky).
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, AutoReconnect
from config import Config
import time


class MongoDB:
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def connect(self, retries=5):
        if self._db is not None:
            return self._db

        Config.validate()
        last_error = None

        for attempt in range(1, retries + 1):
            print(f"Connecting to MongoDB Atlas... (attempt {attempt}/{retries})")
            try:
                self._client = MongoClient(
                    Config.MONGODB_URI,
                    serverSelectionTimeoutMS=20000,
                    connectTimeoutMS=20000,
                    tlsInsecure=True
                )
                self._client.admin.command("ping")
                self._db = self._client[Config.DATABASE_NAME]
                print("Successfully connected to MongoDB!")
                print(f"Using database: {Config.DATABASE_NAME}")
                self._setup_collections()
                return self._db
            except (ServerSelectionTimeoutError, ConnectionFailure, AutoReconnect) as e:
                last_error = e
                print(f"Attempt {attempt} failed. Retrying in 3 seconds...")
                time.sleep(3)

        print("Could not connect to MongoDB after retries.")
        raise last_error

    def _setup_collections(self):
        print("Setting up collections and indexes...")
        self.medicines.create_index("medicine_name")
        self.doctors.create_index("doctor_id", unique=True)
        self.patients.create_index("patient_id", unique=True)
        self.prescriptions.create_index([("patient_id", 1), ("is_active", 1)])
        self.interaction_logs.create_index([("patient_id", 1), ("check_date", -1)])
        print("Collections ready!")

    def _col(self, name):
        self.connect()
        return self._db[name]

    @property
    def medicines(self):
        return self._col("medicines")

    @property
    def doctors(self):
        return self._col("doctors")

    @property
    def patients(self):
        return self._col("patients")

    @property
    def prescriptions(self):
        return self._col("prescriptions")

    @property
    def interaction_logs(self):
        return self._col("interaction_logs")

    def get_collection_stats(self):
        self.connect()
        stats = {}
        for name in ["medicines", "doctors", "patients", "prescriptions", "interaction_logs"]:
            stats[name] = self._db[name].count_documents({})
        return stats


db = MongoDB()