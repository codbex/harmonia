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
    <article class="template-card">
      <header class="template-card-header">
        <h3>Slate Dashboard</h3>
        <a class="template-open" href="/harmonia/templates/slate-dashboard.html" target="_blank" rel="noopener noreferrer">Open in new tab</a>
      </header>
      <iframe class="template-frame" src="/harmonia/templates/slate-dashboard.html" title="Slate Dashboard template" loading="lazy"></iframe>
    </article>
  </div>
</div>
