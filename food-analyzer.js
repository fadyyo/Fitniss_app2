/* ============================================================
   FOOD ANALYZER — Sphinx Fitness
   Calls our own backend server (no API key needed in browser)
   ============================================================ */

(function () {

    const API_ENDPOINT = '/api/food-analyze';

    function $(id) { return document.getElementById(id); }

    let selectedDataUrl = null;

    // ---- Modal open / close ----
    function openFoodAnalyzer() {
        const modal = $('foodAnalyzerModal');
        if (modal) modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeFoodAnalyzer() {
        const modal = $('foodAnalyzerModal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // ---- Resize image with canvas (max 1024px) ----
    function resizeImage(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const MAX = 1024;
                let { width, height } = img;
                if (width > MAX || height > MAX) {
                    if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
                    else { width = Math.round(width * MAX / height); height = MAX; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.85));
            };
            img.onerror = () => resolve(dataUrl);
            img.src = dataUrl;
        });
    }

    // ---- File handling ----
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            showFAError('❌ Please upload a valid image file (JPG, PNG, WEBP).');
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const resized = await resizeImage(e.target.result);
            selectedDataUrl = resized;
            showPreview(resized);
        };
        reader.readAsDataURL(file);
    }

    function showPreview(src) {
        const dz = $('fa-dropzone');
        const pw = $('fa-preview-wrap');
        const img = $('fa-preview-img');
        if (dz) dz.style.display = 'none';
        if (pw) pw.style.display = 'block';
        if (img) img.src = src;
        const btn = $('fa-analyze-btn');
        if (btn) btn.disabled = false;
        $('fa-result-area').innerHTML = '';
    }

    function clearImage() {
        selectedDataUrl = null;
        const dz = $('fa-dropzone');
        const pw = $('fa-preview-wrap');
        if (dz) dz.style.display = '';
        if (pw) pw.style.display = 'none';
        const inp = $('fa-file-input');
        if (inp) inp.value = '';
        const btn = $('fa-analyze-btn');
        if (btn) btn.disabled = true;
        $('fa-result-area').innerHTML = '';
    }

    // ---- Analyze ----
    async function analyzeFood() {
        if (!selectedDataUrl) {
            showFAError('❌ Please upload a food image first.');
            return;
        }

        setLoading(true);
        $('fa-result-area').innerHTML = '';

        const matches = selectedDataUrl.match(/^data:([^;]+);base64,(.+)$/);
        const mimeType = matches ? matches[1] : 'image/jpeg';
        const imageBase64 = matches ? matches[2] : '';

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageBase64, mimeType }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    showFAError('⏳ Rate limit reached. Please wait a moment and try again.');
                } else {
                    showFAError('❌ ' + (data?.error || 'Server error. Please try again.'));
                }
                return;
            }

            renderResult(data);

        } catch (err) {
            showFAError('❌ Could not connect to the server. Check your internet connection.');
        } finally {
            setLoading(false);
        }
    }

    // ---- Render result ----
    function renderResult(d) {
        const healthy = !!d.is_healthy;
        const score = Math.min(10, Math.max(1, Number(d.health_score) || 5));
        const scoreColor = score >= 7 ? '#22c55e' : score >= 5 ? '#f59e0b' : '#ef4444';
        const n = d.nutrition || {};
        const li = (arr, clr, sym) => (arr || []).map(x => `<li><span style="color:${clr}">${sym}</span> ${esc(x)}</li>`).join('');

        $('fa-result-area').innerHTML = `
        <div class="fa-result">
            <div class="fa-verdict ${healthy ? 'healthy' : 'unhealthy'}">
                <div class="fa-verdict-icon">${healthy ? '✅' : '⚠️'}</div>
                <div class="fa-verdict-text">
                    <h3>${esc(d.food_name || 'Unknown')} — ${healthy ? 'Healthy Choice' : 'Not the Best Choice'}</h3>
                    <p>${esc(d.reason || '')}</p>
                </div>
            </div>

            <div class="fa-score-row">
                <span class="fa-score-label">Health Score</span>
                <div class="fa-score-bar-wrap">
                    <div class="fa-score-bar-fill" id="fa-score-fill" style="width:0%;background:${scoreColor}"></div>
                </div>
                <span class="fa-score-value" style="color:${scoreColor}">${score}/10</span>
            </div>

            <p class="fa-section-title">Estimated Nutrition (per serving)</p>
            <div class="fa-macros-grid">
                ${chip(n.calories, 'Calories', '🔥')}
                ${chip(n.protein, 'Protein', '💪')}
                ${chip(n.carbs, 'Carbs', '🌾')}
                ${chip(n.fat, 'Fat', '🥑')}
                ${chip(n.fiber, 'Fiber', '🥦')}
                ${chip(n.sugar, 'Sugar', '🍬')}
            </div>

            <div class="fa-info-sections">
                ${d.benefits?.length     ? `<div class="fa-info-block green"><h4>🌱 Benefits</h4><ul>${li(d.benefits, '#22c55e', '✓')}</ul></div>` : ''}
                ${d.concerns?.length     ? `<div class="fa-info-block red"><h4>⚠️ Concerns</h4><ul>${li(d.concerns, '#ef4444', '✗')}</ul></div>` : ''}
                ${d.alternatives?.length ? `<div class="fa-info-block blue"><h4>🔄 Alternatives</h4><ul>${li(d.alternatives, '#2563eb', '→')}</ul></div>` : ''}
                ${d.tips?.length         ? `<div class="fa-info-block amber"><h4>💡 Tips</h4><ul>${li(d.tips, '#d97706', '★')}</ul></div>` : ''}
            </div>
        </div>`;

        requestAnimationFrame(() => {
            const f = $('fa-score-fill');
            if (f) f.style.width = (score * 10) + '%';
        });
    }

    function chip(val, label, icon) {
        return `<div class="fa-macro-chip">
            <span class="fa-m-value">${icon} ${esc(String(val || '—'))}</span>
            <span class="fa-m-label">${label}</span>
        </div>`;
    }

    function esc(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function showFAError(msg) {
        $('fa-result-area').innerHTML = `<div class="fa-error"><span>${msg}</span></div>`;
    }

    function setLoading(on) {
        const btn = $('fa-analyze-btn');
        const sp = $('fa-spinner');
        if (btn) btn.disabled = on;
        if (sp) sp.classList.toggle('active', on);
        const txt = $('fa-btn-text');
        if (txt) txt.textContent = on ? 'Analyzing...' : '🔍 Analyze Food';
    }

    // ---- Init ----
    function init() {
        const navBtn = $('foodScanNavBtn');
        if (navBtn) navBtn.addEventListener('click', openFoodAnalyzer);

        const closeBtn = $('fa-close-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeFoodAnalyzer);

        const modal = $('foodAnalyzerModal');
        if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeFoodAnalyzer(); });

        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFoodAnalyzer(); });

        const fileInput = $('fa-file-input');
        const cameraInput = $('fa-camera-input');
        if (fileInput) fileInput.addEventListener('change', e => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
        });
        if (cameraInput) cameraInput.addEventListener('change', e => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
        });

        // Browse & Camera are now <label for="..."> elements — browser handles opening
        // the file picker natively. Just stop click from bubbling to dropzone.
        const browseBtn = $('fa-browse-btn');
        if (browseBtn) browseBtn.addEventListener('click', e => e.stopPropagation());
        const cameraBtn = $('fa-camera-btn');
        if (cameraBtn) cameraBtn.addEventListener('click', e => e.stopPropagation());

        const dz = $('fa-dropzone');
        if (dz) {
            dz.addEventListener('click', e => {
                // Only open generic file picker if clicking the zone itself, not a label/input
                if (e.target.closest('.fa-zone-btn') || e.target.tagName === 'INPUT') return;
                fileInput && fileInput.click();
            });
            dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
            dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
            dz.addEventListener('drop', e => {
                e.preventDefault(); dz.classList.remove('dragover');
                const f = e.dataTransfer?.files?.[0];
                if (f) handleFile(f);
            });
        }

        const clearBtn = $('fa-clear-btn');
        if (clearBtn) clearBtn.addEventListener('click', clearImage);

        const analyzeBtn = $('fa-analyze-btn');
        if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeFood);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
