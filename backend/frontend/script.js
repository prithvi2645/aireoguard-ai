// Dropdown Logic
function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.btn-orange')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}




// -- Existing Functional Logic (Adapted for theme) --
const form = document.getElementById('prediction-form');
const rulValue = document.getElementById('rul-value');
const rulStatus = document.getElementById('rul-status');
const healthText = document.getElementById('health-text');
const healthCanvas = document.getElementById('healthGauge').getContext('2d');
const demoBtn = document.getElementById('demo-btn');

// Default data
const defaultSensorData = {
    setting_1: -0.0007,
    setting_2: -0.0004,
    setting_3: 100.0,
    s_1: 518.67,
    s_2: 642.15,
    s_3: 1591.82,
    s_4: 1403.14,
    s_5: 14.62,
    s_6: 21.61,
    s_7: 554.26,
    s_8: 2388.05,
    s_9: 9055.15,
    s_10: 1.3,
    s_11: 47.28,
    s_12: 522.19,
    s_13: 2388.07,
    s_14: 8139.62,
    s_15: 8.4052,
    s_16: 0.03,
    s_17: 392,
    s_18: 2388,
    s_19: 100.0,
    s_20: 39.0,
    s_21: 23.40
};

// Initialize Gauge Chart (Strict Orange/Gray)
// Initialize Gauge Chart (Strict Orange/Gray)
let gaugeChart = new Chart(healthCanvas, {
    type: 'doughnut',
    data: {
        labels: ['Health', 'Loss'],
        datasets: [{
            data: [100, 0],
            backgroundColor: ['#ff6600', '#f5f5f5'], // Orange and Light Gray
            borderWidth: 0,
            cutout: '80%',
            circumference: 180,
            rotation: 270
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
});

async function runPrediction() {
    // Get values from form
    const formData = new FormData(form);
    const requestData = { ...defaultSensorData };

    for (let [key, value] of formData.entries()) {
        requestData[key] = parseFloat(value);
    }

    rulValue.innerText = "...";

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        const rul = result.predicted_rul.toFixed(1);
        const health = result.health_score.toFixed(1);

        rulValue.innerText = rul;
        healthText.innerText = `${health}%`;

        // Update Gauge
        gaugeChart.data.datasets[0].data = [health, 100 - health];

        // Color Logic: STRICT 3-Color Policy
        // We only have Orange, Gray, White.
        // We can use Shade difference or just Orange for everything and text distinction?
        // Let's use Orange for everything "Active", Gray for "Inactive".
        // Or: Orange = Good, Dark Gray = Bad? No, Orange is accent.
        // Let's keep the gauge Orange.

        let statusText = "OPTIMAL";
        if (health < 60) statusText = "WARNING";
        if (health < 30) statusText = "CRITICAL";

        console.log("Status Updated:", statusText); // Debug

        // Gauge always Orange (brand color)
        gaugeChart.update();

        // Update status text
        if (rulStatus) {
            rulStatus.innerText = statusText;
            rulStatus.style.color = "#ff6600";
            rulStatus.style.fontWeight = "bold";
            rulStatus.style.textShadow = "0 0 10px rgba(255, 102, 0, 0.5)";
        } else {
            console.error("rulStatus element not found!");
        }

    } catch (error) {
        console.error('Error:', error);
        if (rulValue) rulValue.innerText = "Error";
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await runPrediction();
});

// Demo Mode Logic
if (demoBtn) {
    demoBtn.addEventListener('click', () => {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            let baseVal = parseFloat(input.defaultValue);
            let randomFactor = (Math.random() * 0.1) - 0.05;
            if (input.name === 's_14' || input.name === 's_11') randomFactor += 0.02;
            let newVal = baseVal * (1 + randomFactor);
            input.value = newVal.toFixed(2);
        });
        runPrediction();
    });
}
