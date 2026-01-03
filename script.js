document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loanAmountInput = document.getElementById('loanAmount');
    const loanAmountRange = document.getElementById('loanAmountRange');
    const interestRateInput = document.getElementById('interestRate');
    const interestRateRange = document.getElementById('interestRateRange');
    const loanTenureInput = document.getElementById('loanTenure');
    const loanTenureRange = document.getElementById('loanTenureRange');
    
    const emiResult = document.getElementById('emiResult');
    const principalDisplay = document.getElementById('principalDisplay');
    const totalInterest = document.getElementById('totalInterest');
    const totalPayment = document.getElementById('totalPayment');

    // Chart Instance
    let emiChart = null;

    // Helper to format currency
    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    };

    // Initialize Chart
    const initChart = (principal, interest) => {
        const ctx = document.getElementById('emiChart').getContext('2d');
        
        if (emiChart) {
            emiChart.destroy();
        }

        emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal Amount', 'Total Interest'],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: [
                        '#D4AF37', // Gold
                        '#333333'  // Dark Gray
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#E5E5E5',
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += formatCurrency(context.parsed);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    };

    // Calculate EMI
    const calculateEMI = () => {
        const principal = parseFloat(loanAmountInput.value);
        const rate = parseFloat(interestRateInput.value);
        const tenureYears = parseFloat(loanTenureInput.value);

        if (!principal || !rate || !tenureYears) return;

        const monthlyRate = rate / 12 / 100;
        const tenureMonths = tenureYears * 12;

        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

        const totalPay = emi * tenureMonths;
        const totalInt = totalPay - principal;

        // Update UI
        emiResult.textContent = formatCurrency(emi);
        principalDisplay.textContent = formatCurrency(principal);
        totalInterest.textContent = formatCurrency(totalInt);
        totalPayment.textContent = formatCurrency(totalPay);

        // Update Chart
        if (emiChart) {
            emiChart.data.datasets[0].data = [principal, totalInt];
            emiChart.update();
        } else {
            initChart(principal, totalInt);
        }
    };

    // Sync inputs
    const syncInputs = (source, target) => {
        target.value = source.value;
        calculateEMI();
    };

    // Event Listeners
    loanAmountInput.addEventListener('input', () => syncInputs(loanAmountInput, loanAmountRange));
    loanAmountRange.addEventListener('input', () => syncInputs(loanAmountRange, loanAmountInput));

    interestRateInput.addEventListener('input', () => syncInputs(interestRateInput, interestRateRange));
    interestRateRange.addEventListener('input', () => syncInputs(interestRateRange, interestRateInput));

    loanTenureInput.addEventListener('input', () => syncInputs(loanTenureInput, loanTenureRange));
    loanTenureRange.addEventListener('input', () => syncInputs(loanTenureRange, loanTenureInput));

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Initial Calculation
    calculateEMI();
});
