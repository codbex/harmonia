// Onyx Chat demo application logic: Pinecone Router settings, the shared
// "chat" Alpine store (the only owner of dataset mutations, so sending,
// reacting, joining, and the reply simulation ripple across pages), the app
// shell controller, and one controller per page. Page fragments in
// pages/*.html are pure markup that reference these controllers by name;
// they hold local UI state only and read data from the store.

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

  const data = window.OnyxData;
  const toastIcons = { positive: 'circle-success', negative: 'circle-error', warning: 'circle-warning', information: 'circle-info' };
  const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const localDay = (ts) => new Date(ts).toDateString();

  Alpine.store('chat', {
    users: [],
    channels: [],
    dms: [],
    profile: {},
    settings: {},
    // Set while a simulated reply is being "written": { key, userId }.
    typing: null,
    activitySeenTs: '',
    simCounter: 0,
    _messageSeq: 0,
    _activeKey: null,
    _timers: [],
    _toaster: undefined,

    init() {
      this.reset(false);
    },
    reset(notify = true) {
      this.clearTimers();
      this.users = structuredClone(data.users);
      this.channels = structuredClone(data.channels);
      this.dms = structuredClone(data.dms);
      // The profile references the "you" entry, so editing it on the settings
      // page ripples into every rendered message author line.
      this.profile = this.users.find((user) => user.id === 'you');
      this.settings = {
        // Each switch on the settings page gates a real part of the reply
        // simulation (see deliverMessage and scheduleSimulation below).
        notifications: { messageToasts: true, mentionAlerts: true, typingIndicators: true },
        // Seed from Harmonia's current color scheme ("auto" | "light" | "dark").
        theme: Harmonia.getColorScheme(),
      };
      // Two days back, so the seeded mentions count as unseen on first load.
      this.activitySeenTs = new Date(Date.now() - 2 * 86400000).toISOString();
      this.simCounter = 0;
      this._messageSeq = 0;
      // Keep the conversation the user is currently viewing marked as read.
      if (this._activeKey) this.markRead(this._activeKey);
      if (notify) this.toast('Workspace reset', 'All demo conversations have been restored to their initial state.', 'information');
    },

    // ---- notifications (toasts) ----
    attachToaster(notificationsMagic) {
      this._toaster = notificationsMagic;
    },
    toast(title, description = '', variant = 'information') {
      this._toaster?.add({
        template: 'toast',
        position: 'bottom-right',
        timeout: 4500,
        data: { title, description, variant, icon: toastIcons[variant] || toastIcons.information },
      });
    },

    // ---- simulation timers ----
    clearTimers() {
      this._timers.forEach((timer) => clearTimeout(timer));
      this._timers = [];
      this.typing = null;
    },

    // ---- lookups ----
    userById(id) {
      return this.users.find((user) => user.id === id);
    },
    displayName(id) {
      return this.userById(id)?.name || 'Former teammate';
    },
    // A conversation key is a channel id ("general") or "dms/" plus the other
    // participant's user id ("dms/maria").
    conversation(key) {
      if (!key) return undefined;
      if (key.startsWith('dms/')) return this.dms.find((dm) => dm.id === key.slice(4));
      return this.channels.find((channel) => channel.id === key);
    },
    conversationPath(key) {
      return key.startsWith('dms/') ? '/' + key : '/channels/' + key;
    },
    conversationLabel(key) {
      return key.startsWith('dms/') ? this.displayName(key.slice(4)) : '#' + key;
    },
    get joinedChannels() {
      return this.channels.filter((channel) => channel.joined);
    },
    dayLabel(ts) {
      const days = Math.round((new Date(new Date().toDateString()) - new Date(localDay(ts))) / 86400000);
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      return dayFormatter.format(new Date(ts));
    },

    // ---- activity (derived from messages, so it grows with the simulation
    // and entries disappear when their message is deleted) ----
    get mentionEvents() {
      const events = [];
      this.eachConversation((key, messages) => {
        for (const message of messages) {
          if (message.userId !== 'you' && message.mentions?.includes('you')) {
            events.push({ id: 'mention-' + message.id, path: this.conversationPath(key), label: this.conversationLabel(key), userId: message.userId, text: message.text, ts: message.ts });
          }
        }
      });
      return events.sort((a, b) => b.ts.localeCompare(a.ts));
    },
    get reactionEvents() {
      const events = [];
      this.eachConversation((key, messages) => {
        for (const message of messages) {
          if (message.userId !== 'you') continue;
          for (const reaction of message.reactions) {
            for (const userId of reaction.userIds) {
              if (userId === 'you') continue;
              events.push({ id: 'reaction-' + message.id + '-' + reaction.emoji + '-' + userId, path: this.conversationPath(key), label: this.conversationLabel(key), userId, emoji: reaction.emoji, text: message.text, ts: message.ts });
            }
          }
        }
      });
      return events.sort((a, b) => b.ts.localeCompare(a.ts));
    },
    eachConversation(visit) {
      this.channels.forEach((channel) => visit(channel.id, channel.messages));
      this.dms.forEach((dm) => visit('dms/' + dm.id, dm.messages));
    },
    get unseenMentionCount() {
      return this.mentionEvents.filter((event) => event.ts > this.activitySeenTs).length;
    },
    markActivitySeen() {
      this.activitySeenTs = new Date().toISOString();
    },

    // ---- conversation actions ----
    setActiveConversation(key) {
      this._activeKey = key;
    },
    markRead(key) {
      const conversation = this.conversation(key);
      if (conversation) conversation.unread = 0;
    },
    joinChannel(id) {
      const channel = this.channels.find((c) => c.id === id);
      if (!channel || channel.joined) return;
      channel.joined = true;
      if (!channel.memberIds.includes('you')) channel.memberIds.push('you');
      this.toast('Joined #' + channel.name, 'The channel now shows up in your sidebar.', 'positive');
    },
    leaveChannel(id) {
      const channel = this.channels.find((c) => c.id === id);
      if (!channel || !channel.joined) return;
      channel.joined = false;
      channel.unread = 0;
      channel.memberIds = channel.memberIds.filter((memberId) => memberId !== 'you');
      this.toast('Left #' + channel.name, 'You can rejoin any time from Browse channels.', 'information');
    },
    // Returns the conversation key for a DM with the given user, creating the
    // (empty) thread first if it does not exist yet.
    openDm(userId) {
      if (!this.dms.some((dm) => dm.id === userId)) {
        this.dms.unshift({ id: userId, userId, unread: 0, messages: [] });
      }
      return 'dms/' + userId;
    },

    // ---- message actions ----
    toggleReaction(key, messageId, emoji) {
      const message = this.conversation(key)?.messages.find((m) => m.id === messageId);
      if (!message) return;
      let reaction = message.reactions.find((r) => r.emoji === emoji);
      if (!reaction) {
        reaction = { emoji, userIds: [] };
        message.reactions.push(reaction);
      }
      if (reaction.userIds.includes('you')) {
        reaction.userIds = reaction.userIds.filter((userId) => userId !== 'you');
        if (!reaction.userIds.length) message.reactions = message.reactions.filter((r) => r !== reaction);
      } else {
        reaction.userIds.push('you');
      }
    },
    editMessage(key, messageId, text) {
      const message = this.conversation(key)?.messages.find((m) => m.id === messageId);
      if (!message || !text.trim()) return;
      message.text = text.trim();
      message.edited = true;
    },
    deleteMessage(key, messageId) {
      const conversation = this.conversation(key);
      if (!conversation) return;
      conversation.messages = conversation.messages.filter((m) => m.id !== messageId);
    },
    sendMessage(key, text) {
      const conversation = this.conversation(key);
      const body = text.trim();
      if (!conversation || !body) return;
      this.simCounter++;
      conversation.messages.push({
        id: key.replace('/', '-') + '-u' + ++this._messageSeq,
        userId: 'you',
        text: body,
        ts: new Date().toISOString(),
        reactions: [],
        edited: false,
        mentions: [],
      });
      this.scheduleSimulation(key);
    },

    // ---- the reply simulation ----
    // After every send: a typing indicator, then a canned reply in the same
    // conversation; after every second send, additionally a scripted message
    // in another channel (unread badge and toast ripple). Fully deterministic:
    // scripts are cycled by the send counter, there is no randomness. Every
    // timer is tracked so AppShell's destroy() and reset() can clear them.
    scheduleSimulation(key) {
      const round = this.simCounter;
      let reply = data.replyScripts[key]?.[(round - 1) % data.replyScripts[key].length];
      if (!reply && key.startsWith('dms/')) {
        const fallback = data.replyScripts.dmFallback[(round - 1) % data.replyScripts.dmFallback.length];
        reply = { userId: key.slice(4), text: fallback.text };
      }
      if (reply) {
        if (this.settings.notifications.typingIndicators) {
          this._timers.push(setTimeout(() => (this.typing = { key, userId: reply.userId }), 800));
        }
        this._timers.push(
          setTimeout(
            () => {
              if (this.typing?.key === key) this.typing = null;
              this.deliverMessage(key, reply.userId, reply.text, reply.mentionYou);
            },
            2600 + (round % 3) * 600
          )
        );
      }
      if (round % 2 !== 0) return;
      const event = data.sideEvents[(round / 2 - 1) % data.sideEvents.length];
      this._timers.push(setTimeout(() => this.deliverMessage(event.channelId, event.userId, event.text), 6000));
    },
    // Appends a simulated incoming message and handles the unread badge and
    // toast ripple for conversations the user is not currently looking at.
    deliverMessage(key, userId, text, mentionYou = false) {
      const conversation = this.conversation(key);
      if (!conversation) return;
      conversation.messages.push({
        id: key.replace('/', '-') + '-s' + ++this._messageSeq,
        userId,
        text,
        ts: new Date().toISOString(),
        reactions: [],
        edited: false,
        mentions: mentionYou ? ['you'] : [],
      });
      // Channels the user has left still receive history, but stay silent.
      if (conversation.joined === false) return;
      const isActive = this._activeKey === key;
      if (!isActive) conversation.unread++;
      if (mentionYou && this.settings.notifications.mentionAlerts) {
        this.toast(this.displayName(userId) + ' mentioned you', 'In ' + this.conversationLabel(key) + ': ' + text, 'information');
      } else if (!isActive && this.settings.notifications.messageToasts) {
        this.toast('New message in ' + this.conversationLabel(key), this.displayName(userId) + ': ' + text, 'information');
      }
    },

    // ---- profile and appearance ----
    setStatus(status) {
      this.profile.status = status;
    },
    setTheme(mode) {
      this.settings.theme = mode;
      Harmonia.setColorScheme(mode);
    },
  });

  // ---------------------------------------------------------------------------
  // App shell: sidebar, toolbar, jump-to search, routing chrome.
  // ---------------------------------------------------------------------------
  const routeTitles = {
    '/channels': 'Browse channels',
    '/activity': 'Activity',
    '/people': 'People',
    '/settings': 'Settings',
  };

  Alpine.data('AppShell', () => ({
    routeLoading: false,
    showSidebarSheet: false,
    isSmallScreen: false,
    jumpQuery: '',
    jumpOpen: false,
    sidebarBreakpointListener: undefined,

    get path() {
      return this.$router.context.path;
    },
    get crumbs() {
      if (this.path.startsWith('/channels/')) {
        return [{ label: 'Channels', path: '/channels' }, { label: '#' + (this.$router.context.params.id || '') }];
      }
      if (this.path.startsWith('/dms/')) {
        return [{ label: 'People', path: '/people' }, { label: this.$store.chat.displayName(this.$router.context.params.id) }];
      }
      if (this.path === '/') {
        const first = this.$store.chat.joinedChannels[0];
        return [{ label: first ? '#' + first.name : 'Chat' }];
      }
      return [{ label: routeTitles[this.path] || 'Not found' }];
    },
    isActive(path) {
      return this.path === path || this.path.startsWith(path + '/');
    },
    // The home route ("/") shows the first joined channel, so that channel's
    // sidebar entry is highlighted there too.
    channelActive(id) {
      return this.path === '/channels/' + id || (this.path === '/' && this.$store.chat.joinedChannels[0]?.id === id);
    },
    go(path) {
      this.showSidebarSheet = false;
      this.jumpOpen = false;
      this.jumpQuery = '';
      this.$router.navigate(path);
    },

    // ---- jump-to search (toolbar popover) ----
    get jumpResults() {
      const query = this.jumpQuery.trim().toLowerCase();
      if (!query) return [];
      const channels = this.$store.chat.channels
        .filter((channel) => channel.name.toLowerCase().includes(query) || channel.topic.toLowerCase().includes(query))
        .slice(0, 3)
        .map((channel) => ({ id: 'channel-' + channel.id, kind: 'channel', label: '#' + channel.name, hint: channel.topic, path: '/channels/' + channel.id }));
      const people = this.$store.chat.users
        .filter((user) => user.id !== 'you' && (user.name.toLowerCase().includes(query) || user.title.toLowerCase().includes(query)))
        .slice(0, 3)
        .map((user) => ({ id: 'person-' + user.id, kind: 'person', label: user.name, hint: user.title, userId: user.id }));
      return channels.concat(people);
    },
    jumpTo(result) {
      this.go(result.path || '/' + this.$store.chat.openDm(result.userId));
    },
    jumpFirst() {
      if (this.jumpResults.length) this.jumpTo(this.jumpResults[0]);
    },

    onRouteStart() {
      this.routeLoading = true;
    },
    onRouteEnd() {
      this.routeLoading = false;
      this.showSidebarSheet = false;
      const title = this.crumbs[this.crumbs.length - 1]?.label;
      document.title = (title ? title + ' | ' : '') + 'Onyx Chat';
    },
    onFetchError() {
      this.routeLoading = false;
      this.$store.chat.toast('Page failed to load', 'The page template could not be fetched. Check the network connection and try again.', 'negative');
    },
    // Replaces Pinecone Router's default notfound handler, which logs a console
    // error for every unknown path; the 404 page is all the feedback we need.
    notFound() {},

    init() {
      this.$store.chat.attachToaster(this.$notifications);
      this.sidebarBreakpointListener = Harmonia.getBreakpointListener((matches) => {
        this.isSmallScreen = matches;
        if (matches) {
          this.$refs.sidebarSheet.appendChild(this.$refs.sidebar);
        } else if (this.$refs.sidebarSheet.firstElementChild) {
          this.showSidebarSheet = false;
          this.$el.appendChild(this.$refs.sidebar);
        }
      }, 1024);
    },
    destroy() {
      this.$store.chat.clearTimers();
      this.sidebarBreakpointListener.remove();
    },
  }));

  // ---------------------------------------------------------------------------
  // Page controllers. Fragments reference them via x-data; local UI state
  // (drafts, dialogs, filters) lives here and intentionally resets when the
  // user navigates away, while the conversations live in the chat store.
  // ---------------------------------------------------------------------------

  // Shared by "/", "/channels/:id", and "/dms/:id". Navigating between two
  // conversations on the SAME route does not remount the fragment (Pinecone
  // reuses the rendered template), so conversation switches are handled by
  // watching the derived key instead of relying on init() alone.
  Alpine.data('pageChat', () => ({
    draft: '',
    editingId: null,
    editDraft: '',
    deleteTarget: null,
    detailsOpen: false,
    isCompact: false,
    emojis: window.OnyxData.emojiSet,
    compactBreakpointListener: undefined,

    get key() {
      const path = this.$router.context.path;
      if (path.startsWith('/dms/')) return 'dms/' + this.$router.context.params.id;
      if (path.startsWith('/channels/')) return this.$router.context.params.id;
      return this.$store.chat.joinedChannels[0]?.id || '';
    },
    get isDm() {
      return this.key.startsWith('dms/');
    },
    get conversation() {
      return this.$store.chat.conversation(this.key);
    },
    get partner() {
      return this.isDm && this.conversation ? this.$store.chat.userById(this.conversation.userId) : null;
    },
    get label() {
      return this.$store.chat.conversationLabel(this.key);
    },
    get members() {
      if (!this.conversation || this.isDm) return [];
      return this.conversation.memberIds.map((id) => this.$store.chat.userById(id)).filter(Boolean);
    },
    // Flat render list: day separators plus messages. A message renders
    // "compact" (no avatar or author line) when the same author posted the
    // previous message within five minutes on the same day.
    get timeline() {
      if (!this.conversation) return [];
      const items = [];
      let previous = null;
      const sorted = [...this.conversation.messages].sort((a, b) => a.ts.localeCompare(b.ts));
      for (const message of sorted) {
        const day = new Date(message.ts).toDateString();
        if (!previous || new Date(previous.ts).toDateString() !== day) {
          items.push({ kind: 'day', id: 'day-' + day, label: this.$store.chat.dayLabel(message.ts) });
        }
        const compact = !!previous && previous.userId === message.userId && new Date(previous.ts).toDateString() === day && new Date(message.ts) - new Date(previous.ts) <= 300000;
        items.push({ kind: 'message', id: message.id, message, compact });
        previous = message;
      }
      return items;
    },
    get messageCount() {
      return this.conversation?.messages.length || 0;
    },
    get typingHere() {
      const typing = this.$store.chat.typing;
      return !!typing && typing.key === this.key && this.$store.chat.settings.notifications.typingIndicators;
    },
    get typerName() {
      return this.typingHere ? this.$store.chat.displayName(this.$store.chat.typing.userId) : '';
    },

    isMine(reaction) {
      return reaction.userIds.includes('you');
    },
    openConversation() {
      // A deep link to a DM that has not been started yet still works, as long
      // as the person exists; only truly unknown ids reach the not-found state.
      if (this.isDm && !this.conversation && this.$store.chat.userById(this.key.slice(4))) {
        this.$store.chat.openDm(this.key.slice(4));
      }
      this.$store.chat.setActiveConversation(this.conversation ? this.key : null);
      this.$store.chat.markRead(this.key);
      this.cancelEdit();
      this.deleteTarget = null;
      this.draft = '';
      this.scrollToBottom(true);
    },
    send() {
      const text = this.draft.trim();
      if (!text || !this.conversation) return;
      this.$store.chat.sendMessage(this.key, text);
      this.draft = '';
      this.scrollToBottom(true);
    },
    // Enter sends / saves, Shift+Enter falls through to a plain newline.
    composerKeydown(event) {
      if (event.shiftKey) return;
      event.preventDefault();
      this.send();
    },
    editKeydown(event) {
      if (event.shiftKey) return;
      event.preventDefault();
      this.saveEdit();
    },
    react(messageId, emoji) {
      this.$store.chat.toggleReaction(this.key, messageId, emoji);
    },
    // The edit textarea focuses itself on mount via x-h-focus in the fragment.
    startEdit(message) {
      this.editingId = message.id;
      this.editDraft = message.text;
    },
    saveEdit() {
      if (!this.editDraft.trim()) return;
      this.$store.chat.editMessage(this.key, this.editingId, this.editDraft);
      this.cancelEdit();
    },
    cancelEdit() {
      this.editingId = null;
      this.editDraft = '';
    },
    confirmDelete() {
      if (this.deleteTarget) this.$store.chat.deleteMessage(this.key, this.deleteTarget.id);
      this.deleteTarget = null;
    },
    leave() {
      this.detailsOpen = false;
      this.$store.chat.leaveChannel(this.key);
      this.$router.navigate('/');
    },
    nearBottom() {
      const el = this.$refs.timeline;
      return !el || el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    },
    // Own sends and conversation switches force-scroll; incoming messages only
    // follow when the user is already near the bottom, so reading upward in
    // the history is never interrupted.
    scrollToBottom(force = false) {
      const follow = force || this.nearBottom();
      this.$nextTick(() => {
        const el = this.$refs.timeline;
        if (el && follow) el.scrollTop = el.scrollHeight;
      });
    },

    init() {
      // The listener fires immediately, so isCompact is correct from here on.
      this.compactBreakpointListener = Harmonia.getBreakpointListener((matches) => {
        this.isCompact = matches;
      }, 1024);
      // Open the details panel by default on desktop (both split panels must
      // be visible at init for the data-key persisted sizes to be restored);
      // on compact screens the conversation comes first.
      this.detailsOpen = !this.isCompact;
      this.$watch('key', () => this.openConversation());
      this.$watch('messageCount', () => this.scrollToBottom(false));
      this.$watch('typingHere', (shown) => shown && this.scrollToBottom(false));
      this.openConversation();
    },
    destroy() {
      this.compactBreakpointListener.remove();
      this.$store.chat.setActiveConversation(null);
    },
  }));

  Alpine.data('pageChannels', () => ({
    search: '',
    get list() {
      const query = this.search.trim().toLowerCase();
      if (!query) return this.$store.chat.channels;
      return this.$store.chat.channels.filter((channel) => channel.name.toLowerCase().includes(query) || channel.topic.toLowerCase().includes(query));
    },
  }));

  Alpine.data('pageActivity', () => ({
    tab: 'mentions',
    init() {
      // Opening the page acknowledges the mentions, clearing the sidebar badge.
      this.$store.chat.markActivitySeen();
    },
  }));

  Alpine.data('pagePeople', () => ({
    search: '',
    get list() {
      const query = this.search.trim().toLowerCase();
      if (!query) return this.$store.chat.users;
      return this.$store.chat.users.filter((user) => user.name.toLowerCase().includes(query) || user.title.toLowerCase().includes(query));
    },
    message(person) {
      this.$router.navigate('/' + this.$store.chat.openDm(person.id));
    },
  }));

  Alpine.data('pageSettings', () => ({
    showReset: false,
    save() {
      this.$store.chat.toast('Profile saved', 'Your profile changes are visible across the workspace.', 'positive');
    },
    confirmReset() {
      this.showReset = false;
      this.$store.chat.reset();
    },
  }));
});
