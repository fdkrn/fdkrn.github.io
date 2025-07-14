document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupWeatherChart();
  loadNews();
  setupCalculator();
  setupStockChart();

  await loadDaxData();

  const stockSelect = document.getElementById('stockSelect');
  const toggleDax = document.getElementById('toggleDax');

  stockSelect.addEventListener('change', () => {
    updateStockChart(stockSelect.value);
  });

  toggleDax.addEventListener('change', (e) => {
    showDax = e.target.checked;
    updateStockChart(stockSelect.value);
  });

  updateStockChart('AAPL');
});

// Globale Variablen
let stocksChart;
let daxData = null; //globaler speicher
let showDax = true;

// Tab switching
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// Fetch Stock Data von Yahoo Finance via Proxy
async function fetchStockData(symbol = 'AAPL') {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(yahooUrl)}`;

  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (!data.chart || !data.chart.result) {
      throw new Error('Invalid symbol or data not found');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0].close;

    const labels = timestamps.map(ts => {
      const date = new Date(ts * 1000);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });

    return { labels, prices };
  } catch (error) {
    console.error('Fetch stock data error:', error);
    return null;
  }
}

// Chart Setup initial (leer)
function setupStockChart() {
  const ctx = document.getElementById('stocksChart').getContext('2d');
  stocksChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Stock Price',
          data: [],
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76,175,80,0.1)',
          tension: 0.3
        },
        {
          label: 'DAX',
          data: [],
          borderColor: 'rgba(0,100,200,0.4)',
          backgroundColor: 'rgba(0,100,200,0.1)',
          tension: 0.3,
          hidden: !showDax // Start abhängig vom Schalter
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true }
      }
    }
  });
}

async function loadDaxData() {
  const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/%5EGDAXI?interval=1d&range=1mo'));
  const data = await res.json();
  const timestamps = data.chart.result[0].timestamp;
  const closes = data.chart.result[0].indicators.quote[0].close;
  daxData = {
    labels: timestamps.map(ts => new Date(ts * 1000).toISOString().split('T')[0]),
    prices: closes
  };
}

// Chart aktualisieren
async function updateStockChart(symbol = 'AAPL') {
  const stockData = await fetchStockData(symbol);

  stocksChart.data.labels = stockData.labels;
  stocksChart.data.datasets[0].data = stockData.prices;
  stocksChart.data.datasets[0].label = `${symbol} Stock Price`;

  if (daxData) {
    stocksChart.data.datasets[1].data = alignData(stockData.labels, daxData);
  }

  stocksChart.update();
}
// Daten auf Labels angleichen
function alignData(labels, otherData) {
  const map = Object.fromEntries(otherData.labels.map((l, i) => [l, otherData.prices[i]]));
  return labels.map(l => map[l] ?? null);
}

// Toggle DAX Linie
document.getElementById('toggleDax').addEventListener('change', e => {
  showDax = e.target.checked;
  stocksChart.data.datasets[1].hidden = !showDax;
  stocksChart.update();
});

// Wetter Chart Setup
let weatherChart;
function setupWeatherChart() {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  weatherChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Temp (°C)',
        data: [22, 24, 19, 23, 25, 20, 21],
        backgroundColor: '#00bcd4',
        borderRadius: 10,
        barPercentage: 0.6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: { ticks: { color: '#aaa' }, grid: { display: false } },
        y: { ticks: { color: '#aaa' }, grid: { color: '#222' }, beginAtZero: true }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart'
      }
    }
  });

  document.getElementById('weatherSummary').textContent = 'Weekly temperature forecast.';
}

// News Feed laden
function loadNews() {
  const newsFeed = document.getElementById('newsFeed');
  const newsItems = [
    { title: 'Stock Market hits new highs', date: '2025-07-12' },
    { title: 'Storm warning issued for West Coast', date: '2025-07-11' },
    { title: 'Tech stocks lead the rally', date: '2025-07-10' }
  ];

  newsFeed.innerHTML = newsItems.map(
    item => `<div class="news-item"><strong>${item.title}</strong><br/><small>${item.date}</small></div>`
  ).join('');
}

// Investment Rechner
function setupCalculator() {
  const form = document.getElementById('investmentForm');
  const resultDiv = document.getElementById('calcResult');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (!symbol || isNaN(amount) || amount <= 0 || !date) {
      resultDiv.textContent = 'Please enter valid input.';
      return;
    }

    const startDate = new Date(date);
    const now = new Date();

    if (startDate > now) {
      resultDiv.textContent = 'Date cannot be in the future.';
      return;
    }

    const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    const monthlyReturn = Math.pow(1 + 0.10, 1 / 12) - 1;

    const futureValue = amount * Math.pow(1 + monthlyReturn, monthsElapsed);

    resultDiv.innerHTML = `
      <p>Investment in <strong>${symbol}</strong> since <strong>${date}</strong>:</p>
      <p><strong>$${futureValue.toFixed(2)}</strong> (estimated, assuming 10% annual return)</p>
    `;
  });
}
