const fs = require('fs');

console.log('Reading IQVIA_MAT_Jul_Dashboard.backup.html...');
let html = fs.readFileSync('IQVIA_MAT_Jul_Dashboard.backup.html', 'utf8').replace(/\r\n/g, '\n');
const logoB64 = fs.readFileSync('logo_base64.txt', 'utf8').trim();

// 1. Remove <aside class="sidebar"> ... </aside>
const asideStart = html.indexOf('<aside class="sidebar">');
const asideEnd = html.indexOf('</aside>', asideStart) + '</aside>'.length;
if (asideStart === -1 || asideEnd === -1) throw new Error('Sidebar not found');
html = html.slice(0, asideStart) + html.slice(asideEnd);

// 2. Remove Tab 1 and Tab 2 sections: from <section id="tab-products" to <section id="tab-analytics"
const t1Start = html.indexOf('<!-- ================= TAB 1: PRODUCTS PERFORMANCE ================= -->');
const t3Start = html.indexOf('<!-- ================= TAB 3: ANALYTICS ================= -->');
if (t1Start === -1 || t3Start === -1) throw new Error('Tabs 1/3 comments not found');
html = html.slice(0, t1Start) + html.slice(t3Start);

// 3. Update top-header HTML: include logo, titles and scope badge
const oldHeaderStart = html.indexOf('<header class="top-header">');
const oldHeaderEnd = html.indexOf('</header>', oldHeaderStart) + '</header>'.length;
if (oldHeaderStart === -1 || oldHeaderEnd === -1) throw new Error('Top header not found');

const newHeader = `<header class="top-header">
      <div class="header-branding">
        <img src="data:image/jpeg;base64,${logoB64}" alt="HPG Logo" class="header-logo">
        <div class="top-header-titles">
          <h1 id="header-main-title">IQVIA MAT Jul Performance Analytics</h1>
          <p id="header-sub-title">Multi-year side-by-side growth trajectory, competitive dynamics, and strategic diagnostics</p>
        </div>
      </div>
      <div class="header-badge" id="current-scope-badge">
        Scope: Active Selection
      </div>
    </header>`;

html = html.slice(0, oldHeaderStart) + newHeader + html.slice(oldHeaderEnd);

// 4. Update tab-analytics: make it always displayed (remove class="tab-content" hiding)
html = html.replace('<section id="tab-analytics" class="tab-content">', '<section id="tab-analytics" style="display: flex; flex-direction: column; gap: 20px;">');

// 5. Add ATC4 filter inside #tab-analytics .filter-row
const oldProductSearchBlock = `            <!-- Product Autocomplete -->
            <div class="filter-group" style="flex: 2;">
              <label>Select Product</label>
              <div class="filter-input-wrap">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></line>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="t3-product-search" class="search-input" placeholder="Search product name..." autocomplete="off">
                <div id="t3-product-autocomplete" class="autocomplete-list"></div>
              </div>
            </div>`;

const newFilterRowBlock = `            <!-- ATC4 Category Filter -->
            <div class="filter-group" style="flex: 2.2;">
              <label>Select ATC4 Category</label>
              <div class="filter-input-wrap">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></line>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="t3-atc4-search" class="search-input" placeholder="Search ATC4 category code or description..." autocomplete="off">
                <div id="t3-atc4-autocomplete" class="autocomplete-list"></div>
              </div>
            </div>

            <!-- Product Autocomplete Filter -->
            <div class="filter-group" style="flex: 1.8;">
              <label>Select Product</label>
              <div class="filter-input-wrap">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></line>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="t3-product-search" class="search-input" placeholder="Search product name..." autocomplete="off">
                <div id="t3-product-autocomplete" class="autocomplete-list"></div>
              </div>
            </div>`;

if (!html.includes(oldProductSearchBlock)) {
  throw new Error('Old product search block not found');
}
html = html.replace(oldProductSearchBlock, newFilterRowBlock);

// 6. Update CSS: body flex-direction column, .content-area max-width, .top-header styles, header-branding, header-logo
const oldBodyCss = `    body {
      font-family: var(--font-family);
      background-color: var(--bg-canvas);
      color: var(--text-main);
      display: flex;
      min-height: 100vh;
      overflow-x: hidden;
    }`;

const newBodyCss = `    body {
      font-family: var(--font-family);
      background-color: var(--bg-canvas);
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .header-branding {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-logo {
      height: 48px;
      max-width: 140px;
      object-fit: contain;
      border-radius: var(--radius-sm);
      background: #ffffff;
      padding: 2px 4px;
      border: 1px solid #edf2f7;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }`;

html = html.replace(oldBodyCss, newBodyCss);

// Update .content-area css for max-width
const oldContentAreaCss = `    .content-area {
      padding: 20px 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      flex: 1;
    }`;

const newContentAreaCss = `    .content-area {
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 22px;
      flex: 1;
      max-width: 1800px;
      margin: 0 auto;
      width: 100%;
    }`;

html = html.replace(oldContentAreaCss, newContentAreaCss);

// Update .top-header css
const oldTopHeaderCss = `    .top-header {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
    }`;

const newTopHeaderCss = `    .top-header {
      background: #ffffff;
      border-bottom: 1px solid var(--border-color);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 50;
      gap: 20px;
    }`;

html = html.replace(oldTopHeaderCss, newTopHeaderCss);

// 7. Update JavaScript section
// Let's inspect where JS starts and ends
const scriptStartTag = '  <script>\n';
const scriptStartIndex = html.lastIndexOf(scriptStartTag);
const scriptEndTag = '\n  </script>';
const scriptEndIndex = html.lastIndexOf(scriptEndTag);
if (scriptStartIndex === -1 || scriptEndIndex === -1) throw new Error('Script block not found');

console.log('HTML structure processed successfully. Script index range:', scriptStartIndex, scriptEndIndex);

// Let's create the final updated script block
const finalJs = `
    (function() {
      // Register datalabels plugin safely
      if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
        try {
          Chart.register(ChartDataLabels);
        } catch (e) {
          console.warn('ChartDataLabels registration:', e);
        }
      }

      // Parse embedded data
      // Schema: [ATC4, Product, Pack, NFC1, Strength, U23, U24, U25, U26, V23, V24, V25, V26]
      const rawRows = JSON.parse(document.getElementById('iqvia-data').textContent);
      
      // Map to lightweight objects
      const data = rawRows.map(r => ({
        atc4: r[0],
        product: r[1],
        pack: r[2],
        nfc1: r[3],
        strength: r[4],
        u23: r[5],
        u24: r[6],
        u25: r[7],
        u26: r[8],
        v23: r[9],
        v24: r[10],
        v25: r[11],
        v26: r[12]
      }));

      // Build Fast Lookup Indices
      const atcMap = new Map(); // atc4 -> array of rows
      const productMap = new Map(); // product -> set of atc4s
      const allUniqueProducts = [];
      const allUniqueATC4s = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (!atcMap.has(row.atc4)) {
          atcMap.set(row.atc4, []);
          allUniqueATC4s.push(row.atc4);
        }
        atcMap.get(row.atc4).push(row);

        if (!productMap.has(row.product)) {
          productMap.set(row.product, new Set());
          allUniqueProducts.push(row.product);
        }
        productMap.get(row.product).add(row.atc4);
      }

      allUniqueProducts.sort((a,b) => a.localeCompare(b));
      allUniqueATC4s.sort((a,b) => a.localeCompare(b));

      // State Management (Streamlined to Analytics)
      const state = {
        t3: {
          product: '',
          atc4: '',
          nfc1: 'ALL',
          strength: 'ALL',
          pack: 'ALL',
          metric: 'value', // 'value' | 'units'
          view: 'absolute', // 'absolute' | 'index' (2023 = 100)
          topN: 'ALL', // 'ALL' | '10' | '20' | '50'
          sortKey: { t: 'metric', c: 3 }, // default: selected metric, 2026
          sortDir: 'desc',
          chartLens: 'trend', // 'trend' | 'quadrant' | 'share' | 'waterfall' | 'mix'
          chartLayout: 'lens', // 'lens' | 'grid'
          expandedProds: new Set()
        }
      };

      // Charts instances
      let chart3 = null;
      let chart3Quadrant = null;
      let chart3Share = null;
      let chart3Waterfall = null;
      let chart3Nfc1 = null;
      let chart3Strength = null;

      // Tab 3 chart interaction state (hover emphasis / legend isolate)
      let t3HoverIdx = -1;
      let t3SoloIdx = -1;

      // Palette definitions
      const PALETTE = [
        '#1a365d', '#2b6cb0', '#795548', '#c53030', '#4a5568', 
        '#319795', '#d69e2e', '#805ad5', '#dd6b20', '#3182ce',
        '#8d6e63', '#e53e3e', '#2c5282', '#6b46c1', '#285e61'
      ];

      // Formatting Utilities
      function fmtNum(n) {
        if (n === null || n === undefined || isNaN(n)) return '0';
        return Math.round(n).toLocaleString('en-US');
      }

      function fmtPct(n) {
        if (n === null || n === undefined || isNaN(n)) return '0.0%';
        return (n).toFixed(1) + '%';
      }

      function fmtGrowthBadge(curr, prev, isYear2023) {
        if (isYear2023 || prev === null || prev === undefined || prev === 0) {
          return '<span class="growth-badge growth-na">N/A</span>';
        }
        const gr = ((curr - prev) / prev) * 100;
        const sign = gr > 0 ? '+' : '';
        const cls = gr >= 0 ? 'growth-pos' : 'growth-neg';
        return '<span class="growth-badge ' + cls + '">' + sign + gr.toFixed(1) + '%</span>';
      }

      // Compact cell formatting (full precision kept in title tooltip / CSV export)
      function fmtCompact(n) {
        if (n === null || n === undefined || isNaN(n)) return '0';
        const abs = Math.abs(n);
        if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (abs >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (abs >= 1e3) return (n / 1e3).toFixed(0) + 'K';
        return Math.round(n).toLocaleString('en-US');
      }

      // 3-year CAGR (2023 -> 2026) rendered as a pill; N/A when the base year is unusable
      function fmtCagrCell(curr, base) {
        if (base === null || base === undefined || base <= 0 || curr === null || curr === undefined || isNaN(curr)) {
          return '<span class="growth-badge growth-na">N/A</span>';
        }
        const c = (Math.pow(curr / base, 1 / 3) - 1) * 100;
        const sign = c > 0 ? '+' : '';
        const cls = c >= 0 ? 'growth-pos' : 'growth-neg';
        return '<span class="growth-badge ' + cls + '">' + sign + c.toFixed(1) + '%</span>';
      }

      // 4-Year Market Share Trajectory Delta in basis points (bps)
      function fmtDeltaBpsCell(deltaBps, s23, s26) {
        if (deltaBps === null || deltaBps === undefined || isNaN(deltaBps)) {
          return '<span class="growth-badge growth-na">N/A</span>';
        }
        const sign = deltaBps > 0 ? '+' : '';
        const cls = deltaBps > 0 ? 'growth-pos' : (deltaBps < 0 ? 'growth-neg' : 'growth-na');
        const tip = '2023 Share: ' + s23.toFixed(1) + '% → 2026 Share: ' + s26.toFixed(1) + '% (' + sign + (deltaBps / 100).toFixed(2) + ' pp)';
        return '<span class="growth-badge ' + cls + '" title="' + tip + '">' + sign + deltaBps.toLocaleString('en-US') + ' bps</span>';
      }

      // Evolution Index (EI) pill
      function fmtEICell(ei) {
        if (ei === null || ei === undefined || isNaN(ei)) {
          return '<span class="growth-badge growth-na" title="No 2025 baseline">N/A</span>';
        }
        const cls = ei >= 100 ? 'growth-pos' : 'growth-neg';
        const diff = (ei - 100).toFixed(1);
        const sign = ei >= 100 ? '+' : '';
        const tip = ei >= 100
          ? 'Outperforming Category Market by ' + sign + diff + ' index points'
          : 'Underperforming Category Market by ' + diff + ' index points';
        return '<span class="growth-badge ' + cls + '" title="' + tip + '">' + ei.toFixed(1) + '</span>';
      }

      // Calculation Helpers
      function getMetricsForYear(row, year) {
        if (year === '2023') return { u: row.u23, v: row.v23, uPrev: null, vPrev: null };
        if (year === '2024') return { u: row.u24, v: row.v24, uPrev: row.u23, vPrev: row.v23 };
        if (year === '2025') return { u: row.u25, v: row.v25, uPrev: row.u24, vPrev: row.v24 };
        return { u: row.u26, v: row.v26, uPrev: row.u25, vPrev: row.v25 };
      }

      // Multi-ATC4 Product Resolution Helper: get ATC4 with highest 2026 LC Value
      function getBestATC4ForProduct(prod) {
        const atcList = Array.from(productMap.get(prod) || []);
        if (atcList.length === 0) return '';
        if (atcList.length === 1) return atcList[0];
        
        let bestATC = atcList[0];
        let maxVal = -1;
        for (const atc of atcList) {
          const rows = atcMap.get(atc) || [];
          let sumVal = 0;
          for (const r of rows) {
            if (r.product === prod) sumVal += r.v26;
          }
          if (sumVal > maxVal) {
            maxVal = sumVal;
            bestATC = atc;
          }
        }
        return bestATC;
      }

      // Populate Cascading Dropdowns
      function updateCascadingFilters(atc4, nfc1SelectId, strengthSelectId, packSelectId, currentNFC1, currentStrength, currentPack) {
        const nfc1Select = document.getElementById(nfc1SelectId);
        const strengthSelect = document.getElementById(strengthSelectId);
        const packSelect = document.getElementById(packSelectId);
        const rows = atcMap.get(atc4) || [];

        // Distinct NFC1 in this ATC4
        const nfc1Set = new Set();
        rows.forEach(r => nfc1Set.add(r.nfc1));
        const sortedNFC1 = Array.from(nfc1Set).sort();

        nfc1Select.innerHTML = '<option value="ALL">All NFC1 Forms</option>' +
          sortedNFC1.map(n => '<option value="' + n + '">' + n + '</option>').join('');
        
        if (currentNFC1 && nfc1Set.has(currentNFC1)) {
          nfc1Select.value = currentNFC1;
        } else {
          nfc1Select.value = 'ALL';
        }

        // Distinct Strengths in ATC4 (narrowed by selected NFC1 if not ALL)
        const selectedNFC1 = nfc1Select.value;
        const strSet = new Set();
        rows.forEach(r => {
          if (selectedNFC1 === 'ALL' || r.nfc1 === selectedNFC1) {
            strSet.add(r.strength);
          }
        });
        const sortedStr = Array.from(strSet).sort();

        strengthSelect.innerHTML = '<option value="ALL">All Strengths</option>' +
          sortedStr.map(s => '<option value="' + s + '">' + s + '</option>').join('');

        if (currentStrength && strSet.has(currentStrength)) {
          strengthSelect.value = currentStrength;
        } else {
          strengthSelect.value = 'ALL';
        }

        // Distinct Packs in ATC4 (narrowed by selected NFC1 and Strength)
        const selectedStrength = strengthSelect.value;
        const packSet = new Set();
        rows.forEach(r => {
          if ((selectedNFC1 === 'ALL' || r.nfc1 === selectedNFC1) &&
              (selectedStrength === 'ALL' || r.strength === selectedStrength)) {
            packSet.add(r.pack);
          }
        });
        const sortedPacks = Array.from(packSet).sort();

        packSelect.innerHTML = '<option value="ALL">All Packs</option>' +
          sortedPacks.map(p => '<option value="' + p + '">' + p + '</option>').join('');

        if (currentPack && packSet.has(currentPack)) {
          packSelect.value = currentPack;
        } else {
          packSelect.value = 'ALL';
        }
      }

      // Render Tab 3 (Analytics - 4 Years Side-by-Side)
      function renderTab3() {
        const { product, atc4, nfc1, strength, pack, metric } = state.t3;

        // Scope badge in top header
        const badge = document.getElementById('current-scope-badge');
        if (badge) {
          const atcShort = atc4 ? (atc4.length > 28 ? atc4.slice(0, 26) + '…' : atc4) : 'All ATC4';
          const prodShort = product ? ' · ' + product : '';
          badge.textContent = 'Scope: ' + atcShort + prodShort;
        }

        // Check if product spans multiple ATC4s
        const multiBar = document.getElementById('t3-multi-atc4-bar');
        const switcher = document.getElementById('t3-atc4-switcher');
        const productATCs = product ? Array.from(productMap.get(product) || []) : [];
        if (productATCs.length > 1) {
          multiBar.style.display = 'flex';
          switcher.innerHTML = productATCs.map(a => '<option value="' + a + '" ' + (a === atc4 ? 'selected' : '') + '>' + a + '</option>').join('');
        } else {
          multiBar.style.display = 'none';
        }

        const allAtcRows = atcMap.get(atc4) || [];
        const filteredRows = allAtcRows.filter(r => {
          if (nfc1 !== 'ALL' && r.nfc1 !== nfc1) return false;
          if (strength !== 'ALL' && r.strength !== strength) return false;
          if (pack !== 'ALL' && r.pack !== pack) return false;
          return true;
        });

        // Table reflects the selected metric only (LC Value or Units)
        const isValueMetric = metric === 'value';
        const metricName = isValueMetric ? 'LC Value' : 'Units';
        const mKeys = isValueMetric ? ['v23', 'v24', 'v25', 'v26'] : ['u23', 'u24', 'u25', 'u26'];
        const valsOf = (r) => mKeys.map(k => r[k]);

        // Sum Totals across each year (selected metric only, over the FULL scope)
        const tot = [0, 0, 0, 0];
        filteredRows.forEach(r => {
          const vals = valsOf(r);
          for (let i = 0; i < 4; i++) tot[i] += vals[i];
        });

        // Category Market Growth for Evolution Index calculation (2025 -> 2026)
        const mktGrowth26 = tot[2] > 0 ? ((tot[3] - tot[2]) / tot[2]) * 100 : 0;

        // Group rows by Product for tree table
        const sortKey = state.t3.sortKey;
        const sortVal = (vals) => {
          if (sortKey.t === 'metric') return vals[sortKey.c];
          if (sortKey.t === 'growth') return vals[sortKey.c] > 0 ? (vals[sortKey.c + 1] - vals[sortKey.c]) / vals[sortKey.c] : -Infinity;
          if (sortKey.t === 'cagr') return (vals[0] > 0 && vals[3] >= 0) ? Math.pow(vals[3] / vals[0], 1 / 3) - 1 : -Infinity;
          if (sortKey.t === 'share26') return tot[3] > 0 ? vals[3] / tot[3] : -Infinity;
          if (sortKey.t === 'deltabps') {
            const s23 = tot[0] > 0 ? (vals[0] / tot[0]) : 0;
            const s26 = tot[3] > 0 ? (vals[3] / tot[3]) : 0;
            return s26 - s23;
          }
          if (sortKey.t === 'ei') {
            const pGr = vals[2] > 0 ? ((vals[3] - vals[2]) / vals[2]) * 100 : null;
            return (pGr !== null && (100 + mktGrowth26) > 0) ? ((100 + pGr) / (100 + mktGrowth26)) * 100 : -Infinity;
          }
          return -Infinity;
        };

        // Group into product map
        const prodMap = new Map();
        filteredRows.forEach(r => {
          if (!prodMap.has(r.product)) {
            prodMap.set(r.product, []);
          }
          prodMap.get(r.product).push(r);
        });

        const groups = [];
        prodMap.forEach((packs, prodName) => {
          // Sort packs within product
          packs.sort((a, b) => {
            if (sortKey.t === 'product') return state.t3.sortDir === 'asc' ? a.product.localeCompare(b.product) : b.product.localeCompare(a.product);
            if (sortKey.t === 'pack') return state.t3.sortDir === 'asc' ? (a.pack || '').localeCompare(b.pack || '') : (b.pack || '').localeCompare(a.pack || '');
            if (sortKey.t === 'strength') return state.t3.sortDir === 'asc' ? (a.strength || '').localeCompare(b.strength || '') : (b.strength || '').localeCompare(a.strength || '');
            if (sortKey.t === 'nfc1') return state.t3.sortDir === 'asc' ? (a.nfc1 || '').localeCompare(b.nfc1 || '') : (b.nfc1 || '').localeCompare(a.nfc1 || '');
            const va = sortVal(valsOf(a)), vb = sortVal(valsOf(b));
            return state.t3.sortDir === 'asc' ? va - vb : vb - va;
          });

          const strSet = new Set(packs.map(p => p.strength).filter(Boolean));
          const nfcSet = new Set(packs.map(p => p.nfc1).filter(Boolean));
          const strDisplay = strSet.size === 1 ? Array.from(strSet)[0] : (strSet.size > 1 ? strSet.size + ' Strengths' : '-');
          const nfcDisplay = nfcSet.size === 1 ? Array.from(nfcSet)[0] : (nfcSet.size > 1 ? nfcSet.size + ' Forms' : '-');

          const sumVals = [0, 0, 0, 0];
          packs.forEach(p => {
            const v = valsOf(p);
            for (let i = 0; i < 4; i++) sumVals[i] += v[i];
          });

          groups.push({
            product: prodName,
            strength: strDisplay,
            nfc1: nfcDisplay,
            vals: sumVals,
            packs: packs
          });
        });

        // Sort product groups
        groups.sort((a, b) => {
          if (sortKey.t === 'product') return state.t3.sortDir === 'asc' ? a.product.localeCompare(b.product) : b.product.localeCompare(a.product);
          if (sortKey.t === 'pack') return state.t3.sortDir === 'asc' ? a.packs.length - b.packs.length : b.packs.length - a.packs.length;
          if (sortKey.t === 'strength') return state.t3.sortDir === 'asc' ? a.strength.localeCompare(b.strength) : b.strength.localeCompare(a.strength);
          if (sortKey.t === 'nfc1') return state.t3.sortDir === 'asc' ? a.nfc1.localeCompare(b.nfc1) : b.nfc1.localeCompare(a.nfc1);
          const va = sortVal(a.vals), vb = sortVal(b.vals);
          return state.t3.sortDir === 'asc' ? va - vb : vb - va;
        });

        // Per-column max for in-cell data bars (from product groups)
        const colMax = [0, 0, 0, 0];
        groups.forEach(g => {
          for (let i = 0; i < 4; i++) if (g.vals[i] > colMax[i]) colMax[i] = g.vals[i];
        });

        state.t3._lastRows = filteredRows;
        state.t3._lastGroups = groups;

        // Dynamic table header: only the selected metric's columns, sortable (rendered even if 0 rows)
        document.getElementById('t3-table-metric-label').textContent = metricName;
        const keyId = (k) => k.t + (k.c !== undefined ? k.c : '');
        const activeKey = keyId(sortKey);
        const arrow = (k) => keyId(k) === activeKey ? ' <span style="font-size:9px;">' + (state.t3.sortDir === 'asc' ? '▲' : '▼') + '</span>' : '';
        document.getElementById('t3-table-head-row').innerHTML = 
          '<th class="sortable" data-key="product">Product' + arrow({ t: 'product' }) + '</th>' +
          '<th class="sortable" data-key="pack">Pack' + arrow({ t: 'pack' }) + '</th>' +
          '<th class="sortable" data-key="strength">Strength' + arrow({ t: 'strength' }) + '</th>' +
          '<th class="sortable" data-key="nfc1">NFC1' + arrow({ t: 'nfc1' }) + '</th>' +
          '<th class="num-col sortable" data-key="metric0">' + metricName + ' 2023' + arrow({ t: 'metric', c: 0 }) + '</th>' +
          '<th class="num-col sortable" data-key="metric1">' + metricName + ' 2024' + arrow({ t: 'metric', c: 1 }) + '</th>' +
          '<th class="num-col sortable" data-key="metric2">' + metricName + ' 2025' + arrow({ t: 'metric', c: 2 }) + '</th>' +
          '<th class="num-col sortable" data-key="metric3">' + metricName + ' 2026' + arrow({ t: 'metric', c: 3 }) + '</th>' +
          '<th class="num-col sortable" data-key="growth0">' + metricName + ' Gr% 2024' + arrow({ t: 'growth', c: 0 }) + '</th>' +
          '<th class="num-col sortable" data-key="growth1">' + metricName + ' Gr% 2025' + arrow({ t: 'growth', c: 1 }) + '</th>' +
          '<th class="num-col sortable" data-key="growth2">' + metricName + ' Gr% 2026' + arrow({ t: 'growth', c: 2 }) + '</th>' +
          '<th class="num-col sortable" data-key="cagr">' + metricName + ' CAGR 23-26' + arrow({ t: 'cagr' }) + '</th>' +
          '<th class="num-col sortable" data-key="share26">2026 Share %' + arrow({ t: 'share26' }) + '</th>' +
          '<th class="num-col sortable" data-key="deltabps">Δ Share (bps)' + arrow({ t: 'deltabps' }) + '</th>' +
          '<th class="num-col sortable" data-key="ei">Evolution Index (EI)' + arrow({ t: 'ei' }) + '</th>';

        const tbody = document.getElementById('t3-table-body');
        if (groups.length === 0) {
          tbody.innerHTML = '<tr><td colspan="15" style="text-align:center; padding: 24px; color: var(--text-muted);">No records found.</td></tr>';
          document.getElementById('t3-table-foot').innerHTML = '';
          document.getElementById('t3-peer-count').innerHTML = 'Showing <strong>0</strong> peer rows';
          renderTab3Charts([]);
          return;
        }

        // Top-N display limit applies to product groups
        const topN = state.t3.topN;
        const displayGroups = topN === 'ALL' ? groups : groups.slice(0, parseInt(topN, 10));
        const totalPacks = filteredRows.length;
        document.getElementById('t3-peer-count').innerHTML = topN === 'ALL'
          ? 'Showing <strong>' + groups.length + '</strong> products (' + totalPacks + ' packs) across 4 MAT Years'
          : 'Showing <strong>' + displayGroups.length + '</strong> of ' + groups.length + ' products (' + totalPacks + ' packs)';

        // Update Expand All button label based on current state
        const allExpanded = displayGroups.length > 0 && displayGroups.every(g => state.t3.expandedProds.has(g.product));
        const expandBtn = document.getElementById('t3-expand-toggle-btn');
        if (expandBtn) expandBtn.textContent = allExpanded ? 'Collapse All' : 'Expand All';

        // In-cell data bars on year columns (hover shows the full number)
        const barCell = (v, i, selected) => {
          if (!v || colMax[i] <= 0) return ' title="' + fmtNum(v) + '"';
          const pct = Math.max(2, Math.round((v / colMax[i]) * 100));
          const base = selected ? '#ebf8ff' : '#ffffff';
          return ' style="background: linear-gradient(90deg, rgba(43,108,176,0.16) ' + pct + '%, ' + base + ' ' + pct + '%);" title="' + fmtNum(v) + '"';
        };

        let rowsHtml = '';
        displayGroups.forEach(g => {
          const isSelected = (product || '').length > 0 && g.product.toLowerCase() === product.toLowerCase();
          const isExpanded = state.t3.expandedProds.has(g.product);
          const vals = g.vals;
          const s23 = tot[0] > 0 ? (vals[0] / tot[0]) * 100 : 0;
          const s26 = tot[3] > 0 ? (vals[3] / tot[3]) * 100 : 0;
          const deltaBps = Math.round((s26 - s23) * 100);
          const pGr26 = vals[2] > 0 ? ((vals[3] - vals[2]) / vals[2]) * 100 : null;
          const ei = (pGr26 !== null && (100 + mktGrowth26) > 0)
            ? ((100 + pGr26) / (100 + mktGrowth26)) * 100
            : null;

          // Product Summary Row
          rowsHtml += '<tr class="prod-group-row ' + (isSelected ? 'highlight-selected' : '') + '" data-product="' + g.product + '" data-tab="3">' +
            '<td>' +
              '<div class="prod-tree-cell">' +
                '<span class="tree-toggle-btn" title="Toggle packs">' + (isExpanded ? '▼' : '▶') + '</span>' +
                '<strong>' + g.product + '</strong>' +
                '<span class="pack-count-pill">' + g.packs.length + ' ' + (g.packs.length === 1 ? 'pack' : 'packs') + '</span>' +
              '</div>' +
            '</td>' +
            '<td style="color: #64748b; font-style: italic;">All Packs</td>' +
            '<td style="color: #64748b;">' + g.strength + '</td>' +
            '<td style="color: #64748b;">' + g.nfc1 + '</td>' +
            '<td class="num-col"' + barCell(vals[0], 0, isSelected) + '><strong>' + fmtCompact(vals[0]) + '</strong></td>' +
            '<td class="num-col"' + barCell(vals[1], 1, isSelected) + '><strong>' + fmtCompact(vals[1]) + '</strong></td>' +
            '<td class="num-col"' + barCell(vals[2], 2, isSelected) + '><strong>' + fmtCompact(vals[2]) + '</strong></td>' +
            '<td class="num-col"' + barCell(vals[3], 3, isSelected) + '><strong>' + fmtCompact(vals[3]) + '</strong></td>' +
            '<td class="num-col">' + fmtGrowthBadge(vals[1], vals[0], false) + '</td>' +
            '<td class="num-col">' + fmtGrowthBadge(vals[2], vals[1], false) + '</td>' +
            '<td class="num-col">' + fmtGrowthBadge(vals[3], vals[2], false) + '</td>' +
            '<td class="num-col">' + fmtCagrCell(vals[3], vals[0]) + '</td>' +
            '<td class="num-col" title="' + s26.toFixed(2) + '%"><strong>' + fmtPct(s26) + '</strong></td>' +
            '<td class="num-col">' + fmtDeltaBpsCell(deltaBps, s23, s26) + '</td>' +
            '<td class="num-col">' + fmtEICell(ei) + '</td>' +
          '</tr>';

          // Child Pack Rows (rendered when expanded)
          if (isExpanded) {
            g.packs.forEach(p => {
              const pVals = valsOf(p);
              const ps23 = tot[0] > 0 ? (pVals[0] / tot[0]) * 100 : 0;
              const ps26 = tot[3] > 0 ? (pVals[3] / tot[3]) * 100 : 0;
              const pDeltaBps = Math.round((ps26 - ps23) * 100);
              const pGr26Pack = pVals[2] > 0 ? ((pVals[3] - pVals[2]) / pVals[2]) * 100 : null;
              const pEi = (pGr26Pack !== null && (100 + mktGrowth26) > 0)
                ? ((100 + pGr26Pack) / (100 + mktGrowth26)) * 100
                : null;

              rowsHtml += '<tr class="pack-child-row ' + (isSelected ? 'highlight-selected' : '') + '" data-product="' + g.product + '">' +
                '<td class="tree-indent-cell">' + p.product + '</td>' +
                '<td><strong>' + p.pack + '</strong></td>' +
                '<td>' + p.strength + '</td>' +
                '<td>' + p.nfc1 + '</td>' +
                '<td class="num-col"' + barCell(pVals[0], 0, isSelected) + '>' + fmtCompact(pVals[0]) + '</td>' +
                '<td class="num-col"' + barCell(pVals[1], 1, isSelected) + '>' + fmtCompact(pVals[1]) + '</td>' +
                '<td class="num-col"' + barCell(pVals[2], 2, isSelected) + '>' + fmtCompact(pVals[2]) + '</td>' +
                '<td class="num-col"' + barCell(pVals[3], 3, isSelected) + '>' + fmtCompact(pVals[3]) + '</td>' +
                '<td class="num-col">' + fmtGrowthBadge(pVals[1], pVals[0], false) + '</td>' +
                '<td class="num-col">' + fmtGrowthBadge(pVals[2], pVals[1], false) + '</td>' +
                '<td class="num-col">' + fmtGrowthBadge(pVals[3], pVals[2], false) + '</td>' +
                '<td class="num-col">' + fmtCagrCell(pVals[3], pVals[0]) + '</td>' +
                '<td class="num-col" title="' + ps26.toFixed(2) + '%">' + fmtPct(ps26) + '</td>' +
                '<td class="num-col">' + fmtDeltaBpsCell(pDeltaBps, ps23, ps26) + '</td>' +
                '<td class="num-col">' + fmtEICell(pEi) + '</td>' +
              '</tr>';
            });
          }
        });
        tbody.innerHTML = rowsHtml;

        document.getElementById('t3-table-foot').innerHTML = 
          '<tr>' +
            '<td colspan="4"><strong>Total Market</strong></td>' +
            '<td class="num-col" title="' + fmtNum(tot[0]) + '">' + fmtCompact(tot[0]) + '</td>' +
            '<td class="num-col" title="' + fmtNum(tot[1]) + '">' + fmtCompact(tot[1]) + '</td>' +
            '<td class="num-col" title="' + fmtNum(tot[2]) + '">' + fmtCompact(tot[2]) + '</td>' +
            '<td class="num-col" title="' + fmtNum(tot[3]) + '">' + fmtCompact(tot[3]) + '</td>' +
            '<td class="num-col">' + fmtGrowthBadge(tot[1], tot[0], false) + '</td>' +
            '<td class="num-col">' + fmtGrowthBadge(tot[2], tot[1], false) + '</td>' +
            '<td class="num-col">' + fmtGrowthBadge(tot[3], tot[2], false) + '</td>' +
            '<td class="num-col">' + fmtCagrCell(tot[3], tot[0]) + '</td>' +
            '<td class="num-col">100.0%</td>' +
            '<td class="num-col"><span class="growth-badge" style="background:#edf2f7; color:#4a5568;">0 bps</span></td>' +
            '<td class="num-col"><span class="growth-badge" style="background:#edf2f7; color:#4a5568;" title="Category Market Parity Benchmark">100.0</span></td>' +
          '</tr>';

        // Chart always tracks individual packs (top 10 by selected metric 2026)
        const chartRows = filteredRows.slice();
        chartRows.sort((a, b) => (isValueMetric ? b.v26 - a.v26 : b.u26 - a.u26));
        state.t3._chartRows = chartRows;
        renderTab3Charts(chartRows);
      }

      // Hover emphasis: dim all lines except the hovered one (selected product always keeps its color)
      function t3ApplyEmphasis(chart) {
        if (!chart) return;
        const selKey = (state.t3.product || '').toLowerCase();
        chart.data.datasets.forEach((ds, i) => {
          const isSel = selKey && ds.prodKey === selKey;
          if (t3HoverIdx >= 0 && i !== t3HoverIdx && !isSel) {
            ds.borderColor = '#d8dee6';
            ds.backgroundColor = '#d8dee6';
            ds.pointRadius = 2;
            ds.borderWidth = 2;
          } else {
            ds.borderColor = ds._baseColor;
            ds.backgroundColor = ds._baseColor;
            ds.pointRadius = ds._baseRadius;
            ds.borderWidth = isSel ? 3.5 : (i === t3HoverIdx ? 3 : 2);
          }
        });
        chart.update('none');
      }

      // 1. Chart.js Trajectory Trend (4-Year Line Chart)
      function renderTrajectoryChart(rows) {
        const canvas = document.getElementById('t3-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (chart3) {
          chart3.destroy();
          chart3 = null;
        }
        t3HoverIdx = -1;
        t3SoloIdx = -1;

        const metric = state.t3.metric;
        const isValueMetric = metric === 'value';
        const metricName = isValueMetric ? 'LC Value' : 'Units';
        const indexed = state.t3.view === 'index';
        const metricLbl = document.getElementById('t3-chart-metric-label');
        if (metricLbl) metricLbl.textContent = metricName;

        const mkSeries = (r) => (isValueMetric ? [r.v23, r.v24, r.v25, r.v26] : [r.u23, r.u24, r.u25, r.u26]);
        const toData = (raw) => {
          if (!indexed) return raw.slice();
          if (!raw[0] || raw[0] <= 0) return raw.map(() => null);
          return raw.map(v => (v / raw[0]) * 100);
        };

        // Cap to top 10 products/lines by 2026 value of the selected metric
        const maxLines = 10;
        const topRows = rows.slice(0, maxLines);
        const subTitleEl = document.getElementById('t3-chart-subtitle');
        if (subTitleEl) {
          if (rows.length === 0) {
            subTitleEl.textContent = 'No peer rows in the current scope';
          } else if (rows.length > maxLines) {
            subTitleEl.textContent = 'Top ' + maxLines + ' peers by ' + metricName + ' 2026 (of ' + rows.length + ') · dashed line = Total Market · click a legend item to isolate, again to reset';
          } else {
            subTitleEl.textContent = 'All ' + rows.length + ' peer products · dashed line = Total Market · click a legend item to isolate, again to reset';
          }
        }

        // Datasets: Total Market reference line first (always visible, drawn behind)
        const totalRaw = [0, 0, 0, 0];
        rows.forEach(r => {
          const s = mkSeries(r);
          for (let i = 0; i < 4; i++) totalRaw[i] += s[i];
        });

        const datasets = [{
          label: 'Total Market',
          shortLabel: 'Total Market',
          prodKey: '',
          raw: totalRaw,
          data: toData(totalRaw),
          borderColor: '#718096',
          backgroundColor: '#718096',
          borderDash: [6, 4],
          borderWidth: 2,
          pointRadius: 2,
          pointHoverRadius: 4,
          tension: 0.25,
          fill: false,
          isTotal: true,
          order: 10,
          _baseColor: '#718096',
          _baseRadius: 2
        }];

        const selProdLower = (state.t3.product || '').toLowerCase();
        topRows.forEach((r, idx) => {
          const isSelected = selProdLower && r.product.toLowerCase() === selProdLower;
          const raw = mkSeries(r);
          const color = isSelected ? '#c53030' : PALETTE[idx % PALETTE.length];
          const fullLabel = r.product + (topRows.filter(x => x.product === r.product).length > 1 ? ' (' + r.strength + ')' : '');
          datasets.push({
            label: fullLabel,
            shortLabel: fullLabel.length > 18 ? fullLabel.slice(0, 17) + '…' : fullLabel,
            prodKey: r.product.toLowerCase(),
            raw: raw,
            data: toData(raw),
            borderColor: color,
            backgroundColor: color,
            borderWidth: isSelected ? 3.5 : 2,
            pointRadius: isSelected ? 5 : 3,
            pointHoverRadius: 6,
            tension: 0.25,
            fill: false,
            _baseColor: color,
            _baseRadius: isSelected ? 5 : 3
          });
        });

        chart3 = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['MAT Jul 2023', 'MAT Jul 2024', 'MAT Jul 2025', 'MAT Jul 2026'],
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 10,
                right: 90
              }
            },
            interaction: {
              mode: 'nearest',
              intersect: false
            },
            onHover: (e, els) => {
              const idx = els && els.length ? els[0].datasetIndex : -1;
              if (idx !== t3HoverIdx) {
                t3HoverIdx = idx;
                t3ApplyEmphasis(chart3);
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  boxWidth: 12,
                  font: { size: 11 },
                  usePointStyle: false
                },
                onClick: (e, legendItem, legend) => {
                  const clickedIdx = legendItem.datasetIndex;
                  const ci = legend.chart;
                  if (t3SoloIdx === clickedIdx) {
                    t3SoloIdx = -1;
                    ci.data.datasets.forEach((ds, i) => {
                      ci.setDatasetVisibility(i, true);
                    });
                  } else {
                    t3SoloIdx = clickedIdx;
                    ci.data.datasets.forEach((ds, i) => {
                      const keep = i === clickedIdx || i === 0;
                      ci.setDatasetVisibility(i, keep);
                    });
                  }
                  ci.update();
                }
              },
              tooltip: {
                backgroundColor: '#0f1e36',
                callbacks: {
                  label: function(ctx) {
                    const ds = ctx.dataset;
                    const rawVal = ds.raw ? ds.raw[ctx.dataIndex] : null;
                    const idxStr = indexed ? (' (Index: ' + (ctx.raw ? ctx.raw.toFixed(1) : 'N/A') + ')') : '';
                    const valStr = rawVal !== null ? fmtCompact(rawVal) : 'N/A';
                    return ' ' + ds.label + ': ' + valStr + idxStr;
                  }
                }
              },
              datalabels: {
                display: function(ctx) {
                  return ctx.dataIndex === 3;
                },
                anchor: 'center',
                align: 'right',
                offset: 8,
                clip: false,
                formatter: function(value, ctx) {
                  return ctx.dataset.shortLabel || ctx.dataset.label;
                },
                font: function(ctx) {
                  const isSel = selProdLower && ctx.dataset.prodKey === selProdLower;
                  return {
                    size: isSel ? 11 : 10,
                    weight: isSel ? '700' : '600'
                  };
                },
                color: function(ctx) {
                  return ctx.dataset._baseColor || '#4a5568';
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 12, weight: '600' } }
              },
              y: {
                beginAtZero: false,
                grid: { color: '#edf2f7' },
                ticks: {
                  font: { size: 11 },
                  callback: function(v) {
                    if (indexed) return v.toFixed(0);
                    if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
                    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
                    if (v >= 1e3) return (v / 1e3).toFixed(0) + 'K';
                    return v;
                  }
                },
                title: {
                  display: true,
                  text: indexed ? 'Evolution Index (2023 = 100)' : metricName,
                  font: { size: 11, weight: '600' },
                  color: '#718096'
                }
              }
            }
          }
        });

        canvas.onmouseleave = () => {
          if (t3HoverIdx !== -1) {
            t3HoverIdx = -1;
            t3ApplyEmphasis(chart3);
          }
        };
      }

      // 2. Chart.js Strategic Quadrant (Price vs. Volume Growth Bubble Scatter)
      function renderQuadrantChart(rows) {
        const canvas = document.getElementById('t3-quadrant-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (chart3Quadrant) {
          chart3Quadrant.destroy();
          chart3Quadrant = null;
        }

        const selProd = (state.t3.product || '').toLowerCase();

        // Aggregate by product
        const prodMap = new Map();
        rows.forEach(r => {
          if (!prodMap.has(r.product)) {
            prodMap.set(r.product, { product: r.product, u23: 0, u26: 0, v23: 0, v26: 0 });
          }
          const o = prodMap.get(r.product);
          o.u23 += r.u23; o.u26 += r.u26; o.v23 += r.v23; o.v26 += r.v26;
        });

        const prodList = Array.from(prodMap.values());
        prodList.sort((a, b) => b.v26 - a.v26);
        const topPeers = prodList.slice(0, 30); // Top 30 products to ensure high readability

        const maxVal = topPeers.length > 0 ? Math.max(...topPeers.map(p => p.v26)) : 1;

        const points = [];
        topPeers.forEach((p, idx) => {
          if (p.u23 <= 0 || p.u26 <= 0) return;
          const volCagr = (Math.pow(p.u26 / p.u23, 1 / 3) - 1) * 100;
          const p23 = p.v23 / p.u23;
          const p26 = p.v26 / p.u26;
          if (p23 <= 0) return;
          const priceChange = ((p26 - p23) / p23) * 100;
          const r = Math.max(6, Math.min(26, Math.round(6 + 20 * Math.sqrt(p.v26 / maxVal))));
          const isSel = selProd && p.product.toLowerCase() === selProd;
          const color = isSel ? '#c53030' : PALETTE[idx % PALETTE.length];

          // Determine strategic quadrant label
          let quad = '';
          if (volCagr >= 0 && priceChange >= 0) quad = '⭐ Category Star';
          else if (volCagr >= 0 && priceChange < 0) quad = '🚀 Volume Gainer';
          else if (volCagr < 0 && priceChange >= 0) quad = '🛡️ Price-Protected Niche';
          else quad = '⚠️ Declining / At-Risk';

          points.push({
            x: Math.round(volCagr * 10) / 10,
            y: Math.round(priceChange * 10) / 10,
            r: r,
            product: p.product,
            v26: p.v26,
            volCagr: volCagr,
            priceChange: priceChange,
            quad: quad,
            isSel: isSel,
            color: color
          });
        });

        chart3Quadrant = new Chart(ctx, {
          type: 'bubble',
          data: {
            datasets: [{
              label: 'Peer Products',
              data: points,
              backgroundColor: points.map(pt => pt.isSel ? 'rgba(197, 48, 48, 0.88)' : pt.color + 'b3'),
              borderColor: points.map(pt => pt.isSel ? '#9b2c2c' : pt.color),
              borderWidth: points.map(pt => pt.isSel ? 3 : 1),
              hoverBorderWidth: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: { top: 15, right: 20, bottom: 10, left: 10 }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0f1e36',
                callbacks: {
                  title: (items) => {
                    const pt = items[0].raw;
                    return pt.product + (pt.isSel ? ' (Active Product)' : '');
                  },
                  label: (item) => {
                    const pt = item.raw;
                    return [
                      ' Strategic Position: ' + pt.quad,
                      ' Volume (Units) 3-Yr CAGR: ' + (pt.volCagr > 0 ? '+' : '') + pt.volCagr.toFixed(1) + '%',
                      ' Price/Unit 3-Yr % Change: ' + (pt.priceChange > 0 ? '+' : '') + pt.priceChange.toFixed(1) + '%',
                      ' 2026 LC Value: ' + fmtCompact(pt.v26) + ' (' + Math.round(pt.v26).toLocaleString('en-US') + ')'
                    ];
                  }
                }
              },
              datalabels: {
                display: (ctx) => {
                  const pt = ctx.dataset.data[ctx.dataIndex];
                  return pt.isSel || pt.r >= 14;
                },
                formatter: (v) => v.product,
                font: { size: 10, weight: '700' },
                color: (ctx) => ctx.dataset.data[ctx.dataIndex].isSel ? '#c53030' : '#1a202c',
                align: 'top',
                offset: 4,
                clip: false
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Volume Momentum: Units 3-Year CAGR (%)',
                  font: { size: 11, weight: '700' },
                  color: '#4a5568'
                },
                ticks: {
                  callback: (v) => v + '%'
                },
                grid: {
                  color: (c) => c.tick.value === 0 ? '#1a365d' : '#edf2f7',
                  lineWidth: (c) => c.tick.value === 0 ? 2 : 1
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Pricing Power / Erosion: Price/Unit 3-Yr % Change (%)',
                  font: { size: 11, weight: '700' },
                  color: '#4a5568'
                },
                ticks: {
                  callback: (v) => v + '%'
                },
                grid: {
                  color: (c) => c.tick.value === 0 ? '#1a365d' : '#edf2f7',
                  lineWidth: (c) => c.tick.value === 0 ? 2 : 1
                }
              }
            }
          }
        });
      }

      // 3. Chart.js 100% Stacked Market Share Evolution (2023 - 2026)
      function renderShareEvolutionChart(rows) {
        const canvas = document.getElementById('t3-share-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (chart3Share) {
          chart3Share.destroy();
          chart3Share = null;
        }

        const isValue = state.t3.metric === 'value';
        const selProd = (state.t3.product || '').toLowerCase();

        // Aggregate by product
        const prodMap = new Map();
        rows.forEach(r => {
          if (!prodMap.has(r.product)) {
            prodMap.set(r.product, { product: r.product, s: [0, 0, 0, 0] });
          }
          const o = prodMap.get(r.product);
          if (isValue) {
            o.s[0] += r.v23; o.s[1] += r.v24; o.s[2] += r.v25; o.s[3] += r.v26;
          } else {
            o.s[0] += r.u23; o.s[1] += r.u24; o.s[2] += r.u25; o.s[3] += r.u26;
          }
        });

        const totByYear = [0, 0, 0, 0];
        prodMap.forEach(p => {
          for (let i = 0; i < 4; i++) totByYear[i] += p.s[i];
        });

        const prodList = Array.from(prodMap.values());
        prodList.sort((a, b) => b.s[3] - a.s[3]);

        const topCount = 8;
        const topProds = prodList.slice(0, topCount);
        const otherProds = prodList.slice(topCount);

        const datasets = [];
        topProds.forEach((p, idx) => {
          const isSel = selProd && p.product.toLowerCase() === selProd;
          const color = isSel ? '#c53030' : PALETTE[idx % PALETTE.length];
          const shares = p.s.map((val, i) => totByYear[i] > 0 ? (val / totByYear[i]) * 100 : 0);
          datasets.push({
            label: p.product + (isSel ? ' (Active)' : ''),
            data: shares.map(v => Math.round(v * 10) / 10),
            rawVals: p.s,
            backgroundColor: color,
            borderColor: '#ffffff',
            borderWidth: 1,
            stack: 'market-share'
          });
        });

        if (otherProds.length > 0) {
          const otherVals = [0, 0, 0, 0];
          otherProds.forEach(p => {
            for (let i = 0; i < 4; i++) otherVals[i] += p.s[i];
          });
          const otherShares = otherVals.map((val, i) => totByYear[i] > 0 ? (val / totByYear[i]) * 100 : 0);
          datasets.push({
            label: 'All Other Peers (' + otherProds.length + ')',
            data: otherShares.map(v => Math.round(v * 10) / 10),
            rawVals: otherVals,
            backgroundColor: '#a0aec0',
            borderColor: '#ffffff',
            borderWidth: 1,
            stack: 'market-share'
          });
        }

        chart3Share = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['MAT Jul 2023', 'MAT Jul 2024', 'MAT Jul 2025', 'MAT Jul 2026'],
            datasets: datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { boxWidth: 12, font: { size: 11 } }
              },
              tooltip: {
                backgroundColor: '#0f1e36',
                callbacks: {
                  label: (ctx) => {
                    const raw = ctx.dataset.rawVals ? ctx.dataset.rawVals[ctx.dataIndex] : null;
                    const valStr = raw !== null ? (' · ' + fmtCompact(raw)) : '';
                    return ' ' + ctx.dataset.label + ': ' + ctx.raw.toFixed(1) + '%' + valStr;
                  }
                }
              },
              datalabels: {
                display: (ctx) => ctx.dataset.data[ctx.dataIndex] >= 6,
                formatter: (v) => v.toFixed(0) + '%',
                font: { size: 10, weight: '700' },
                color: '#ffffff'
              }
            },
            scales: {
              x: {
                stacked: true,
                grid: { display: false },
                ticks: { font: { size: 12, weight: '600' } }
              },
              y: {
                stacked: true,
                max: 100,
                ticks: { callback: (v) => v + '%' },
                title: {
                  display: true,
                  text: 'Competitive Market Share (%)',
                  font: { size: 11, weight: '600' },
                  color: '#718096'
                }
              }
            }
          }
        });
      }

      // 4. Chart.js Category Value Growth Attribution Waterfall (2023 -> 2026)
      function renderWaterfallChart(rows) {
        const canvas = document.getElementById('t3-waterfall-chart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (chart3Waterfall) {
          chart3Waterfall.destroy();
          chart3Waterfall = null;
        }

        const isValue = state.t3.metric === 'value';
        const metricLabel = isValue ? 'LC Value' : 'Units';

        // Product aggregate 2023 and 2026
        const prodMap = new Map();
        let tot23 = 0;
        let tot26 = 0;

        rows.forEach(r => {
          const v23 = isValue ? r.v23 : r.u23;
          const v26 = isValue ? r.v26 : r.u26;
          tot23 += v23;
          tot26 += v26;
          if (!prodMap.has(r.product)) {
            prodMap.set(r.product, { product: r.product, v23: 0, v26: 0 });
          }
          const o = prodMap.get(r.product);
          o.v23 += v23;
          o.v26 += v26;
        });

        const deltas = Array.from(prodMap.values()).map(p => ({
          product: p.product,
          delta: p.v26 - p.v23,
          v23: p.v23,
          v26: p.v26
        }));

        // Separate positive and negative contributors
        const posList = deltas.filter(d => d.delta > 0).sort((a, b) => b.delta - a.delta);
        const negList = deltas.filter(d => d.delta < 0).sort((a, b) => a.delta - b.delta);

        const topPos = posList.slice(0, 5);
        const remPos = posList.slice(5);
        const topNeg = negList.slice(0, 3);
        const remNeg = negList.slice(3);

        const otherPosDelta = remPos.reduce((s, d) => s + d.delta, 0);
        const otherNegDelta = remNeg.reduce((s, d) => s + d.delta, 0);
        const otherNetDelta = otherPosDelta + otherNegDelta;

        const labels = ['MAT Jul 2023'];
        const barData = [];
        const barColors = [];
        const rawDeltas = [];

        // 1. Initial 2023 Total Bar
        barData.push([0, tot23]);
        barColors.push('#1a365d');
        rawDeltas.push(tot23);

        let running = tot23;

        // 2. Top positive contributors
        topPos.forEach(p => {
          labels.push('+' + p.product);
          barData.push([running, running + p.delta]);
          barColors.push('#38a169');
          rawDeltas.push(p.delta);
          running += p.delta;
        });

        // 3. Top negative contributors
        topNeg.forEach(p => {
          labels.push('-' + p.product);
          barData.push([running + p.delta, running]);
          barColors.push('#e53e3e');
          rawDeltas.push(p.delta);
          running += p.delta;
        });

        // 4. Other peers net
        if (otherNetDelta !== 0) {
          labels.push('Other Peers Net');
          if (otherNetDelta > 0) {
            barData.push([running, running + otherNetDelta]);
            barColors.push('#68d391');
          } else {
            barData.push([running + otherNetDelta, running]);
            barColors.push('#fc8181');
          }
          rawDeltas.push(otherNetDelta);
          running += otherNetDelta;
        }

        // 5. Ending 2026 Total Bar
        labels.push('MAT Jul 2026');
        barData.push([0, tot26]);
        barColors.push('#1a365d');
        rawDeltas.push(tot26);

        chart3Waterfall = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              data: barData,
              backgroundColor: barColors,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: { top: 25, right: 15 }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0f1e36',
                callbacks: {
                  label: (ctx) => {
                    const d = rawDeltas[ctx.dataIndex];
                    const isTot = ctx.dataIndex === 0 || ctx.dataIndex === labels.length - 1;
                    if (isTot) {
                      return ' Total Market ' + metricLabel + ': ' + fmtCompact(d) + ' (' + Math.round(d).toLocaleString('en-US') + ')';
                    }
                    const sign = d > 0 ? '+' : '';
                    return ' Contribution: ' + sign + fmtCompact(d) + ' (' + Math.round(d).toLocaleString('en-US') + ')';
                  }
                }
              },
              datalabels: {
                anchor: 'end',
                align: 'top',
                font: { size: 10, weight: '700' },
                color: '#2d3748',
                formatter: (v, ctx) => {
                  const d = rawDeltas[ctx.dataIndex];
                  const isTot = ctx.dataIndex === 0 || ctx.dataIndex === labels.length - 1;
                  if (isTot) return fmtCompact(d);
                  return (d > 0 ? '+' : '') + fmtCompact(d);
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 11, weight: '600' } }
              },
              y: {
                ticks: {
                  callback: (v) => fmtCompact(v)
                },
                title: {
                  display: true,
                  text: metricLabel + ' Growth Attribution',
                  font: { size: 11, weight: '600' },
                  color: '#718096'
                }
              }
            }
          }
        });
      }

      // 5. Chart.js NFC1 Dosage Form & Strength Mix Breakdown
      function renderMixBreakdownChart(rows) {
        const nfc1Canvas = document.getElementById('t3-nfc1-chart');
        const strCanvas = document.getElementById('t3-strength-chart');
        if (!nfc1Canvas || !strCanvas) return;

        if (chart3Nfc1) {
          chart3Nfc1.destroy();
          chart3Nfc1 = null;
        }
        if (chart3Strength) {
          chart3Strength.destroy();
          chart3Strength = null;
        }

        const isValue = state.t3.metric === 'value';

        // Aggregate by NFC1 for MAT 2026
        const nfc1Map = new Map();
        const strMap = new Map();

        rows.forEach(r => {
          const val = isValue ? r.v26 : r.u26;
          nfc1Map.set(r.nfc1, (nfc1Map.get(r.nfc1) || 0) + val);
          strMap.set(r.strength, (strMap.get(r.strength) || 0) + val);
        });

        const nfc1List = Array.from(nfc1Map.entries()).sort((a, b) => b[1] - a[1]);
        const strList = Array.from(strMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);

        const nfc1Labels = nfc1List.map(e => e[0]);
        const nfc1Values = nfc1List.map(e => e[1]);
        const nfc1Tot = nfc1Values.reduce((s, v) => s + v, 0);

        // Doughnut for NFC1
        chart3Nfc1 = new Chart(nfc1Canvas.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: nfc1Labels,
            datasets: [{
              data: nfc1Values,
              backgroundColor: PALETTE.slice(0, nfc1Labels.length),
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { boxWidth: 12, font: { size: 10 } }
              },
              tooltip: {
                backgroundColor: '#0f1e36',
                callbacks: {
                  label: (ctx) => {
                    const pct = nfc1Tot > 0 ? (ctx.raw / nfc1Tot * 100).toFixed(1) : '0';
                    return ' ' + ctx.label + ': ' + fmtCompact(ctx.raw) + ' (' + pct + '%)';
                  }
                }
              },
              datalabels: {
                display: (ctx) => {
                  const pct = nfc1Tot > 0 ? ctx.dataset.data[ctx.dataIndex] / nfc1Tot : 0;
                  return pct >= 0.08;
                },
                formatter: (v) => {
                  const pct = nfc1Tot > 0 ? (v / nfc1Tot * 100).toFixed(0) : '0';
                  return pct + '%';
                },
                color: '#ffffff',
                font: { size: 11, weight: '700' }
              }
            },
            cutout: '58%'
          }
        });

        // Horizontal bar for Strength
        const strLabels = strList.map(e => e[0] || 'Unknown');
        const strValues = strList.map(e => e[1]);

        chart3Strength = new Chart(strCanvas.getContext('2d'), {
          type: 'bar',
          data: {
            labels: strLabels,
            datasets: [{
              label: isValue ? '2026 LC Value' : '2026 Units',
              data: strValues,
              backgroundColor: '#2b6cb0',
              borderRadius: 4
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: { right: 40 }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#0f1e36',
                callbacks: {
                  label: (ctx) => ' ' + ctx.dataset.label + ': ' + fmtCompact(ctx.raw) + ' (' + Math.round(ctx.raw).toLocaleString('en-US') + ')'
                }
              },
              datalabels: {
                anchor: 'end',
                align: 'right',
                formatter: (v) => fmtCompact(v),
                font: { size: 10, weight: '600' },
                color: '#2d3748'
              }
            },
            scales: {
              x: {
                ticks: { callback: (v) => fmtCompact(v) },
                grid: { color: '#edf2f7' }
              },
              y: {
                grid: { display: false },
                ticks: { font: { size: 11, weight: '600' } }
              }
            }
          }
        });
      }

      // Master Tab 3 Chart Dispatcher
      function renderTab3Charts(chartRows) {
        const allRows = state.t3._lastRows || chartRows;
        if (state.t3.chartLayout === 'grid') {
          // Grid Overview: display all 5 panels
          document.querySelectorAll('.chart-panel').forEach(p => p.classList.add('active'));
          const wrapper = document.getElementById('t3-charts-wrapper');
          if (wrapper) wrapper.className = 'chart-grid-layout';
          renderTrajectoryChart(chartRows);
          renderQuadrantChart(allRows);
          renderShareEvolutionChart(allRows);
          renderWaterfallChart(allRows);
          renderMixBreakdownChart(allRows);
        } else {
          // Single Lens Focus
          const wrapper = document.getElementById('t3-charts-wrapper');
          if (wrapper) wrapper.className = 'chart-panels-wrapper';
          document.querySelectorAll('.chart-panel').forEach(p => p.classList.remove('active'));
          const activePanel = document.getElementById('t3-panel-' + state.t3.chartLens);
          if (activePanel) activePanel.classList.add('active');

          if (state.t3.chartLens === 'trend') renderTrajectoryChart(chartRows);
          else if (state.t3.chartLens === 'quadrant') renderQuadrantChart(allRows);
          else if (state.t3.chartLens === 'share') renderShareEvolutionChart(allRows);
          else if (state.t3.chartLens === 'waterfall') renderWaterfallChart(allRows);
          else if (state.t3.chartLens === 'mix') renderMixBreakdownChart(allRows);
        }
      }

      // Autocomplete setup helper
      function setupAutocomplete(inputId, listId, itemsGetter, onSelect) {
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);

        function showMatches(val) {
          const term = val.trim().toLowerCase();
          const items = itemsGetter();
          const matches = term === '' 
            ? items.slice(0, 40)
            : items.filter(it => it.toLowerCase().includes(term)).slice(0, 40);

          if (matches.length === 0) {
            list.innerHTML = '<div style="padding:10px; color:#a0aec0; font-size:12px;">No matches found</div>';
          } else {
            list.innerHTML = matches.map(m => '<div class="autocomplete-item" data-value="' + m + '">' + m + '</div>').join('');
          }
          list.style.display = 'block';
        }

        input.addEventListener('focus', () => showMatches(input.value));
        input.addEventListener('input', () => showMatches(input.value));

        list.addEventListener('click', (e) => {
          const item = e.target.closest('.autocomplete-item');
          if (item) {
            const val = item.getAttribute('data-value');
            input.value = val;
            list.style.display = 'none';
            onSelect(val);
          }
        });

        document.addEventListener('click', (e) => {
          if (!input.contains(e.target) && !list.contains(e.target)) {
            list.style.display = 'none';
          }
        });
      }

      // CSV export for the current Analytics view (full precision, all rows in scope)
      function exportT3CSV() {
        const rows = state.t3._lastRows || [];
        if (rows.length === 0) return;
        const { atc4, metric } = state.t3;
        const isValueMetric = metric === 'value';
        const metricName = isValueMetric ? 'LC Value' : 'Units';
        const q = (s) => '"' + String(s).replace(/"/g, '""') + '"';
        const gr = (curr, prev) => (prev > 0) ? ((curr - prev) / prev * 100).toFixed(1) : '';
        const cagrPct = (curr, base) => (base > 0 && curr >= 0) ? ((Math.pow(curr / base, 1 / 3) - 1) * 100).toFixed(1) : '';
        const seriesOf = (r) => (isValueMetric ? [r.v23, r.v24, r.v25, r.v26] : [r.u23, r.u24, r.u25, r.u26]);

        const lines = [];
        lines.push(['Product', 'Pack', 'Strength', 'NFC1',
          metricName + ' 2023', metricName + ' 2024', metricName + ' 2025', metricName + ' 2026',
          metricName + ' Gr% 2024', metricName + ' Gr% 2025', metricName + ' Gr% 2026',
          metricName + ' CAGR 23-26',
          '2026 Share %', 'Delta Share (bps)', 'Evolution Index'].join(','));

        // First pass: compute totals for share/EI calculations
        const tot = [0, 0, 0, 0];
        rows.forEach(r => {
          const vals = seriesOf(r);
          for (let i = 0; i < 4; i++) tot[i] += vals[i];
        });
        const mktGr26 = tot[2] > 0 ? (tot[3] - tot[2]) / tot[2] * 100 : 0;

        // Second pass: build CSV rows with new metrics
        rows.forEach(r => {
          const vals = seriesOf(r);
          const s23 = tot[0] > 0 ? vals[0] / tot[0] * 100 : 0;
          const s26 = tot[3] > 0 ? vals[3] / tot[3] * 100 : 0;
          const deltaBps = Math.round((s26 - s23) * 100);
          const prodGr26 = vals[2] > 0 ? (vals[3] - vals[2]) / vals[2] * 100 : 0;
          const ei = ((100 + prodGr26) / (100 + mktGr26) * 100);
          lines.push([q(r.product), q(r.pack), q(r.strength), q(r.nfc1),
            vals[0], vals[1], vals[2], vals[3],
            gr(vals[1], vals[0]), gr(vals[2], vals[1]), gr(vals[3], vals[2]),
            cagrPct(vals[3], vals[0]),
            s26.toFixed(2), deltaBps, ei.toFixed(1)].join(','));
        });
        lines.push([q('Total Market'), '', '', '', tot[0], tot[1], tot[2], tot[3],
          gr(tot[1], tot[0]), gr(tot[2], tot[1]), gr(tot[3], tot[2]),
          cagrPct(tot[3], tot[0]),
          '100.00', '0', '100.0'].join(','));

        const blob = new Blob(['\\uFEFF' + lines.join('\\r\\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Analytics_' + metricName.replace(/\\s+/g, '') + '_' + (atc4 || 'ALL').replace(/[^\\w]+/g, '_').slice(0, 40) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      // Event Bindings for Tab 3 (Analytics)
      // 1. ATC4 Autocomplete Search
      setupAutocomplete('t3-atc4-search', 't3-atc4-autocomplete', () => allUniqueATC4s, (selectedATC) => {
        state.t3.atc4 = selectedATC;
        // Check if current product belongs to this ATC4
        const rows = atcMap.get(selectedATC) || [];
        const prodsInAtc = new Set(rows.map(r => r.product));
        if (state.t3.product && !prodsInAtc.has(state.t3.product)) {
          state.t3.product = '';
          document.getElementById('t3-product-search').value = '';
        }
        state.t3.nfc1 = 'ALL';
        state.t3.strength = 'ALL';
        state.t3.pack = 'ALL';
        updateCascadingFilters(state.t3.atc4, 't3-nfc1-select', 't3-strength-select', 't3-pack-select', 'ALL', 'ALL', 'ALL');
        renderTab3();
      });

      // 2. Product Autocomplete Search
      setupAutocomplete('t3-product-search', 't3-product-autocomplete', () => {
        if (state.t3.atc4) {
          const rows = atcMap.get(state.t3.atc4) || [];
          return Array.from(new Set(rows.map(r => r.product))).sort((a,b) => a.localeCompare(b));
        }
        return allUniqueProducts;
      }, (selectedProd) => {
        state.t3.product = selectedProd;
        const availableATCs = Array.from(productMap.get(selectedProd) || []);
        if (!state.t3.atc4 || !availableATCs.includes(state.t3.atc4)) {
          state.t3.atc4 = getBestATC4ForProduct(selectedProd);
          document.getElementById('t3-atc4-search').value = state.t3.atc4;
        }
        state.t3.nfc1 = 'ALL';
        state.t3.strength = 'ALL';
        state.t3.pack = 'ALL';
        updateCascadingFilters(state.t3.atc4, 't3-nfc1-select', 't3-strength-select', 't3-pack-select', 'ALL', 'ALL', 'ALL');
        renderTab3();
      });

      document.getElementById('t3-atc4-switcher').addEventListener('change', (e) => {
        state.t3.atc4 = e.target.value;
        document.getElementById('t3-atc4-search').value = e.target.value;
        state.t3.nfc1 = 'ALL';
        state.t3.strength = 'ALL';
        state.t3.pack = 'ALL';
        updateCascadingFilters(state.t3.atc4, 't3-nfc1-select', 't3-strength-select', 't3-pack-select', 'ALL', 'ALL', 'ALL');
        renderTab3();
      });

      document.getElementById('t3-nfc1-select').addEventListener('change', (e) => {
        state.t3.nfc1 = e.target.value;
        updateCascadingFilters(state.t3.atc4, 't3-nfc1-select', 't3-strength-select', 't3-pack-select', state.t3.nfc1, state.t3.strength, state.t3.pack);
        state.t3.strength = document.getElementById('t3-strength-select').value;
        state.t3.pack = document.getElementById('t3-pack-select').value;
        renderTab3();
      });

      document.getElementById('t3-strength-select').addEventListener('change', (e) => {
        state.t3.strength = e.target.value;
        updateCascadingFilters(state.t3.atc4, 't3-nfc1-select', 't3-strength-select', 't3-pack-select', state.t3.nfc1, state.t3.strength, state.t3.pack);
        state.t3.pack = document.getElementById('t3-pack-select').value;
        renderTab3();
      });

      document.getElementById('t3-pack-select').addEventListener('change', (e) => {
        state.t3.pack = e.target.value;
        renderTab3();
      });

      document.querySelectorAll('#t3-metric-toggle .toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#t3-metric-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.t3.metric = btn.getAttribute('data-metric');
          renderTab3();
        });
      });

      document.querySelectorAll('#t3-view-toggle .toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#t3-view-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.t3.view = btn.getAttribute('data-view');
          renderTab3();
        });
      });

      document.getElementById('t3-topn-select').addEventListener('change', (e) => {
        state.t3.topN = e.target.value;
        renderTab3();
      });

      document.getElementById('t3-export-btn').addEventListener('click', exportT3CSV);

      // Expand / Collapse All Toggle on Tab 3
      document.getElementById('t3-expand-toggle-btn').addEventListener('click', () => {
        const groups = state.t3._lastGroups || [];
        const topN = state.t3.topN;
        const displayGroups = topN === 'ALL' ? groups : groups.slice(0, parseInt(topN, 10));
        const allExpanded = displayGroups.length > 0 && displayGroups.every(g => state.t3.expandedProds.has(g.product));
        if (allExpanded) {
          displayGroups.forEach(g => state.t3.expandedProds.delete(g.product));
        } else {
          displayGroups.forEach(g => state.t3.expandedProds.add(g.product));
        }
        renderTab3();
      });

      // Visuals Hub: Lens navigation — switch between the 5 chart panels
      document.querySelectorAll('#t3-lens-nav .chart-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#t3-lens-nav .chart-nav-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.t3.chartLens = btn.getAttribute('data-lens');
          renderTab3Charts(state.t3._chartRows || []);
        });
      });

      // Visuals Hub: Layout toggle — switch between single lens and grid
      document.querySelectorAll('#t3-layout-toggle .toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('#t3-layout-toggle .toggle-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.t3.chartLayout = btn.getAttribute('data-layout');
          // In grid mode, hide the lens nav strip; in lens mode, show it
          const lensNav = document.getElementById('t3-lens-nav');
          if (lensNav) lensNav.style.display = state.t3.chartLayout === 'grid' ? 'none' : 'flex';
          renderTab3Charts(state.t3._chartRows || []);
        });
      });

      // Sortable Analytics table headers (click to toggle asc/desc)
      document.querySelector('#t3-table thead').addEventListener('click', (e) => {
        const th = e.target.closest('th.sortable');
        if (!th) return;
        const key = th.getAttribute('data-key');
        let parsed;
        if (key === 'product') parsed = { t: 'product' };
        else if (key === 'pack') parsed = { t: 'pack' };
        else if (key === 'strength') parsed = { t: 'strength' };
        else if (key === 'nfc1') parsed = { t: 'nfc1' };
        else if (key === 'cagr') parsed = { t: 'cagr' };
        else if (key === 'share26') parsed = { t: 'share26' };
        else if (key === 'deltabps') parsed = { t: 'deltabps' };
        else if (key === 'ei') parsed = { t: 'ei' };
        else parsed = { t: key.match(/^[a-z]+/)[0], c: parseInt(key.replace(/^\\D+/, ''), 10) };
        const same = parsed.t === state.t3.sortKey.t && parsed.c === state.t3.sortKey.c;
        if (same) {
          state.t3.sortDir = state.t3.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          state.t3.sortKey = parsed;
          state.t3.sortDir = (parsed.t === 'product' || parsed.t === 'pack' || parsed.t === 'strength' || parsed.t === 'nfc1') ? 'asc' : 'desc';
        }
        renderTab3();
      });

      // Interactive row click on Tab 3 to toggle packs or focus product
      document.getElementById('t3-table-body').addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.tree-toggle-btn');
        const groupRow = e.target.closest('tr.prod-group-row');
        const childRow = e.target.closest('tr.pack-child-row');

        if (toggleBtn || groupRow) {
          const tr = groupRow || toggleBtn.closest('tr');
          const prod = tr.getAttribute('data-product');
          if (toggleBtn) {
            if (state.t3.expandedProds.has(prod)) {
              state.t3.expandedProds.delete(prod);
            } else {
              state.t3.expandedProds.add(prod);
            }
            renderTab3();
            return;
          }
          if (state.t3.expandedProds.has(prod)) {
            state.t3.expandedProds.delete(prod);
          } else {
            state.t3.expandedProds.add(prod);
          }
          state.t3.product = prod;
          document.getElementById('t3-product-search').value = prod;
          renderTab3();
          return;
        }

        if (childRow) {
          const prod = childRow.getAttribute('data-product');
          if (prod) {
            state.t3.product = prod;
            document.getElementById('t3-product-search').value = prod;
            renderTab3();
          }
        }
      });

      // Auto-Select Default on Load (Top ATC4 by LC Value: 'A02B2 PROTON PUMP INHIBITORS' / 'ZURCAL')
      const initialATC4 = 'A02B2 PROTON PUMP INHIBITORS';
      const initialProduct = 'ZURCAL';

      function setToggleActive(groupId, attr, val) {
        document.querySelectorAll('#' + groupId + ' .toggle-btn').forEach(b => {
          if (b.getAttribute(attr) === val) b.classList.add('active');
          else b.classList.remove('active');
        });
      }

      function initAnalytics() {
        state.t3.product = initialProduct;
        state.t3.atc4 = initialATC4;
        state.t3.nfc1 = 'ALL';
        state.t3.strength = 'ALL';
        state.t3.pack = 'ALL';
        state.t3.metric = 'value';
        state.t3.view = 'absolute';
        state.t3.topN = 'ALL';
        state.t3.sortKey = { t: 'metric', c: 3 };
        state.t3.sortDir = 'desc';
        state.t3.chartLens = 'trend';
        state.t3.chartLayout = 'lens';
        state.t3.expandedProds.clear();
        document.getElementById('t3-atc4-search').value = initialATC4;
        document.getElementById('t3-product-search').value = initialProduct;
        setToggleActive('t3-metric-toggle', 'data-metric', 'value');
        setToggleActive('t3-view-toggle', 'data-view', 'absolute');
        setToggleActive('t3-layout-toggle', 'data-layout', 'lens');
        // Reset lens nav: activate 'trend' button, show the nav strip
        document.querySelectorAll('#t3-lens-nav .chart-nav-btn').forEach(b => {
          if (b.getAttribute('data-lens') === 'trend') b.classList.add('active');
          else b.classList.remove('active');
        });
        const lensNav = document.getElementById('t3-lens-nav');
        if (lensNav) lensNav.style.display = 'flex';
        document.getElementById('t3-topn-select').value = 'ALL';
        updateCascadingFilters(initialATC4, 't3-nfc1-select', 't3-strength-select', 't3-pack-select', 'ALL', 'ALL', 'ALL');
        renderTab3();
      }

      // Initial execution
      initAnalytics();

    })();
`;

// Replace script in html
const finalHtml = html.slice(0, scriptStartIndex + scriptStartTag.length) + finalJs + html.slice(scriptEndIndex);

fs.writeFileSync('IQVIA_MAT_Jul_Dashboard.html', finalHtml, 'utf8');
console.log('Successfully wrote IQVIA_MAT_Jul_Dashboard.html! Size:', finalHtml.length);
