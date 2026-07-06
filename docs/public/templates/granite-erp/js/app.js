// Granite ERP demo application logic: Pinecone Router settings, the shared
// "erp" Alpine store (the only owner of dataset mutations, so actions ripple
// across pages), the app shell controller, and one controller per page.
// Page fragments in pages/*.html are pure markup that reference these
// controllers by name; they hold local UI state only and read data from the store.

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

  const data = window.GraniteData;
  const toastIcons = { positive: 'circle-success', negative: 'circle-error', warning: 'circle-warning', information: 'circle-info' };
  const statusVariants = {
    Paid: 'positive',
    Sent: 'information',
    Draft: 'outline',
    Overdue: 'negative',
    Due: 'warning',
    Scheduled: 'outline',
    Pending: 'warning',
    Approved: 'positive',
    Rejected: 'negative',
  };
  const currencyCodes = { usd: 'USD', eur: 'EUR', gbp: 'GBP' };
  const moneyFormatters = {};

  Alpine.store('erp', {
    invoices: [],
    bills: [],
    customers: [],
    vendors: [],
    inventory: [],
    documents: [],
    messages: [],
    approvals: [],
    notifications: [],
    activity: [],
    searchSeed: '',
    settings: {},
    _toaster: undefined,

    init() {
      this.reset(false);
    },
    reset(notify = true) {
      this.invoices = structuredClone(data.invoices);
      this.bills = structuredClone(data.bills);
      this.customers = structuredClone(data.customers);
      this.vendors = structuredClone(data.vendors);
      this.inventory = structuredClone(data.inventory);
      this.documents = structuredClone(data.documents);
      this.messages = structuredClone(data.messages);
      this.approvals = structuredClone(data.approvals);
      this.notifications = structuredClone(data.notifications);
      this.activity = structuredClone(data.activity);
      this.settings = {
        company: {
          name: 'Granite Industrial Ltd',
          email: 'finance@granite.example',
          taxId: 'BG204411358',
          address: '12 Foundry Street, Sofia, Bulgaria',
          about: 'Industrial monitoring hardware and services.',
        },
        currency: 'usd',
        dateFormat: 'mdy',
        notifications: { invoiceEmails: true, approvalAlerts: true, weeklyDigest: false, lowStockAlerts: true },
        // Seed from Harmonia's current color scheme ("auto" | "light" | "dark").
        theme: Harmonia.getColorScheme(),
      };
      if (notify) this.toast('Workspace reset', 'All demo data has been restored to its initial state.', 'information');
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

    // ---- shared formatting helpers ----
    money(value) {
      const code = currencyCodes[this.settings.currency] || 'USD';
      const kind = Number.isInteger(value) ? 'whole' : 'cents';
      const key = code + kind;
      moneyFormatters[key] ??= new Intl.NumberFormat('en-US', { style: 'currency', currency: code, minimumFractionDigits: kind === 'whole' ? 0 : 2, maximumFractionDigits: kind === 'whole' ? 0 : 2 });
      return moneyFormatters[key].format(value);
    },
    date(iso) {
      if (!iso) return '';
      if (this.settings.dateFormat === 'iso') return iso;
      const locale = this.settings.dateFormat === 'dmy' ? 'en-GB' : 'en-US';
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso.replace(' ', 'T')));
    },
    statusVariant(status) {
      return statusVariants[status] || 'outline';
    },

    // ---- derived state (drives badges and KPIs, so actions ripple everywhere) ----
    get unreadCount() {
      return this.messages.filter((m) => m.unread).length;
    },
    get pendingApprovals() {
      return this.approvals.filter((a) => a.status === 'Pending');
    },
    get openInvoices() {
      return this.invoices.filter((i) => i.status === 'Sent' || i.status === 'Overdue');
    },
    get openInvoiceTotal() {
      return this.openInvoices.reduce((sum, i) => sum + i.amount, 0);
    },
    get overdueInvoices() {
      return this.invoices.filter((i) => i.status === 'Overdue');
    },
    get overdueBillCount() {
      return this.bills.filter((b) => b.status === 'Overdue').length;
    },
    get lowStockItems() {
      return this.inventory.filter((i) => i.stock <= i.reorderLevel);
    },

    logActivity(icon, text) {
      this.activity.unshift({ id: 'A-' + (this.activity.length + 7), icon, text, time: 'Just now' });
    },

    // ---- inbox ----
    markRead(id) {
      const message = this.messages.find((m) => m.id === id);
      if (message) message.unread = false;
    },
    markAllRead() {
      this.messages.forEach((m) => (m.unread = false));
    },
    archiveMessage(id) {
      this.messages = this.messages.filter((m) => m.id !== id);
      this.toast('Message archived', '', 'information');
    },

    // ---- approvals ----
    approve(id) {
      const approval = this.approvals.find((a) => a.id === id);
      if (!approval) return;
      approval.status = 'Approved';
      approval.currentStep = approval.steps.length;
      this.logActivity('stamp', `${approval.id} ${approval.title} approved.`);
      this.toast('Request approved', `${approval.id} has been approved and the requester was notified.`, 'positive');
    },
    reject(id) {
      const approval = this.approvals.find((a) => a.id === id);
      if (!approval) return;
      approval.status = 'Rejected';
      this.logActivity('circle-x', `${approval.id} ${approval.title} rejected.`);
      this.toast('Request rejected', `${approval.id} has been rejected and the requester was notified.`, 'negative');
    },

    // ---- invoices ----
    invoiceById(id) {
      return this.invoices.find((i) => i.id === id);
    },
    addInvoice(draft, send) {
      const nextNumber = Math.max(...this.invoices.map((i) => Number(i.id.slice(4)))) + 1;
      const subtotal = draft.qty * draft.unitPrice;
      const invoice = {
        id: 'INV-' + nextNumber,
        customer: draft.customer,
        issued: '2026-07-03',
        due: draft.due,
        amount: Math.round(subtotal * 1.1 * 100) / 100,
        status: send ? 'Sent' : 'Draft',
        items: [{ description: draft.description, qty: draft.qty, unitPrice: draft.unitPrice }],
        activity: [{ date: '2026-07-03', text: 'Draft created.' }],
      };
      if (send) invoice.activity.push({ date: '2026-07-03', text: `Sent to ${draft.customer}.` });
      this.invoices.unshift(invoice);
      this.logActivity('file-plus-2', `${invoice.id} created for ${invoice.customer}.`);
      this.toast(send ? 'Invoice sent' : 'Draft saved', `${invoice.id} for ${this.money(invoice.amount)} was ${send ? 'created and sent to ' + invoice.customer : 'saved as a draft'}.`, 'positive');
      return invoice.id;
    },
    setInvoiceStatus(id, status) {
      const invoice = this.invoiceById(id);
      if (!invoice) return;
      invoice.status = status;
      if (status === 'Paid') {
        invoice.activity.push({ date: '2026-07-03', text: 'Payment received, invoice closed.' });
        this.logActivity('circle-check', `Payment received for ${invoice.id} from ${invoice.customer}.`);
        this.toast('Invoice paid', `${invoice.id} (${this.money(invoice.amount)}) has been marked as paid.`, 'positive');
      } else if (status === 'Sent') {
        invoice.activity.push({ date: '2026-07-03', text: `Sent to ${invoice.customer}.` });
        this.logActivity('send', `${invoice.id} sent to ${invoice.customer}.`);
        this.toast('Invoice sent', `${invoice.id} was sent to ${invoice.customer}.`, 'positive');
      }
    },
    remindInvoice(id) {
      const invoice = this.invoiceById(id);
      if (!invoice) return;
      invoice.activity.push({ date: '2026-07-03', text: 'Payment reminder sent.' });
      this.toast('Reminder sent', `A payment reminder for ${invoice.id} was sent to ${invoice.customer}.`, 'information');
    },

    // ---- bills ----
    payBill(id) {
      const bill = this.bills.find((b) => b.id === id);
      if (!bill) return;
      bill.status = 'Paid';
      this.logActivity('banknote', `${bill.id} (${bill.vendor}) paid.`);
      this.toast('Bill paid', `${bill.id} from ${bill.vendor} (${this.money(bill.amount)}) was scheduled for payment today.`, 'positive');
    },

    // ---- vendors ----
    addVendor(draft) {
      this.vendors.unshift({ id: 'V-' + String(this.vendors.length + 1).padStart(2, '0'), rating: 0, active: true, ...draft });
      this.logActivity('user-plus', `Vendor ${draft.name} added to the vendor list.`);
      this.toast('Vendor added', `${draft.name} is now available for purchase orders and bills.`, 'positive');
    },
    toggleVendor(id) {
      const vendor = this.vendors.find((v) => v.id === id);
      if (!vendor) return;
      vendor.active = !vendor.active;
      this.toast(vendor.active ? 'Vendor activated' : 'Vendor deactivated', `${vendor.name} is now ${vendor.active ? 'active' : 'inactive'}.`, 'information');
    },

    // ---- inventory ----
    adjustStock(sku, quantity) {
      const item = this.inventory.find((i) => i.sku === sku);
      if (!item || !quantity) return;
      item.stock += quantity;
      this.logActivity('package', `${item.name} restocked at ${item.warehouse} warehouse (+${quantity}).`);
      this.toast('Restock ordered', `${quantity} x ${item.name} added to the ${item.warehouse} warehouse.`, 'positive');
    },

    // ---- documents ----
    addDocument(file) {
      const extension = (file.name.split('.').pop() || '').toLowerCase();
      const types = { pdf: 'Report', xlsx: 'Report', csv: 'Report', docx: 'Contract', doc: 'Contract', png: 'Image', jpg: 'Image', svg: 'Image' };
      const size = file.size >= 1048576 ? (file.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(file.size / 1024)) + ' KB';
      this.documents.unshift({ id: 'DOC-' + (32 + this.documents.length), name: file.name, type: types[extension] || 'File', size, linkedTo: 'Uploads', uploaded: '2026-07-03', tags: ['uploaded'] });
    },
    removeDocument(id) {
      const document = this.documents.find((d) => d.id === id);
      this.documents = this.documents.filter((d) => d.id !== id);
      if (document) this.toast('Document deleted', `${document.name} was removed from the library.`, 'information');
    },

    // ---- appearance ----
    setTheme(mode) {
      this.settings.theme = mode;
      Harmonia.setColorScheme(mode);
    },
  });

  // ---------------------------------------------------------------------------
  // App shell: sidebar, toolbar, breadcrumb, routing chrome.
  // ---------------------------------------------------------------------------
  const routeTitles = {
    '/': 'Dashboard',
    '/inbox': 'Inbox',
    '/approvals': 'Approvals',
    '/invoices': 'Invoices',
    '/bills': 'Bills',
    '/customers': 'Customers',
    '/vendors': 'Vendors',
    '/inventory': 'Inventory',
    '/documents': 'Documents',
    '/reports': 'Reports',
    '/settings': 'Settings',
  };

  Alpine.data('AppShell', () => ({
    routeLoading: false,
    showSidebarSheet: false,
    isSmallScreen: false,
    notificationListShown: false,
    searchQuery: '',
    sidebarBreakpointListener: undefined,

    get path() {
      return this.$router.context.path;
    },
    get crumbs() {
      if (this.path.startsWith('/invoices/')) {
        return [{ label: 'Invoices', path: '/invoices' }, { label: this.$router.context.params.id || 'Invoice' }];
      }
      return [{ label: routeTitles[this.path] || 'Not found' }];
    },
    isActive(path) {
      return this.path === path || this.path.startsWith(path + '/');
    },
    go(path) {
      this.showSidebarSheet = false;
      this.notificationListShown = false;
      this.$router.navigate(path);
    },
    globalSearch() {
      const query = this.searchQuery.trim();
      if (!query) return;
      this.$store.erp.searchSeed = query;
      this.searchQuery = '';
      this.go('/invoices');
    },
    onRouteStart() {
      this.routeLoading = true;
    },
    onRouteEnd() {
      this.routeLoading = false;
      this.showSidebarSheet = false;
      if (this.$refs.pageScroll) this.$refs.pageScroll.scrollTop = 0;
      const title = this.crumbs[this.crumbs.length - 1]?.label;
      document.title = (title ? title + ' | ' : '') + 'Granite ERP';
    },
    onFetchError() {
      this.routeLoading = false;
      this.$store.erp.toast('Page failed to load', 'The page template could not be fetched. Check the network connection and try again.', 'negative');
    },
    // Replaces Pinecone Router's default notfound handler, which logs a console
    // error for every unknown path; the 404 page is all the feedback we need.
    notFound() {},
    removeNotification(id) {
      this.$store.erp.notifications = this.$store.erp.notifications.filter((n) => n.id !== id);
    },
    clearNotifications() {
      this.$store.erp.notifications = [];
      this.notificationListShown = false;
    },

    init() {
      this.$store.erp.attachToaster(this.$notifications);
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
      this.sidebarBreakpointListener.remove();
    },
  }));

  // ---------------------------------------------------------------------------
  // Page controllers. One per route; fragments reference them via x-data.
  // Local UI state (filters, sort, dialogs) lives here and intentionally resets
  // when the user navigates away, while real data lives in the erp store.
  // ---------------------------------------------------------------------------
  Alpine.data('pageDashboard', () => ({
    period: '6m',
    get revenueChart() {
      return this.period === '12m' ? window.GraniteData.charts.revenueFullYear : window.GraniteData.charts.revenueHalfYear;
    },
    spendChart: window.GraniteData.charts.spendByCategory,
    get kpis() {
      const erp = this.$store.erp;
      return [
        { label: 'Outstanding', value: erp.money(erp.openInvoiceTotal), hint: erp.openInvoices.length + ' open invoices', icon: 'wallet' },
        { label: 'Overdue invoices', value: String(erp.overdueInvoices.length), hint: erp.money(erp.overdueInvoices.reduce((sum, i) => sum + i.amount, 0)) + ' past due', icon: 'clock-alert' },
        { label: 'Pending approvals', value: String(erp.pendingApprovals.length), hint: 'waiting on you', icon: 'stamp' },
        { label: 'Low stock items', value: String(erp.lowStockItems.length), hint: 'below reorder level', icon: 'package-open' },
      ];
    },
    get recentInvoices() {
      return this.$store.erp.invoices.slice(0, 5);
    },
  }));

  Alpine.data('pageInbox', () => ({
    selectedId: null,
    filter: 'all',
    // Below the breakpoint the inbox split shows either the message list or the
    // reading pane (data-hidden bindings in inbox.html), not both side by side.
    isCompact: false,
    init() {
      this.compactBreakpointListener = Harmonia.getBreakpointListener((matches) => {
        this.isCompact = matches;
      }, 1024);
    },
    destroy() {
      this.compactBreakpointListener.remove();
    },
    get list() {
      const messages = this.$store.erp.messages;
      return this.filter === 'unread' ? messages.filter((m) => m.unread) : messages;
    },
    get selected() {
      return this.$store.erp.messages.find((m) => m.id === this.selectedId);
    },
    open(id) {
      this.selectedId = id;
      this.$store.erp.markRead(id);
    },
    archive(id) {
      if (this.selectedId === id) this.selectedId = null;
      this.$store.erp.archiveMessage(id);
    },
  }));

  Alpine.data('pageApprovals', () => ({
    filter: 'Pending',
    expandedId: null,
    get list() {
      const approvals = this.$store.erp.approvals;
      if (this.filter === 'Pending') return approvals.filter((a) => a.status === 'Pending');
      if (this.filter === 'Resolved') return approvals.filter((a) => a.status !== 'Pending');
      return approvals;
    },
    toggle(id) {
      this.expandedId = this.expandedId === id ? null : id;
    },
  }));

  Alpine.data('pageInvoices', () => ({
    search: '',
    status: 'All',
    statuses: ['All', 'Draft', 'Sent', 'Paid', 'Overdue'],
    sortKey: 'issued',
    sortAsc: false,
    page: 1,
    pageSize: 8,
    showNew: false,
    newInvoice: { customer: '', due: '', description: '', qty: 1, unitPrice: null },
    newInvoiceValid: false,

    init() {
      const erp = this.$store.erp;
      if (erp.searchSeed) {
        this.search = erp.searchSeed;
        erp.searchSeed = '';
      }
    },
    get filtered() {
      const query = this.search.trim().toLowerCase();
      return this.$store.erp.invoices.filter((invoice) => {
        const matchesQuery = !query || invoice.id.toLowerCase().includes(query) || invoice.customer.toLowerCase().includes(query);
        const matchesStatus = this.status === 'All' || invoice.status === this.status;
        return matchesQuery && matchesStatus;
      });
    },
    get sorted() {
      const direction = this.sortAsc ? 1 : -1;
      return [...this.filtered].sort((a, b) => {
        const left = a[this.sortKey];
        const right = b[this.sortKey];
        return (typeof left === 'number' ? left - right : String(left).localeCompare(String(right))) * direction;
      });
    },
    get pageCount() {
      return Math.max(1, Math.ceil(this.sorted.length / this.pageSize));
    },
    get paged() {
      const page = Math.min(this.page, this.pageCount);
      return this.sorted.slice((page - 1) * this.pageSize, page * this.pageSize);
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    ariaSort(key) {
      if (this.sortKey !== key) return 'none';
      return this.sortAsc ? 'ascending' : 'descending';
    },
    get newInvoiceTotal() {
      return Math.round((this.newInvoice.qty || 0) * (this.newInvoice.unitPrice || 0) * 1.1 * 100) / 100;
    },
    openNew() {
      this.newInvoice = { customer: '', due: '', description: '', qty: 1, unitPrice: null };
      // Clear any :user-invalid state from a previous attempt so errors do not
      // show on a freshly opened, empty form.
      this.$refs.newInvoiceForm?.reset();
      this.newInvoiceValid = this.$refs.newInvoiceForm?.checkValidity() ?? false;
      this.showNew = true;
    },
    submitNew(send) {
      const id = this.$store.erp.addInvoice({ ...this.newInvoice, qty: Number(this.newInvoice.qty), unitPrice: Number(this.newInvoice.unitPrice) }, send);
      this.showNew = false;
      this.$router.navigate('/invoices/' + id);
    },
  }));

  Alpine.data('pageInvoiceDetail', () => ({
    get invoice() {
      return this.$store.erp.invoiceById(this.$params.id);
    },
    get customer() {
      return this.$store.erp.customers.find((c) => c.name === this.invoice?.customer);
    },
    get lifecycleStep() {
      return { Draft: 1, Sent: 2, Overdue: 2, Paid: 3 }[this.invoice?.status] || 1;
    },
    get subtotal() {
      return (this.invoice?.items || []).reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
    },
    get tax() {
      return Math.round(this.subtotal * 0.1 * 100) / 100;
    },
  }));

  Alpine.data('pageBills', () => ({
    status: 'All',
    statuses: ['All', 'Due', 'Scheduled', 'Overdue', 'Paid'],
    vendor: 'all',
    payTarget: null,
    get vendorNames() {
      return [...new Set(this.$store.erp.bills.map((b) => b.vendor))];
    },
    get list() {
      return this.$store.erp.bills.filter((bill) => (this.status === 'All' || bill.status === this.status) && (this.vendor === 'all' || bill.vendor === this.vendor));
    },
    confirmPay() {
      this.$store.erp.payBill(this.payTarget.id);
      this.payTarget = null;
    },
  }));

  Alpine.data('pageCustomers', () => ({
    search: '',
    segment: 'all',
    view: 'grid',
    selected: null,
    get list() {
      const query = this.search.trim().toLowerCase();
      return this.$store.erp.customers.filter((customer) => {
        const matchesQuery = !query || customer.name.toLowerCase().includes(query) || customer.contact.toLowerCase().includes(query) || customer.city.toLowerCase().includes(query);
        const matchesSegment = this.segment === 'all' || customer.segment === this.segment;
        return matchesQuery && matchesSegment;
      });
    },
    invoicesFor(name) {
      return this.$store.erp.invoices.filter((invoice) => invoice.customer === name);
    },
    openInvoice(id) {
      this.selected = null;
      this.$router.navigate('/invoices/' + id);
    },
  }));

  Alpine.data('pageVendors', () => ({
    search: '',
    showAdd: false,
    newVendor: { name: '', category: '', contact: '', email: '', city: '' },
    newVendorValid: false,
    get list() {
      const query = this.search.trim().toLowerCase();
      return this.$store.erp.vendors.filter((vendor) => !query || vendor.name.toLowerCase().includes(query) || vendor.category.toLowerCase().includes(query) || vendor.contact.toLowerCase().includes(query));
    },
    openAdd() {
      this.newVendor = { name: '', category: '', contact: '', email: '', city: '' };
      this.$refs.newVendorForm?.reset();
      this.newVendorValid = this.$refs.newVendorForm?.checkValidity() ?? false;
      this.showAdd = true;
    },
    submitAdd() {
      this.$store.erp.addVendor({ ...this.newVendor });
      this.showAdd = false;
    },
  }));

  Alpine.data('pageInventory', () => ({
    warehouse: null,
    category: null,
    restockTarget: null,
    restockQty: 25,
    // Below the breakpoint the inventory split shows either the warehouse tree
    // or the stock table (data-hidden bindings in inventory.html); treeOpen
    // switches between them.
    isCompact: false,
    treeOpen: false,
    init() {
      this.compactBreakpointListener = Harmonia.getBreakpointListener((matches) => {
        this.isCompact = matches;
      }, 1024);
    },
    destroy() {
      this.compactBreakpointListener.remove();
    },
    get tree() {
      const warehouses = new Map();
      this.$store.erp.inventory.forEach((item) => {
        if (!warehouses.has(item.warehouse)) warehouses.set(item.warehouse, new Set());
        warehouses.get(item.warehouse).add(item.category);
      });
      return [...warehouses.entries()].map(([name, categories]) => ({ name, categories: [...categories].sort() }));
    },
    get list() {
      return this.$store.erp.inventory.filter((item) => (!this.warehouse || item.warehouse === this.warehouse) && (!this.category || item.category === this.category));
    },
    get filterLabel() {
      if (!this.warehouse) return 'All warehouses';
      return this.category ? this.warehouse + ' / ' + this.category : this.warehouse;
    },
    pick(warehouse, category = null) {
      this.warehouse = warehouse;
      this.category = category;
      this.treeOpen = false;
    },
    stockPercent(item) {
      return Math.min(100, Math.round((item.stock / (item.reorderLevel * 2)) * 100));
    },
    stockVariant(item) {
      if (item.stock <= item.reorderLevel) return 'negative';
      return item.stock <= item.reorderLevel * 1.5 ? 'warning' : 'positive';
    },
    askRestock(item) {
      this.restockQty = 25;
      this.restockTarget = item;
    },
    confirmRestock() {
      this.$store.erp.adjustStock(this.restockTarget.sku, Number(this.restockQty) || 0);
      this.restockTarget = null;
    },
  }));

  Alpine.data('pageDocuments', () => ({
    type: 'all',
    scanning: false,
    scanTimeout: undefined,
    removeTarget: null,
    get types() {
      return [...new Set(this.$store.erp.documents.map((d) => d.type))].sort();
    },
    get list() {
      return this.$store.erp.documents.filter((d) => this.type === 'all' || d.type === this.type);
    },
    typeIcon(type) {
      return { Contract: 'file-signature', Report: 'file-chart-column', Invoice: 'receipt-text', Policy: 'shield-check', Checklist: 'list-checks', Image: 'file-image' }[type] || 'file';
    },
    upload(event) {
      const files = [...event.target.files];
      if (!files.length) return;
      files.forEach((file) => this.$store.erp.addDocument(file));
      this.$store.erp.toast(files.length === 1 ? 'Document uploaded' : files.length + ' documents uploaded', 'Available in the library under the Uploads tag.', 'positive');
      event.target.value = '';
    },
    scan() {
      this.scanning = true;
      this.scanTimeout = setTimeout(() => {
        this.scanning = false;
        this.$store.erp.toast('Library scan complete', 'All documents are indexed and searchable.', 'positive');
      }, 1400);
    },
    confirmRemove() {
      this.$store.erp.removeDocument(this.removeTarget.id);
      this.removeTarget = null;
    },
    destroy() {
      clearTimeout(this.scanTimeout);
    },
  }));

  Alpine.data('pageReports', () => ({
    tab: 'revenue',
    range: '6m',
    agingChart: window.GraniteData.charts.invoiceAging,
    cashflowChart: window.GraniteData.charts.cashflow,
    daysToPayChart: window.GraniteData.charts.daysToPay,
    get revenueChart() {
      return this.range === '12m' ? window.GraniteData.charts.revenueFullYear : window.GraniteData.charts.revenueHalfYear;
    },
    get stats() {
      const erp = this.$store.erp;
      return [
        { label: 'Invoiced, last 6 months', value: erp.money(1236000) },
        { label: 'Outstanding right now', value: erp.money(erp.openInvoiceTotal) },
        { label: 'Average days to pay', value: '19.5' },
        { label: 'Open approval requests', value: String(erp.pendingApprovals.length) },
      ];
    },
    exportReport() {
      this.$store.erp.toast('Export started', 'The report will be emailed to finance@granite.example as a spreadsheet.', 'information');
    },
  }));

  Alpine.data('pageSettings', () => ({
    showReset: false,
    save() {
      this.$store.erp.toast('Settings saved', 'Company profile and preferences have been updated.', 'positive');
    },
    confirmReset() {
      this.showReset = false;
      this.$store.erp.reset();
    },
  }));
});
