
setTimeout(function() {
    const splash1 = document.querySelector('#splash-screen1 .splash-content');
    if (splash1) {
        splash1.innerHTML += '<button class="continue-btn" onclick="showSecondSplash()">Lanjutkan</button>';
    }
}, 2000);

function showSecondSplash() {
    document.getElementById('splash-screen1').classList.add('hidden');
    document.getElementById('splash-screen2').classList.remove('hidden');
}

function showMainContent() {
    document.getElementById('splash-screen2').classList.add('hidden');
    document.getElementById('main-content').style.display = 'block';
}



let iterativeTime = 0;
let recursiveTime = 0;


const ctx = document.getElementById('performanceChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Rekursi', 'Iterasi'],
        datasets: [{
            label: 'Waktu Eksekusi Terakhir (ms)',
            data: [0, 0],
            backgroundColor: ['#007bff', '#28a745'],
            borderRadius: 5,
        }]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
    }
});


const ctxComplexity = document.getElementById('complexityChart').getContext('2d');
const complexityChart = new Chart(ctxComplexity, {
    type: 'line',
    data: {
        datasets: [
            {
                label: 'Rekursi (O(n) + overhead)',
                data: [], 
                borderColor: '#007bff',
                backgroundColor: '#007bff',
                fill: false,
                tension: 0.3
            },
            {
                label: 'Iterasi (O(n))',
                data: [], 
                borderColor: '#28a745',
                backgroundColor: '#28a745',
                fill: false,
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: { 
                type: 'linear', 
                position: 'bottom',
                title: { display: true, text: 'Panjang String (n)' }
            },
            y: { 
                beginAtZero: true,
                title: { display: true, text: 'Waktu (ms)' } 
            }
        }
    }
});

async function runIterative() {
    const str = document.getElementById('inputString').value;
    const outputElement = document.getElementById('iterativeOutput');
    // Pastikan ID ini sama dengan yang ada di main.html
    const timeElement = document.getElementById('iterativeTime'); 
    outputElement.textContent = "Memproses...";

    try {
       const response = await fetch(
            `http://localhost:8080/proses?text=${encodeURIComponent(str)}&metode=iteratif`
        );
        const data = await response.json();
        outputElement.textContent = data.result;
        timeElement.textContent = data.executionTime.toFixed(4);
        iterativeTime = parseFloat(data.executionTime);
        
        updateChart();
        updateLineChart(str.length, iterativeTime, 'iterasi');
    } catch (error) {
        outputElement.textContent = "Error Server";
    }
}

async function runRecursive() {
    const str = document.getElementById('inputString').value;
    const outputElement = document.getElementById('recursiveOutput');
    const timeElement = document.getElementById('recursiveTime');
    outputElement.textContent = "Memproses...";
    
    try {
        const response = await fetch(
            `http://localhost:8080/proses?text=${encodeURIComponent(str)}&metode=rekursi`
        );
        const data = await response.json();
        outputElement.textContent = data.result;
        timeElement.textContent = data.executionTime.toFixed(4);
        recursiveTime  = parseFloat(data.executionTime); 
        
        updateChart(); 
        updateLineChart(str.length, recursiveTime, 'rekursi');
    } catch (error) {
        outputElement.textContent = "Error Server";
    }
}





function updateLineChart(n, time, method) {
    const datasetIndex = (method === 'iterasi') ? 0 : 1;
    
    // Gunakan parseFloat untuk akurasi nilai
    complexityChart.data.datasets[datasetIndex].data.push({ 
        x: n, 
        y: parseFloat(time) 
    });

    // Urutkan berdasarkan n agar garis tidak berantakan
    complexityChart.data.datasets[datasetIndex].data.sort((a, b) => a.x - b.x);
    complexityChart.update('none'); // Update tanpa animasi agar ringan
}

function updateChart() {
    chart.data.datasets[0].data = [iterativeTime, recursiveTime];
    chart.update();
}

function reset() {
    document.getElementById('inputString').value = 'Hello World';
    document.getElementById('iterativeOutput').textContent = '-';
    document.getElementById('recursiveOutput').textContent = '-';
    iterativeTime = 0;
    recursiveTime = 0;
    chart.data.datasets[0].data = [0, 0];
    chart.update();
    
    
    complexityChart.data.datasets[0].data = [];
    complexityChart.data.datasets[1].data = [];
    complexityChart.update();
}
