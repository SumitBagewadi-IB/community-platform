import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export type TopicSummary = {
  slug: string;
  title: string;
  categorySlug: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  pinned: boolean;
  views: number;
  repliesCount: number;
  createdAt: Date;
  lastActivityAt: Date;
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  body: string;
  isOp: boolean;
  likedBy: string[];
  createdAt: Date;
};

function toDate(ts: Timestamp | null | undefined): Date {
  return ts ? ts.toDate() : new Date();
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "topic";
}

export function subscribeTopics(callback: (topics: TopicSummary[]) => void): Unsubscribe {
  const q = query(collection(db, "topics"), orderBy("lastActivityAt", "desc"));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          slug: d.id,
          title: data.title,
          categorySlug: data.categorySlug,
          authorId: data.authorId,
          authorName: data.authorName,
          authorInitials: data.authorInitials,
          pinned: Boolean(data.pinned),
          views: data.views ?? 0,
          repliesCount: data.repliesCount ?? 0,
          createdAt: toDate(data.createdAt),
          lastActivityAt: toDate(data.lastActivityAt),
        };
      })
    );
  });
}

export function subscribeTopic(
  slug: string,
  callback: (topic: TopicSummary | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, "topics", slug), (snap) => {
    if (!snap.exists()) {
      callback(null);
      return;
    }
    const data = snap.data();
    callback({
      slug: snap.id,
      title: data.title,
      categorySlug: data.categorySlug,
      authorId: data.authorId,
      authorName: data.authorName,
      authorInitials: data.authorInitials,
      pinned: Boolean(data.pinned),
      views: data.views ?? 0,
      repliesCount: data.repliesCount ?? 0,
      createdAt: toDate(data.createdAt),
      lastActivityAt: toDate(data.lastActivityAt),
    });
  });
}

export function subscribeTopicPosts(
  slug: string,
  callback: (posts: Post[]) => void
): Unsubscribe {
  const q = query(collection(db, "topics", slug, "posts"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorId: data.authorId,
          authorName: data.authorName,
          authorInitials: data.authorInitials,
          body: data.body,
          isOp: Boolean(data.isOp),
          likedBy: data.likedBy ?? [],
          createdAt: toDate(data.createdAt),
        };
      })
    );
  });
}

type Author = { uid: string; name: string; initials: string };

export async function createTopic(
  title: string,
  body: string,
  categorySlug: string,
  author: Author
): Promise<string> {
  let slug = slugify(title);
  const topicRef = doc(db, "topics", slug);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(topicRef);
    const finalRef = existing.exists() ? doc(db, "topics", `${slug}-${Date.now().toString(36)}`) : topicRef;
    if (finalRef.id !== slug) slug = finalRef.id;

    tx.set(finalRef, {
      title,
      categorySlug,
      authorId: author.uid,
      authorName: author.name,
      authorInitials: author.initials,
      pinned: false,
      views: 1,
      repliesCount: 0,
      createdAt: serverTimestamp(),
      lastActivityAt: serverTimestamp(),
    });

    const postRef = doc(collection(finalRef, "posts"));
    tx.set(postRef, {
      authorId: author.uid,
      authorName: author.name,
      authorInitials: author.initials,
      body,
      isOp: true,
      likedBy: [],
      createdAt: serverTimestamp(),
    });
  });

  return slug;
}

export async function createReply(topicSlug: string, body: string, author: Author): Promise<void> {
  const topicRef = doc(db, "topics", topicSlug);
  await runTransaction(db, async (tx) => {
    const topicSnap = await tx.get(topicRef);
    if (!topicSnap.exists()) throw new Error("Topic not found");

    const postRef = doc(collection(topicRef, "posts"));
    tx.set(postRef, {
      authorId: author.uid,
      authorName: author.name,
      authorInitials: author.initials,
      body,
      isOp: false,
      likedBy: [],
      createdAt: serverTimestamp(),
    });

    tx.update(topicRef, {
      repliesCount: (topicSnap.data().repliesCount ?? 0) + 1,
      lastActivityAt: serverTimestamp(),
    });
  });
}

export async function toggleLike(
  topicSlug: string,
  postId: string,
  uid: string,
  liked: boolean
): Promise<void> {
  const postRef = doc(db, "topics", topicSlug, "posts", postId);
  await setDoc(postRef, { likedBy: liked ? arrayRemove(uid) : arrayUnion(uid) }, { merge: true });
}
