// Handle tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.querySelector(`.tab[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
  }
  
  // Chart.js setups
  document.addEventListener('DOMContentLoaded', () => {
    const stockCtx = document.getElementById('stockChart').getContext('2d');
    const stockChart = new Chart(stockCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Stock Value',
          data: [150, 165, 140, 175, 190],
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74, 222, 128, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: '#ccc' } },
          y: { ticks: { color: '#ccc' } }
        },
        plugins: {
          legend: { labels: { color: '#ccc' } },
          tooltip: { backgroundColor: '#374151', titleColor: '#f3f4f6', bodyColor: '#f3f4f6' }
        }
      }
    });
  
    const weatherCtx = document.getElementById('weatherChart').getContext('2d');
    const weatherChart = new Chart(weatherCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [{
          label: 'Temperature (°C)',
          data: [22, 24, 20, 26, 28],
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: '#ccc' } },
          y: { ticks: { color: '#ccc' } }
        },
        plugins: {
          legend: { labels: { color: '#ccc' } },
          tooltip: { backgroundColor: '#374151', titleColor: '#f3f4f6', bodyColor: '#f3f4f6' }
        }
      }
    });
  });
  