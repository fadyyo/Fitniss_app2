// ============================================
// THEME MANAGEMENT
// ============================================

function injectDeleteBtnStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .delete-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid #ef4444;
            background: transparent;
            color: #ef4444;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            margin-left: 12px;
            padding: 0;
            font-weight: bold;
            flex-shrink: 0;
        }
        .delete-btn:hover {
            background: #fef2f2;
            transform: scale(1.1);
        }
        .delete-btn.confirming {
            background: #ef4444;
            color: white;
            border-color: #ef4444;
            animation: pulse-red 1.5s infinite;
        }
        .delete-btn span {
            font-size: 0.9rem;
        }
        @keyframes pulse-red {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .dark-mode .delete-btn:hover {
            background: rgba(239, 68, 68, 0.1);
        }
    `;
    document.head.appendChild(style);
}

function initTheme() {
    injectDeleteBtnStyles();
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const t = document.getElementById('themeToggle');
        if (t) t.innerHTML = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        const t = document.getElementById('themeToggle');
        if (t) t.innerHTML = '🌙';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const t = document.getElementById('themeToggle');
    if (t) t.innerHTML = isDark ? '☀️' : '🌙';
}

// ============================================
// AUTH MANAGEMENT
// ============================================

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            loginUser(username);
        } else {
            showNotification('❌ Invalid username or password. Please sign up first.', 'error');
        }
    }
}

function handleSignUp(e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    const password = document.getElementById('newPassword').value.trim();

    if (username && email && password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
            showNotification('⚠️ Username already exists!', 'warning');
            return;
        }
        users.push({ username, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        showNotification('✅ Account created! Please login.', 'success');
        showLoginPage();
    }
}

function handleGoogleAuth() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6); display: flex; align-items: center;
        justify-content: center; z-index: 9999; font-family: 'Inter', sans-serif;
        backdrop-filter: blur(4px);
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white; padding: 32px; border-radius: 16px; width: 360px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;
    `;
    
    const accounts = [
        { name: 'Ahmed Hassan', email: 'ahmed@gmail.com' },
        { name: 'Work Account', email: 'work@company.com' }
    ];
    
    content.innerHTML = `
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="40" style="margin-bottom: 15px;">
        <h3 style="margin-bottom: 10px; color: #333;">Choose an account</h3>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 20px;">to continue to Sphinx Fitness</p>
        <div id="google-accounts-list"></div>
        <button id="closeGoogleModal" style="margin-top: 20px; background: none; border: none; color: #666; cursor: pointer; font-size: 0.9rem;">Cancel</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const list = content.querySelector('#google-accounts-list');
    accounts.forEach(acc => {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex; align-items: center; padding: 12px; border: 1px solid #eee;
            border-radius: 10px; margin-bottom: 10px; cursor: pointer; text-align: left;
            transition: background 0.2s;
        `;
        item.onmouseover = () => item.style.background = '#f8f9fa';
        item.onmouseout = () => item.style.background = 'white';
        item.onclick = () => {
            document.body.removeChild(modal);
            loginUser(acc.name);
        };
        item.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#4285f4,#34a853); color: white; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; font-size: 1rem; flex-shrink: 0;">
                ${acc.name[0]}
            </div>
            <div>
                <div style="font-weight: 600; font-size: 0.9rem; color: #333;">${acc.name}</div>
                <div style="font-size: 0.8rem; color: #666;">${acc.email}</div>
            </div>
        `;
        list.appendChild(item);
    });
    
    document.getElementById('closeGoogleModal').onclick = () => document.body.removeChild(modal);
}

function loginUser(username, isReturning = false) {
    localStorage.setItem('currentUser', username);
    const greetingElement = document.getElementById('userGreeting');
    if (greetingElement) {
        const greetingText = isReturning ? "Welcome back" : "Hello";
        greetingElement.textContent = `${greetingText}, ${username}! 👋`;
    }
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    initTheme();
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    document.getElementById('mainApp').classList.add('hidden');
    const results = document.getElementById('results');
    if (results) results.classList.add('hidden');
    const welcome = document.getElementById('welcomeDashboard');
    if (welcome) welcome.classList.remove('hidden');
    const statsCard = document.getElementById('statsCard');
    if (statsCard) statsCard.classList.add('hidden');
    document.getElementById('authSection').classList.remove('hidden');
    showLoginPage();
}

function showSignUpPage() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('signUpPage').classList.remove('hidden');
}

function showLoginPage() {
    document.getElementById('signUpPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
}

// ============================================
// CORE LOGIC & DATA GENERATION
// ============================================

let currentDailyCalories = 0;
let currentFoodPlan = [];
let currentWorkoutPlan = [];
let currentFitnessLevel = 'beginner';
let deleteClicks = {}; // To track clicks for deleting items

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getUniqueRandomItems(array, count) {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
}

function generateSingleMeal(mealName, targetRatio) {
    let category = mealName.toLowerCase();
    if (!FOODS[category]) category = 'snacks';
    
    // Pick 4 unique random items from the specific meal category
    const items = getUniqueRandomItems(FOODS[category], 3);
    
    return {
        name: mealName,
        ratio: targetRatio,
        actualCalories: items.reduce((sum, item) => sum + item.kcal, 0),
        items: items
    };
}

function generateFullFoodPlan() {
    const mealConfigs = [
        { name: 'Breakfast', ratio: 0.25 },
        { name: 'Lunch', ratio: 0.40 },
        { name: 'Dinner', ratio: 0.35 }
    ];
    currentFoodPlan = mealConfigs.map(config => generateSingleMeal(config.name, config.ratio));
    renderFoodPlan();
}

function regenerateIndividualMeal(index) {
    const meal = currentFoodPlan[index];
    currentFoodPlan[index] = generateSingleMeal(meal.name, meal.ratio);
    renderFoodPlan();
}

// Remove a specific item from a meal
function removeItemFromMeal(mealIndex, itemIndex) {
    if (mealIndex < 0 || mealIndex >= currentFoodPlan.length) return;
    const meal = currentFoodPlan[mealIndex];
    if (itemIndex < 0 || itemIndex >= meal.items.length) return;
    
    const removedItem = meal.items[itemIndex];
    meal.items.splice(itemIndex, 1);
    meal.actualCalories = meal.items.reduce((sum, item) => sum + item.kcal, 0);
    
    renderFoodPlan();
    if (typeof renderMacrosDonut === 'function') renderMacrosDonut();
    showNotification(`✕ ${removedItem.name} removed from ${meal.name}`, 'info');
}

// Remove an entire meal
function removeMeal(mealIndex) {
    if (mealIndex < 0 || mealIndex >= currentFoodPlan.length) return;
    const mealName = currentFoodPlan[mealIndex].name;
    currentFoodPlan.splice(mealIndex, 1);
    renderFoodPlan();
    if (typeof renderMacrosDonut === 'function') renderMacrosDonut();
    showNotification(`🗑️ ${mealName} removed from your plan`, 'info');
}

// Open modal to add items to a specific meal
function openAddItemsModal(mealIndex) {
    if (mealIndex < 0 || mealIndex >= currentFoodPlan.length) return;
    const meal = currentFoodPlan[mealIndex];
    
    // Store the current meal index for use in the modal
    window.__addItemsMealIndex = mealIndex;
    
    // Open the meal builder modal
    const modal = document.getElementById('builderModal');
    if (!modal) return;
    
    // Clear previous selections
    __builderSelected = [];
    __builderCategory = 'protein';
    
    // Set a flag to indicate we're adding to an existing meal
    window.__addItemsMode = true;
    window.__addItemsMealName = meal.name;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    if (typeof renderMealBuilder === 'function') {
        renderMealBuilder();
    }
}

function generateWorkoutPlan(fitnessLevel) {
    let level = (fitnessLevel === 'Normal Weight' || fitnessLevel === 'Underweight') ? 'intermediate' : 'beginner';
    const goal = document.getElementById('goal')?.value;
    if (fitnessLevel === 'Normal Weight' && goal === 'muscle_gain') level = 'advanced';

    const available = WORKOUTS[level];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    let selected = [];
    let pool = [...available];
    for (let i = 0; i < 5; i++) {
        if (pool.length === 0) pool = [...available];
        const idx = Math.floor(Math.random() * pool.length);
        selected.push({ day: days[i], ...pool.splice(idx, 1)[0] });
    }
    currentWorkoutPlan = selected;
    renderWorkoutPlan();
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

const MEAL_ICONS = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snacks: '🍎' };

function renderFoodPlan() {
    const container = document.getElementById('foodPlan');
    if (!container) return;

    container.innerHTML = currentFoodPlan.map((meal, index) => {
        const totalProtein = meal.items.reduce((s, i) => s + (i.protein || 0), 0);
        const totalCarbs   = meal.items.reduce((s, i) => s + (i.carbs || 0), 0);
        const totalFat     = meal.items.reduce((s, i) => s + (i.fat || 0), 0);
        const mealIcon = MEAL_ICONS[meal.name] || '🍽️';

        return `
        <div class="meal-card" ondblclick="regenerateIndividualMeal(${index})" title="Double-click to regenerate this meal" role="listitem">
            <div class="meal-card-accent"></div>
            <div class="meal-header">
                <span class="meal-name">
                    ${mealIcon} ${meal.name}
                    <span class="meal-badge">${meal.items.length} items</span>
                </span>
                <div style="display:flex;gap:8px;align-items:center;">
                    <span class="meal-calories">${meal.actualCalories} kcal</span>
                    <button onclick="addToFavorites('${meal.name}', ${JSON.stringify(meal.items).replace(/"/g, '&quot;')})"
                        class="btn btn-outline" style="width:auto;padding:4px 8px;font-size:0.85rem;height:auto;" title="Add to favorites">⭐</button>
                </div>
            </div>
            <ul class="meal-items">
                ${meal.items.map((item, itemIdx) => `
                    <li class="meal-item">
                        <span class="food-emoji">${item.emoji}</span>
                        <div class="food-info">
                            <span class="food-name">${item.name}</span>
                            <div class="food-macros">
                                <span class="macro-pill protein">P: ${item.protein}g</span>
                                <span class="macro-pill carbs">C: ${item.carbs}g</span>
                                <span class="macro-pill fat">F: ${item.fat}g</span>
                            </div>
                        </div>
                        <span class="food-weight">${item.weight || '100g'}</span>
                        <button onclick="removeItemFromMeal(${index}, ${itemIdx})" class="delete-btn" title="Click 3 times to remove">✕</button>
                    </li>
                `).join('')}
            </ul>
            <div class="meal-total-row">
                <div class="meal-total-item">
                    <span class="total-val">${totalProtein}g</span>
                    <span class="total-lbl">Protein</span>
                </div>
                <div class="meal-total-item">
                    <span class="total-val">${totalCarbs}g</span>
                    <span class="total-lbl">Carbs</span>
                </div>
                <div class="meal-total-item">
                    <span class="total-val">${totalFat}g</span>
                    <span class="total-lbl">Fat</span>
                </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">
                <button onclick="openAddItemsModal(${index})" class="btn btn-primary" style="width:auto;padding:8px 12px;font-size:0.85rem;flex:1;" title="Add items to this meal">➕ Add Item</button>
                <button onclick="removeMeal(${index})" class="btn btn-outline" style="width:auto;padding:8px 12px;font-size:0.85rem;" title="Remove this meal">🗑️ Remove Meal</button>
            </div>
        </div>
        `;
    }).join('');
    calculateTotalCalories();
}

function renderWorkoutPlan() {
    const container = document.getElementById('workoutPlan');
    if (!container) return;
    container.innerHTML = currentWorkoutPlan.map((workout, index) => `
        <div class="workout-card" role="listitem">
            <div class="workout-header">
                <div style="cursor: pointer;" onclick="openExerciseModalFromPlan(${index})">
                    <span class="workout-emoji">${workout.emoji}</span>
                    <span class="workout-name"> ${workout.name}</span>
                </div>
                <span style="font-size: 0.9rem; color: var(--light-text);">${workout.day}</span>
            </div>
            <div class="workout-details">
                <div class="detail"><span class="detail-label">Duration</span><span class="detail-value">${workout.duration} min</span></div>
                <div class="detail"><span class="detail-label">Intensity</span><span class="detail-value">${workout.intensity}</span></div>
                <div class="detail"><span class="detail-label">Calories</span><span class="detail-value">${workout.calories}</span></div>
            </div>
            <p class="workout-description">${workout.description}</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button onclick="openExerciseModalFromPlan(${index})" class="btn btn-primary" style="width: auto; flex: 1; padding: 8px; font-size: 0.9rem;">👆 View Details</button>
                <button onclick="logWorkoutCompletion('${workout.name}', ${workout.duration})" class="btn btn-outline" style="width: auto; padding: 8px 12px; font-size: 0.9rem;" title="Mark as completed">✅ Done</button>
            </div>
        </div>
    `).join('');
    updateWorkoutStatsDisplay();
}

// ============================================
// SEARCH LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('workoutSearch');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) { searchResults.classList.add('hidden'); return; }
            const allWorkouts = [...WORKOUTS.beginner, ...WORKOUTS.intermediate, ...WORKOUTS.advanced];
            const filtered = allWorkouts.filter(w =>
                w.name.toLowerCase().includes(query) ||
                w.description.toLowerCase().includes(query) ||
                w.exercises.some(ex => ex.name.toLowerCase().includes(query) || ex.muscles.toLowerCase().includes(query))
            );
            if (filtered.length > 0) {
                searchResults.innerHTML = filtered.map(w => `
                    <div class="search-item" onclick="openExerciseModalFromData('${w.name}')">
                        <span>${w.emoji}</span>
                        <div>
                            <div style="font-weight: bold;">${w.name}</div>
                            <div style="font-size: 0.8rem; color: var(--light-text);">${w.intensity} Intensity</div>
                        </div>
                    </div>
                `).join('');
                searchResults.classList.remove('hidden');
            } else {
                searchResults.innerHTML = '<div class="search-item">No exercises found</div>';
                searchResults.classList.remove('hidden');
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }
});

// ============================================
// TIMER LOGIC
// ============================================

let audioContext;
let oscillator;
let gainNode;

function playTimerEndSound() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    for (let i = 0; i < 60; i++) {
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + i + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i + 0.5);
    }
    oscillator.start(audioContext.currentTime);
}

function stopTimerEndSound() {
    if (oscillator) { oscillator.stop(); oscillator.disconnect(); }
    if (audioContext) { audioContext.close(); }
}

let timerInterval;
let timeLeft = 0;

function getTimerDisplay() { return document.querySelector('.timer-display'); }
function getStartBtn() { return document.getElementById('startTimer'); }

function updateTimerDisplay() {
    const d = getTimerDisplay();
    if (!d) return;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    d.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function setTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    updateTimerDisplay();
    const btn = getStartBtn();
    if (btn) btn.textContent = 'Start';
}

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startTimer');
    const resetBtn = document.getElementById('resetTimer');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
                startBtn.textContent = 'Start';
            } else {
                if (timeLeft <= 0) return;
                startBtn.textContent = 'Pause';
                timerInterval = setInterval(() => {
                    timeLeft--;
                    updateTimerDisplay();
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                        startBtn.textContent = 'Start';
                        playTimerEndSound();
                        setTimeout(() => { alert('⏰ Time is up! Get back to work!'); stopTimerEndSound(); }, 100);
                    }
                }, 1000);
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = null;
            timeLeft = 0;
            updateTimerDisplay();
            const btn = getStartBtn();
            if (btn) btn.textContent = 'Start';
        });
    }
});

// ============================================
// MODAL LOGIC
// ============================================

function openExerciseModalFromPlan(index) {
    openExerciseModal(currentWorkoutPlan[index]);
}

function openExerciseModalFromData(workoutName) {
    const allWorkouts = [...WORKOUTS.beginner, ...WORKOUTS.intermediate, ...WORKOUTS.advanced];
    const workout = allWorkouts.find(w => w.name === workoutName);
    if (workout) {
        openExerciseModal(workout);
        const sr = document.getElementById('searchResults');
        const si = document.getElementById('workoutSearch');
        if (sr) sr.classList.add('hidden');
        if (si) si.value = '';
    }
}

function openExerciseModal(workout) {
    const modal = document.getElementById('exerciseModal');
    const modalBody = document.getElementById('modalBody');
    
    let exercisesHtml = '';
    if (workout.exercises && workout.exercises.length > 0) {
        exercisesHtml = `
            <ul class="sub-exercise-list">
                ${workout.exercises.map(ex => `
                    <li class="sub-exercise-item">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <span class="sub-exercise-name">${ex.name}</span>
                            ${ex.sets ? `<span class="food-weight" style="margin-left: 0;">${ex.sets} Sets x ${ex.reps} Reps</span>` : ''}
                        </div>
                        <span class="sub-exercise-desc">${ex.desc}</span>
                        <span class="sub-exercise-muscles">Target: ${ex.muscles}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    } else {
        exercisesHtml = '<p>No specific sub-exercises listed for this workout yet.</p>';
    }

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-title">
                <span>${workout.emoji}</span>
                <span>${workout.name} Details</span>
            </div>
            <p style="color: var(--light-text);">${workout.description}</p>
        </div>
        <h3>Daily Exercises:</h3>
        ${exercisesHtml}
        <a href="${workout.videoUrl || '#'}" target="_blank" class="video-btn">
            🎬 Watch Training Videos
        </a>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    resetTimerLogic();
}

function resetTimerLogic() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 0;
    updateTimerDisplay();
    const btn = getStartBtn();
    if (btn) btn.textContent = 'Start';
}

function closeExerciseModal() {
    const modal = document.getElementById('exerciseModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    clearInterval(timerInterval);
}

// ============================================
// UI INTERACTION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const planForm = document.getElementById('planForm');
    if (planForm) {
        planForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const age = parseFloat(document.getElementById('age').value);
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const goal = document.getElementById('goal').value;

            if (!age || !weight || !height || !goal) return;

            const bmi = (weight / ((height/100)**2)).toFixed(1);
            const bmr = 10 * weight + 6.25 * height - 5 * age - 80;
            const baseCalories = bmr * 1.2;
            currentDailyCalories = Math.round(goal === 'weight_loss' ? baseCalories * 0.85 : goal === 'muscle_gain' ? baseCalories * 1.15 : baseCalories);
            
            const fitnessLevel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal Weight' : bmi < 30 ? 'Overweight' : 'Obese';
            currentFitnessLevel = fitnessLevel;

            document.getElementById('bmiValue').textContent = bmi;
            document.getElementById('caloriesValue').textContent = currentDailyCalories + ' kcal';
            document.getElementById('levelValue').textContent = fitnessLevel;

            generateFullFoodPlan();
            generateWorkoutPlan(fitnessLevel);

            document.getElementById('statsCard').classList.remove('hidden');
            document.getElementById('welcomeDashboard').classList.add('hidden');
            document.getElementById('results').classList.remove('hidden');
            setTimeout(() => document.getElementById('results').scrollIntoView({ behavior: 'smooth' }), 100);
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const signUpForm = document.getElementById('signUpForm');
    if (signUpForm) signUpForm.addEventListener('submit', handleSignUp);

    const showSignUp = document.getElementById('showSignUp');
    if (showSignUp) showSignUp.addEventListener('click', (e) => { e.preventDefault(); showSignUpPage(); });

    const showLogin = document.getElementById('showLogin');
    if (showLogin) showLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginPage(); });

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const regenWorkout = document.getElementById('regenerateWorkoutBtn');
    if (regenWorkout) regenWorkout.addEventListener('click', () => generateWorkoutPlan(currentFitnessLevel));

    const regenFood = document.getElementById('regenerateFoodBtn');
    if (regenFood) regenFood.addEventListener('click', () => generateFullFoodPlan());

    const closeModal = document.querySelector('.close-modal');
    if (closeModal) closeModal.addEventListener('click', closeExerciseModal);

    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('exerciseModal')) closeExerciseModal();
    });

    // About Us button
    const aboutUsBtn = document.getElementById('aboutUsBtn');
    if (aboutUsBtn) {
        aboutUsBtn.addEventListener('click', () => {
            const aboutPage = document.getElementById('aboutUsPage');
            const mainContent = document.getElementById('mainContent');
            if (aboutPage && mainContent) {
                aboutPage.classList.remove('hidden');
                mainContent.classList.add('hidden');
            }
        });
    }

    const backFromAbout = document.getElementById('backFromAbout');
    if (backFromAbout) {
        backFromAbout.addEventListener('click', () => {
            document.getElementById('aboutUsPage').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('hidden');
        });
    }

    // Init user session
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) loginUser(currentUser, true);
    else {
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }
});

function switchTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    if (event) event.currentTarget.classList.add('active');
}

// ============================================
// WATER INTAKE TRACKER
// ============================================

let dailyWaterIntake = 0;
const WATER_GOAL = 8;

function initWaterTracker() {
    const today = new Date().toDateString();
    const savedData = JSON.parse(localStorage.getItem('waterTrackerData') || '{}');
    if (savedData.date !== today) {
        dailyWaterIntake = 0;
        localStorage.setItem('waterTrackerData', JSON.stringify({ date: today, cups: 0 }));
    } else {
        dailyWaterIntake = savedData.cups || 0;
    }
    updateWaterDisplay();
}

function addWaterCup() {
    if (dailyWaterIntake < WATER_GOAL) {
        dailyWaterIntake++;
        const today = new Date().toDateString();
        localStorage.setItem('waterTrackerData', JSON.stringify({ date: today, cups: dailyWaterIntake }));
        updateWaterDisplay();
        if (dailyWaterIntake === WATER_GOAL) {
            showNotification('🎉 Daily water goal achieved! Great job!', 'success');
        }
    }
}

function removeWaterCup() {
    if (dailyWaterIntake > 0) {
        dailyWaterIntake--;
        const today = new Date().toDateString();
        localStorage.setItem('waterTrackerData', JSON.stringify({ date: today, cups: dailyWaterIntake }));
        updateWaterDisplay();
    }
}

function updateWaterDisplay() {
    const tracker = document.getElementById('waterTracker');
    if (!tracker) return;
    tracker.classList.remove('hidden');
    const t = window.__t || (s => s);
    const cups = Array.from({ length: WATER_GOAL }, (_, i) => `
        <div class="water-cup ${i < dailyWaterIntake ? 'filled' : ''}" onclick="addWaterCup()">
            ${i < dailyWaterIntake ? '💧' : ''}
        </div>
    `).join('');

    tracker.innerHTML = `
        <div class="water-tracker">
            <h4>💧 ${t('water_title') || 'Water Intake'} · ${dailyWaterIntake}/${WATER_GOAL} cups</h4>
            <div class="water-cups">${cups}</div>
            <div style="display:flex;gap:8px;margin-top:8px;">
                <button onclick="addWaterCup()" class="btn btn-primary" style="width:auto;flex:1;padding:8px;font-size:0.85rem;">+ Add Cup</button>
                <button onclick="removeWaterCup()" class="btn btn-outline" style="width:auto;padding:8px 12px;font-size:0.85rem;">− Remove</button>
            </div>
        </div>
    `;
}

// ============================================
// CALORIE PROGRESS
// ============================================

function calculateTotalCalories() {
    const totalConsumed = currentFoodPlan.reduce((sum, meal) => sum + meal.actualCalories, 0);
    const progressCard = document.getElementById('calorieProgressBar');
    if (!progressCard) return;

    const t = window.__t || (s => s);
    const pct = Math.min(100, Math.round((totalConsumed / (currentDailyCalories || 1)) * 100));
    const color = pct < 70 ? 'var(--primary)' : pct < 90 ? 'var(--secondary)' : pct < 110 ? 'var(--accent)' : 'var(--danger)';
    
    // Determine status text based on percentage
    let statusText = '';
    if (pct < 70) statusText = 'Keep going! 💪';
    else if (pct < 90) statusText = 'Almost there! 🎯';
    else if (pct < 110) statusText = 'Perfect balance! ✨';
    else statusText = 'You\'ve exceeded your goal';

    progressCard.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div>
                <h3 style="font-size:1rem;margin-bottom:4px;">🎯 ${t('calorie_progress') || 'Daily Calorie Progress'}</h3>
                <p style="font-size:0.8rem;color:var(--light-text);margin:0;">${t('calorie_progress_desc') || 'Tracks your daily calorie intake against your personalized goal. Aim to stay within your target range for optimal results.'}</p>
            </div>
            <span style="font-weight:700;color:${color};font-size:1.1rem;">${totalConsumed} / ${currentDailyCalories} kcal</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%;background:${color};"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:var(--light-text);margin-top:6px;">
            <div>
                <span>${pct}% of daily goal</span>
                <span style="margin-left:12px;">${Math.max(0, currentDailyCalories - totalConsumed)} kcal remaining</span>
            </div>
            <span style="color:${color};font-weight:600;">${statusText}</span>
        </div>
    `;
}

// ============================================
// FAVORITES
// ============================================

let favorites = [];

function loadFavorites() {
    const key = `favorites_${localStorage.getItem('currentUser') || 'guest'}`;
    favorites = JSON.parse(localStorage.getItem(key) || '[]');
}

function saveFavorites() {
    const key = `favorites_${localStorage.getItem('currentUser') || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(favorites));
}

function addToFavorites(mealName, items) {
    loadFavorites();
    if (favorites.find(f => f.name === mealName)) {
        showNotification('⚠️ Already in favorites!', 'warning');
        return;
    }
    favorites.push({ name: mealName, items });
    saveFavorites();
    showNotification('⭐ Added to favorites!', 'success');
    updateFavoritesDisplay();
}

// Add selected items from builder to an existing meal
function addSelectedItemsToMeal() {
    if (!window.__addItemsMode || window.__addItemsMealIndex === undefined) return;
    if (__builderSelected.length === 0) {
        showNotification('⚠️ Select at least one item to add', 'warning');
        return;
    }
    
    const mealIndex = window.__addItemsMealIndex;
    const meal = currentFoodPlan[mealIndex];
    if (!meal) return;
    
    // Add selected items to the meal
    meal.items.push(...__builderSelected);
    meal.actualCalories = meal.items.reduce((sum, item) => sum + item.kcal, 0);
    
    // Reset the builder
    __builderSelected = [];
    __builderCategory = 'protein';
    window.__addItemsMode = false;
    window.__addItemsMealIndex = undefined;
    window.__addItemsMealName = undefined;
    
    // Close modal and update display
    const modal = document.getElementById('builderModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
    
    renderFoodPlan();
    if (typeof renderMacrosDonut === 'function') renderMacrosDonut();
    showNotification(`✅ Items added to ${meal.name}!`, 'success');
}

function removeFavorite(index) {
    loadFavorites();
    favorites.splice(index, 1);
    saveFavorites();
    updateFavoritesDisplay();
}

function updateFavoritesDisplay() {
    loadFavorites();
    const section = document.getElementById('featuredFavorites');
    const list = document.getElementById('favoritesList');
    if (!section || !list) return;

    if (favorites.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    list.innerHTML = favorites.map((fav, i) => `
        <div class="fav-card" onclick="loadFavorite(${i})">
            <span class="meal-name">🍽️ ${fav.name}</span>
            <button class="remove-btn" onclick="event.stopPropagation(); removeFavorite(${i})" title="Remove">×</button>
        </div>
    `).join('');
}

function loadFavorite(index) {
    loadFavorites();
    const fav = favorites[index];
    if (!fav) return;
    
    // Check if meal already exists to avoid duplicates in current plan
    if (currentFoodPlan.find(m => m.name === fav.name)) {
        showNotification('⚠️ This meal is already in your plan!', 'warning');
        return;
    }

    currentFoodPlan.push({
        name: fav.name,
        ratio: 0,
        actualCalories: fav.items.reduce((s, i) => s + i.kcal, 0),
        items: fav.items
    });
    renderFoodPlan();
    calculateTotalCalories();
    if (typeof renderMacrosDonut === 'function') renderMacrosDonut();
    showNotification('✅ Favorite meal loaded!', 'success');
}

// ============================================
// WORKOUT STATS
// ============================================

let workoutHistory = [];

function loadWorkoutHistory() {
    const key = `workoutHistory_${localStorage.getItem('currentUser') || 'guest'}`;
    workoutHistory = JSON.parse(localStorage.getItem(key) || '[]');
}

function saveWorkoutHistory() {
    const key = `workoutHistory_${localStorage.getItem('currentUser') || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(workoutHistory));
}

function logWorkoutCompletion(workoutName, duration) {
    loadWorkoutHistory();
    workoutHistory.push({
        name: workoutName,
        duration,
        date: new Date().toLocaleDateString()
    });
    saveWorkoutHistory();
    showNotification(`✅ ${workoutName} completed! 💪`, 'success');
    updateWorkoutStatsDisplay();
}

function updateWorkoutStatsDisplay() {
    loadWorkoutHistory();
    const statsCard = document.getElementById('workoutStats');
    if (!statsCard) return;

    if (workoutHistory.length === 0) {
        statsCard.classList.add('hidden');
        return;
    }
    statsCard.classList.remove('hidden');

    const totalWorkouts = workoutHistory.length;
    const totalMinutes = workoutHistory.reduce((s, w) => s + (w.duration || 0), 0);
    const lastWorkout = workoutHistory[workoutHistory.length - 1];

    statsCard.innerHTML = `
        <h3>🏋️ Workout Stats</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-label">Total Sessions</span>
                <span class="stat-value">${totalWorkouts}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Minutes</span>
                <span class="stat-value">${totalMinutes}</span>
            </div>
        </div>
        <div style="margin-top:12px;font-size:0.85rem;color:var(--light-text);">
            Last: ${lastWorkout.name} · ${lastWorkout.date}
        </div>
    `;
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'info') {
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());

    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = '0'; n.style.transform = 'translateX(-100px)'; n.style.transition = 'all 0.3s'; setTimeout(() => n.remove(), 300); }, 3000);
}

// ============================================
// DAILY QUOTE
// ============================================

const QUOTES = [
    '"The only bad workout is the one that didn\'t happen."',
    '"Take care of your body. It\'s the only place you have to live."',
    '"Strength does not come from the body. It comes from the will."',
    '"Your health is an investment, not an expense."',
    '"Push yourself because no one else is going to do it for you."',
    '"The harder you work, the better you get."',
    '"Success starts with self-discipline."',
    '"Champions aren\'t made in gyms. They are made from stuff inside them."',
];

function setDailyQuote() {
    const el = document.getElementById('dailyQuote');
    if (el) {
        const idx = new Date().getDate() % QUOTES.length;
        el.textContent = QUOTES[idx];
    }
}

document.addEventListener('DOMContentLoaded', setDailyQuote);

/* ==============================================
   NEW NAVIGATION LOGIC (DROPDOWN)
   ============================================== */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (menuToggleBtn && dropdownMenu) {
        // Toggle menu on button click
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && !menuToggleBtn.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });

        // Close menu when clicking any item inside it
        dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                dropdownMenu.classList.add('hidden');
            });
        });
    }
});
