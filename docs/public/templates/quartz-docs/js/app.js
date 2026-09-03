// Quartz Docs demo application logic: Pinecone Router settings, the shared
// "quartz" store (site map, search index and color scheme), the app shell
// controller that owns the navigation chrome, and the small docPage controller
// that gives every documentation page its previous/next links.
// Page fragments in pages/*.html are pure markup that read from the store.

document.addEventListener('alpine:init', () => {
  window.PineconeRouter.settings({
    // Hash routing keeps deep links and reloads working on static hosting.
    hash: true,
    // Every route template renders into the <div id="page-outlet"> in index.html.
    targetID: 'page-outlet',
    // Fetch all page fragments at low priority after the first page renders.
    preload: true,
    // Inside the docs homepage iframe, skip history.pushState() so demo
    // navigation does not pollute the parent page's browser history.
    pushState: window.self === window.top,
  });

  const data = window.QuartzData;

  Alpine.store('quartz', {
    nav: data.nav,
    posts: data.posts,
    features: data.features,
    // Seed from Harmonia's current color scheme ("auto" | "light" | "dark").
    // Writing the theme applies it, so the appearance menu's radio items can
    // bind it with x-model directly.
    _theme: Harmonia.getColorScheme(),
    get theme() {
      return this._theme;
    },
    set theme(mode) {
      this._theme = mode;
      Harmonia.setColorScheme(mode);
    },

    // Every page in sidebar order. Drives the previous/next pager.
    get flatPages() {
      return this.nav.flatMap((group) => group.items);
    },
    titleFor(path) {
      return this.flatPages.find((page) => page.route === path)?.title || '';
    },

    // Matches page titles and their headings. A heading hit navigates to the
    // page that contains it, which is as deep as a demo search needs to go.
    search(query) {
      const needle = query.trim().toLowerCase();
      if (!needle) return [];
      const results = [];
      for (const group of this.nav) {
        for (const page of group.items) {
          if (page.title.toLowerCase().includes(needle)) {
            results.push({ route: page.route, label: page.title, heading: '', group: group.label });
          }
          for (const heading of page.headings) {
            if (heading.toLowerCase().includes(needle)) {
              results.push({ route: page.route, label: page.title, heading, group: group.label });
            }
          }
        }
      }
      return results.slice(0, 8);
    },
  });

  // ---------------------------------------------------------------------------
  // App shell: sidebar, navbar, search palette, routing chrome.
  // ---------------------------------------------------------------------------
  Alpine.data('AppShell', () => ({
    routeLoading: false,
    routedOnce: false,
    showSidebarSheet: false,
    isSmallScreen: false,
    loadError: false,
    searchOpen: false,
    searchQuery: '',
    sidebarBreakpointListener: undefined,

    get path() {
      return this.$router.context.path;
    },
    // The landing page is full width, like a VitePress home layout. Every other
    // route keeps the sidebar.
    get hasSidebar() {
      return this.path !== '/';
    },
    get showDesktopSidebar() {
      return this.hasSidebar && !this.isSmallScreen;
    },
    get themeIcon() {
      return { light: 'sun', dark: 'moon' }[this.$store.quartz.theme] || 'sun-moon';
    },
    get searchResults() {
      return this.$store.quartz.search(this.searchQuery);
    },
    isSection(prefix) {
      return this.path === prefix || this.path.startsWith(prefix + '/');
    },
    go(path) {
      this.showSidebarSheet = false;
      this.closeSearch();
      this.$router.navigate(path);
    },

    // ---- search palette ----
    openSearch() {
      this.searchQuery = '';
      this.searchOpen = true;
    },
    closeSearch() {
      this.searchOpen = false;
    },
    // Reached by a click and by Enter alike, since the combobox activates the
    // highlighted result by clicking it.
    pick(result) {
      this.closeSearch();
      this.showSidebarSheet = false;
      this.$router.navigate(result.route);
    },
    // Only ever runs when nothing is highlighted. Once the user arrows into the
    // results the combobox takes Enter and this handler never sees it.
    pickFirst() {
      const first = this.searchResults[0];
      if (first) this.pick(first);
    },

    // ---- routing chrome ----
    onRouteStart() {
      this.routeLoading = true;
    },
    onRouteEnd() {
      this.routeLoading = false;
      this.loadError = false;
      this.showSidebarSheet = false;
      // The document is the scroll container, so a new page starts from its top.
      window.scrollTo(0, 0);
      // Move focus to the fresh page, so keyboard and screen reader users are
      // not left on the link they came from. The initial route stays untouched.
      if (this.routedOnce) {
        document.getElementById('page-outlet').focus({ preventScroll: true });
      }
      this.routedOnce = true;
      const title = this.$store.quartz.titleFor(this.path);
      document.title = (title ? title + ' | ' : '') + 'Quartz';
    },
    onFetchError() {
      this.routeLoading = false;
      this.loadError = true;
    },
    // Replaces Pinecone Router's default notfound handler, which logs a console
    // error for every unknown path. The 404 page is all the feedback we need.
    notFound() {},

    init() {
      // Below the breakpoint the sidebar moves into the sheet, so the same
      // markup serves as the desktop sidebar and the mobile navigation drawer.
      this.sidebarBreakpointListener = Harmonia.getBreakpointListener((matches) => {
        this.isSmallScreen = matches;
        if (matches) {
          this.$refs.sidebarSheet.appendChild(this.$refs.sidebar);
        } else if (this.$refs.sidebarSheet.firstElementChild) {
          this.showSidebarSheet = false;
          this.$refs.sidebarSlot.appendChild(this.$refs.sidebar);
        }
      }, 1024);
    },
    destroy() {
      this.sidebarBreakpointListener.remove();
    },
  }));

  // ---------------------------------------------------------------------------
  // Documentation pages. Every guide, reference and blog post fragment uses this
  // controller for the previous/next pager at the bottom of the page.
  // ---------------------------------------------------------------------------
  Alpine.data('docPage', () => ({
    // The post this route is about, for the blog entries. Undefined on the guide
    // and reference pages, which have no entry in posts.
    get post() {
      return this.$store.quartz.posts.find((entry) => entry.route === this.$router.context.path);
    },
    get index() {
      return this.$store.quartz.flatPages.findIndex((page) => page.route === this.$router.context.path);
    },
    get prev() {
      const pages = this.$store.quartz.flatPages;
      return this.index > 0 ? pages[this.index - 1] : null;
    },
    get next() {
      const pages = this.$store.quartz.flatPages;
      return this.index >= 0 && this.index < pages.length - 1 ? pages[this.index + 1] : null;
    },
  }));
});
