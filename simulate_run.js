const fs = require('fs');
const html = fs.readFileSync('IQVIA_MAT_Jul_Dashboard.html', 'utf8');

const sIdx = html.indexOf('<script type="application/json" id="iqvia-data">');
const eIdx = html.indexOf('</script>', sIdx);
const jsonContent = html.substring(sIdx + '<script type="application/json" id="iqvia-data">'.length, eIdx).trim();

const jsStart = html.lastIndexOf('<script>') + 8;
const jsEnd = html.lastIndexOf('</script>');
const jsCode = html.substring(jsStart, jsEnd);

const dom = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        id,
        textContent: '',
        innerHTML: '',
        value: '',
        style: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); }
        },
        addEventListener() {},
        contains() { return false; },
        setAttribute() {},
        getAttribute() { return ''; },
        getContext() { return {}; }
      };
    }
    return this.elements[id];
  },
  querySelector() {
    return this.getElementById('__querySelector-stub__');
  },
  querySelectorAll() { return []; },
  addEventListener() {}
};

dom.getElementById('iqvia-data').textContent = jsonContent;

global.document = dom;
global.Chart = function() { return { destroy() {} }; };
global.Chart.register = function() {};
global.ChartDataLabels = undefined; // What if ChartDataLabels is undefined because CDN is offline or blocked?

try {
  eval(jsCode);
  console.log('Execution completed!');
  console.log('Table 1 rows HTML length:', dom.getElementById('t1-table-body').innerHTML.length);
  console.log('Table 1 head:', dom.getElementById('t1-table-head-row').innerHTML);

  // Trigger nav button for Tab 2 and Tab 3
  const navButtons = dom.querySelectorAll();
  console.log('Tested initialization successfully.');
} catch (e) {
  console.error('CRITICAL RUNTIME ERROR:', e.message, e.stack);
}
