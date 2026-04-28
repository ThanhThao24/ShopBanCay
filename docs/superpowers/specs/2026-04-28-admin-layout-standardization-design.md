# Admin Layout Standardization

**Date:** 2026-04-28
**Scope:** 8 admin HTML pages + 1 CSS file (`css/admin.css`)
**Goal:** Unify HTML structure across all admin pages to match Figma design (`le2AKzNIfhrYZDHvkyWtr9`)

---

## Problem

Two incompatible layout structures exist in the admin section:

| File | Wrapper | Logo | Header | Content |
|---|---|---|---|---|
| `dashboard.html` | `admin-body` + `admin-wrapper` | `admin-sidebar-logo` + `nav-logo` | `admin-header` (green ✅) | `admin-content` |
| 7 other pages | `admin-layout` + `admin-main` | `admin-brand` + `logo-wrapper` | `admin-topbar` (white ❌) | `page-content` |

Figma shows all admin pages with the same dark-green header (`#2d5a27`).

---

## Canonical Structure

Every admin page (except `admin_login.html`) will use this exact HTML skeleton:

```html
<body>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <div class="logo-wrapper">
          <div class="logo-bg-nav"></div>
          <img class="logo-icon-nav" src="..." alt="Logo">
        </div>
        <div class="brand-name">Mầm Xanh</div>
      </div>
      <nav class="admin-nav">
        <a href="..." class="admin-nav-item [active]">
          <img src="..."> <span>Label</span>
        </a>
        <!-- 8 nav items total -->
      </nav>
    </aside>

    <div class="admin-main">
      <header class="admin-header">
        <div class="admin-search">
          <div class="admin-search-icon"><img src="..." alt="Search"></div>
          <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, khách hàng...">
        </div>
        <div class="admin-profile">
          <div class="admin-notif">
            <img src="..." alt="Notification">
            <span class="notif-dot"></span>
          </div>
          <div class="admin-user">
            <span class="user-role">Quản trị Mầm Xanh</span>
            <div class="user-avatar"><img src="..." alt="Avatar"></div>
          </div>
        </div>
      </header>
      <div class="admin-content">
        <!-- page-specific content — unchanged -->
      </div>
    </div>
  </div>
</body>
```

---

## Class Name Mapping

### Changes applied to 7 non-dashboard pages

| Old class | New class |
|---|---|
| `admin-topbar` | `admin-header` |
| `search-bar` | `admin-search` |
| `search-icon` | `admin-search-icon` |
| `topbar-actions` | `admin-profile` |
| `notification-btn` | `admin-notif` |
| `badge-dot` | `notif-dot` |
| `user-profile` | `admin-user` |
| `user-name` | `user-role` |
| `page-content` | `admin-content` |

### Changes applied to `dashboard.html` only

| Old | New |
|---|---|
| `<body class="admin-body">` | `<body>` (no class) |
| `<div class="admin-wrapper">` | `<div class="admin-main">` |
| `admin-sidebar-logo` + `nav-logo` markup | `admin-brand` + `logo-wrapper` markup |
| `nav-logo-bg-shape`, `nav-logo-subtitle`, `nav-logo-icon-wrap` | `logo-bg-nav`, `logo-icon-nav` |
| `nav-brand-name` | `brand-name` |

---

## CSS Changes (`css/admin.css`)

Update `.admin-content` to include flex and background:

```css
.admin-content {
    padding: 48px;
    background-color: #fafaf9;
    flex: 1;
}
```

Keep deprecated classes (`admin-topbar`, `page-content`, `admin-body`, `admin-wrapper`,
`search-bar`, `topbar-actions`, `notification-btn`, `badge-dot`, `user-profile`, `user-name`)
intact — do not delete them. JS files may reference them via `querySelector`.

---

## Files in Scope

| File | Action |
|---|---|
| `admin/dashboard.html` | Replace wrapper + logo + wrap in admin-layout |
| `admin/admin_products.html` | Replace header + content classes |
| `admin/admin_orders.html` | Replace header + content classes |
| `admin/admin_categories.html` | Replace header + content classes |
| `admin/admin_promotions.html` | Replace header + content classes |
| `admin/admin_revenue.html` | Replace header + content classes |
| `admin/admin_support.html` | Replace header + content classes |
| `admin/admin_analytics.html` | Replace header + content classes |
| `css/admin.css` | Update `.admin-content` |
| `admin/admin_login.html` | No change — no shared layout |

---

## Out of Scope

- Page-specific content inside `admin-content`
- JavaScript files
- CSS files other than `admin.css`
- Frontend (non-admin) pages
