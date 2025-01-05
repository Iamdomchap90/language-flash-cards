import clientPromise from '.';

let db;
let vocab;

async function init() {
  if (db) return;
  try {
    client = await _mongoClientPromise;
    db = await client.db();
    vocabCards = await db.collection('vocab_cards');
  } catch (error) {
    throw new Error('Failed to connect to database.');
  }
}

(async () => {
  await init();
})();

export async function getVocabCards() {
  try {
    if (!vocabCards) await init();
    const result = await vocabCards
      .find({})
      .limit(10)
      .map((user) => ({ ...user, _id: user._id.toString() }))
      .toArray();

    return { vocabs: result };
  } catch (error) {
    return { error: 'Failed to fetch vocab cards!' };
  }
}
