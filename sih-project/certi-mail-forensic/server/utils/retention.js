import mongoose from 'mongoose';

/**
 * Reads RETENTION_DAYS from the environment and ensures the createdAt TTL
 * index on the investigations collection matches it. This runs once at
 * server startup, so changing the env var and redeploying is enough to
 * change the retention period — no manual database migration needed.
 */
export async function ensureRetentionIndex() {
  const retentionDays = parseInt(process.env.RETENTION_DAYS) || 90;
  const expireAfterSeconds = retentionDays * 24 * 60 * 60;

  try {
    const collection = mongoose.connection.collection('investigations');
    const indexes = await collection.indexes();
    const existingTtlIndex = indexes.find((idx) => idx.key?.createdAt === 1 && idx.expireAfterSeconds !== undefined);

    if (!existingTtlIndex) {
      await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds });
      console.log(`--> Retention index created: ${retentionDays} days`);
    } else if (existingTtlIndex.expireAfterSeconds !== expireAfterSeconds) {
      // collMod updates an existing TTL index's expiry without dropping/recreating it
      await mongoose.connection.db.command({
        collMod: 'investigations',
        index: {
          keyPattern: { createdAt: 1 },
          expireAfterSeconds
        }
      });
      console.log(`--> Retention index updated: ${existingTtlIndex.expireAfterSeconds}s -> ${expireAfterSeconds}s (${retentionDays} days)`);
    } else {
      console.log(`--> Retention index already set to ${retentionDays} days`);
    }
  } catch (err) {
    console.log('--> Retention index setup skipped:', err.message);
  }
}

export function getRetentionDays() {
  return parseInt(process.env.RETENTION_DAYS) || 90;
}