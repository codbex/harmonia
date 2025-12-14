# Info Page

The info page can be used to present instructions with actions, show a message to the user when a page or list is empty or as an error page.

## API Reference

### Component attubute(s)

```
x-h-info-page
x-h-info-page-header
x-h-info-page-media
x-h-info-page-title
x-h-info-page-description
x-h-info-page-content
```

### Modifiers

#### x-h-info-page-media

| Modifier | Description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| icon     | Applies styles for inline svg icons. Do not activate when using an img tag. |

## Examples

### With inline SVG icon

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-info-page>
  <div x-h-info-page-header>
    <div x-h-info-page-media.icon>
      <i role="img" data-lucide="folder"></i>
    </div>
    <div x-h-info-page-title>No Projects Yet</div>
    <div x-h-info-page-description>You haven't created any projects yet. Get started by creating your first project.</div>
  </div>
  <div x-h-info-page-content>
    <div class="flex gap-2">
      <button x-h-button data-variant="primary">Create Project</button>
      <button x-h-button data-variant="outline">Import Project</button>
    </div>
  </div>
  <a href="#" x-h-button data-size="sm" data-variant="link">Learn More<i role="img" data-lucide="arrow-up-right"></i></a>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-info-page>
  <div x-h-info-page-header>
    <div x-h-info-page-media.icon>
      <i role="img" data-lucide="folder"></i>
    </div>
    <div x-h-info-page-title>No Projects Yet</div>
    <div x-h-info-page-description>You haven't created any projects yet. Get started by creating your first project.</div>
  </div>
  <div x-h-info-page-content>
    <div class="flex gap-2">
      <button x-h-button data-variant="primary">Create Project</button>
      <button x-h-button data-variant="outline">Import Project</button>
    </div>
  </div>
  <a href="#" x-h-button data-size="sm" data-variant="link">Learn More<i role="img" data-lucide="arrow-up-right"></i></a>
</div>
```

### With image

<br />

<ClientOnly>
<component-container>
<div x-h-info-page>
  <div x-h-info-page-header>
    <div x-h-info-page-media>
      <img src="/logo/harmonia.svg" alt="@harmonia" width="256px" />
    </div>
    <div x-h-info-page-title>Harmonia UI</div>
    <div x-h-info-page-description>UI component library for Alpine.js</div>
  </div>
  <div x-h-info-page-content>
    <button x-h-button data-variant="primary">GitHub Page</button>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-info-page>
  <div x-h-info-page-header>
    <div x-h-info-page-media>
      <img src="/logo/harmonia.svg" alt="@harmonia" width="256px" />
    </div>
    <div x-h-info-page-title>Harmonia UI</div>
    <div x-h-info-page-description>UI component library for Alpine.js</div>
  </div>
  <div x-h-info-page-content>
    <button x-h-button data-variant="primary">GitHub Page</button>
  </div>
</div>
```

### With border

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-info-page class="border">
  <div x-h-info-page-header>
    <div x-h-info-page-media>
      <i role="img" data-lucide="upload"></i>
    </div>
    <div x-h-info-page-title>Upload file(s)</div>
    <div x-h-info-page-description>Drag & drop your file(s) or use the button below</div>
  </div>
  <div x-h-info-page-content>
    <button x-h-button data-variant="primary">Upload</button>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-info-page class="border">
  <div x-h-info-page-header>
    <div x-h-info-page-media>
      <i role="img" data-lucide="upload"></i>
    </div>
    <div x-h-info-page-title>Upload file(s)</div>
    <div x-h-info-page-description>Drag & drop your file(s) or use the button below</div>
  </div>
  <div x-h-info-page-content>
    <button x-h-button data-variant="primary">Upload</button>
  </div>
</div>
```
