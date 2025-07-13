document.addEventListener('DOMContentLoaded', () => {
  // 🚀 Setup all charts and data fetching
  setupStockChart();
  setupWeatherChart();
  loadNews();
  setupCalculator();
});

// Example chart functions (will fill in real API data later)
function setupStockChart() {
  const ctx = document.getElementById('stocksChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{
        label: 'Stock Example',
        data: [120, 130, 125],
        borderColor: '#00bcd4',
        fill: false,
      }]
    }
  });
}

function setupWeatherChart() {
  const ctx = document.getElementById('weatherChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed'],
      datasets: [{
        label: 'Temp (°C)',
        data: [12, 15, 13],
        borderColor: '#ff9800',
        fill: false,
      }]
    }
  });
}

function loadNews() {
  document.getElementById('newsFeed').innerHTML = `
    <ul>
      <li>Loading news...</li>
    </ul>
  `;
  // Later: fetch from NewsAPI
}

function setupCalculator() {
  const form = document.getElementById('investmentForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('calcResult').textContent = 
      "Calculating... (feature coming)";
  });
}
