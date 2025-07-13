document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupStockChart();
  setupWeatherChart();
  loadNews();
  setupCalculator();
});

// Tab switching logic
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

let stocksChart, weatherChart;

function setupStockChart() {
  const ctx = document.getElementById('stocksChart').getContext('2d');

  stocksChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'AAPL Stock Price',
        data: [135, 142, 138, 150, 155, 160],
        borderColor: '#00bcd4',
        backgroundColor: 'rgba(0, 188, 212, 0.2)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        cubicInterpolationMode: 'monotone'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: { labels: { color: '#00bcd4' } },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          ticks: { color: '#aaa' },
          grid: { color: '#222' }
        },
        y: {
          ticks: { color: '#aaa' },
          grid: { color: '#222' },
          beginAtZero: false
        }
      },
      elements: {
        line: {
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
        },
        point: {
          borderWidth: 2,
          borderColor: '#00bcd4',
          backgroundColor: '#121212'
        }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart'
      }
    }
  });

  // Summary text
  document.getElementById('stocksSummary').textContent = 'Sample AAPL stock data (Jan-Jun 2025).';
}

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
        borderSkipped: false,
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
        x: {
          ticks: { color: '#aaa' },
          grid: { display: false }
        },
        y: {
          ticks: { color: '#aaa' },
          grid: { color: '#222' },
          beginAtZero: true
        }
      },
      animation: {
        duration: 600,
        easing: 'easeOutQuart'
      }
    }
  });

  document.getElementById('weatherSummary').textContent = 'Weekly temperature forecast.';
}

function loadNews() {
  const newsFeed = document.getElementById('newsFeed');
  // Demo static news items
  const newsItems = [
    { title: 'Stock Market hits new highs', date: '2025-07-12' },
    { title: 'Storm warning issued for West Coast', date: '2025-07-11' },
    { title: 'Tech stocks lead the rally', date: '2025-07-10' },
  ];

  newsFeed.innerHTML = newsItems.map(
    item => `<div class="news-item"><strong>${item.title}</strong><br/><small>${item.date}</small></div>`
  ).join('');
}

// Calculator inside Stocks tab
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
    const monthlyReturn = Math.pow(1 + 0.10, 1 / 12) - 1; // ~0.797% monthly

    const futureValue = amount * Math.pow(1 + monthlyReturn, monthsElapsed);

    resultDiv.innerHTML = `
      <p>Investment in <strong>${symbol}</strong> since <strong>${date}</strong>:</p>
      <p><strong>$${futureValue.toFixed(2)}</strong> (estimated, assuming 10% annual return)</p>
    `;
  });
}