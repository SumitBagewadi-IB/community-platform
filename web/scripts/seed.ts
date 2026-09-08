// One-time/idempotent Firestore seed script. Run with:
//   npx tsx scripts/seed.ts
// Uses Application Default Credentials (gcloud auth application-default login)
// against NEXT_PUBLIC_FIREBASE_PROJECT_ID — needs write access to Firestore.

import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { categories, topics as seedTopics, parseCount } from "../src/lib/data";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ibproduct-vibe-coding";

if (!getApps().length) {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}

const db = getFirestore();

function relativeToDate(rel: string): Date {
  const now = Date.now();
  const s = rel.trim().toLowerCase();

  if (s === "just now") return new Date(now);

  // compact form: "5m", "2d", "1h"
  const compact = s.match(/^(\d+)([smhd])$/);
  if (compact) {
    const unitMs: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return new Date(now - parseInt(compact[1], 10) * unitMs[compact[2]]);
  }

  // verbose form: "5 minutes ago", "1 hour ago", "2 days ago"
  const verbose = s.match(/^(\d+)\s*(second|minute|hour|day)s?\s*ago$/);
  if (verbose) {
    const unitMs: Record<string, number> = {
      second: 1000,
      minute: 60000,
      hour: 3600000,
      day: 86400000,
    };
    return new Date(now - parseInt(verbose[1], 10) * unitMs[verbose[2]]);
  }

  return new Date(now - 1000 * 60 * 60 * 24 * 2); // fallback: 2 days ago
}

async function seed() {
  console.log(`Seeding Firestore in project ${PROJECT_ID}...`);

  const catBatch = db.batch();
  categories.forEach((cat, i) => {
    catBatch.set(db.collection("categories").doc(cat.slug), {
      name: cat.name,
      color: cat.color,
      order: i,
    });
  });
  await catBatch.commit();
  console.log(`Seeded ${categories.length} categories.`);

  for (const topic of seedTopics) {
    const topicRef = db.collection("topics").doc(topic.slug);
    const lastActivityAt = Timestamp.fromDate(relativeToDate(topic.activity));

    await topicRef.set({
      title: topic.title,
      categorySlug: topic.categorySlug,
      authorId: "seed",
      authorName: topic.posts[0]?.author ?? "Team_IBS",
      authorInitials: topic.posts[0]?.initials ?? "IB",
      pinned: Boolean(topic.pinned),
      views: parseCount(topic.views),
      repliesCount: topic.replies,
      createdAt: lastActivityAt,
      lastActivityAt,
    });

    const postsCol = topicRef.collection("posts");
    const existing = await postsCol.limit(1).get();
    if (existing.empty) {
      for (const post of topic.posts) {
        await postsCol.add({
          authorId: "seed",
          authorName: post.author,
          authorInitials: post.initials,
          body: post.body.join("\n\n"),
          isOp: Boolean(post.isOp),
          // Placeholder ids so seeded posts start with a believable like count
          // (real toggles add/remove the current user's actual uid on top).
          likedBy: Array.from({ length: post.likes }, (_, i) => `seed-like-${i}`),
          createdAt: Timestamp.fromDate(relativeToDate(post.timeAgo)),
        });
      }
      console.log(`  seeded ${topic.posts.length} posts for "${topic.slug}"`);
    } else {
      console.log(`  posts already exist for "${topic.slug}", skipping`);
    }
  }

  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
