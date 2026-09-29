# Worklog: IQVIA MAT Jul Interactive Performance Dashboard Implementation

## Overview
This document records every data extraction/cleaning decision, mathematical formula, architecture choice, and UI implementation step taken during the development of the standalone interactive IQVIA dashboard (`IQVIA_MAT_Jul_Dashboard.html`).

---

## 1. Raw Dataset Analysis & Characteristics
- **Source File**: `IQVIA.xlsx`, Sheet `Sheet1`.
- **Row Count**: 16,489 initial rows.
- **Original Columns**:
  - `ATC4`
  - `Product`
  - `Strength`
  - `Pack`
  - `Launch Date`
  - `NFC1`
  - `Units MAT Jul 2023`, `Units MAT Jul 2024`, `Units MAT Jul 2025`, `Units MAT Jul 2026`
  - `LC Value MAT Jul 2023`, `LC Value MAT Jul 2024`, `LC Value MAT Jul 2025`, `LC Value MAT Jul 2026`

### Key Observations & Cleaning:
1. **No Corporation Column**: Confirmed that `Corporation` is absent from the dataset. No grouping, filtering, or display by corporation was introduced.
2. **Grand Total Elimination**: The final row in the Excel sheet contained an Excel summary row with `ATC4 = 'Grand Total'` and `Product = NaN`, carrying total market sums (~314.8B LC Value). This row was purged to prevent skewing peer totals and chart axes.
3. **Blank / Empty Product Handling**: Rows missing product names or with whitespace-only values were removed.
4. **Column Header Normalization**: Newline characters in column names (`Units\nMAT Jul 2023`) were stripped and replaced with spaces (`Units MAT Jul 2023`).
5. **Pack Aggregation**: Rows were aggregated from 16,488 pack-level records down to **13,368 peer rows** by grouping on `(ATC4, Product, NFC1, Strength)` and summing `Units` and `LC Value` independently for each of the 4 MAT snapshots (Jul 2023, 2024, 2025, 2026).
6. **Multi-ATC4 Product Nuance**: In the dataset, certain products (e.g., broad-indication molecules) span across multiple `ATC4` categories. When a user selects a product in Tab 1 or Tab 3, the dashboard automatically resolves to the ATC4 category with the highest 2026 LC Value while presenting an interactive switcher allowing seamless switching between ATC4 contexts.

---

## 2. Mathematical Formulas Implemented

### A. Year-Over-Year (YoY) Growth %
Calculated dynamically for both `Units` and `LC Value` across all tabs:
$$\text{Growth \%}(Y) = \frac{\text{Value}(Y) - \text{Value}(Y-1)}{\text{Value}(Y-1)} \times 100$$
- **MAT 2023**: Displays `N/A` since no MAT 2022 baseline exists.
- **Zero / Null Prior Year**: Displays `N/A` if $\text{Value}(Y-1) = 0$ or undefined.
- **Visual Styling**: Positive growth formatted with `+` sign in a light green pill badge (`growth-pos`), negative growth formatted in a light red pill badge (`growth-neg`).

### B. Dynamic Market Share %
Calculated dynamically within the active peer scope (ATC4 filtered by active NFC1 & Strength selections):
$$\text{Market Share}(Y) = \frac{\text{Row Value}(Y)}{\sum_{r \in \text{Current Scope}} \text{Row Value}_r(Y)} \times 100$$
- Always recalculates live on filter or year changes to sum precisely to 100.0%.

---

## 3. UI/UX Architecture & Technical Choices

### A. Standalone & Self-Contained Architecture
- **Output File**: `IQVIA_MAT_Jul_Dashboard.html` (~1.82 MB).
- **Embedded Dataset**: Embedded directly inside a `<script type="application/json" id="iqvia-data">` block as a compact 2D array:
  `[ATC4, Product, NFC1, Strength, U23, U24, U25, U26, V23, V24, V25, V26]`
  This reduced memory footprint and enables fast, client-side rendering with no web server requirement.
- **Embedded Assets**: `HPG logo.jpg` is encoded directly as Base64 in the HTML header.
- **External Dependencies**: Only CDN libraries (`Chart.js` v4.4.1 and `chartjs-plugin-datalabels` v2.2.0) are loaded.

### B. Corporate Visual Theme
- Built around **Navy Blue, Controlled Crimson Red, and Warm Tan/Brown**:
  - Primary Structural / Header / Table headers: Deep Navy `#1a365d` / `#0f1e36`.
  - Accents & Alerts / Highlights: Crimson Red `#c53030`.
  - Secondary Filters & Selected Active Nav: Warm Tan/Brown `#795548` / `#8d6e63`.
  - Table typography: `Inter` font, tabular numbers, sticky column headers and sticky total row.

### C. Sidebar Navigation & Tab Breakdown
- **Tab-entry reset**: switching to a tab always resets it to the default scope (ZURCAL / A02B2 PROTON PUMP INHIBITORS, All NFC1 Forms, All Strengths, MAT 2026, LC Value, All rows, default sort). Filter selections do not persist across tab switches — each visit presents a clean state (relevant for multi-user distribution).
1. **Tab 1: Products Performance (Default on Load)**
   - Autocomplete search across all unique products.
   - Cascading `NFC1` and `Strength` dropdowns populated only with values belonging to the active `ATC4`.
   - MAT Year segmented toggle (`2023`, `2024`, `2025`, `2026`, default `2026`).
   - Table columns: `Product | Strength | NFC1 | LC Value | LC Value Share | LC Value Growth % PY | Units | Units Share | Units Growth % PY`.
   - Synchronized Bar Chart: Product names on X-axis, Units on Y-axis, data labels positioned outside bar ends.
2. **Tab 2: ATC4 Performance**
   - Autocomplete search across all unique `ATC4` categories.
   - Cascading `NFC1` and `Strength` dropdowns.
   - MAT Year segmented toggle.
   - Synchronized Bar Chart of category peer volumes.
3. **Tab 3: Analytics (4-Year Historical Evolution)**
   - Metric Toggle (`LC Value` / `Units`): drives BOTH the table and the chart. The table renders only the selected metric's columns:
     `Product | Strength | NFC1 | <Metric> 2023..2026 | <Metric> Growth % 2024..2026 | <Metric> CAGR 23-26` (11 columns, was previously a fixed 17-column both-metrics layout).
   - Table toolbar (in the table header bar): metric toggle, Top-N selector (`All rows` default / `Top 10 / 20 / 50`), and `Export CSV` button. Top-N limits displayed rows only; the Total Market footer always covers the full scope.
   - **Sortable headers**: metric year columns, Growth % columns, CAGR, and Product are clickable to sort asc/desc (first click on a numeric column = descending). Default sort: selected metric 2026 descending; the chart's top-10 capping always follows the selected metric's 2026 value regardless of table sort.
   - **CAGR column**: 3-year CAGR (2023→2026) pill per row; `N/A` when the 2023 base is 0.
   - **Compact numbers + data bars**: year cells render compact (`667.4M`, `2.79B`) with in-cell data bars scaled to the column max; the exact number is available via the cell's `title` tooltip and in the CSV export (full precision).
   - **Sticky Product column**: first column stays pinned during horizontal scrolling of the Analytics table.
   - **CSV Export**: downloads `Analytics_<Metric>_<ATC4>.csv` (UTF-8 BOM) with all rows in scope plus the Total Market row.
   - Synchronized Multi-Line Chart: X-axis represents the 4 MAT years (2023 - 2026); individual lines track each peer row over time.
   - **Line Chart Capping**: To prevent visual clutter and lag, the line chart visualizes the top 10 peer rows by the selected metric's 2026 volume, while the data table continues to display the full peer set.
   - **Chart view toggle**: `Absolute` / `Index (2023 = 100)`; index mode rebases every line to its 2023 value with a dedicated y-axis title and non-zero baseline.
   - **Total Market reference line**: dashed gray line computed over the full peer scope, kept visible even when a line is isolated.
   - **Legend isolate & hover emphasis**: click a legend item to isolate that line (click again to reset); hovering a line or legend item dims all others, except the selected product which keeps its crimson highlight.
   - **End-of-line label**: the selected product is labeled at its final data point; hovering another line labels that one too.
   - **Richer tooltips**: index mode shows `index · metric value (+YoY%)`; absolute mode shows the full number `(+YoY%)`; tooltip items sorted descending by value.

---

## 4. Verification & Validation Checklist
- [x] Standalone file works directly by double-clicking in any browser.
- [x] All 16,488 pack records aggregated to 13,368 peer rows without data loss.
- [x] No `Corporation` references present anywhere in code, UI, or filters.
- [x] Interlinked cascading filter functionality tested and verified.
- [x] MAT year switching verified; 2023 shows `N/A` for growth.
- [x] Market share sums accurately to 100.0%.
- [x] Chart data labels rendered outside bar ends on Tabs 1 and 2.
- [x] Line chart tracks 4-year trends with metric toggling on Tab 3.
- [x] HPG logo embedded as base64 in sidebar header.

---

## 5. Table Feature Harmonization & Analytics Roadmap

### A. Cross-Tab Table Features Verification & Upgrades
1. **Interactive Column Sorting**:
   - All columns across Tab 1, Tab 2, and Tab 3 now support dynamic asc/desc sorting with visual arrows (`▲` / `▼`).
   - Added sorting support for `Strength` and `NFC1` across all 3 tables (defaulting to alphabetical ascending).
   - Ensured table headers with active sort indicators always render even when filter combinations return 0 peer rows.
2. **Top-N Display Limiters**:
   - `All rows`, `Top 10`, `Top 20`, and `Top 50` available across Tab 1, Tab 2, and Tab 3.
   - Total Market / Total Category footer calculations always evaluate over the complete active scope regardless of Top-N display selection.
3. **Data Bars & Compact Formatting**:
   - Tab 1 & Tab 2 display in-cell magnitude gradient data bars for `LC Value` and `Units`.
   - Hovering over compact numbers (`M`, `B`, `K`) displays full raw unrounded numbers via `title` attributes.
   - Hovering over Share percentages displays exact 2-decimal percentages (`title="${vShare.toFixed(2)}%"`).
4. **Interactive Table Row Selection**:
   - Clicking any row in Tab 1 immediately focuses and highlights that product across the table and bar chart.
   - Clicking any row in Tab 2 toggles `highlight-selected` for easy comparative inspection.
   - Clicking any row in Tab 3 focuses that product, highlighting it in crimson on the multi-year line chart.
   - Added pointer cursors to table rows (`cursor: pointer`).
5. **Sticky Product Column & Sticky Totals**:
   - Verified pinned first column with horizontal scrolling shadow and sticky header/footer across all tabs.
6. **Full-Precision CSV Export**:
   - Universal UTF-8 BOM CSV exports for Tab 1, Tab 2, and Tab 3 containing full raw figures and market totals.

---

## 6. Streamlined Analytics Architecture (Consolidation)
### Key Changes Implemented:
1. **Sidebar Removal & Top Header Rebranding**:
   - Removed the fixed left `<aside class="sidebar">` and sidebar tab navigation.
   - Retained the **HPG Logo** (Base64 encoded) and dashboard branding by moving them into the sticky top navigation header (`.top-header`).
   - Replaced sidebar layout constraints with a fluid, full-width top-to-bottom layout (`max-width: 1800px; margin: 0 auto;`).
2. **Tab Consolidation**:
   - Removed the legacy *Products Performance* (Tab 1) and *ATC4 Performance* (Tab 2) sections and their redundant event handlers.
   - Promoted the **Analytics** view as the primary, persistent dashboard surface with zero tab friction.
3. **Dedicated ATC4 Filter on Analytics**:
   - Added an **ATC4 Category Filter** autocomplete input (`#t3-atc4-search`) directly into the main Analytics filter bar alongside the **Product Search** filter.
   - Implemented bidirectional synchronization:
     - Selecting an ATC4 category filters the category scope, refreshes the cascading NFC1, Strength, and Pack dropdowns, and filters the product autocomplete list.
     - Selecting a product automatically resolves the best ATC4 category and updates the ATC4 search box.
   - Preserved all 5 visual diagnostic lenses (📈 Trajectory Trend, 🎯 Price vs Volume Matrix, 📊 100% Share Evolution, 🪜 Growth Waterfall, and 🍩 Form & Strength Mix), the 4-year side-by-side data table with collapsible pack trees, sortable headers, and CSV export.

---

## 7. Leading Product Filter & Competitive ATC4 Table Scope
### Requirements & Implementation:
1. **Product Filter as the Leading Filter**:
   - Re-ordered the primary filter bar so that **Select Product** is placed first on the left with a prominent indicator (`★ Leading Filter`), followed by **ATC4 Scope** (`(Competitive Category)`).
   - In the product autocomplete dropdown, suggestions search across all unique products in the market, displaying each product name alongside its primary ATC4 category in parentheses (e.g. `ZURCAL (A02B2 PROTON PUMP INHIBITORS)`).
2. **Competitive Scope: Full ATC4 Table Display**:
   - When a product is chosen (e.g. `ZURCAL`), the dashboard automatically resolves the product's ATC4 category (`A02B2 PROTON PUMP INHIBITORS`), sets the ATC4 search input, and establishes that ATC4 as the scope.
   - The table view logic was modified so it **does not filter out other products** by product name. Instead, it renders **all competitive products** within the chosen product's ATC4 category (e.g. all 143 products in `A02B2` including CONTROLOC, NEXIUM, PANTOVER, PEPTIFIX, etc.).
3. **Focus Product Visual Distinction & Expansion**:
   - The chosen product is styled with `.highlight-selected` (warm red tint `#fff5f5`, crimson left border `border-left: 4px solid var(--accent-red)`), an eye-catching `<span class="focus-pill">Selected</span>` badge, and gradient in-cell data bars in crimson.
   - The chosen product is auto-expanded in the table tree so its packs and SKUs are immediately visible.
   - Clicking any other product row in the table smoothly switches focus to that competitor while staying inside the same ATC4 table.
4. **Synchronized Diagnostics**:
   - Across all 5 diagnostic lenses (Trajectory line chart, Price-Volume Quadrant, 100% Share Evolution, Waterfall, and Portfolio Mix), the chosen product is guaranteed to appear among the top peers plotted and is prominently highlighted in Crimson (`#c53030`) against the competitive peers.
5. **Scope Badges & Reset to All**:
   - Top header badge displays `ATC4 Scope: <ATC4 Name> · Focus: <Product Name>`.
   - Peer count bar indicates `Showing X competitive products (Y packs) in ATC4: <ATC4 Name> · ★ Focus Product: <Product Name>`.
   - "Reset to All" button completely clears the product and ATC4 to view the entire market.

---

## 8. Whole Market Default Scope & Filter Dropdown Fix
### Problem Diagnosis:
1. **Fatal JavaScript Syntax Error**:
   - `renderTrajectoryChart` contained a duplicate identifier declaration `const selProdLower = (state.t3.product || '').toLowerCase();`.
   - This syntax error halted browser JavaScript parsing on load, preventing any scripts, event listeners, or rendering functions from executing.
   - As a result, the header badge displayed the unrendered fallback `Scope: Active Selection`, the table rendered zero rows, and all search inputs and dropdowns were unresponsive.

### Solution & Enhancements:
1. **Resolved Syntax Error**:
   - Removed the duplicate identifier declaration in `renderTrajectoryChart` and properly closed the datasets array, restoring 100% clean, error-free script execution.
2. **Whole Market Default Scope on Load**:
   - Changed initial state on load to Whole Market (`initialProduct = ''`, `initialATC4 = ''`).
   - Header scope badge defaults to `Scope: Whole Market`.
   - Summary peer bar indicates `Showing competitive products (packs) in Whole Market`.
   - Initial search inputs start clean with helpful placeholders.
3. **Fixed and Enhanced Dropdown Lists for Filters**:
   - **Product & ATC4 Search Inputs**: Added dedicated dropdown toggle arrow buttons (`▼`) and clear buttons (`✕`) to `.filter-input-wrap`. Users can click the arrow to open the dropdown list or click the clear button to reset the selection.
   - **Cascading Dropdowns (NFC1, Strength, Pack)**:
     - Pre-populated with total counts in labels (e.g. `All NFC1 Forms (17)`, `All Strengths (471)`, `All Packs (252)`).
     - Cascading hierarchy: selecting NFC1 immediately filters Strengths and Packs, and resets Strength and Pack values to `'ALL'`. Selecting Strength immediately filters Packs and resets Pack value to `'ALL'`.
     - Pack dropdown performance optimization: capped to top 250 packs when unconstrained to prevent browser UI freezing, with intelligent prompt to narrow via Product, ATC4, or Strength.
   - **Reset to All**: Completely resets all filters back to Whole Market cleanly.

