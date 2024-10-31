function applyFilters() {
    // Lógica para aplicar los filtros
    alert("Filtros aplicados");
}

function resetFilters() {
    // Lógica para restablecer los filtros
    document.getElementById('date-start').value = "";
    document.getElementById('date-end').value = "";
    document.getElementById('predefined-dates').value = "";
    document.getElementById('dependencias').selectedIndex = -1;
    document.getElementById('tipo').selectedIndex = -1;
    document.getElementById('subtipo').selectedIndex = -1;
    alert("Filtros restablecidos");
}


// Gráfico de barras
const barCtx = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Cantidad de Detenciones',
            data: [12, 19, 3, 5, 2, 3, 7, 10, 6, 8, 9, 4],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Gráfico de torta
const pieCtx = document.getElementById('pieChart').getContext('2d');
const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Preventivo', 'Infracción', 'Hecho Ilícito'],
        datasets: [{
            label: 'Tipos de Secuestro',
            data: [40, 25, 35],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true
    }
});

