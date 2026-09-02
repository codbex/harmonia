// Quartz Docs demo dataset. Quartz is a fictional data-fetching library, and
// this file is the whole site map: the sidebar, the command palette search and
// the previous/next pager all read from the nav tree below, so a page is added
// in one place. The headings of every entry mirror the h2 elements of its page
// fragment, which is what makes the search find sections and not just pages.
window.QuartzData = {
  posts: [
    {
      route: '/blog/quartz-1-1',
      title: 'Quartz 1.1: smarter refetching',
      date: 'June 18, 2026',
      author: 'Case Aylmer',
      initials: 'CA',
      tag: 'Release',
      excerpt: 'Focus and reconnect refetching are now driven by a single scheduler, so a tab that wakes up after an hour asleep sends one request instead of twelve.',
    },
    {
      route: '/blog/announcing-quartz-1-0',
      title: 'Announcing Quartz 1.0',
      date: 'April 2, 2026',
      author: 'Iva Petrova',
      initials: 'IP',
      tag: 'Release',
      excerpt: 'After fourteen months of use in production, the cache API is stable. Here is what shipped, what we deliberately left out, and how to upgrade from the beta.',
    },
  ],

  nav: [
    {
      label: 'Introduction',
      items: [
        { route: '/guide/what-is-quartz', title: 'What is Quartz?', headings: ['Motivation', 'How it works', 'When to use it'] },
        { route: '/guide/getting-started', title: 'Getting started', headings: ['Installation', 'Your first query', 'Devtools'] },
      ],
    },
    {
      label: 'Guide',
      items: [
        { route: '/guide/queries', title: 'Queries', headings: ['Query keys', 'Reading state', 'Dependent queries'] },
        { route: '/guide/caching', title: 'Caching', headings: ['Staleness', 'Invalidation', 'Garbage collection'] },
      ],
    },
    {
      label: 'Reference',
      items: [{ route: '/api', title: 'API reference', headings: ['quartz(options)', 'client.query()', 'client.invalidate()', 'Options'] }],
    },
    // Filled in below from posts, so a new post shows up in the sidebar, the
    // search index and the pager without being listed twice.
    { label: 'Blog', items: [] },
  ],

  features: [
    { icon: 'zap', title: 'Tiny by design', details: '2 kB minified and compressed, with no build step and no plugin system to learn.' },
    { icon: 'refresh-cw', title: 'Stale while revalidate', details: 'Render the cached value immediately, refresh it in the background, and swap it in when it lands.' },
    { icon: 'layers', title: 'Framework agnostic', details: 'A plain observable cache. Bindings for the big three frameworks are thin wrappers over the same core.' },
    { icon: 'database', title: 'Normalized cache', details: 'Entities are stored once and shared by every query that references them, so one update refreshes them all.' },
    { icon: 'sparkles', title: 'Devtools included', details: 'Inspect keys, staleness and in-flight requests from a panel that ships in the same package.' },
    { icon: 'package', title: 'Zero dependencies', details: 'Nothing but the platform. Works in every browser that supports fetch and AbortController.' },
  ],
};

window.QuartzData.nav[3].items = [{ route: '/blog', title: 'All posts', headings: [] }, ...window.QuartzData.posts.map((post) => ({ route: post.route, title: post.title, headings: [] }))];
