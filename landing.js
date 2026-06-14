// Landing Page Logic - Charts and Navigation

// Initialize Charts on Page Load
document.addEventListener('DOMContentLoaded', () => {
    initWeightChart();
    initActivityChart();
});

// Initialize Weight Progress Chart
function initWeightChart() {
    const weightCanvas = document.getElementById('weightChart');
    if (weightCanvas) {
        const weightCtx = weightCanvas.getContext('2d');
        new Chart(weightCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                datasets: [{
                    label: 'Weight (kg)',
                    data: [85, 83, 81, 79, 78, 77],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#0ea5e9',
                    pointBorderColor: '#0ea5e9',
                    pointBorderWidth: 0,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(79, 70, 229, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                weight: '600'
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: {
                                weight: '600'
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize Activity Distribution Chart
function initActivityChart() {
    const activityCanvas = document.getElementById('activityChart');
    if (activityCanvas) {
        const activityCtx = activityCanvas.getContext('2d');
        new Chart(activityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Strength', 'Cardio', 'Yoga', 'Rest'],
                datasets: [{
                    data: [40, 30, 15, 15],
                    backgroundColor: [
                        '#4f46e5',
                        '#0ea5e9',
                        '#f59e0b',
                        '#10b981'
                    ],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            padding: 20,
                            font: {
                                weight: '600',
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header Scroll Animation
const landingNav = document.querySelector('.landing-nav');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        landingNav.classList.add('scrolled');
    } else {
        landingNav.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
}, false);
