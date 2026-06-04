/* ============================================
   NEW FEATURES — Frontend only (Vanilla JS)
   - Macros donut chart
   - Weight progress chart + goal tracker
   - Streak counter
   - Workout history heatmap
   - Custom Meal Builder
   - Real PDF export (jsPDF)
   - Browser notifications
   - Arabic / English toggle (RTL)
   - Smart meal swap suggestions
   ============================================ */

// ---------- Helpers ----------
function getCurrentUserKey(suffix) {
    const u = localStorage.getItem('currentUser') || 'guest';
    return `${suffix}_${u}`;
}

function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
}

function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ============================================
// 1) MACROS DONUT CHART
// ============================================
function renderMacrosDonut() {
    const card = document.getElementById('macrosCard');
    if (!card) return;
    if (!Array.isArray(currentFoodPlan) || currentFoodPlan.length === 0) {
        card.classList.add('hidden');
        return;
    }
    card.classList.remove('hidden');

    let p = 0, c = 0, f = 0;
    currentFoodPlan.forEach(meal => {
        meal.items.forEach(it => {
            p += Number(it.protein) || 0;
            c += Number(it.carbs) || 0;
            f += Number(it.fat) || 0;
        });
    });

    const pCal = p * 4, cCal = c * 4, fCal = f * 9;
    const totalCal = pCal + cCal + fCal || 1;
    const pPct = (pCal / totalCal) * 100;
    const cPct = (cCal / totalCal) * 100;
    const fPct = (fCal / totalCal) * 100;

    const C = 2 * Math.PI * 70;
    const pLen = (pPct / 100) * C;
    const cLen = (cPct / 100) * C;
    const fLen = (fPct / 100) * C;

    const t = window.__t || (s => s);
    card.innerHTML = `
        <h3>📊 ${t('macros_title')}</h3>
        <div class="macros-card">
            <div class="donut-wrap">
                <svg viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="70" fill="none" stroke="var(--border)" stroke-width="20"/>
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#3b82f6" stroke-width="20"
                        stroke-dasharray="${pLen} ${C}" stroke-dashoffset="0"/>
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#f59e0b" stroke-width="20"
                        stroke-dasharray="${cLen} ${C}" stroke-dashoffset="${-pLen}"/>
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#10b981" stroke-width="20"
                        stroke-dasharray="${fLen} ${C}" stroke-dashoffset="${-(pLen + cLen)}"/>
                </svg>
                <div class="donut-center">
                    <span class="big">${Math.round(totalCal)}</span>
                    <span class="small">kcal</span>
                </div>
            </div>
            <div class="macro-legend">
                <div>
                    <div class="macro-row">
                        <span class="macro-dot" style="background:#3b82f6"></span>
                        <span class="label">${t('protein')}</span>
                        <span class="value">${Math.round(p)}g · ${Math.round(pPct)}%</span>
                    </div>
                    <div class="macro-bar"><div style="width:${pPct}%;background:#3b82f6"></div></div>
                </div>
                <div>
                    <div class="macro-row">
                        <span class="macro-dot" style="background:#f59e0b"></span>
                        <span class="label">${t('carbs')}</span>
                        <span class="value">${Math.round(c)}g · ${Math.round(cPct)}%</span>
                    </div>
                    <div class="macro-bar"><div style="width:${cPct}%;background:#f59e0b"></div></div>
                </div>
                <div>
                    <div class="macro-row">
                        <span class="macro-dot" style="background:#10b981"></span>
                        <span class="label">${t('fat')}</span>
                        <span class="value">${Math.round(f)}g · ${Math.round(fPct)}%</span>
                    </div>
                    <div class="macro-bar"><div style="width:${fPct}%;background:#10b981"></div></div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// 2) WEIGHT PROGRESS TRACKER + GOAL
// ============================================
function getWeightLog() {
    return loadJSON(getCurrentUserKey('weightLog'), []);
}
function saveWeightLog(log) {
    saveJSON(getCurrentUserKey('weightLog'), log);
}
function getWeightGoal() {
    return loadJSON(getCurrentUserKey('weightGoal'), null);
}
function setWeightGoal(value) {
    saveJSON(getCurrentUserKey('weightGoal'), value);
}

function logCurrentWeight() {
    const input = document.getElementById('weightLogInput');
    if (!input) return;
    const val = parseFloat(input.value);
    if (!val || val < 20 || val > 400) {
        showNotification('⚠️ ' + (window.__t ? __t('invalid_weight') : 'Enter a valid weight'), 'warning');
        return;
    }
    const log = getWeightLog();
    const today = new Date().toISOString().slice(0, 10);
    const idx = log.findIndex(e => e.date === today);
    if (idx >= 0) log[idx].weight = val;
    else log.push({ date: today, weight: val });
    log.sort((a, b) => a.date.localeCompare(b.date));
    if (log.length > 90) log.splice(0, log.length - 90);
    saveWeightLog(log);
    input.value = '';
    const mainW = document.getElementById('weight');
    if (mainW) mainW.value = val;
    showNotification('✅ ' + (window.__t ? __t('weight_logged') : 'Weight logged'), 'success');
    renderProgressChart();
}

function saveGoalWeight() {
    const input = document.getElementById('goalWeightInput');
    if (!input) return;
    const val = parseFloat(input.value);
    if (!val || val < 20 || val > 400) {
        showNotification('⚠️ Enter a valid goal weight', 'warning');
        return;
    }
    setWeightGoal(val);
    showNotification('🎯 ' + (window.__t ? __t('goal_set') : 'Goal saved!'), 'success');
    renderProgressChart();
}

function renderProgressChart() {
    const card = document.getElementById('progressTab');
    if (!card) return;
    const log = getWeightLog();
    const goal = getWeightGoal();
    const t = window.__t || (s => s);

    let chartHtml = '';
    if (log.length < 2) {
        chartHtml = `<div class="weight-empty">📈 ${t('weight_empty')}</div>`;
    } else {
        const pad = 30;
        const W = 600, H = 220;
        const weights = log.map(e => e.weight);
        const minW = Math.min(...weights, goal || Infinity) - 2;
        const maxW = Math.max(...weights, goal || -Infinity) + 2;
        const range = maxW - minW || 1;
        const stepX = (W - pad * 2) / (log.length - 1);
        const points = log.map((e, i) => {
            const x = pad + i * stepX;
            const y = pad + ((maxW - e.weight) / range) * (H - pad * 2);
            return { x, y, ...e };
        });
        const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const areaPath = path + ` L ${points[points.length - 1].x} ${H - pad} L ${points[0].x} ${H - pad} Z`;

        const goalY = goal ? pad + ((maxW - goal) / range) * (H - pad * 2) : null;

        const ticks = 4;
        let gridLines = '';
        for (let i = 0; i <= ticks; i++) {
            const y = pad + (i / ticks) * (H - pad * 2);
            const w = (maxW - (i / ticks) * range).toFixed(1);
            gridLines += `<line x1="${pad}" y1="${y}" x2="${W - pad}" y2="${y}"/>`;
            gridLines += `<text x="${pad - 5}" y="${y + 3}" text-anchor="end" class="chart-label">${w}</text>`;
        }

        chartHtml = `
            <div class="progress-chart">
                <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/>
                            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                    <g class="chart-grid">${gridLines}</g>
                    ${goalY !== null ? `<line x1="${pad}" y1="${goalY}" x2="${W - pad}" y2="${goalY}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6 4"/>
                    <text x="${W - pad}" y="${goalY - 4}" text-anchor="end" class="chart-label" style="fill:#10b981;font-weight:bold">🎯 ${goal}kg</text>` : ''}
                    <path d="${areaPath}" class="chart-area"/>
                    <path d="${path}" class="chart-line"/>
                    ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" class="chart-dot"><title>${p.date}: ${p.weight}kg</title></circle>`).join('')}
                </svg>
            </div>
        `;
    }

    let goalSection = '';
    if (goal) {
        const latest = log.length ? log[log.length - 1].weight : null;
        const start = log.length ? log[0].weight : null;
        let progressTxt = '';
        if (latest !== null && start !== null && start !== goal) {
            const total = Math.abs(start - goal);
            const done = Math.abs(start - latest);
            const pct = Math.min(100, Math.max(0, (done / total) * 100));
            const remaining = Math.abs(latest - goal).toFixed(1);
            progressTxt = `
                <div class="goal-row"><span>${t('current')}: <b>${latest}kg</b></span><span>${t('goal')}: <b>${goal}kg</b></span></div>
                <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div style="text-align:center;margin-top:6px;font-size:0.85rem;color:var(--light-text);">
                    ${remaining} kg ${t('to_goal')} · ${Math.round(pct)}% ${t('done')}
                </div>
            `;
        } else {
            progressTxt = `<div class="goal-row"><span>${t('goal')}: <b>${goal}kg</b></span><button onclick="clearGoalWeight()" class="swap-btn">${t('clear')}</button></div>`;
        }
        goalSection = `<div class="goal-tracker">${progressTxt}</div>`;
    }

    card.innerHTML = `
        <div class="tab-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
            <h2>📈 ${t('progress_title')}</h2>
        </div>
        <p style="margin-bottom:15px;font-size:0.85rem;color:var(--light-text);background:var(--border);padding:10px;border-radius:8px;">
            💡 ${t('progress_hint')}
        </p>
        ${chartHtml}
        <div class="weight-input-row">
            <input type="number" id="weightLogInput" placeholder="${t('today_weight')}" step="0.1">
            <button onclick="logCurrentWeight()" class="btn btn-primary" style="width:auto;padding:0 20px;">${t('log_btn')}</button>
        </div>
        <div style="margin-top:20px;">
            <h3 style="font-size:0.95rem;margin-bottom:10px;">🎯 ${t('goal_title')}</h3>
            <div class="weight-input-row" style="margin-top:0;">
                <input type="number" id="goalWeightInput" placeholder="${t('goal_placeholder')}" step="0.1" value="${goal || ''}">
                <button onclick="saveGoalWeight()" class="btn btn-outline" style="width:auto;padding:0 20px;">${t('save')}</button>
            </div>
            ${goalSection}
        </div>
    `;
}

function clearGoalWeight() {
    localStorage.removeItem(getCurrentUserKey('weightGoal'));
    renderProgressChart();
}

// ============================================
// 3) STREAK COUNTER
// ============================================
function calculateStreak() {
    const log = workoutHistory || [];
    if (log.length === 0) return 0;

    const dates = new Set(log.map(w => w.date));
    let streak = 0;
    let cursor = new Date();
    if (!dates.has(cursor.toLocaleDateString())) {
        cursor.setDate(cursor.getDate() - 1);
    }
    while (dates.has(cursor.toLocaleDateString())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

function renderStreakCard() {
    const card = document.getElementById('streakCard');
    if (!card) return;
    const t = window.__t || (s => s);
    const streak = calculateStreak();
    const best = loadJSON(getCurrentUserKey('bestStreak'), 0);
    if (streak > best) saveJSON(getCurrentUserKey('bestStreak'), streak);
    const newBest = Math.max(streak, best);

    if (streak === 0 && newBest === 0) {
        card.classList.add('hidden');
        return;
    }
    card.classList.remove('hidden');
    card.innerHTML = `
        <h3>🔥 ${t('streak_title')}</h3>
        <div class="streak-flex">
            <div class="streak-num">${streak}</div>
            <div class="streak-info">
                <div class="label">${streak === 1 ? t('day') : t('days')} ${t('in_a_row')}</div>
                <div class="sublabel">${t('best')}: ${newBest} ${newBest === 1 ? t('day') : t('days')}</div>
            </div>
        </div>
    `;
}

// ============================================
// 4) WORKOUT HISTORY HEATMAP
// ============================================
function renderHeatmap() {
    const card = document.getElementById('historyTab');
    if (!card) return;
    const t = window.__t || (s => s);

    const days = 28;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counts = {};
    (workoutHistory || []).forEach(w => {
        counts[w.date] = (counts[w.date] || 0) + 1;
    });

    let cells = '';
    let totalThisMonth = 0;
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString();
        const count = counts[key] || 0;
        if (count > 0) totalThisMonth++;
        let lvl = '';
        if (count === 1) lvl = 'lvl-1';
        else if (count === 2) lvl = 'lvl-2';
        else if (count === 3) lvl = 'lvl-3';
        else if (count >= 4) lvl = 'lvl-4';
        const isToday = i === 0 ? 'today' : '';
        const dayNum = d.getDate();
        cells += `<div class="heat-day ${lvl} ${isToday}" title="${key}: ${count} ${t('workouts')}">${dayNum}</div>`;
    }

    const totalAll = (workoutHistory || []).length;
    const totalDuration = (workoutHistory || []).reduce((s, w) => s + (w.duration || 0), 0);

    card.innerHTML = `
        <div class="tab-header" style="margin-bottom:20px;">
            <h2>📅 ${t('history_title')}</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">
            <div class="stat-item"><span class="stat-label">${t('active_days')}</span><span class="stat-value">${totalThisMonth}/${days}</span></div>
            <div class="stat-item"><span class="stat-label">${t('total_sessions')}</span><span class="stat-value">${totalAll}</span></div>
            <div class="stat-item"><span class="stat-label">${t('total_min')}</span><span class="stat-value">${totalDuration}</span></div>
        </div>
        <div class="heatmap-card card" style="margin:0;">
            <h3 style="text-align:center;font-size:0.95rem;">${t('last_28')}</h3>
            <div class="heatmap-grid">${cells}</div>
            <div class="heatmap-legend">
                <span>${t('less')}</span>
                <span class="swatch" style="background:var(--border)"></span>
                <span class="swatch" style="background:rgba(16,185,129,0.25)"></span>
                <span class="swatch" style="background:rgba(16,185,129,0.55)"></span>
                <span class="swatch" style="background:var(--secondary)"></span>
                <span class="swatch" style="background:linear-gradient(135deg,var(--secondary),var(--primary))"></span>
                <span>${t('more')}</span>
            </div>
            ${totalAll > 0 ? `<div style="text-align:center;margin-top:15px;">
                <button onclick="clearWorkoutHistory()" class="btn btn-outline" style="width:auto;padding:6px 14px;font-size:0.8rem;">🗑️ ${t('clear_history')}</button>
            </div>` : ''}
        </div>
    `;
}

function clearWorkoutHistory() {
    if (!confirm((window.__t ? __t('confirm_clear') : 'Clear all workout history?'))) return;
    workoutHistory = [];
    saveWorkoutHistory();
    renderHeatmap();
    renderStreakCard();
    updateWorkoutStatsDisplay();
}

// Hook into existing logWorkoutCompletion
const __originalLogWorkout = window.logWorkoutCompletion;
window.logWorkoutCompletion = function(name, dur) {
    if (typeof __originalLogWorkout === 'function') {
        __originalLogWorkout(name, dur);
    }
    renderStreakCard();
    if (document.getElementById('historyTab') && !document.getElementById('historyTab').closest('.hidden')) {
        renderHeatmap();
    }
    pushBrowserNotification('💪 Workout logged!', `${name} — keep it up!`);
};

// ============================================
// 5) CUSTOM MEAL BUILDER
// ============================================
let __builderSelected = [];
let __builderCategory = 'protein';

function openMealBuilder() {
    const modal = document.getElementById('builderModal');
    if (!modal) return;
    __builderSelected = [];
    __builderCategory = 'protein';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderMealBuilder();
}

function closeMealBuilder() {
    const modal = document.getElementById('builderModal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function setBuilderCategory(cat) {
    __builderCategory = cat;
    renderMealBuilder();
}

function addToBuilder(category, idx) {
    const item = FOODS[category][idx];
    if (item) {
        __builderSelected.push(item);
        renderMealBuilder();
    }
}

function removeFromBuilder(idx) {
    __builderSelected.splice(idx, 1);
    renderMealBuilder();
}

function renderMealBuilder() {
    const body = document.getElementById('builderBody');
    if (!body) return;
    const t = window.__t || (s => s);

    const cats = [
        { id: 'protein', label: '🥩 ' + t('protein') },
        { id: 'carbs', label: '🍚 ' + t('carbs') },
        { id: 'vegetables', label: '🥦 ' + t('vegetables') },
        { id: 'fruits', label: '🍎 ' + t('fruits') }
    ];

    const items = (FOODS[__builderCategory] || []).map((it, i) => `
        <div class="food-pick-item" onclick="addToBuilder('${__builderCategory}', ${i})">
            <span class="emoji">${it.emoji}</span>
            <div>${it.name}</div>
            <div class="kcal">${it.kcal} kcal</div>
        </div>
    `).join('');

    let totals = { kcal: 0, p: 0, c: 0, f: 0 };
    __builderSelected.forEach(it => {
        totals.kcal += it.kcal || 0;
        totals.p += it.protein || 0;
        totals.c += it.carbs || 0;
        totals.f += it.fat || 0;
    });

    const selectedHtml = __builderSelected.length === 0
        ? `<div class="builder-selected-empty">${t('builder_empty')}</div>`
        : __builderSelected.map((it, i) => `
            <span class="selected-chip">${it.emoji} ${it.name}<button onclick="removeFromBuilder(${i})">×</button></span>
        `).join('');

    // Determine if we're in "add items to meal" mode
    const isAddItemsMode = window.__addItemsMode === true;
    const mealName = window.__addItemsMealName || '';
    
    // Build action buttons based on mode
    let actionButtons = '';
    if (isAddItemsMode) {
        actionButtons = `
            <button class="btn btn-primary" onclick="addSelectedItemsToMeal()" ${__builderSelected.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>✅ ${t('add_to_meal') || 'Add to ' + mealName}</button>
            <button class="btn btn-outline" onclick="closeMealBuilder()">${t('cancel') || 'Cancel'}</button>
        `;
    } else {
        actionButtons = `
            <button class="btn btn-primary" onclick="addBuilderToFavorites()" ${__builderSelected.length === 0 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>⭐ ${t('save_favorite')}</button>
            <button class="btn btn-outline" onclick="closeMealBuilder()">${t('close')}</button>
        `;
    }

    body.innerHTML = `
        <div class="modal-header">
            <div class="modal-title"><span>🍳</span><span>${isAddItemsMode ? t('add_items_title') || 'Add Items to ' + mealName : t('builder_title')}</span></div>
            <p style="color:var(--light-text);">${isAddItemsMode ? t('add_items_desc') || 'Select items to add to your meal' : t('builder_desc')}</p>
        </div>
        <div class="builder-categories">
            ${cats.map(c => `<button class="cat-pill ${c.id === __builderCategory ? 'active' : ''}" onclick="setBuilderCategory('${c.id}')">${c.label}</button>`).join('')}
        </div>
        <div class="food-picker">${items}</div>
        <h4 style="margin-top:15px;font-size:0.95rem;">${t('builder_selected')} (${__builderSelected.length})</h4>
        <div class="builder-selected">${selectedHtml}</div>
        <div class="builder-summary">
            <div class="item"><div class="v">${Math.round(totals.kcal)}</div><div class="l">kcal</div></div>
            <div class="item"><div class="v">${Math.round(totals.p)}g</div><div class="l">${t('protein')}</div></div>
            <div class="item"><div class="v">${Math.round(totals.c)}g</div><div class="l">${t('carbs')}</div></div>
            <div class="item"><div class="v">${Math.round(totals.f)}g</div><div class="l">${t('fat')}</div></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;">
            ${actionButtons}
        </div>
    `;
}

function addBuilderToFavorites() {
    if (__builderSelected.length === 0) return;
    const mealName = prompt((window.__t ? __t('builder_name_prompt') : 'Name this meal:'), 'My Custom Meal');
    if (!mealName) return;
    addToFavorites(mealName, [...__builderSelected]);
    closeMealBuilder();
}

// ============================================
// 6) MEAL SWAP SUGGESTIONS
// ============================================
function swapFoodItem(mealIdx, itemIdx) {
    const meal = currentFoodPlan[mealIdx];
    if (!meal) return;
    const item = meal.items[itemIdx];
    if (!item) return;
    let category = null;
    for (const cat of ['protein', 'carbs', 'vegetables', 'fruits', 'breakfast', 'lunch', 'dinner', 'snacks']) {
        if ((FOODS[cat] || []).some(f => f.name === item.name)) {
            category = cat;
            break;
        }
    }
    if (!category) return;
    const pool = FOODS[category].filter(f => f.name !== item.name &&
        Math.abs(f.kcal - item.kcal) / item.kcal < 0.4);
    const final = pool.length ? pool : FOODS[category].filter(f => f.name !== item.name);
    if (final.length === 0) return;
    meal.items[itemIdx] = final[Math.floor(Math.random() * final.length)];
    meal.actualCalories = meal.items.reduce((s, x) => s + x.kcal, 0);
    renderFoodPlan();
    enhanceFoodPlanWithSwap();
}

function enhanceFoodPlanWithSwap() {
    const t = window.__t || (s => s);
    document.querySelectorAll('#foodPlan .meal-card').forEach((card, mealIdx) => {
        card.querySelectorAll('.meal-item').forEach((li, itemIdx) => {
            if (li.querySelector('.swap-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'swap-btn';
            btn.innerHTML = '🔄 ' + t('swap');
            btn.onclick = (e) => { e.stopPropagation(); swapFoodItem(mealIdx, itemIdx); };
            li.appendChild(btn);
        });
    });
}

// Hook renderFoodPlan
const __originalRenderFoodPlan = window.renderFoodPlan;
window.renderFoodPlan = function() {
    if (typeof __originalRenderFoodPlan === 'function') {
        __originalRenderFoodPlan();
    }
    enhanceFoodPlanWithSwap();
    renderMacrosDonut();
};

// ============================================
// 7) REAL PDF EXPORT (jsPDF)
// ============================================
function exportPlanAsPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        showNotification('⚠️ PDF library still loading, try again', 'warning');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const t = window.__t || (s => s);

    let y = 20;
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Sphinx Fitness — Personal Plan', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
    y += 12;

    doc.setDrawColor(220);
    doc.line(20, y, 190, y);
    y += 8;

    doc.setFontSize(13);
    doc.setTextColor(30);
    doc.text('Personal Stats', 20, y);
    y += 7;
    doc.setFontSize(10);
    const bmi = document.getElementById('bmiValue')?.textContent || '-';
    const cal = document.getElementById('caloriesValue')?.textContent || '-';
    const lvl = document.getElementById('levelValue')?.textContent || '-';
    doc.text(`BMI: ${bmi}    |    Daily Calories: ${cal}    |    Level: ${lvl}`, 20, y);
    y += 12;

    let totP = 0, totC = 0, totF = 0;
    currentFoodPlan.forEach(m => m.items.forEach(it => {
        totP += it.protein || 0; totC += it.carbs || 0; totF += it.fat || 0;
    }));
    doc.setFontSize(13);
    doc.text('Daily Macros', 20, y); y += 7;
    doc.setFontSize(10);
    doc.text(`Protein: ${Math.round(totP)}g   |   Carbs: ${Math.round(totC)}g   |   Fat: ${Math.round(totF)}g`, 20, y);
    y += 12;

    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129);
    doc.text('Nutrition Plan', 20, y); y += 7;
    doc.setTextColor(30);
    doc.setFontSize(10);
    currentFoodPlan.forEach(meal => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont(undefined, 'bold');
        doc.text(`${meal.name} — ${meal.actualCalories} kcal`, 20, y); y += 6;
        doc.setFont(undefined, 'normal');
        meal.items.forEach(item => {
            if (y > 275) { doc.addPage(); y = 20; }
            doc.text(`  • ${item.name} (${item.weight || '100g'}) — P:${item.protein}g  C:${item.carbs}g  F:${item.fat}g`, 22, y);
            y += 5;
        });
        y += 3;
    });

    if (y > 240) { doc.addPage(); y = 20; }
    y += 5;
    doc.setFontSize(13);
    doc.setTextColor(245, 158, 11);
    doc.text('Weekly Training', 20, y); y += 7;
    doc.setTextColor(30);
    doc.setFontSize(10);
    currentWorkoutPlan.forEach(w => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFont(undefined, 'bold');
        doc.text(`${w.day}: ${w.name}`, 20, y); y += 5;
        doc.setFont(undefined, 'normal');
        doc.text(`  Duration: ${w.duration} min  |  Intensity: ${w.intensity}  |  ~${w.calories} kcal`, 22, y);
        y += 5;
        const desc = doc.splitTextToSize(`  ${w.description}`, 165);
        doc.text(desc, 22, y); y += desc.length * 5 + 4;
    });

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated by Sphinx Fitness · ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });

    doc.save(`sphinx_fitness_plan_${Date.now()}.pdf`);
    showNotification('📥 ' + t('pdf_exported'), 'success');
}

// ============================================
// TEXT EXPORT
// ============================================
function exportPlanAsText() {
    if (!currentFoodPlan.length && !currentWorkoutPlan.length) {
        showNotification('⚠️ Generate your plan first!', 'warning');
        return;
    }
    let txt = `SPHINX FITNESS — PERSONAL PLAN\nGenerated: ${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`;
    txt += `BMI: ${document.getElementById('bmiValue')?.textContent || '-'}\n`;
    txt += `Daily Calories: ${document.getElementById('caloriesValue')?.textContent || '-'}\n`;
    txt += `Fitness Level: ${document.getElementById('levelValue')?.textContent || '-'}\n\n`;

    txt += `${'='.repeat(50)}\nNUTRITION PLAN\n${'='.repeat(50)}\n\n`;
    currentFoodPlan.forEach(meal => {
        txt += `📍 ${meal.name} — ${meal.actualCalories} kcal\n`;
        meal.items.forEach(item => {
            txt += `   • ${item.name} (${item.weight || '100g'})  |  P:${item.protein}g  C:${item.carbs}g  F:${item.fat}g\n`;
        });
        txt += '\n';
    });

    txt += `${'='.repeat(50)}\nWEEKLY TRAINING\n${'='.repeat(50)}\n\n`;
    currentWorkoutPlan.forEach(w => {
        txt += `📅 ${w.day}: ${w.name}\n`;
        txt += `   Duration: ${w.duration} min | Intensity: ${w.intensity} | ~${w.calories} kcal\n`;
        txt += `   ${w.description}\n\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sphinx_plan_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('📝 Text plan exported!', 'success');
}

// ============================================
// 8) BROWSER NOTIFICATIONS
// ============================================
function pushBrowserNotification(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    const opts = { body, icon: 'sphinx-logo.jpeg' };
    try {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(reg => {
                reg.showNotification(title, opts);
            }).catch(() => { try { new Notification(title, opts); } catch {} });
        } else {
            new Notification(title, opts);
        }
    } catch(e) {
        try { new Notification(title, opts); } catch {}
    }
}

function requestNotifPerm() {
    if (!('Notification' in window)) {
        showNotification('⚠️ Notifications not supported', 'warning');
        return;
    }
    Notification.requestPermission().then(p => {
        updateNotifBadge();
        if (p === 'granted') {
            pushBrowserNotification('Sphinx Fitness', '🎉 Notifications enabled!');
            scheduleReminders();
        }
    });
}

function updateNotifBadge() {
    const badge = document.getElementById('notifBadge');
    if (!badge || !('Notification' in window)) return;
    const t = window.__t || (s => s);
    if (Notification.permission === 'granted') {
        badge.textContent = '🔔 ' + t('notif_on');
        badge.classList.add('on');
    } else {
        badge.textContent = '🔕 ' + t('notif_off');
        badge.classList.remove('on');
    }
}

function scheduleReminders() {
    if (window.__waterTimer) clearInterval(window.__waterTimer);
    // Send one immediately so user knows notifications are working
    setTimeout(() => {
        pushBrowserNotification('💪 Sphinx Fitness', 'Reminders are ON! Stay hydrated & keep moving 🔥');
    }, 1500);
    // Then every 2 hours between 9am-9pm
    window.__waterTimer = setInterval(() => {
        const h = new Date().getHours();
        if (h >= 9 && h <= 21) {
            const msg = dailyWaterIntake < WATER_GOAL
                ? `You've had ${dailyWaterIntake}/${WATER_GOAL} cups today 💧`
                : `Great hydration today! Keep it up 🌊`;
            pushBrowserNotification('💧 Hydration Check', msg);
        }
    }, 2 * 60 * 60 * 1000);
}

// ============================================
// 9) i18n — English / Arabic with RTL
// ============================================
const I18N = {
    en: {
        macros_title: 'Macro Breakdown',
        protein: 'Protein', carbs: 'Carbs', fat: 'Fat',
        vegetables: 'Veggies', fruits: 'Fruits',
        progress_title: 'Weight Progress',
        progress_hint: 'Log your weight daily to track your trend over time.',
        weight_empty: 'Log your weight at least 2 days to see your trend.',
        today_weight: "Today's weight (kg)",
        log_btn: 'Log',
        goal_title: 'Goal Weight',
        goal_placeholder: 'Target weight (kg)',
        save: 'Save',
        invalid_weight: 'Enter a valid weight',
        weight_logged: 'Weight logged!',
        goal_set: 'Goal saved!',
        current: 'Current', goal: 'Goal',
        to_goal: 'to go', done: 'done',
        clear: 'clear',
        streak_title: 'Workout Streak',
        day: 'day', days: 'days', in_a_row: 'in a row', best: 'Best',
        history_title: 'Workout History',
        active_days: 'Active Days', total_sessions: 'Sessions', total_min: 'Total Min',
        last_28: 'Last 28 Days', less: 'less', more: 'more',
        workouts: 'workouts',
        clear_history: 'Clear History',
        confirm_clear: 'Clear all workout history?',
        builder_title: 'Build Your Custom Meal',
        builder_desc: 'Pick foods from each category to compose a balanced meal. Macros are calculated live.',
        builder_empty: 'No items selected yet. Tap any food above to add it.',
        builder_selected: 'Selected items',
        save_favorite: 'Save to Favorites',
        close: 'Close',
        builder_name_prompt: 'Name this meal:',
        swap: 'swap',
        pdf_exported: 'PDF exported successfully!',
        notif_on: 'Notifications ON',
        notif_off: 'Enable Notifications',
        nav_nutrition: '🥗 Nutrition',
        nav_workout: '🏋️ Workout',
        nav_progress: '📈 Progress',
        nav_history: '📅 History',
        custom_meal: '🍳 Custom Meal',
        export_pdf: '📄 PDF',
        favorites: 'Favorites',
        water_title: 'Daily Water Intake',
        calorie_progress: 'Daily Calorie Progress',
        calorie_progress_desc: 'Tracks your daily calorie intake against your personalized goal. Aim to stay within your target range for optimal results.',
        add_items_title: 'Add Items to Meal',
        add_items_desc: 'Select items to add to your meal',
        add_to_meal: 'Add to Meal',
        cancel: 'Cancel'
    },
    ar: {
        macros_title: 'توزيع العناصر الغذائية',
        protein: 'بروتين', carbs: 'كارب', fat: 'دهون',
        vegetables: 'خضروات', fruits: 'فاكهة',
        progress_title: 'تتبع الوزن',
        progress_hint: 'سجّل وزنك يومياً لمتابعة تطورك بمرور الوقت.',
        weight_empty: 'سجّل وزنك ليومين على الأقل لرؤية الرسم البياني.',
        today_weight: 'وزن اليوم (كجم)',
        log_btn: 'تسجيل',
        goal_title: 'الوزن المستهدف',
        goal_placeholder: 'الوزن المطلوب (كجم)',
        save: 'حفظ',
        invalid_weight: 'أدخل وزن صحيح',
        weight_logged: 'تم تسجيل الوزن!',
        goal_set: 'تم حفظ الهدف!',
        current: 'الحالي', goal: 'الهدف',
        to_goal: 'متبقي', done: 'منجز',
        clear: 'مسح',
        streak_title: 'سلسلة التمارين',
        day: 'يوم', days: 'يوم', in_a_row: 'متتالي', best: 'الأفضل',
        history_title: 'سجل التمارين',
        active_days: 'أيام نشطة', total_sessions: 'إجمالي الجلسات', total_min: 'إجمالي الدقائق',
        last_28: 'آخر 28 يوم', less: 'أقل', more: 'أكثر',
        workouts: 'تمارين',
        clear_history: 'مسح السجل',
        confirm_clear: 'مسح سجل التمارين بالكامل؟',
        builder_title: 'صمم وجبتك الخاصة',
        builder_desc: 'اختر أطعمة من كل فئة لتركيب وجبة متوازنة. سيتم حساب العناصر الغذائية تلقائياً.',
        builder_empty: 'لم يتم اختيار أصناف بعد. اضغط على أي طعام لإضافته.',
        builder_selected: 'الأصناف المختارة',
        save_favorite: 'حفظ في المفضلة',
        close: 'إغلاق',
        builder_name_prompt: 'سمي هذه الوجبة:',
        swap: 'استبدال',
        pdf_exported: 'تم تصدير PDF بنجاح!',
        notif_on: 'الإشعارات مفعلة',
        notif_off: 'تفعيل الإشعارات',
        nav_nutrition: '🥗 الغذاء',
        nav_workout: '🏋️ التمرين',
        nav_progress: '📈 التقدم',
        nav_history: '📅 السجل',
        custom_meal: '🍳 وجبة مخصصة',
        export_pdf: '📄 PDF',
        favorites: 'المفضلة',
        water_title: 'ماء اليوم',
        calorie_progress: 'تقدم السعرات اليومية',
        calorie_progress_desc: 'يتابع استهلاكك اليومي للسعرات مقابل هدفك المخصص. اسع للبقاء ضمن نطاق الهدف للحصول على أفضل النتائج.',
        add_items_title: 'إضافة أصناف للوجبة',
        add_items_desc: 'اختر أصناف لإضافتها لوجبتك',
        add_to_meal: 'إضافة للوجبة',
        cancel: 'إلغاء'
    }
};

window.__lang = localStorage.getItem('lang') || 'en';
window.__t = function(key) {
    return (I18N[window.__lang] && I18N[window.__lang][key]) || I18N.en[key] || key;
};

function applyLanguage() {
    const lang = window.__lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const t = window.__t;

    const navN = document.getElementById('navNutrition');
    const navW = document.getElementById('navWorkout');
    const navP = document.getElementById('navProgress');
    const navH = document.getElementById('navHistory');
    if (navN) navN.textContent = t('nav_nutrition');
    if (navW) navW.textContent = t('nav_workout');
    if (navP) navP.textContent = t('nav_progress');
    if (navH) navH.textContent = t('nav_history');

    const cmBtn = document.getElementById('customMealBtn');
    const pdfBtn = document.getElementById('exportPdfBtn');
    if (cmBtn) cmBtn.textContent = t('custom_meal');
    if (pdfBtn) pdfBtn.textContent = t('export_pdf');
    const favTitles = document.querySelectorAll('[data-t="favorites"]');
    favTitles.forEach(el => el.textContent = t('favorites'));

    const ls = document.getElementById('langSwitch');
    if (ls) ls.textContent = lang === 'en' ? '🌐 العربية' : '🌐 English';

    if (typeof currentFoodPlan !== 'undefined' && currentFoodPlan.length) renderMacrosDonut();
    renderStreakCard();
    renderProgressChart();
    renderHeatmap();
    updateNotifBadge();
}

function toggleLang() {
    window.__lang = window.__lang === 'en' ? 'ar' : 'en';
    localStorage.setItem('lang', window.__lang);
    applyLanguage();
}

// ============================================
// EXTENDED TAB SWITCHING
// ============================================
const __originalSwitchTab = window.switchTab;
window.switchTab = function(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const target = document.getElementById(tabName + 'Tab');
    if (target) target.classList.add('active');
    if (event) event.currentTarget.classList.add('active');

    if (tabName === 'progress') renderProgressChart();
    if (tabName === 'history') renderHeatmap();
};

// ============================================
// HOOK INTO LOGIN to load user data + UI
// ============================================
const __originalLoginUser = window.loginUser;
window.loginUser = function(username, isReturning = false) {
    if (typeof __originalLoginUser === 'function') {
        __originalLoginUser(username, isReturning);
    }
    setTimeout(() => {
        applyLanguage();
        renderStreakCard();
        updateNotifBadge();
        initWaterTracker();
        updateFavoritesDisplay();
        loadWorkoutHistory();
        updateWorkoutStatsDisplay();
    }, 100);
};

// ============================================
// INIT — wire up the new UI on load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const ls = document.getElementById('langSwitch');
    if (ls) ls.addEventListener('click', toggleLang);

    const nb = document.getElementById('notifBadge');
    if (nb) nb.addEventListener('click', requestNotifPerm);

    const bm = document.getElementById('builderModal');
    if (bm) {
        bm.addEventListener('click', (e) => { if (e.target === bm) closeMealBuilder(); });
    }

    setTimeout(applyLanguage, 50);

    setTimeout(() => {
        if (localStorage.getItem('currentUser')) {
            renderStreakCard();
            updateNotifBadge();
            if (Notification && Notification.permission === 'granted') scheduleReminders();
        }
    }, 200);
});
