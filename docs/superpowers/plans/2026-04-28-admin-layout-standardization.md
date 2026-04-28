# Admin Layout Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize all 8 admin HTML pages to use a single canonical layout structure matching the Figma design.

**Architecture:** All pages use `div.admin-layout` (flex row) → `aside.admin-sidebar` + `div.admin-main` (flex column) → `header.admin-header` (green #2d5a27) + `div.admin-content`. The sidebar always uses `admin-brand` + `logo-wrapper` for the logo area and `admin-nav` for navigation.

**Tech Stack:** Plain HTML + CSS. No JS changes. No build tools.

---

## File Map

| File | Change type |
|---|---|
| `css/admin.css` | Add `flex:1` + `background` to `.admin-content` |
| `admin/dashboard.html` | Rebuild outer wrapper + logo markup |
| `admin/admin_products.html` | Rename header + content classes |
| `admin/admin_orders.html` | Rename header + content classes |
| `admin/admin_categories.html` | Rename header + content classes |
| `admin/admin_promotions.html` | Rename header + content classes |
| `admin/admin_revenue.html` | Fix sidebar logo + strip nav-bg-hover divs |
| `admin/admin_support.html` | Rebuild sidebar logo + rebuild header |
| `admin/admin_analytics.html` | Fix sidebar logo + strip nav-bg-hover divs |

---

## Task 1: Update `css/admin.css`

**Files:**
- Modify: `css/admin.css` (line ~436)

- [ ] **Step 1: Update `.admin-content` rule**

Find and replace in `css/admin.css`:

```css
/* BEFORE */
.admin-content {
    padding: 48px;
}

/* AFTER */
.admin-content {
    padding: 48px;
    background-color: #fafaf9;
    flex: 1;
}
```

- [ ] **Step 2: Verify `admin-header` works in flex context**

Confirm `css/admin.css` already has this block (do NOT change it):

```css
.admin-layout .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.admin-header {
    height: 88px;
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    position: sticky;
    top: 0;
    z-index: 900;
}
```

- [ ] **Step 3: Commit**

```bash
git add css/admin.css
git commit -m "style: make admin-content flex:1 with background color"
```

---

## Task 2: Standardize `admin/dashboard.html`

**Files:**
- Modify: `admin/dashboard.html`

Current structure uses `<body class="admin-body">` + `<div class="admin-wrapper">` + non-standard logo markup. Must be migrated to canonical structure.

- [ ] **Step 1: Replace `<body>` opening tag**

```html
<!-- BEFORE -->
<body class="admin-body">

<!-- AFTER -->
<body>
    <div class="admin-layout">
```

- [ ] **Step 2: Replace sidebar logo section**

Find this block (lines 16–25 approx):
```html
        <div class="admin-sidebar-logo">
            <div class="nav-logo">
                <div class="nav-logo-bg-shape"></div>
                <div class="nav-logo-subtitle">Mầm Xanh</div>
                <div class="nav-logo-icon-wrap">
                    <img src="../assets/figma/ffa71a92-4aa9-4c9a-885b-ef6879b7d9fc.png" alt="Logo Icon">
                </div>
            </div>
            <h1 class="nav-brand-name" style="margin-left: 12px;">Mầm Xanh</h1>
        </div>
```

Replace with:
```html
        <div class="admin-brand">
            <div class="logo-wrapper">
                <div class="logo-bg-nav"></div>
                <img class="logo-icon-nav" src="../assets/figma/ffa71a92-4aa9-4c9a-885b-ef6879b7d9fc.png" alt="Logo">
            </div>
            <div class="brand-name">Mầm Xanh</div>
        </div>
```

- [ ] **Step 3: Replace `admin-wrapper` with `admin-main`**

```html
<!-- BEFORE -->
    <div class="admin-wrapper">

<!-- AFTER -->
    <div class="admin-main">
```

- [ ] **Step 4: Close the new `admin-layout` div and close `body`**

Find the end of the file. The current structure ends:
```html
    </div>  <!-- closes admin-wrapper -->
    <script src="../js/store.js"></script>
    <script src="../js/dashboard.js"></script>
</body>
```

Replace with:
```html
    </div>  <!-- closes admin-main -->
  </div>  <!-- closes admin-layout -->
  <script src="../js/store.js"></script>
  <script src="../js/dashboard.js"></script>
</body>
```

- [ ] **Step 5: Open `admin/dashboard.html` in browser and verify**

- Sidebar appears on the left with logo + nav
- Header is dark green with search bar and user avatar
- Dashboard content (stats, chart) renders below header
- No horizontal overflow or broken layout

- [ ] **Step 6: Commit**

```bash
git add admin/dashboard.html
git commit -m "refactor: migrate dashboard.html to canonical admin-layout structure"
```

---

## Task 3: Standardize `admin/admin_products.html`

**Files:**
- Modify: `admin/admin_products.html`

- [ ] **Step 1: Replace header block**

Find (lines 65–85 approx):
```html
            <!-- Topbar -->
            <header class="admin-topbar">
                <div class="search-bar">
                    <div class="search-icon">
                        <img src="../assets/figma/f67abaf5-c131-4a3c-801b-c77098fdd91b.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, khách hàng...">
                </div>
                
                <div class="topbar-actions">
                    <button class="notification-btn">
                        <img src="../assets/figma/b222a3be-b587-49b7-b7dd-8111d3800cc5.svg" alt="Notifications">
                        <span class="badge-dot"></span>
                    </button>
                    <div class="user-profile">
                        <span class="user-name">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/6d65ee8c-6291-4898-84a7-e9ba2678ef9c.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

Replace with:
```html
            <!-- Header -->
            <header class="admin-header">
                <div class="admin-search">
                    <div class="admin-search-icon">
                        <img src="../assets/figma/f67abaf5-c131-4a3c-801b-c77098fdd91b.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, khách hàng...">
                </div>
                <div class="admin-profile">
                    <div class="admin-notif">
                        <img src="../assets/figma/b222a3be-b587-49b7-b7dd-8111d3800cc5.svg" alt="Notifications">
                        <span class="notif-dot"></span>
                    </div>
                    <div class="admin-user">
                        <span class="user-role">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/6d65ee8c-6291-4898-84a7-e9ba2678ef9c.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

- [ ] **Step 2: Replace content wrapper**

```html
<!-- BEFORE -->
            <!-- Page Content -->
            <div class="page-content">

<!-- AFTER -->
            <!-- Page Content -->
            <div class="admin-content">
```

And the matching closing tag (find `</div>` before `</main>`):
```html
<!-- BEFORE -->
            </div>  <!-- end page-content / before </main> -->

<!-- AFTER -->
            </div>  <!-- end admin-content -->
```

- [ ] **Step 3: Open `admin/admin_products.html` in browser and verify**

- Header is dark green
- Search input placeholder is visible (white text)
- Notification dot visible, avatar displayed
- Product table and content below header — no layout breaks

- [ ] **Step 4: Commit**

```bash
git add admin/admin_products.html
git commit -m "refactor: standardize admin_products.html layout classes"
```

---

## Task 4: Standardize `admin/admin_orders.html`

**Files:**
- Modify: `admin/admin_orders.html`

The header markup is identical to `admin_products.html`. Apply the same changes (icon/avatar UUIDs differ per page — keep each page's own UUIDs).

- [ ] **Step 1: Replace header block**

Find (lines 65–85 approx):
```html
            <!-- Topbar -->
            <header class="admin-topbar">
                <div class="search-bar">
                    <div class="search-icon">
                        <img src="../assets/figma/978bf268-1472-47ba-8460-752f7d97dfa6.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, khách hàng...">
                </div>
                
                <div class="topbar-actions">
                    <button class="notification-btn">
                        <img src="../assets/figma/bb548abe-fc9d-41d4-ad73-da4164a0b088.svg" alt="Notifications">
                        <span class="badge-dot"></span>
                    </button>
                    <div class="user-profile">
                        <span class="user-name">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/58e8437f-2cdc-4b9b-bc6d-56cf3b5393a2.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

Replace with:
```html
            <!-- Header -->
            <header class="admin-header">
                <div class="admin-search">
                    <div class="admin-search-icon">
                        <img src="../assets/figma/978bf268-1472-47ba-8460-752f7d97dfa6.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, khách hàng...">
                </div>
                <div class="admin-profile">
                    <div class="admin-notif">
                        <img src="../assets/figma/bb548abe-fc9d-41d4-ad73-da4164a0b088.svg" alt="Notifications">
                        <span class="notif-dot"></span>
                    </div>
                    <div class="admin-user">
                        <span class="user-role">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/58e8437f-2cdc-4b9b-bc6d-56cf3b5393a2.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

- [ ] **Step 2: Replace content wrapper**

```html
<!-- BEFORE -->
            <div class="page-content">

<!-- AFTER -->
            <div class="admin-content">
```

- [ ] **Step 3: Verify in browser — header is green, orders table renders correctly**

- [ ] **Step 4: Commit**

```bash
git add admin/admin_orders.html
git commit -m "refactor: standardize admin_orders.html layout classes"
```

---

## Task 5: Standardize `admin/admin_categories.html`

**Files:**
- Modify: `admin/admin_categories.html`

- [ ] **Step 1: Replace header block**

Find (lines 65–85 approx):
```html
            <!-- Topbar -->
            <header class="admin-topbar">
                <div class="search-bar">
                    <div class="search-icon">
                        <img src="../assets/figma/978bf268-1472-47ba-8460-752f7d97dfa6.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm danh mục...">
                </div>

                <div class="topbar-actions">
                    <button class="notification-btn">
                        <img src="../assets/figma/bb548abe-fc9d-41d4-ad73-da4164a0b088.svg" alt="Notifications">
                        <span class="badge-dot"></span>
                    </button>
                    <div class="user-profile">
                        <span class="user-name">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/58e8437f-2cdc-4b9b-bc6d-56cf3b5393a2.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

Replace with:
```html
            <!-- Header -->
            <header class="admin-header">
                <div class="admin-search">
                    <div class="admin-search-icon">
                        <img src="../assets/figma/978bf268-1472-47ba-8460-752f7d97dfa6.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm danh mục...">
                </div>
                <div class="admin-profile">
                    <div class="admin-notif">
                        <img src="../assets/figma/bb548abe-fc9d-41d4-ad73-da4164a0b088.svg" alt="Notifications">
                        <span class="notif-dot"></span>
                    </div>
                    <div class="admin-user">
                        <span class="user-role">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/58e8437f-2cdc-4b9b-bc6d-56cf3b5393a2.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

- [ ] **Step 2: Replace content wrapper**

```html
<!-- BEFORE -->
            <!-- Page Content -->
            <div class="page-content">

<!-- AFTER -->
            <!-- Page Content -->
            <div class="admin-content">
```

- [ ] **Step 3: Verify in browser — green header, categories grid renders**

- [ ] **Step 4: Commit**

```bash
git add admin/admin_categories.html
git commit -m "refactor: standardize admin_categories.html layout classes"
```

---

## Task 6: Standardize `admin/admin_promotions.html`

**Files:**
- Modify: `admin/admin_promotions.html`

Note: this page has a background image div before the header — keep it in place.

- [ ] **Step 1: Replace header block**

Find (lines 70–90 approx):
```html
            <!-- Topbar -->
            <header class="admin-topbar">
                <div class="search-bar">
                    <div class="search-icon">
                        <img src="../assets/figma/1df5e343-441d-4f0f-ad1f-4e58bac02252.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, khách hàng...">
                </div>
                
                <div class="topbar-actions">
                    <button class="notification-btn">
                        <img src="../assets/figma/cbdade7a-4480-4b7b-b318-51c90e4b46c5.svg" alt="Notifications">
                        <span class="badge-dot"></span>
                    </button>
                    <div class="user-profile">
                        <span class="user-name">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/8c207e01-fab7-482a-ad4b-790b1209edee.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

Replace with:
```html
            <!-- Header -->
            <header class="admin-header">
                <div class="admin-search">
                    <div class="admin-search-icon">
                        <img src="../assets/figma/1df5e343-441d-4f0f-ad1f-4e58bac02252.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm nhanh đơn hàng, khách hàng...">
                </div>
                <div class="admin-profile">
                    <div class="admin-notif">
                        <img src="../assets/figma/cbdade7a-4480-4b7b-b318-51c90e4b46c5.svg" alt="Notifications">
                        <span class="notif-dot"></span>
                    </div>
                    <div class="admin-user">
                        <span class="user-role">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/8c207e01-fab7-482a-ad4b-790b1209edee.jpg" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

- [ ] **Step 2: Find and replace content wrapper**

```html
<!-- BEFORE (find the first occurrence after </header>) -->
            <div class="page-content">

<!-- AFTER -->
            <div class="admin-content">
```

- [ ] **Step 3: Verify in browser — green header, promotions table renders**

- [ ] **Step 4: Commit**

```bash
git add admin/admin_promotions.html
git commit -m "refactor: standardize admin_promotions.html layout classes"
```

---

## Task 7: Standardize `admin/admin_revenue.html` sidebar

**Files:**
- Modify: `admin/admin_revenue.html`

This page already has `admin-header` (green ✅). Only the sidebar needs fixing:
1. Logo area has extra `logo-text-nav` and `brand-subtitle` elements not in canonical structure
2. Nav items have spurious `div.nav-bg-hover` inside them

- [ ] **Step 1: Replace logo area**

Find:
```html
            <div class="admin-brand">
                <div class="logo-wrapper">
                    <div class="logo-bg-nav"></div>
                    <img class="logo-icon-nav" src="../assets/figma/d9f71e46-e9a3-4e61-923d-b8127b2f640a.png" alt="Logo">
                    <div class="logo-text-nav">Mầm Xanh</div>
                </div>
                <div class="brand-subtitle">Hệ thống quản trị</div>
            </div>
```

Replace with:
```html
            <div class="admin-brand">
                <div class="logo-wrapper">
                    <div class="logo-bg-nav"></div>
                    <img class="logo-icon-nav" src="../assets/figma/d9f71e46-e9a3-4e61-923d-b8127b2f640a.png" alt="Logo">
                </div>
                <div class="brand-name">Mầm Xanh</div>
            </div>
```

- [ ] **Step 2: Remove all `div.nav-bg-hover` elements from nav**

Each non-active nav item has this pattern:
```html
                <a href="..." class="admin-nav-item">
                    <div class="nav-bg-hover"><img src="../assets/figma/1b402567-8110-48cc-b7f3-952070353f42.svg" alt="Bg"></div>
                    <img src="..." alt="...">
                    <span>Label</span>
                </a>
```

Remove all `<div class="nav-bg-hover">...</div>` lines so each nav item becomes:
```html
                <a href="..." class="admin-nav-item">
                    <img src="..." alt="...">
                    <span>Label</span>
                </a>
```

There are 7 such divs (all items except the active `admin_revenue` link). Remove all 7.

- [ ] **Step 3: Verify in browser — sidebar shows logo correctly, nav items have no extra images**

- [ ] **Step 4: Commit**

```bash
git add admin/admin_revenue.html
git commit -m "refactor: clean up admin_revenue.html sidebar to canonical structure"
```

---

## Task 8: Standardize `admin/admin_support.html`

**Files:**
- Modify: `admin/admin_support.html`

This page has the most divergence: sidebar uses `sidebar-top`/`sidebar-bottom` wrappers, no logo image, and header uses `search-wrap` instead of standard markup.

- [ ] **Step 1: Replace sidebar logo area**

Find:
```html
        <aside class="admin-sidebar">
            <div class="sidebar-top">
                <div class="admin-brand">
                    <h1>Mầm Xanh</h1>
                    <span>Admin Portal</span>
                </div>

                <nav class="admin-nav">
```

Replace with (keep `sidebar-bottom` below nav, unmodified):
```html
        <aside class="admin-sidebar">
            <div class="admin-brand">
                <div class="logo-wrapper">
                    <div class="logo-bg-nav"></div>
                    <img class="logo-icon-nav" src="../assets/figma/4b9e6e0f-eb58-449f-9b44-3d39b9e665a3.png" alt="Logo">
                </div>
                <div class="brand-name">Mầm Xanh</div>
            </div>

            <nav class="admin-nav">
```

- [ ] **Step 2: Remove closing `</div>` of old `sidebar-top`**

Find and remove the line:
```html
            </div>
```
that closes `sidebar-top` (it appears after `</nav>`, before `<div class="sidebar-bottom">`).

The result should be:
```html
            </nav>
            
            <div class="sidebar-bottom">
                <button class="btn-new-ticket">
```

- [ ] **Step 3: Replace header block**

Find:
```html
            <!-- Topbar (Authority Components) -->
            <header class="admin-topbar">
                <div class="search-wrap">
                    <img src="../assets/figma/2d55320a-a5c8-478a-a371-005c14b4b36a.svg" alt="Search">
                    <input type="text" placeholder="Tìm kiếm yêu cầu...">
                </div>
                
                <div class="topbar-actions">
                    <div>
                        <button><img src="../assets/figma/b9b7562e-0359-4d8d-b67c-d59d229521f5.svg" alt="N"></button>
                        <button><img src="../assets/figma/22495a5b-93f2-4f86-8559-83fc4510d2c3.svg" alt="S"></button>
                        <button><img src="../assets/figma/d44100f0-05d0-4ce0-bd03-536aa7250b46.svg" alt="H"></button>
                    </div>
                    <div class="user-avatar">
                        <img src="../assets/figma/36fa8a97-f2cb-4b7c-926f-d8cd7c7fbde4.png" alt="User">
                    </div>
                </div>
            </header>
```

Replace with:
```html
            <!-- Header -->
            <header class="admin-header">
                <div class="admin-search">
                    <div class="admin-search-icon">
                        <img src="../assets/figma/2d55320a-a5c8-478a-a371-005c14b4b36a.svg" alt="Search">
                    </div>
                    <input type="text" placeholder="Tìm kiếm yêu cầu...">
                </div>
                <div class="admin-profile">
                    <div class="admin-notif">
                        <img src="../assets/figma/b9b7562e-0359-4d8d-b67c-d59d229521f5.svg" alt="Notifications">
                        <span class="notif-dot"></span>
                    </div>
                    <div class="admin-user">
                        <span class="user-role">Quản trị Mầm Xanh</span>
                        <div class="user-avatar">
                            <img src="../assets/figma/36fa8a97-f2cb-4b7c-926f-d8cd7c7fbde4.png" alt="Avatar">
                        </div>
                    </div>
                </div>
            </header>
```

- [ ] **Step 4: Verify in browser — sidebar shows logo correctly, header is green, support chat content renders**

- [ ] **Step 5: Commit**

```bash
git add admin/admin_support.html
git commit -m "refactor: standardize admin_support.html layout — rebuild sidebar and header"
```

---

## Task 9: Standardize `admin/admin_analytics.html` sidebar

**Files:**
- Modify: `admin/admin_analytics.html`

Same pattern as `admin_revenue.html` — header is already `admin-header` (green ✅), sidebar logo has extra elements and nav items have `nav-bg-hover` divs.

- [ ] **Step 1: Replace logo area**

Find:
```html
            <div class="admin-brand">
                <div class="logo-wrapper">
                    <div class="logo-bg-nav"></div>
                    <img class="logo-icon-nav" src="../assets/figma/fbfdbdda-6ce0-4805-88ca-bd52589b92dd.png" alt="Logo">
                    <div class="logo-text-nav">Mầm Xanh</div>
                </div>
                <div class="brand-subtitle">Hệ thống quản trị</div>
            </div>
```

Replace with:
```html
            <div class="admin-brand">
                <div class="logo-wrapper">
                    <div class="logo-bg-nav"></div>
                    <img class="logo-icon-nav" src="../assets/figma/fbfdbdda-6ce0-4805-88ca-bd52589b92dd.png" alt="Logo">
                </div>
                <div class="brand-name">Mầm Xanh</div>
            </div>
```

- [ ] **Step 2: Remove all `div.nav-bg-hover` elements from nav**

Same as Task 7 Step 2 — remove all 7 occurrences of:
```html
                    <div class="nav-bg-hover"><img src="../assets/figma/6d6a2434-c1b0-47ff-89e7-aa43f0ad0813.svg" alt="Bg"></div>
```

Each nav item after removal should be:
```html
                <a href="..." class="admin-nav-item">
                    <img src="..." alt="...">
                    <span>Label</span>
                </a>
```

- [ ] **Step 3: Verify in browser — sidebar shows logo correctly, nav items clean, analytics charts render**

- [ ] **Step 4: Commit**

```bash
git add admin/admin_analytics.html
git commit -m "refactor: clean up admin_analytics.html sidebar to canonical structure"
```

---

## Self-Review Checklist

- [x] All 8 pages covered (dashboard, products, orders, categories, promotions, revenue, support, analytics)
- [x] admin_login.html excluded (no shared layout)
- [x] CSS change is minimal and non-breaking
- [x] Old classes (`admin-topbar`, `page-content`, etc.) kept in CSS — not deleted
- [x] Each page's own figma asset UUIDs preserved (not swapped)
- [x] admin_support.html sidebar-bottom (New Ticket button) preserved
- [x] admin_revenue.html and admin_analytics.html header inner content left as-is (page-specific filters/nav)
- [x] No JS files touched
