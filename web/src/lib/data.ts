export type Category = {
  slug: string;
  name: string;
  color: string;
};

export const categories: Category[] = [
  { slug: "announcements", name: "Announcements", color: "#00ab4e" },
  { slug: "equity-trading", name: "Equity & Trading", color: "#2563eb" },
  { slug: "mutual-funds-sip", name: "Mutual Funds & SIP", color: "#7c3aed" },
  { slug: "ipo-corner", name: "IPO Corner", color: "#d97706" },
  { slug: "derivatives-fo", name: "Derivatives & F&O", color: "#0891b2" },
  { slug: "investor-education", name: "Investor Education", color: "#11a971" },
  { slug: "feedback-support", name: "Feedback & Support", color: "#6b7280" },
];

export type Post = {
  author: string;
  initials: string;
  timeAgo: string;
  isOp?: boolean;
  body: string[];
  likes: number;
};

export type Topic = {
  slug: string;
  title: string;
  categorySlug: string;
  replies: number;
  views: string;
  activity: string;
  pinned?: boolean;
  posts: Post[];
};

export const topics: Topic[] = [
  {
    slug: "welcome-guidelines-faq",
    title: "Welcome to the Indiabulls Securities Community — Guidelines & FAQ",
    categorySlug: "announcements",
    replies: 4,
    views: "1.4k",
    activity: "2d",
    pinned: true,
    posts: [
      {
        author: "Team_IBS",
        initials: "IB",
        timeAgo: "2 days ago",
        isOp: true,
        likes: 58,
        body: [
          "Welcome! This community is a place for Indiabulls Securities clients to discuss markets, share strategies, and learn from each other.",
          "Please keep discussions respectful and remember that nothing posted here is investment advice — always do your own research.",
        ],
      },
    ],
  },
  {
    slug: "nifty-50-outlook",
    title: "Nifty 50 outlook for the week — levels to watch",
    categorySlug: "equity-trading",
    replies: 24,
    views: "512",
    activity: "5m",
    posts: [
      {
        author: "trader_raunak",
        initials: "TR",
        timeAgo: "5 minutes ago",
        isOp: true,
        likes: 12,
        body: [
          "Nifty closed above the 25,100 mark again today — curious what levels folks are watching for the rest of the week. I'm seeing decent support around 24,950 and resistance building near 25,300.",
          "Anyone tracking FII/DII flows for tomorrow's session? Would love a second opinion before the F&O expiry.",
        ],
      },
      {
        author: "meera_invests",
        initials: "MI",
        timeAgo: "2 minutes ago",
        likes: 4,
        body: [
          "Watching 24,950 too — if that breaks I'd expect a quick move to 24,800. Otherwise looks range-bound into expiry.",
        ],
      },
      {
        author: "deriv_queen",
        initials: "DQ",
        timeAgo: "just now",
        likes: 1,
        body: [
          "FII flows have been mixed this week, DIIs have been net buyers on every dip. I'd keep an eye on Bank Nifty too — it's been leading the index around lately.",
        ],
      },
    ],
  },
  {
    slug: "sip-vs-lumpsum",
    title: "SIP vs lumpsum for a 10-year horizon — what worked for you?",
    categorySlug: "mutual-funds-sip",
    replies: 18,
    views: "340",
    activity: "22m",
    posts: [
      {
        author: "investor_meera",
        initials: "IM",
        timeAgo: "22 minutes ago",
        isOp: true,
        likes: 9,
        body: [
          "Planning a 10-year horizon and going back and forth between a monthly SIP and investing a lumpsum now. What's worked for you over a similar timeframe?",
        ],
      },
    ],
  },
  {
    slug: "upcoming-ipo-checklist",
    title: "Upcoming IPO: what to check before subscribing",
    categorySlug: "ipo-corner",
    replies: 12,
    views: "289",
    activity: "1h",
    posts: [
      {
        author: "ipo_watcher",
        initials: "IW",
        timeAgo: "1 hour ago",
        isOp: true,
        likes: 6,
        body: [
          "With a few IPOs opening this month, what's your checklist before subscribing? I usually look at subscription numbers, grey market trends, and the anchor book.",
        ],
      },
    ],
  },
  {
    slug: "bank-nifty-expiry-strategies",
    title: "Bank Nifty weekly expiry strategies — share your setups",
    categorySlug: "derivatives-fo",
    replies: 40,
    views: "1.2k",
    activity: "6h",
    posts: [
      {
        author: "deriv_queen",
        initials: "DQ",
        timeAgo: "6 hours ago",
        isOp: true,
        likes: 21,
        body: [
          "Weekly expiry is always a mixed bag on Bank Nifty. Sharing what's worked for me lately — curious what setups the rest of you are running.",
        ],
      },
    ],
  },
  {
    slug: "new-to-investing",
    title: "New to investing? Start here — a beginner's roadmap",
    categorySlug: "investor-education",
    replies: 31,
    views: "890",
    activity: "3h",
    posts: [
      {
        author: "Team_IBS",
        initials: "IB",
        timeAgo: "3 hours ago",
        isOp: true,
        likes: 44,
        body: [
          "New here? This thread rounds up the basics — opening a demat account, understanding order types, and a few common beginner mistakes to avoid.",
        ],
      },
    ],
  },
  {
    slug: "margin-requirements-mtf",
    title: "Understanding margin requirements in MTF",
    categorySlug: "derivatives-fo",
    replies: 9,
    views: "201",
    activity: "2h",
    posts: [
      {
        author: "ib_support",
        initials: "IB",
        timeAgo: "2 hours ago",
        isOp: true,
        likes: 7,
        body: [
          "A quick explainer on how margin requirements work under MTF (Margin Trading Facility) and how they're calculated day to day.",
        ],
      },
    ],
  },
  {
    slug: "option-chain-tools-feedback",
    title: "Option chain analysis tools — feedback & requests",
    categorySlug: "feedback-support",
    replies: 6,
    views: "98",
    activity: "5h",
    posts: [
      {
        author: "options_guy",
        initials: "OG",
        timeAgo: "5 hours ago",
        isOp: true,
        likes: 3,
        body: [
          "The option chain view is solid, but a few of us would love OI change alerts. Curious if others have feature requests too.",
        ],
      },
    ],
  },
  {
    slug: "gsec-vs-corporate-bonds",
    title: "G-Secs vs corporate bonds for conservative investors",
    categorySlug: "equity-trading",
    replies: 14,
    views: "176",
    activity: "1d",
    posts: [
      {
        author: "bond_investor",
        initials: "BI",
        timeAgo: "1 day ago",
        isOp: true,
        likes: 8,
        body: [
          "For a conservative allocation, how are people weighing G-Secs against corporate bonds right now? Yield gap has narrowed a bit lately.",
        ],
      },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function parseCount(value: string): number {
  const n = parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return value.toLowerCase().includes("k") ? n * 1000 : n;
}
