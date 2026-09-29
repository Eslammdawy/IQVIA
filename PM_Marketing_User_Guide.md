# IQVIA MAT Interactive Performance Dashboard: Product Manager & Marketing User Guide

Welcome to the **IQVIA MAT Interactive Performance Dashboard**. This guide is tailored specifically for **Product Managers (PMs)** and **Marketing Teams** in pharmaceuticals and life sciences. It translates complex analytics into practical, day-to-day strategic insights.

---

## 1. Quick Start & Executive Overview

### What is this App?
This dashboard is a self-contained, interactive market performance and competitive intelligence platform built on **IQVIA audit data**. It tracks brand and category dynamics across 4 rolling annual snapshots:
- **MAT Jul 2023** (Baseline)
- **MAT Jul 2024**
- **MAT Jul 2025**
- **MAT Jul 2026** (Latest Period)

### Key Concept: What is MAT?
> [!NOTE]
> **MAT (Moving Annual Total)** represents sales/volume accumulated over 12 consecutive months ending in July of that year.
> 
> Unlike calendar-year or monthly snapshots, MAT smooths out seasonal spikes, tender timing, and monthly procurement noise, providing an accurate reading of baseline momentum and underlying market trend.

---

## 2. Navigating the Dashboard & Filter Architecture

The dashboard is structured around a top-level **Control & Filter Bar** that governs both the **4-Year Tree Table** and the **Strategic Diagnostic Visuals Hub**.

```
[ ★ Select Product ] ➔ Auto-Resolves [ ATC4 Scope ] ➔ Filters [ NFC1 Form ] ➔ Filters [ Strength ] ➔ Filters [ Pack ]
                                                              │
                                                              └──> [ Reset to All ]
```

### The Hierarchical / Cascading Filter Logic

1. **Select Product (★ Leading Filter)**:
   - Type-ahead autocomplete across all marketed brand names.
   - Shows the brand along with its competitive category, e.g., `ZURCAL (A02B2 PROTON PUMP INHIBITORS)`.
   - **Competitive Benchmark Mode**: When you select a product, the dashboard does **not** hide competitors; it automatically locks the **ATC4 Category Scope** to that product's peer universe.
   - Your selected product is prominently highlighted in **Crimson Red**, tagged with a `<Selected>` badge, auto-expanded down to pack level, and plotted with priority across all diagnostic charts.

2. **ATC4 Scope (Competitive Class)**:
   - Represents the anatomical and therapeutic classification (e.g., *A02B2 Proton Pump Inhibitors*, *C09A0 ACE Inhibitors Plain*).
   - You can also search/select an ATC4 directly if you are analyzing a category from a portfolio standpoint rather than a single brand.

3. **Multi-ATC4 Switcher Bar**:
   - If a brand operates across multiple therapeutic categories (e.g., broad-indication antibiotics or molecules with dual indications), an amber notification bar appears, letting you switch between ATC4 contexts with one click. By default, the system selects the ATC4 with the highest LC Value in 2026.

4. **Cascading Dropdowns (NFC1 Form, Strength, Pack)**:
   - **NFC1 (New Form Classification 1)**: Form/administration route (e.g., *Oral Solid*, *Injectable*, *Topical*). Selecting an NFC1 dynamically limits available Strengths.
   - **Strength**: Active ingredient dosage (e.g., *20mg*, *40mg*). Selecting a Strength limits the available Packs.
   - **Pack**: Pack size / SKU level (e.g., *28 Tab*, *14 Tab*).

5. **Reset to All**:
   - Clears all filters back to the **Whole Market** baseline.

---

## 3. The 4-Year Historical Evolution Table: Metrics & Equations

The data table organizes products into collapsible trees (Brand ➔ Packs) and offers deep marketing diagnostics.

### Metric Toggle: LC Value vs. Units
In the top right of the table header, toggle between:
- **LC Value**: Local Currency value (sales turnover / ex-factory revenue).
- **Units**: Standard physical volume (packs sold).

### Core Mathematical Equations

#### 1. Year-Over-Year Growth (Gr% PY)
Measures the annual growth rate compared to the immediate prior rolling year:

$$\text{Growth \%}(Y) = \frac{\text{Value}(Y) - \text{Value}(Y-1)}{\text{Value}(Y-1)} \times 100$$

- **MAT 2023**: Displays `N/A` (no MAT 2022 baseline).
- **Green pill (`+X.X%`)**: Volume or revenue expansion.
- **Red pill (`-X.X%`)**: Volume or revenue contraction.

---

#### 2. 3-Year Compound Annual Growth Rate (CAGR 23–26)
Measures the annualized, smoothed compound growth velocity across the full 3-year observation window (2023 to 2026):

$$\text{CAGR} = \left( \frac{\text{Value}_{2026}}{\text{Value}_{2023}} \right)^{\frac{1}{3}} - 1$$

> [!TIP]
> **PM Insight**: If a brand had +25% growth in 2024 but -10% in 2025 and +2% in 2026, single-year figures can be misleading. **CAGR** reveals the true underlying multi-year organic growth rate.
> *Note: If 2023 sales were 0 (new launch), CAGR displays `N/A` because you cannot compound from zero.*

---

#### 3. Market Share % (2026 Share %)
The brand's proportion of the total active competitive peer universe:

$$\text{Market Share}_{2026} = \frac{\text{Product Value}_{2026}}{\sum \text{All Products in Current Scope Value}_{2026}} \times 100$$

> [!IMPORTANT]
> The table footer (`Total Market`) always calculates the true 100.0% sum of the active scope, even if you limit the display via the **Top 10 / 20 / 50** selector.

---

#### 4. Market Share Trajectory Delta ($\Delta$ Share in Basis Points)
Quantifies whether your brand gained or lost competitive market ground over the 3-year cycle, expressed in **Basis Points (bps)**:

$$\Delta \text{Share (bps)} = \left( \text{Market Share}_{2026} - \text{Market Share}_{2023} \right) \times 10,000$$

*(where $1.0\% \text{ share change} = 100 \text{ bps}$)*

- **$+350\text{ bps}$**: Gained $3.50\%$ market share of the category.
- **$-120\text{ bps}$**: Lost $1.20\%$ market share (share erosion to generic or competitor uptake).

---

#### 5. Evolution Index (EI)
The industry-standard pharmaceutical metric comparing brand growth velocity directly against total market/category growth:

$$\text{Evolution Index (EI)} = \frac{100 + \text{Product Growth \%}_{(2025 \to 2026)}}{100 + \text{Category Market Growth \%}_{(2025 \to 2026)}} \times 100$$

| Evolution Index | Meaning | Strategic Interpretation |
| :--- | :--- | :--- |
| **$\text{EI} > 100$** | **Outperforming Market** | The brand is growing faster than the category, expanding market share. |
| **$\text{EI} = 100$** | **Market Parity** | The brand is growing at the exact same pace as the category. |
| **$\text{EI} < 100$** | **Lagging / Underperforming** | The brand is growing slower than the market (or declining faster), shedding share. |

> [!NOTE]
> **Example**: If the category grew $+10\%$ ($\text{Denominator} = 110$) and your brand grew $+21\%$ ($\text{Numerator} = 121$):
> $$\text{EI} = \frac{121}{110} \times 100 = 110.0$$
> Your brand outpaced the market benchmark by **10 index points**.

---

## 4. Interactive Table Features

1. **Collapsible Pack-Level Hierarchy (Tree View)**:
   - Click the `▶` / `▼` toggle next to any product or the **"Expand All / Collapse All"** button in the toolbar to inspect individual SKU / pack performance.
   - Shows pack-specific forms, strengths, and unit/value contributions.
2. **Interactive Column Sorting**:
   - Click any column header (`Product`, `Pack`, `Strength`, `NFC1`, Year values, `Gr%`, `CAGR`, `Share%`, `Δ Share`, `EI`) to sort ascending or descending (`▲` / `▼`).
3. **In-Cell Magnitude Data Bars**:
   - Visual gradient bars behind numbers allow instant visual benchmarking of relative size without reading raw digits.
4. **Top-N Row Limiter**:
   - Switch between **All rows**, **Top 10**, **Top 20**, or **Top 50** to declutter long categories.
5. **Full-Precision CSV Export**:
   - Click **Export CSV** to download a clean, UTF-8 BOM spreadsheet ready for Microsoft Excel or board presentations.

---

## 5. Guide to the 5 Strategic Diagnostic Visuals

Directly below the table is the **Analytics Visuals & Strategic Diagnostics Hub**. Use the **Single Lens** tabs or switch to **Grid View (All 5)** for an executive dashboard summary.

---

### Lens 1: 📈 Trajectory Trend (Multi-Year Line Chart)

#### What it shows:
Tracks the 4-year historical curve (2023 ➔ 2026) for the top 10 peer brands, with your selected brand highlighted in **Crimson Red**.

#### View Toggle Options:
- **Absolute**: Plots actual Local Currency or Unit volumes.
- **Index (2023 = 100)**: Normalizes every brand to a base of 100 in 2023:
  $$\text{Index}_Y = \left( \frac{\text{Value}_Y}{\text{Value}_{2023}} \right) \times 100$$
  - *Why use Index mode?* Allows fair visual comparison between a \$500M market leader and a \$20M challenger to see who has the steeper growth curve.

#### Interactive Controls:
- **Legend Isolate**: Click any brand in the legend to isolate its line; click again to restore all lines.
- **Hover Emphasis**: Hover over any line or legend item to dim all others while keeping your chosen product anchored.

---

### Lens 2: 🎯 Price vs. Volume Strategic Quadrant Matrix

This is one of the most powerful strategic tools for brand managers. It plots every brand in the category on a 2D matrix:

- **Horizontal Axis (X)**: **Volume Momentum** (Units 3-Year CAGR %).
- **Vertical Axis (Y)**: **Pricing Power / Price Erosion** (Price per Unit 3-Year % Change):
  $$\text{Average Price per Unit} = \frac{\text{LC Value}}{\text{Units}}$$
  $$\text{Price Change \%} = \frac{\text{Price}_{2026} - \text{Price}_{2023}}{\text{Price}_{2023}} \times 100$$
- **Bubble Size**: Total 2026 LC Value revenue.

```
       Price/Unit Growth (%)
                 ▲
   🛡️ Price-Protected  │  ⭐ Category Stars
      (Niche Brands)    │   (Healthy Expansion)
 ───────────────────────┼───────────────────────► Units CAGR (%)
   ⚠️ Declining /      │  🚀 Volume Gainers
      At-Risk Brands    │   (Tender / Price Cut)
                 ▼
```

#### The Four Strategic Quadrants:

1. **⭐ Top-Right (Category Stars)**:
   - *High Volume Growth + Positive Pricing Power*.
   - Premium brands with strong physician loyalty, innovative formulations, or protected market positions that grow volume without discounting.
2. **🚀 Bottom-Right (Volume Gainers)**:
   - *High Volume Growth + Negative Price Trend*.
   - Aggressive market penetration, tender wins, or generic competitors trading price concessions for prescription volume.
3. **🛡️ Top-Left (Price-Protected Niche)**:
   - *Negative/Flat Volume + Positive Price Realization*.
   - Mature originator brands or specialized formulations compensating for modest volume attrition through periodic list price adjustments.
4. **⚠️ Bottom-Left (Declining / At-Risk)**:
   - *Volume Contraction + Price Erosion*.
   - Brands facing aggressive substitution, patent expiry cliff, or loss of formulary listing. Urgent brand revitalization or phase-out review needed.

---

### Lens 3: 📊 100% Stacked Market Share Evolution

#### What it shows:
A stacked 100% bar chart tracking the annual market share distribution across the Top 8 peer brands plus an aggregated *"All Other Peers"* bucket from 2023 to 2026.

#### PM Takeaways:
- Instantly observe category consolidation vs. fragmentation.
- Identify which competitor's slice is widening at the expense of others.

---

### Lens 4: 🪜 Category Value Growth Attribution Waterfall

#### What it shows:
Explains step-by-step how the market arrived from **Total 2023 Market Value** to **Total 2026 Market Value**:
- **Navy Bar (Left)**: Base Market 2023.
- **Green Bars (`+`)**: Top 5 brand positive contributors to market expansion.
- **Red Bars (`-`)**: Top 3 brand negative contributors (revenue lost from the market).
- **Lighter Pill**: Net change from remaining peer products.
- **Navy Bar (Right)**: Ending Market 2026.

#### PM Takeaways:
- Answers the board question: *"What drove the \$50M growth in our category over the last 3 years?"*
- Proves whether your brand was the #1, #2, or #3 primary engine of category expansion.

---

### Lens 5: 🍩 Form & Strength Mix Breakdown

A dual doughnut chart displaying the structural composition of the market in MAT 2026:
1. **NFC1 Dosage Form Share**: (e.g., Tablets vs. Capsules vs. Injections vs. Syrups).
   - Helps identify galenic formulation whitespace and patient preference shifts.
2. **Strength Tier Distribution**: (e.g., 20mg vs. 40mg vs. 80mg).
   - Reveals whether the clinical standard of care is shifting toward higher or lower dosing regimens.

---

## 6. PM Strategic Playbook: 4 Typical Analysis Scenarios

### Scenario A: Preparing Brand Review & Performance Presentation
1. In **Select Product**, search for your brand (e.g., `ZURCAL`).
2. Verify your **2026 Share %**, **CAGR 23–26**, and **Evolution Index (EI)** in the table.
   - If $\text{EI} > 100$, state: *"Brand outpaced category momentum by X index points."*
   - Check **$\Delta$ Share (bps)**: *"Captured X bps of competitive category share."*
3. Open **Lens 4 (Waterfall)** to see your brand's rank among category growth drivers.
4. Export the data to CSV via **Export CSV** for your appendix slides.

### Scenario B: Investigating Competitive Threat from a Fast-Growing Competitor
1. Select your product to anchor the category.
2. In the table, click the **LC Value Gr% 2026** column header to sort descending.
3. Identify the highest-growth competitors.
4. Click **Lens 2 (Price vs. Volume Matrix)**:
   - Is the rival in the **Volume Gainer** quadrant? (They are discounting or winning tenders).
   - Or are they in the **Category Star** quadrant? (They have genuine promotional momentum).

### Scenario C: Evaluating Lifecycle Management & Line Extension (New Strength/Form)
1. Select your target ATC4 category.
2. Open **Lens 5 (Form & Strength Mix)**.
3. Analyze whether the high-dose segment (e.g., 40mg/80mg) is gaining share over standard doses, or whether oral liquid/ODT forms are under-represented.
4. Use the cascading **NFC1** and **Strength** dropdowns in the table to isolate that exact segment and assess existing competitor dominance.

### Scenario D: Understanding Product SKU / Pack Optimization
1. In the table, locate your brand row and click the `▶` button to expand all packs.
2. Compare the 4-year volume and value trajectory between pack sizes (e.g., 14-tab vs. 28-tab).
3. Identify low-volume or declining packs that can be rationalized to optimize manufacturing minimum order quantities (MOQ).

---

## 7. Frequently Asked Questions (FAQ)

**Q1: Why does Growth % show `N/A` for MAT 2023?**  
> The dataset begins in MAT Jul 2023. Calculating YoY growth requires an MAT Jul 2022 baseline, which does not exist in the source file.

**Q2: Why is CAGR showing `N/A` for some products?**  
> If a product was launched in 2024, 2025, or 2026, its 2023 value is 0. Mathematical compounding requires a non-zero positive base.

**Q3: Does the dashboard require an internet connection or web server?**  
> No. The application is completely standalone. It can be opened directly by double-clicking the `.html` file in Microsoft Edge, Google Chrome, or Safari. All datasets are embedded directly within the file.

**Q4: Why does the line chart only show 10 lines when the category has 50 products?**  
> To maintain visual clarity and prevent chart lag, the chart plots the Top 10 products by 2026 volume. However, your **Selected Product is always guaranteed to be plotted** in Crimson, and the **Data Table above continues to display all products in the category**.

---
*Created for Product Management & Marketing Excellence · IQVIA Market Intelligence System*
