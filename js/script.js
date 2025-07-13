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
      // Remove active from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Add active to clicked tab and corresponding content
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
}

// Chart.js instances
let stocksChart, weatherChart;

function setupStockChart() {
  const ctx = document.getElementById('stocksChart').getContext('2d');

  stocksChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'AAPL Stock Price',
        data: [130, 135, 125, 140, 150, 145],
        borderColor: '#00bcd4',
        backgroundColor: 'rgba(0,188,212,0.3)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        borderJoinStyle: 'round',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: { color: '#00bcd4' }
        }
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
          hoverBorderWidth: 3,
          hoverRadius: 7,
          radius: 5,
          borderWidth: 2,
          borderColor: '#00bcd4',
          backgroundColor: '#121212'
        }
      },
      animation: {
        duration: 700,
        easing: 'easeOutQuart'
      }
    }
  });

  // Summary text for stocks
  document.getElementById('stocksSummary').textContent = 'AAPL stock prices for first half of 2025. Smooth trendline with rounded corners.';
}

function setupWeatherChart() {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  weatherChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Temperature (°C)',
        data: [22, 24, 19, 23, 25, 20, 21],
        backgroundColor: '#00bcd4',
        borderRadius: 12,
        barPercentage: 0.6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
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

  // Summary text for weather
  document.getElementById('weatherSummary').textContent = 'Weekly temperature forecast with rounded bar charts.';
}

function loadNews() {
  const newsFeed = document.getElementById('newsFeed');
  // Example static news for demo
  const newsItems = [
    { title: 'Stock Market hits new highs', date: '2025-07-12' },
    { title: 'Storm warning issued for West Coast', date: '2025-07-11' },
    { title: 'Tech stocks lead the rally', date: '2025-07-10' },
  ];

  newsFeed.innerHTML = newsItems.map(
    item => `<div class="news-item"><strong>${item.title}</strong><br/><small>${item.date}</small></div>`
  ).join('');
}

// Investment calculator
function setupCalculator() {
  const form = document.getElementById('investmentForm');
  const resultDiv = document.getElementById('calcResult');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const symbol = form.stockSymbol.value.trim().toUpperCase();
    const amount = parseFloat(form.amount.value);
    const date = form.date.value;

    if (!symbol || isNaN(amount) || amount <= 0 || !date) {
      resultDiv.textContent = 'Please enter valid input.';
      return;
    }

    // Dummy calculation: assume 10% annual return compounded monthly from chosen date to now
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
