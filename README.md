# IQVIA MAT Performance Dashboard

[![Dashboard Status](https://img.shields.io/badge/Dashboard-Standalone_HTML-1a365d.svg)](IQVIA_MAT_Jul_Dashboard.html)
[![Data Source](https://img.shields.io/badge/Data_Source-IQVIA_Audit_MAT_Jul_2023--2026-c53030.svg)](#dataset--data-pipeline)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](#prerequisites--regeneration)

An interactive, self-contained market intelligence and brand performance dashboard tailored for pharmaceutical Product Managers, Commercial Directors, and Marketing Teams. It processes IQVIA sales audit data across four rolling annual periods (**MAT Jul 2023 – MAT Jul 2026**) for volume (**Units**) and revenue turnover (**LC Value**).

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Project Architecture & File Structure](#project-architecture--file-structure)
- [Dataset & Data Pipeline](#dataset--data-pipeline)
- [Quick Start Guide](#quick-start-guide)
  - [Opening the Standalone Dashboard](#1-opening-the-standalone-dashboard)
  - [Regenerating the Dashboard from Raw Data](#2-regenerating-the-dashboard-from-raw-data)
- [Business Logic & Mathematical Formulations](#business-logic--mathematical-formulations)
- [Dashboard Views & Navigation](#dashboard-views--navigation)
- [Design System & Theme](#design-system--theme)
- [Related Documentation](#related-documentation)

---

## Overview

The **IQVIA MAT Performance Dashboard** translates complex pharmaceutical audit data into actionable strategic insights without requiring a database server, backend API, or local web server. The production deliverable is a single, portable HTML file (`IQVIA_MAT_Jul_Dashboard.html`) containing the entire optimized dataset, application logic, and visual assets embedded directly into the document.

### Core Metrics Tracked
- **Volume**: Standard units sold across pack sizes (`Units MAT Jul 2023` to `2026`).
- **Revenue**: Local Currency turnover (`LC Value MAT Jul 2023` to `2026`).
- **Time Window**: Four consecutive 12-month rolling periods ending July of each respective year (MAT = Moving Annual Total).

---

## Key Features

- **Zero-Dependency Portable HTML**: Fully offline-capable, runs by double-clicking in modern desktop browsers (Chrome, Edge, Firefox, Safari).
- **Hierarchical Cascading Filters**:
  - **Product** (Type-ahead autocomplete with competitive benchmark mode)
  - **ATC4 Category** (Anatomical Therapeutic Chemical Level 4 classification)
  - **Multi-ATC4 Switcher Bar** (Instantly toggle therapeutic contexts for broad-indication brands)
  - **NFC1 Form** (Administration route, e.g., Oral Solid, Injectable)
  - **Strength** (Active dosage, e.g., 20mg, 40mg)
  - **Pack** (SKU pack sizes)
- **Dynamic Real-Time Calculations**:
  - On-the-fly calculation of Year-Over-Year Growth (YoY %) and 3-Year Compound Annual Growth Rate (CAGR 23–26).
  - Scope-aware Dynamic Market Share % recalculation that always sums to 100.0%.
- **Interactive Visual Diagnostics**:
  - Synchronized bar charts for peer comparison and brand volume rankings.
  - Multi-line historical trajectory charts with Top-10 capping to eliminate visual clutter.
  - Line-isolate mode, hover emphasis, and `Index (2023 = 100)` rebasing.
- **Reporting & Export**:
  - In-cell data bars and compact notation (`667.4M`, `2.79B`) with full precision tooltips.
  - One-click CSV export (`Analytics_<Metric>_<ATC4>.csv`) with UTF-8 BOM encoding for Excel compatibility.

---

## Project Architecture & File Structure

```
d:\HPG\Project AI\Marketing\IMS\IQVIA MAT Jul26/
├── IQVIA_MAT_Jul_Dashboard.html    # Standalone interactive production dashboard (~2.4 MB)
├── IQVIA.xlsx                      # Original raw IQVIA audit dataset (16,489 rows)
├── process_data.py                 # ETL script: cleans, validates, and compresses raw data
├── processed_data.json             # Minified, vector-packed dataset consumed by the generator
├── generate_dashboard.py           # Dashboard compiler injecting dataset & styles into HTML
├── HPG logo.jpg                    # High-resolution corporate logo
├── logo_base64.txt                 # Pre-encoded base64 representation of HPG logo
├── PM_Marketing_User_Guide.md      # Comprehensive strategic marketing & PM user manual
├── worklog.md                      # Detailed technical changelog, equations, and audit trail
└── README.md                       # Repository overview and operational documentation
```

---

## Dataset & Data Pipeline

```
┌─────────────────┐       process_data.py       ┌─────────────────────┐
│   IQVIA.xlsx    │  ────────────────────────>  │ processed_data.json │
│ (16,489 rows)   │   Cleaning, Grouping, Sum   │ (13,368 peer rows)  │
└─────────────────┘                             └─────────────────────┘
                                                           │
                                                           ▼ generate_dashboard.py
                                                ┌─────────────────────────────┐
                                                │ IQVIA_MAT_Jul_Dashboard.html│
                                                │ (Self-contained dashboard)  │
                                                └─────────────────────────────┘
```

1. **Raw Cleaning (`process_data.py`)**:
   - Strips summary and total rows (`ATC4 = 'Grand Total'`) to prevent skewing peer totals.
   - Cleans blank product strings and normalizes column headers.
   - Converts numeric fields with fallback handling for unrecorded entries.
2. **Aggregation**:
   - Groups by `(ATC4, Product, Pack, NFC1, Strength)` across all 4 years of Units and LC Value.
   - Compresses data into a high-density JSON schema:
     `[ATC4, Product, Pack, NFC1, Strength, U23, U24, U25, U26, V23, V24, V25, V26]`
3. **HTML Compilation (`generate_dashboard.py`)**:
   - Injects JSON directly into a `<script type="application/json" id="iqvia-data">` element.
   - Inlines CSS stylesheets, base64 logo assets, and modern client-side rendering engines.

---

## Quick Start Guide

### 1. Opening the Standalone Dashboard
To explore and present the dashboard, no software installation is required:
1. Navigate to the project directory.
2. Double-click **`IQVIA_MAT_Jul_Dashboard.html`** or drag it into any modern web browser.

### 2. Regenerating the Dashboard from Raw Data
If an updated `IQVIA.xlsx` audit file is received:

1. **Install Prerequisites**:
   ```powershell
   pip install pandas openpyxl
   ```

2. **Run Data ETL Pipeline**:
   ```powershell
   python process_data.py
   ```
   *Generates an updated `processed_data.json`.*

3. **Rebuild Standalone HTML Dashboard**:
   ```powershell
   python generate_dashboard.py
   ```
   *Compiles the new dataset into `IQVIA_MAT_Jul_Dashboard.html`.*

---

## Business Logic & Mathematical Formulations

### 1. Year-Over-Year Growth (YoY %)
Calculated dynamically for any given year $Y$ against the previous rolling period $Y-1$:

$$\text{Growth \%}(Y) = \frac{\text{Value}(Y) - \text{Value}(Y-1)}{\text{Value}(Y-1)} \times 100$$

- **MAT 2023**: Rendered as `N/A` (no MAT 2022 baseline present).
- **Positive Expansion**: Represented with a green badge (`+X.X%`).
- **Negative Contraction**: Represented with a red badge (`-X.X%`).

### 2. 3-Year Compound Annual Growth Rate (CAGR 23–26)
Measures the annualized organic velocity between MAT Jul 2023 and MAT Jul 2026:

$$\text{CAGR} = \left( \frac{\text{Value}_{2026}}{\text{Value}_{2023}} \right)^{\frac{1}{3}} - 1$$

- If baseline sales $\text{Value}_{2023} = 0$, CAGR is assigned `N/A` (new product launches).

### 3. Dynamic Market Share %
Calculated dynamically over the active peer scope (filtered ATC4, NFC1, Strength, and Pack):

$$\text{Market Share}(Y) = \frac{\text{Row Value}(Y)}{\sum_{r \in \text{Current Scope}} \text{Row Value}_r(Y)} \times 100$$

---

## Dashboard Views & Navigation

| Tab / View | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Tab 1: Products Performance** | Brand-centric view (default view) | Search any brand; auto-locks to competitive ATC4 class; displays peer rankings, market shares, YoY growth, and synchronized volume bar charts. |
| **Tab 2: ATC4 Performance** | Therapeutic category-centric view | Assess category-level dynamics, strength/form breakdown, and compare full class market share distribution. |
| **Tab 3: Analytics (4-Year Evolution)** | Deep-dive multi-year evolution | Metric toggling (`LC Value` vs. `Units`), sortable table columns, compact data bars, Top-N limiter, CSV export, and multi-line trend analysis with absolute/index view modes. |

---

## Design System & Theme

The dashboard follows a corporate executive theme engineered for readability and presentation quality:

- **Primary Deep Navy** (`#0f1e36` / `#1a365d`): Used for navigational chrome, table headers, and structural elements.
- **Controlled Crimson Red** (`#c53030`): Used for selected product focus, active pill indicators, and critical performance highlights.
- **Warm Brown & Tan** (`#795548` / `#8d6e63`): Used for secondary active tabs, sub-filters, and multi-ATC4 alerts.
- **Performance Indicators**: Forest green (`#276749` / `#f0fff4`) for positive gains and deep red (`#9b2c2c` / `#fff5f5`) for losses.
- **Typography**: Clean, tabular-aligned typography utilizing the Google `Inter` font family.

---

## Related Documentation

- 📖 **[Product Manager & Marketing User Guide](PM_Marketing_User_Guide.md)**: Detailed strategic guidance, marketing workflows, competitive analysis frameworks, and interpretation tips.
- 🛠️ **[Technical Worklog](worklog.md)**: Comprehensive architectural notes, data cleaning decisions, UI lifecycle management, and verification checklists.
