---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Harmonia'
  text: 'A Modern UI Component Library for Alpine.js'
  tagline: 'Build polished, accessible interfaces in minutes. A comprehensive, beautifully themed component set that brings the power of Tailwind CSS to Alpine.js, with no build step required.'
  image:
    src: '/logo/harmonia.svg'
    alt: 'Harmonia Logo'
  actions:
    - theme: brand
      text: Get Started
      link: /installation
    - theme: alt
      text: Components
      link: /components
    - theme: alt
      text: Charts
      link: /charts
    - theme: alt
      text: Utility Classes
      link: /utility-classes
    - theme: alt
      text: Theme Generator
      link: /theming/generator.html
      target: _self

features:
  - icon: <svg-icon class="feature-icon" src="./icons/components.svg"></svg-icon>
    title: 60+ Production-Ready Components
    details: From buttons, inputs, and dialogs to calendars, data tables, and charts, Harmonia ships a comprehensive toolkit for building rich interfaces, so you never have to stitch together mismatched third-party widgets.
    link: /components
    linkText: Browse all components
  - icon: <svg-icon class="feature-icon" src="./icons/alpine.svg"></svg-icon>
    title: Powered by Alpine.js
    details: Every component is a plain Alpine directive you drop straight onto your markup. Declarative, reactive, and instantly familiar to anyone who already knows Alpine.
  - icon: <svg-icon class="feature-icon" src="./icons/tailwindcss.svg"></svg-icon>
    title: Styled with Tailwind CSS v4
    details: Built on Tailwind's latest engine and a consistent set of design tokens, with a full library of utility classes so every component fits naturally into your design system.
    link: /utility-classes
    linkText: Explore utility classes
  - icon: <svg-icon class="feature-icon" src="./icons/graphs.svg"></svg-icon>
    title: Themeable Charts for Dashboards
    details: Visualize data with bar, line, scatter, pie, and doughnut charts that inherit your theme colors and adapt to light and dark mode automatically.
    link: /charts
    linkText: See the charts
  - icon: <svg-icon class="feature-icon" src="./icons/accessibility.svg"></svg-icon>
    title: Accessible by Default
    details: Accessibility is built in, not bolted on. Components ship with proper ARIA roles and states, full keyboard operability, and sensible accessible names out of the box.
  - icon: <svg-icon class="feature-icon" src="./icons/light-dark.svg"></svg-icon>
    title: Light and Dark Mode Built In
    details: Carefully crafted themes adapt to light and dark automatically, powered by modern oklch color tokens for crisp, consistent visuals on any screen.
  - icon: <svg-icon class="feature-icon" src="./icons/theming.svg"></svg-icon>
    title: Effortless Theming
    details: Tailor every color and token through simple CSS variables, or design a complete theme visually with the free, built-in theme generator.
    link: /theming/generator.html
    linkText: Open the theme generator
  - icon: <svg-icon class="feature-icon" src="./icons/rocket.svg"></svg-icon>
    title: No Build Step Required
    details: Drop in a single script from a CDN and start building immediately, with no compiler, tooling, or configuration. Prefer to bundle? A first-class ESM build is ready when you are.
  - icon: <svg-icon class="feature-icon" src="./icons/lightweight.svg"></svg-icon>
    title: Lightweight and Standards-Compliant
    details: Harmonia leans on native browser APIs, semantic HTML, and modern web standards with minimal overhead, keeping your pages fast and your markup clean.
---

<div class="templates">
  <h2 class="templates-title">Templates</h2>
  <p class="templates-intro">Complete, real-world interfaces built entirely with Harmonia components. Preview a template inline, or open it in a new tab to explore and inspect it.</p>

  <div class="template-list">

<TemplateShowcase title="Slate Dashboard" src="/harmonia/templates/slate-dashboard.html" desc="A single-file analytics dashboard with KPI cards, charts, data tables, and a responsive sidebar.">

<<< @/public/templates/slate-dashboard.html

</TemplateShowcase>

<TemplateShowcase title="Granite ERP" src="/harmonia/templates/granite-erp/index.html" desc="A multi-page ERP app split across one shell, two scripts, and thirteen page fragments, routed client-side with Pinecone Router.">

**index.html**

<<< @/public/templates/granite-erp/index.html

**js/app.js**

<<< @/public/templates/granite-erp/js/app.js

**js/data.js**

<<< @/public/templates/granite-erp/js/data.js

**pages/dashboard.html**

<<< @/public/templates/granite-erp/pages/dashboard.html

**pages/inbox.html**

<<< @/public/templates/granite-erp/pages/inbox.html

**pages/approvals.html**

<<< @/public/templates/granite-erp/pages/approvals.html

**pages/invoices.html**

<<< @/public/templates/granite-erp/pages/invoices.html

**pages/invoice-detail.html**

<<< @/public/templates/granite-erp/pages/invoice-detail.html

**pages/bills.html**

<<< @/public/templates/granite-erp/pages/bills.html

**pages/customers.html**

<<< @/public/templates/granite-erp/pages/customers.html

**pages/vendors.html**

<<< @/public/templates/granite-erp/pages/vendors.html

**pages/inventory.html**

<<< @/public/templates/granite-erp/pages/inventory.html

**pages/documents.html**

<<< @/public/templates/granite-erp/pages/documents.html

**pages/reports.html**

<<< @/public/templates/granite-erp/pages/reports.html

**pages/settings.html**

<<< @/public/templates/granite-erp/pages/settings.html

**pages/not-found.html**

<<< @/public/templates/granite-erp/pages/not-found.html

</TemplateShowcase>

<TemplateShowcase title="Onyx Chat" src="/harmonia/templates/onyx-chat/index.html" desc="A multi-page team chat app with channels, direct messages, reactions, and simulated replies, split across one shell, two scripts, and six page fragments, routed client-side with Pinecone Router.">

**index.html**

<<< @/public/templates/onyx-chat/index.html

**js/app.js**

<<< @/public/templates/onyx-chat/js/app.js

**js/data.js**

<<< @/public/templates/onyx-chat/js/data.js

**pages/chat.html**

<<< @/public/templates/onyx-chat/pages/chat.html

**pages/channels.html**

<<< @/public/templates/onyx-chat/pages/channels.html

**pages/activity.html**

<<< @/public/templates/onyx-chat/pages/activity.html

**pages/people.html**

<<< @/public/templates/onyx-chat/pages/people.html

**pages/settings.html**

<<< @/public/templates/onyx-chat/pages/settings.html

**pages/not-found.html**

<<< @/public/templates/onyx-chat/pages/not-found.html

</TemplateShowcase>

  </div>
</div>
