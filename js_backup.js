document.addEventListener('DOMContentLoaded', () => {

    const DICE = ['-', 'd4', 'd6', 'd8', 'd10', 'd12', 'd12+1', 'd12+2', 'd12+3'];
    
    // Áudio Gamificação Sincero
    const AudioEngine = {
        ctx: null,
        init() {
            if(!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if(AudioContext) this.ctx = new AudioContext();
            }
        },
        playTone(freq, type, duration, vol) {
            try {
                if(!this.ctx) this.init();
                if(!this.ctx) return;
                if(this.ctx.state === 'suspended') this.ctx.resume();
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime || 0);
                gain.gain.setValueAtTime(vol, this.ctx.currentTime || 0);
                gain.gain.exponentialRampToValueAtTime(0.001, (this.ctx.currentTime || 0) + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop((this.ctx.currentTime || 0) + duration);
            } catch (e) {
                console.warn("AudioEngine Error: ", e);
            }
        },
        playClick() { this.playTone(800, 'sine', 0.05, 0.05); },      // high clink
        playCoin() { this.playTone(1200, 'sine', 0.1, 0.1); setTimeout(()=>this.playTone(1800, 'sine', 0.15, 0.08), 80); }, // cash register / clink
        playThud() { this.playTone(150, 'triangle', 0.15, 0.2); },    // low thud
        playError() { this.playTone(100, 'sawtooth', 0.2, 0.1); },    // buzz
        playMagic() { this.playTone(600, 'sine', 0.3, 0.1); setTimeout(()=>this.playTone(900, 'triangle', 0.5, 0.1), 100); }
    };
    
    // Init Audio context on first user interaction
    document.body.addEventListener('click', () => AudioEngine.init(), {once:true});
    
    // Toast Notification System
    window.showToast = function(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Add icon based on type
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-triangle';
        
        toast.innerHTML = `<span>${message}</span>`; // Simplified toast as we don't have fontawesome
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };
    
    // UI State
    let isAesthetic = false;
    let currentShopCategory = 'all';
    let activeAttrTabId = null; 

    // Character State
    let state = {
        name: '',
        race: null,
        raceChoices: {}, // Escolhas raciais (ex: atributo do metamorfo)
        charClass: null,
        classChoices: {}, 
        level: 0, // Nivelamento Custom (0 = novato)
        raceSkillMods: {}, // Bônus e penalidades automatizadas (-1/+1) nas perícias
        classSkillMods: {}, // Bônus baseados na classe escolhida
        raceAttrMods: {}, // Bônus automatizados nos atributos
        attributes: {}, // { id: 1(d4)..5(d12) }
        skills: {},     // { id: step }
        elderlySkills: {}, // Pontos extras exclusivos de Idoso
        hindrances: [],
        edges: [],
        powers: [],
        equipment: [],
        
        buyHistory: [], // ['attr', 'skill', 'edge', 'funds'] chronologically

        // Compras com pontos de complicação
        boughtAttr: 0,
        boughtSkill: 0,
        boughtEdges: 0,
        boughtFunds: 0
    };

    // DOM Caching
    const els = {
        raceSelect: document.getElementById('char-race'),
        classSelect: document.getElementById('char-class'),
        attrTabsMenu: document.getElementById('attr-tabs-menu'),
        attrTabContent: document.getElementById('attr-tab-content'),
        hindranceSelect: document.getElementById('select-hindrance'),
        hindranceList: document.getElementById('active-hindrances'),
        hindTogglePanel: document.getElementById('hindrance-severity-toggle'),
        hindToggleCheck: document.getElementById('hindrance-severity-checkbox'),
        edgeSelect: document.getElementById('select-edge'),
        edgeList: document.getElementById('active-edges'),
        powerSelect: document.getElementById('select-power'),
        powerList: document.getElementById('active-powers'),
        eqList: document.getElementById('active-equipment'),
        
        btnAddHind: document.getElementById('btn-add-hindrance'),
        btnAddEdge: document.getElementById('btn-add-edge'),
        btnAddPower: document.getElementById('btn-add-power'),
        btnAddSkill: document.getElementById('btn-add-skill'),
        btnOpenStore: document.getElementById('btn-open-store'),

        buyAttr: document.getElementById('buy-attr'),
        buySkill: document.getElementById('buy-skill'),
        buyEdge: document.getElementById('buy-edge'),
        buyFunds: document.getElementById('buy-funds'),
        
        statPace: document.getElementById('stat-pace'),
        statParry: document.getElementById('stat-parry'),
        statToughness: document.getElementById('stat-toughness')
    };

    // Data Load
    const dRaces = DEFAULT_DATA.races;
    const dClasses = DEFAULT_DATA.classes || [];
    const dAttrs = DEFAULT_DATA.attributes;
    const dSkills = DEFAULT_DATA.skills;
    const dHinds = DEFAULT_DATA.hindrances;
    const dEdges = DEFAULT_DATA.edges;
    const dEq = DEFAULT_DATA.equipment;
    const dPowers = DEFAULT_DATA.powers;

    function populateSelect(selectEl, defs) {
        if(!selectEl) return;
        selectEl.innerHTML = '';
        defs.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = d.name;
            selectEl.appendChild(opt);
        });
    }

    function populateEdgesSelect(selectEl, defs) {
        if(!selectEl) return;
        selectEl.innerHTML = '<option value="" disabled selected>-- Selecione --</option>';
        const groups = {};
        defs.forEach(d => {
            const t = d.type || 'Gerais';
            if(!groups[t]) groups[t] = [];
            groups[t].push(d);
        });
        Object.keys(groups).forEach(cat => {
            const grp = document.createElement('optgroup');
            grp.label = cat;
            groups[cat].forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.id;
                opt.textContent = d.name;
                grp.appendChild(opt);
            });
            selectEl.appendChild(grp);
        });
    }

    function populatePowersSelect(selectEl, defs) {
        if(!selectEl) return;
        selectEl.innerHTML = '<option value="" disabled selected>-- Aprender Poder --</option>';
        defs.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = `${d.name} (${d.rank})`;
            selectEl.appendChild(opt);
        });
    }

    function init() {
        populateSelect(els.raceSelect, dRaces);
        populateSelect(els.classSelect, dClasses);
        populateSelect(els.hindranceSelect, dHinds);
        populateEdgesSelect(els.edgeSelect, dEdges);
        populatePowersSelect(els.powerSelect, dPowers);

        dAttrs.forEach(a => state.attributes[a.id] = 1);
        activeAttrTabId = dAttrs[0].id;
        
        dSkills.filter(s => s.isCore).forEach(s => state.skills[s.id] = 1);

        if (dRaces.length > 0) state.race = dRaces[0].id;
        if (dClasses.length > 0) state.charClass = dClasses[0].id;
        
        renderRaceOptions();
        renderClassOptions();

        setupModeToggle();
        setupStoreListeners();
        initEpicCustomizer();

        renderAttrSkillCard();
        calculateAll();
        
        const btnLevelUp = document.getElementById('btn-level-up');
        if(btnLevelUp) {
            btnLevelUp.addEventListener('click', () => {
                if (state.level === 0) window.showCustomToast("Você adquiriu +1 Ponto de Atributo Livre!");
                else if (state.level === 1) window.showCustomToast("Você adquiriu +1 Ponto de Vantagem!");
                else if (state.level === 2) window.showCustomToast("Nível Extra! Você ganha 2pts para progredir Perícia!");
                else if (state.level === 3) window.showCustomToast("Último Nível! Você ganha 2pts para progredir Perícia!");
                
                if (state.level < 4) {
                    state.level++;
                    calculateAll();
                }
            });
        }

        els.hindranceSelect.addEventListener('change', (e) => {
            const h = dHinds.find(d => d.id === e.target.value);
            if(h && h.type === 'Menor/Maior') els.hindTogglePanel.classList.add('visible');
            else els.hindTogglePanel.classList.remove('visible');
        });
        
        els.edgeSelect.addEventListener('change', (e) => {
            const ed = dEdges.find(d => d.id === e.target.value);
            const hintBox = document.getElementById('edge-hint');
            const arcaneWrapper = document.getElementById('arcane-type-wrapper');
            const arcaneSelect = document.getElementById('select-arcane-type');
            
            arcaneWrapper.classList.add('hidden');
            if(ed) {
                document.getElementById('edge-hint-name').textContent = ed.name;
                document.getElementById('edge-hint-req').textContent = ed.requirements ? `[Req: ${ed.requirements}]` : '';
                document.getElementById('edge-hint-desc').textContent = ed.description || '';
                hintBox.classList.remove('hidden');
                
                if (ed.requireInput === 'arcane_type' && ed.arcaneTypes) {
                    arcaneWrapper.classList.remove('hidden');
                    arcaneSelect.innerHTML = '<option value="" disabled selected>-- Selecione a Tradição --</option>';
                    ed.arcaneTypes.forEach(t => {
                        const opt = document.createElement('option');
                        opt.value = t.id;
                        opt.textContent = t.name;
                        arcaneSelect.appendChild(opt);
                    });
                    document.getElementById('arcane-hint').textContent = '';
                    els.btnAddEdge.disabled = true; // wait for secondary select
                } else {
                    els.btnAddEdge.disabled = (state.edges.length >= (state.maxEdges || 0));
                }
            } else {
                hintBox.classList.add('hidden');
                els.btnAddEdge.disabled = true;
            }
        });

        const arcaneSelect = document.getElementById('select-arcane-type');
        if (arcaneSelect) {
            arcaneSelect.addEventListener('change', (e) => {
                const ed = dEdges.find(d => d.id === els.edgeSelect.value);
                if (ed && ed.arcaneTypes) {
                    const selArcane = ed.arcaneTypes.find(t => t.id === e.target.value);
                    if (selArcane) {
                        document.getElementById('arcane-hint').innerHTML = `<strong>Perícia:</strong> ${selArcane.skill} | <strong>Poderes:</strong> ${selArcane.powers} | <strong>PP:</strong> ${selArcane.pp}<br><span style="color:#555; display:inline-block; margin-top:4px;">${selArcane.desc}</span>`;
                        els.btnAddEdge.disabled = (state.edges.length >= (state.maxEdges || 0));
                    }
                }
            });
        }

        els.powerSelect.addEventListener('change', (e) => {
            const pw = dPowers.find(d => d.id === e.target.value);
            const hintBox = document.getElementById('power-hint');
            if(pw) {
                document.getElementById('power-hint-name').textContent = pw.name;
                document.getElementById('power-hint-rank').textContent = `[${pw.rank}]`;
                
                let statsEl = document.getElementById('power-hint-stats');
                if (statsEl) {
                    let extStr = [];
                    if(pw.pp) extStr.push(`PP: ${pw.pp}`);
                    if(pw.range) extStr.push(`Alc: ${pw.range}`);
                    if(pw.duration) extStr.push(`Dur: ${pw.duration}`);
                    statsEl.textContent = extStr.length > 0 ? `(${extStr.join(' • ')})` : '';
                }

                document.getElementById('power-hint-desc').textContent = pw.description || '';
                hintBox.classList.remove('hidden');
                
                // Habilitar apenas se não estiverreirompendo o máximo de slots de poder (checagem do rastreador)
                if (state.powers.length >= (state.arcaneMaxPowers || 0)) {
                    els.btnAddPower.disabled = true;
                } else {
                    els.btnAddPower.disabled = false;
                }
            } else {
                hintBox.classList.add('hidden');
                els.btnAddPower.disabled = true;
            }
        });

        // Setup initial display
        const initialH = dHinds.find(d => d.id === els.hindranceSelect.value);
        if(initialH && initialH.type === 'Menor/Maior') els.hindTogglePanel.classList.add('visible');
        
        // Portrait (Mini-Preview Uploader Zone)
        const upload = document.getElementById('portrait-upload');
        const dropZone = document.getElementById('image-uploader-zone');
        const instructions = document.getElementById('uploader-instructions');
        const miniContainer = document.getElementById('mini-preview-container');
        const miniImg = document.getElementById('mini-portrait-img');
        const btnClear = document.getElementById('btn-clear-image');
        const urlInput = document.getElementById('portrait-url');
        state.uploadedPortraitSrc = null;

        const applyPortraitImage = (src) => {
            state.uploadedPortraitSrc = src;
            miniImg.src = src;
            instructions.style.display = 'none';
            miniContainer.style.display = 'block';
            btnClear.style.display = 'block';
            const controls = document.getElementById('mini-preview-controls');
            if(controls) controls.style.display = 'flex';
            const subtitle = document.getElementById('lbl-preview-subtitle');
            if(subtitle) subtitle.style.display = 'block';
            dropZone.style.border = 'none';
            dropZone.style.background = 'transparent';
            dropZone.style.padding = '5px 0';
            
            const tempImg = new Image();
            tempImg.onload = () => {
                state.imgNatW = tempImg.naturalWidth || 1;
                state.imgNatH = tempImg.naturalHeight || 1;
                // Defer until variables are populated
                if(typeof renderImageTransform === 'function') renderImageTransform();
                if(typeof renderEpicCard === 'function') renderEpicCard();
            };
            tempImg.src = src;
        };

        // Click to Upload
        dropZone.addEventListener('click', (e) => {
            if(!state.uploadedPortraitSrc && e.target !== urlInput) {
                upload.click();
            }
        });

        // File Input Change
        upload.addEventListener('change', (e) => {
            if(e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = ev => applyPortraitImage(ev.target.result);
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        // URL Paste/Enter
        urlInput.addEventListener('change', (e) => {
            const val = e.target.value.trim();
            if(val) applyPortraitImage(val);
        });

        // Drag & Drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-active');
        });
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-active');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-active');
            if(e.dataTransfer.files && e.dataTransfer.files[0]) {
                const reader = new FileReader();
                reader.onload = ev => applyPortraitImage(ev.target.result);
                reader.readAsDataURL(e.dataTransfer.files[0]);
            }
        });

        // Clear Image
        btnClear.addEventListener('click', () => {
            state.uploadedPortraitSrc = null;
            miniImg.src = '';
            upload.value = '';
            urlInput.value = '';
            instructions.style.display = 'flex';
            miniContainer.style.display = 'none';
            btnClear.style.display = 'none';
            const controls = document.getElementById('mini-preview-controls');
            if(controls) controls.style.display = 'none';
            const subtitle = document.getElementById('lbl-preview-subtitle');
            if(subtitle) subtitle.style.display = 'none';
            dropZone.style.border = '';
            dropZone.style.background = '';
            dropZone.style.padding = '';
            renderEpicCard();
        });

        // Add
        els.btnAddHind.addEventListener('click', () => { AudioEngine.playMagic(); addHindrance(els.hindranceSelect.value); });
        els.btnAddEdge.addEventListener('click', () => { AudioEngine.playMagic(); addEdge(els.edgeSelect.value); });
        els.btnAddPower.addEventListener('click', () => { AudioEngine.playMagic(); addPower(els.powerSelect.value); });
        els.btnOpenStore.addEventListener('click', () => { 
            AudioEngine.playClick(); 
            openStore(); 
        });

        const flashBtn = (e) => {
            if(!e || !e.currentTarget) return;
            const btn = e.currentTarget;
            btn.classList.remove('btn-flash-success');
            void btn.offsetWidth; // trigger DOM reflow to restart animation
            btn.classList.add('btn-flash-success');
        };
        // Buys
        els.buyAttr.addEventListener('click', (e) => { 
            flashBtn(e);
            AudioEngine.playCoin(); 
            state.boughtAttr++; 
            state.buyHistory.push('attr');
            if(typeof showToast === 'function') showToast('+1 Ponto de Atributo adquirido!', 'success'); 
            calculateAll(); 
        });
        els.buySkill.addEventListener('click', (e) => { 
            flashBtn(e);
            AudioEngine.playCoin(); 
            state.boughtSkill++; 
            state.buyHistory.push('skill');
            if(typeof showToast === 'function') showToast('+1 Ponto de Perícia adquirido!', 'success'); 
            calculateAll(); 
        });
        els.buyEdge.addEventListener('click', (e) => { 
            flashBtn(e);
            AudioEngine.playCoin(); 
            state.boughtEdges++; 
            state.buyHistory.push('edge');
            if(typeof showToast === 'function') showToast('+1 Vantagem Extra adquirida!', 'success'); 
            calculateAll(); 
        });
        els.buyFunds.addEventListener('click', (e) => { 
            flashBtn(e);
            AudioEngine.playCoin(); 
            state.boughtFunds++; 
            state.buyHistory.push('funds');
            if(typeof showToast === 'function') showToast('+$500 Iniciais adquiridos!', 'success'); 
            calculateAll(); 
        });

        // Refunds
        const refundBuy = (e, type) => {
            let foundIdx = -1;
            for (let i = state.buyHistory.length - 1; i >= 0; i--) {
                if (state.buyHistory[i] === type) {
                    foundIdx = i;
                    break;
                }
            }
            if (foundIdx === -1) return; // shouldn't happen if button is visible
            
            state.buyHistory.splice(foundIdx, 1);
            if(type === 'attr') state.boughtAttr--;
            if(type === 'skill') state.boughtSkill--;
            if(type === 'edge') state.boughtEdges--;
            if(type === 'funds') state.boughtFunds--;
            
            if(e && e.currentTarget) {
                const btn = e.currentTarget;
                btn.classList.remove('btn-flash-refund');
                void btn.offsetWidth;
                btn.classList.add('btn-flash-refund');
            }
            AudioEngine.playClick();
            if(typeof showToast === 'function') showToast('Pontos restituídos.', 'info'); 
            calculateAll();
        };

        const btnRefundAttr = document.getElementById('btn-refund-attr');
        if(btnRefundAttr) btnRefundAttr.addEventListener('click', (e) => refundBuy(e, 'attr'));
        
        const btnRefundSkill = document.getElementById('btn-refund-skill');
        if(btnRefundSkill) btnRefundSkill.addEventListener('click', (e) => refundBuy(e, 'skill'));
        
        const btnRefundEdge = document.getElementById('btn-refund-edge');
        if(btnRefundEdge) btnRefundEdge.addEventListener('click', (e) => refundBuy(e, 'edge'));
        
        const btnRefundFunds = document.getElementById('btn-refund-funds');
        if(btnRefundFunds) btnRefundFunds.addEventListener('click', (e) => refundBuy(e, 'funds'));

        // Export
        const btnPdf = document.getElementById('btn-export-pdf');
        if(btnPdf) btnPdf.addEventListener('click', exportPDF);
        const btnImg = document.getElementById('btn-export-img');
        if(btnImg) btnImg.addEventListener('click', exportImg);
        
        // Listen to new direct Race Builder button
        const btnRaceBuilder = document.getElementById('btn-open-race-builder-direct');
        if(btnRaceBuilder) {
            btnRaceBuilder.addEventListener('click', () => {
                openRaceBuilder();
            });
        }
        els.raceSelect.addEventListener('change', (e) => { 
            state.race = e.target.value; 
            state.raceChoices = {};
            renderRaceOptions();
            calculateAll(); 
            renderAttrSkillCard();
        });

        els.classSelect.addEventListener('change', (e) => { 
            state.charClass = e.target.value; 
            state.classChoices = {};
            renderClassOptions();
            calculateAll(); 
            renderAttrSkillCard();
        });
    }

    function renderRaceOptions() {
        let container = document.getElementById('race-dynamic-opts');
        if(!container) { 
            container = document.createElement('div'); 
            container.id = 'race-dynamic-opts'; 
            container.style.marginTop = '15px';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = '1fr 1fr';
            container.style.gap = '15px';
            container.style.border = '1px solid var(--primary-color)';
            container.style.borderRadius = '8px';
            container.style.padding = '15px';
            container.style.background = 'rgba(0,0,0,0.2)';
            els.raceSelect.parentNode.parentNode.appendChild(container); 
        }
        
        container.innerHTML = '';
        
        const myRace = dRaces.find(r => r.id === state.race);
        if(!myRace || !myRace.choices) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'grid';
        
        myRace.choices.forEach(ch => {
            const block = document.createElement('div');
            block.style.display = 'flex';
            block.style.flexDirection = 'column';
            // Se for compósto ou single-text livre, ocupa as 2 colunas para não encolher a digitação
            if(ch.type === 'named_text' || ch.type === 'text') block.style.gridColumn = '1 / -1';
            
            block.innerHTML = `<label style="font-size:0.85rem; color:var(--secondary-color); margin-bottom: 5px;">${ch.name}</label>`;
            
            if(ch.type === 'text') {
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.className = 'app-input';
                inp.placeholder = ch.placeholder || '';
                inp.value = state.raceChoices[ch.id] || '';
                inp.addEventListener('input', e => { 
                    state.raceChoices[ch.id] = e.target.value; 
                    calculateAll();
                });
                block.appendChild(inp);
            } else if(ch.type === 'named_text') {
                const w = document.createElement('div');
                w.style.display = 'flex';
                w.style.gap = '10px';
                
                const currentObj = state.raceChoices[ch.id] || { name: '', desc: '' };
                
                const inpNm = document.createElement('input');
                inpNm.type = 'text';
                inpNm.className = 'app-input';
                inpNm.placeholder = 'Nome';
                inpNm.style.flex = '0 0 35%';
                inpNm.value = currentObj.name || '';
                
                const inpDesc = document.createElement('input');
                inpDesc.type = 'text';
                inpDesc.className = 'app-input';
                inpDesc.placeholder = ch.placeholder || 'Descrição';
                inpDesc.style.flex = '1';
                inpDesc.value = currentObj.desc || '';
                
                const updater = () => {
                    state.raceChoices[ch.id] = { name: inpNm.value, desc: inpDesc.value };
                    calculateAll();
                };
                
                inpNm.addEventListener('input', updater);
                inpDesc.addEventListener('input', updater);
                
                w.appendChild(inpNm);
                w.appendChild(inpDesc);
                block.appendChild(w);

            } else if(ch.type === 'skill' || ch.type === 'attribute') {
                const sel = document.createElement('select');
                sel.className = 'app-input';
                sel.innerHTML = `<option value="">-- Selecione --</option>`;
                
                let optsList = [];
                if(ch.options === 'all' && ch.type === 'skill') {
                    optsList = DEFAULT_DATA.skills;
                } else if(Array.isArray(ch.options)) {
                    optsList = (ch.type === 'skill' ? DEFAULT_DATA.skills : DEFAULT_DATA.attributes).filter(i => ch.options.includes(i.id));
                }
                
                optsList.forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.id;
                    opt.textContent = item.name;
                    sel.appendChild(opt);
                });
                
                sel.value = state.raceChoices[ch.id] || '';
                sel.addEventListener('change', e => { 
                    state.raceChoices[ch.id] = e.target.value; 
                    calculateAll();
                    renderAttrSkillCard();
                });
                block.appendChild(sel);
            }
            container.appendChild(block);
        });
    }

    function renderClassOptions() {
        let container = document.getElementById('class-dynamic-opts');
        if(!container) { 
            container = document.createElement('div'); 
            container.id = 'class-dynamic-opts'; 
            container.style.marginTop = '15px';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = '1fr 1fr';
            container.style.gap = '15px';
            container.style.border = '1px solid #7c622f'; // Distinct border color for class
            container.style.borderRadius = '8px';
            container.style.padding = '15px';
            container.style.background = 'rgba(0,0,0,0.2)';
            els.classSelect.parentNode.parentNode.appendChild(container); 
        }
        
        container.innerHTML = '';
        
        const myClass = dClasses.find(r => r.id === state.charClass);
        if(!myClass || !myClass.choices) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'grid';
        
        myClass.choices.forEach(ch => {
            const block = document.createElement('div');
            block.style.display = 'flex';
            block.style.flexDirection = 'column';
            
            block.innerHTML = `<label style="font-size:0.85rem; color:#dcb360; margin-bottom: 5px;">${ch.name}</label>`;
            
            const sel = document.createElement('select');
            sel.className = 'app-input';
            sel.innerHTML = `<option value="">-- Selecione --</option>`;
            
            let optsList = [];
            if(Array.isArray(ch.options)) {
                optsList = (ch.type === 'skill' ? DEFAULT_DATA.skills : DEFAULT_DATA.attributes).filter(i => ch.options.includes(i.id));
            }
            
            optsList.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.textContent = item.name;
                sel.appendChild(opt);
            });
            
            sel.value = state.classChoices[ch.id] || '';
            sel.addEventListener('change', e => { 
                state.classChoices[ch.id] = e.target.value; 
                calculateAll();
                renderAttrSkillCard();
            });
            block.appendChild(sel);
            container.appendChild(block);
        });
    }

    // --- RACE BUILDER LOGIC ---
    let builderRace = { name: '', pool: 2, selections: [] };

    function openRaceBuilder() {
        builderRace = { name: '', pool: 2, selections: [] };
        document.getElementById('rb-race-name').value = '';
        document.getElementById('race-builder-modal').style.display = 'block';
        document.getElementById('race-builder-modal').classList.add('active'); // fallback
        
        document.getElementById('btn-close-race-builder').onclick = () => {
            document.getElementById('race-builder-modal').style.display = 'none';
            document.getElementById('race-builder-modal').classList.remove('active');
            els.raceSelect.value = state.race || (dRaces[0] ? dRaces[0].id : ''); // revert
        };
        
        // Setup Search Bars
        const searchPosEl = document.getElementById('rb-search-pos');
        if(searchPosEl) searchPosEl.oninput = () => renderRaceBuilder();
        
        const searchNegEl = document.getElementById('rb-search-neg');
        if(searchNegEl) searchNegEl.oninput = () => renderRaceBuilder();
        
        document.getElementById('rb-race-name').oninput = (e) => {
            builderRace.name = e.target.value;
            const mobileInput = document.getElementById('rb-mobile-race-name');
            if(mobileInput) mobileInput.value = e.target.value;
            validateRaceBuilder();
        };

        const mobileNameInput = document.getElementById('rb-mobile-race-name');
        if(mobileNameInput) {
            mobileNameInput.oninput = (e) => {
                builderRace.name = e.target.value;
                document.getElementById('rb-race-name').value = e.target.value;
                validateRaceBuilder();
            };
        }

        document.getElementById('btn-save-race').onclick = saveCustomRace;
        const btnMobileSave = document.getElementById('btn-mobile-save-race');
        if(btnMobileSave) btnMobileSave.onclick = saveCustomRace;

        const btnPos = document.getElementById('rb-toggle-pos');
        const btnNeg = document.getElementById('rb-toggle-neg');
        if(btnPos && btnNeg) {
            btnPos.onclick = (e) => {
                e.target.style.background = '#162419'; e.target.style.color = '#28a745'; e.target.style.borderColor = '#28a745';
                btnNeg.style.background = '#080604'; btnNeg.style.color = '#999'; btnNeg.style.borderColor = '#333';
                document.getElementById('rb-col-pos').classList.remove('hidden-mobile');
                document.getElementById('rb-col-neg').classList.add('hidden-mobile');
            };
            btnNeg.onclick = (e) => {
                e.target.style.background = '#2b1010'; e.target.style.color = '#dc3545'; e.target.style.borderColor = '#dc3545';
                btnPos.style.background = '#080604'; btnPos.style.color = '#999'; btnPos.style.borderColor = '#333';
                document.getElementById('rb-col-pos').classList.add('hidden-mobile');
                document.getElementById('rb-col-neg').classList.remove('hidden-mobile');
            };
        }

        const previewToggle = document.getElementById('rb-mobile-toggle-preview');
        if(previewToggle) {
            previewToggle.onclick = (e) => {
                const previewLayer = document.getElementById('rb-mobile-preview');
                if (previewLayer.style.display === 'none' || previewLayer.style.display === '') {
                    previewLayer.style.display = 'block';
                    e.target.textContent = '⬆️ Esconder Resumo ⬆️';
                } else {
                    previewLayer.style.display = 'none';
                    e.target.textContent = '⬇️ Ver Resumo dos Traços ⬇️';
                }
            };
        }
        
        renderRaceBuilder();
    }

    function getCostForSelection(def, sObj) {
        if (def.requireInput === 'hindrance') {
            if (!sObj.text) return 0;
            return sObj.text.endsWith(':Maior') ? -2 : -1;
        }
        if (def.levels) return def.levels[sObj.level].cost;
        return def.cost * (sObj.level + 1);
    }

    function formatSelectionLabel(def, sObj) {
        let label = def.name;
        if(def.levels) label += ` (${def.levels[sObj.level].name})`;
        else if(def.max && sObj.level > 0 && def.type !== 'multiItem') label += ` x${sObj.level + 1}`;
        
        if(def.requireInput && sObj.text) {
            if(def.requireInput === 'hindrance') {
                const parts = sObj.text.split(':');
                const hinds = DEFAULT_DATA.hindrances || DEFAULT_DATA.hindrances;
                const hdef = hinds.find(x => x.id === parts[0]);
                if(hdef) label += ` [${hdef.name} (${parts[1]})]`;
                else label += ` [${sObj.text}]`;
            } else {
                label += ` [${sObj.text}]`;
            }
        }
        return label;
    }

    function renderRaceBuilder() {
        const listPos = document.getElementById('rb-list-pos');
        const listNeg = document.getElementById('rb-list-neg');
        listPos.innerHTML = '';
        listNeg.innerHTML = '';
        
        let defPos = DEFAULT_DATA.racialAbilitiesPos;
        let defNeg = DEFAULT_DATA.racialAbilitiesNeg;
        
        const searchPosEl = document.getElementById('rb-search-pos');
        const qPos = searchPosEl ? searchPosEl.value.toLowerCase() : '';
        if(qPos) defPos = defPos.filter(x => x.name.toLowerCase().includes(qPos));
        
        const searchNegEl = document.getElementById('rb-search-neg');
        const qNeg = searchNegEl ? searchNegEl.value.toLowerCase() : '';
        if(qNeg) defNeg = defNeg.filter(x => x.name.toLowerCase().includes(qNeg));
        

        function createRow(def, sObj, type) {
            const isChecked = !!sObj;
            const color = type === 'pos' ? '#28a745' : '#dc3545';
            const bg = type === 'pos' ? 'rgba(40,167,69,0.05)' : 'rgba(220,53,69,0.05)';
            
            const card = document.createElement('div');
            card.style.cssText = `background: ${isChecked ? bg : 'transparent'}; border: 1px solid ${isChecked ? color : 'var(--border-color)'}; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 8px;`;
            
            // Base Cost Display
            let costLabel = def.levels ? def.levels[0].cost : def.cost;
            costLabel = type === 'neg' ? '+'+Math.abs(costLabel) + ' pts ganho' : costLabel + ' pts';

            const topRow = document.createElement('div');
            topRow.style.cssText = 'display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; cursor: pointer;';
            topRow.innerHTML = `
                <div style="display: flex; gap: 10px; align-items: flex-start; flex: 1;">
                    <input type="checkbox" style="margin-top: 4px; transform: scale(1.2); cursor: pointer;" ${isChecked ? 'checked' : ''}>
                    <div>
                        <div style="font-weight:bold; color:var(--text-color);">${def.name} <span style="font-size:0.8rem; color:${color};">(${costLabel})</span></div>
                        <div style="font-size:0.8rem; color:#aaa; line-height: 1.2;">${def.desc}</div>
                    </div>
                </div>
            `;
            
            topRow.onclick = (e) => {
                if(e.target.tagName !== 'INPUT') {
                    const cb = topRow.querySelector('input');
                    cb.checked = !cb.checked;
                }
                const checkedNow = topRow.querySelector('input').checked;
                
                if (checkedNow && !isChecked) {
                    // Verificação de balanço para compra inicial POSITIVA
                    let initialCost = def.levels ? def.levels[0].cost : def.cost;
                    if (type === 'pos' && builderRace.pool - initialCost < 0) {
                        AudioEngine.playError();
                        topRow.querySelector('input').checked = false;
                        return;
                    }
                    builderRace.selections.push({ uid: Math.random().toString(36).substr(2,9), id: def.id, type: type, level: 0, text: '' });
                    AudioEngine.playClick();
                    renderRaceBuilder();
                } else if (!checkedNow && isChecked) {
                    builderRace.selections = builderRace.selections.filter(x => x.uid !== sObj.uid);
                    AudioEngine.playThud();
                    renderRaceBuilder();
                }
            };
            card.appendChild(topRow);

            if (isChecked) {
                const subRow = document.createElement('div');
                subRow.style.cssText = `display: flex; gap: 15px; margin-top: 5px; padding-top: 8px; border-top: 1px dashed ${color}55; align-items: center; justify-content: space-between;`;
                let hasContent = false;
                
                // Text Input / Select
                if (def.requireInput) {
                    hasContent = true;
                    const inputWrap = document.createElement('div');
                    inputWrap.style.flex = "1";
                    if (def.requireInput === 'text') {
                        inputWrap.innerHTML = `<input type="text" placeholder="Especificar..." value="${sObj.text}" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius:4px; background: var(--bg-color); color: var(--text-color);">`;
                        inputWrap.querySelector('input').oninput = (e) => { sObj.text = e.target.value; validateRaceBuilder(); };
                    } else if (def.requireInput === 'select') {
                        let opts = `<option value="">-- Escolher --</option>`;
                        def.options.forEach(opt => {
                            opts += `<option value="${opt}" ${sObj.text === opt ? 'selected' : ''}>${opt}</option>`;
                        });
                        inputWrap.innerHTML = `<select style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius:4px; background: var(--bg-color); color: var(--text-color);">${opts}</select>`;
                        inputWrap.querySelector('select').onchange = (e) => { sObj.text = e.target.value; validateRaceBuilder(); };
                    } else if (def.requireInput === 'hindrance') {
                        const hinds = DEFAULT_DATA.hindrances || DEFAULT_DATA.hindrances;
                        let opts = `<option value="">-- Selecione uma Complicação --</option>`;
                        hinds.forEach(h => {
                            if(h.type === 'Menor/Maior') {
                                opts += `<option value="${h.id}:Menor" ${sObj.text === h.id+':Menor' ? 'selected' : ''}>${h.name} (Menor -1pts)</option>`;
                                opts += `<option value="${h.id}:Maior" ${sObj.text === h.id+':Maior' ? 'selected' : ''}>${h.name} (Maior -2pts)</option>`;
                            } else {
                                opts += `<option value="${h.id}:${h.type}" ${sObj.text === h.id+':'+h.type ? 'selected' : ''}>${h.name} (${h.type} ${h.type==='Maior'?'-2pts':'-1pts'})</option>`;
                            }
                        });
                        inputWrap.innerHTML = `<select style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius:4px; background: var(--bg-color); color: var(--text-color);">${opts}</select>`;
                        inputWrap.querySelector('select').onchange = (e) => { sObj.text = e.target.value; validateRaceBuilder(); renderRaceBuilder(); };
                    }
                    subRow.appendChild(inputWrap);
                }

                // Upgrades & Stacks
                let maxLevel = def.levels ? def.levels.length - 1 : (def.max ? def.max - 1 : 0);
                if (maxLevel > 0 && def.type !== 'multiItem') {
                    hasContent = true;
                    const upgWrap = document.createElement('div');
                    upgWrap.style.cssText = 'display: flex; flex-direction: column; align-items: flex-end; gap: 4px;';
                    
                    let curLvlText = def.levels ? def.levels[sObj.level].name : `Ativo x${sObj.level + 1}`;
                    let costInfo = def.levels ? def.levels[sObj.level].cost : def.cost * (sObj.level + 1);
                    
                    upgWrap.innerHTML = `
                        <div style="font-size:0.75rem; color:#aaa;">${curLvlText} (${Math.abs(costInfo)}pts)</div>
                        <div style="display: flex; gap: 5px;">
                            <button class="btn-dec" style="padding: 2px 8px; border-radius:4px; background:var(--box-bg); color:#fff; border:1px solid var(--border-color); cursor:pointer;">-</button>
                            <span style="font-weight:bold; width:20px; text-align:center;">${def.levels ? sObj.level : (sObj.level + 1)}</span>
                            <button class="btn-inc" style="padding: 2px 8px; border-radius:4px; background:var(--box-bg); color:#fff; border:1px solid var(--border-color); cursor:pointer;">+</button>
                        </div>
                    `;

                    upgWrap.querySelector('.btn-inc').onclick = () => {
                        if(sObj.level < maxLevel) {
                            let curCost = getCostForSelection(def, sObj);
                            let virtualS = { ...sObj, level: sObj.level + 1 };
                            let nextCost = getCostForSelection(def, virtualS);
                            let diff = nextCost - curCost;
                            if(type === 'pos' && builderRace.pool - diff < 0) {
                                AudioEngine.playError();
                                return;
                            }
                            sObj.level++;
                            AudioEngine.playClick();
                            renderRaceBuilder();
                        } else AudioEngine.playError();
                    };

                    upgWrap.querySelector('.btn-dec').onclick = () => {
                        if(sObj.level > 0) {
                            sObj.level--;
                            AudioEngine.playThud();
                            renderRaceBuilder();
                        }
                    };
                    subRow.appendChild(upgWrap);
                }
                
                if(hasContent) card.appendChild(subRow);
            }
            return card;
        }

        defPos.forEach(def => {
            const instances = builderRace.selections.filter(x => x.id === def.id && x.type === 'pos');
            if (def.type === 'multiItem') {
                instances.forEach(ins => listPos.appendChild(createRow(def, ins, 'pos')));
                if (instances.length < (def.max || 1)) listPos.appendChild(createRow(def, null, 'pos'));
            } else {
                listPos.appendChild(createRow(def, instances[0] || null, 'pos'));
            }
        });

        defNeg.forEach(def => {
            const instances = builderRace.selections.filter(x => x.id === def.id && x.type === 'neg');
            if (def.type === 'multiItem') {
                instances.forEach(ins => listNeg.appendChild(createRow(def, ins, 'neg')));
                if (instances.length < (def.max || 1)) listNeg.appendChild(createRow(def, null, 'neg'));
            } else {
                listNeg.appendChild(createRow(def, instances[0] || null, 'neg'));
            }
        });

        validateRaceBuilder();
    }

    function validateRaceBuilder() {
        let pool = 2; // Fixed start
        let inputsValid = true;
        let previewHTML = '';
        
        let sumPos = 0; let sumNeg = 0;

        let defPos = DEFAULT_DATA.racialAbilitiesPos;
        
        let defNeg = DEFAULT_DATA.racialAbilitiesNeg;
        

        let sortedSelections = [...builderRace.selections].sort((a, b) => {
            if (a.type === 'pos' && b.type === 'neg') return -1;
            if (a.type === 'neg' && b.type === 'pos') return 1;
            return 0;
        });

        sortedSelections.forEach(s => {
            const def = s.type === 'pos' ? defPos.find(x => x.id === s.id) : defNeg.find(x => x.id === s.id);
            if(!def) return;
            
            let cost = getCostForSelection(def, s);
            pool -= cost; 
            
            if(s.type === 'pos') sumPos += cost;
            else sumNeg += cost;
            
            if (def.requireInput && !s.text) inputsValid = false;

            let title = formatSelectionLabel(def, s);
            
            let color = cost > 0 ? '#28a745' : '#dc3545';
            previewHTML += `<div style="border-left: 3px solid ${color}; padding-left: 8px; margin-bottom: 5px;">
                <strong style="color:var(--text-color);">${title}</strong> 
                <span style="font-size: 0.8em; color: ${color};">(${cost > 0 ? '-'+cost : '+'+Math.abs(cost)} pts)</span>
            </div>`;
        });

        builderRace.pool = pool;
        document.getElementById('rb-preview').innerHTML = previewHTML || '<em>Nenhum traço selecionado.</em>';
        
        const maxPoints = 2 + Math.abs(sumNeg);
        const saldoBtn = document.getElementById('rb-points-val');
        const maxBtn = document.getElementById('rb-points-max');
        const mSaldoBtn = document.getElementById('rb-mobile-points-val');
        const mMaxBtn = document.getElementById('rb-mobile-points-max');
        
        saldoBtn.textContent = pool;
        if(maxBtn) maxBtn.textContent = maxPoints;
        if(mSaldoBtn) mSaldoBtn.textContent = pool;
        if(mMaxBtn) mMaxBtn.textContent = maxPoints;
        
        document.getElementById('rb-preview').innerHTML = previewHTML || '<em>Nenhum traço selecionado.</em>';
        const mPreview = document.getElementById('rb-mobile-preview');
        if(mPreview) mPreview.innerHTML = previewHTML || '<em>Nenhum traço selecionado.</em>';

        const btnSave = document.getElementById('btn-save-race');
        const mBtnSave = document.getElementById('btn-mobile-save-race');
        
        if (pool === 0 && builderRace.name.trim().length > 0 && inputsValid) {
            saldoBtn.parentElement.style.borderColor = '#28a745';
            saldoBtn.style.color = '#28a745';
            btnSave.disabled = false;
            
            if(mSaldoBtn) {
                mSaldoBtn.parentElement.style.borderColor = '#28a745';
                mSaldoBtn.style.color = '#28a745';
            }
            if(mBtnSave) mBtnSave.disabled = false;
        } else {
            saldoBtn.parentElement.style.borderColor = '#dcb360';
            saldoBtn.style.color = '#dcb360';
            btnSave.disabled = true;
            
            if(mSaldoBtn) {
                mSaldoBtn.parentElement.style.borderColor = '#555';
                mSaldoBtn.style.color = '#dcb360';
            }
            if(mBtnSave) mBtnSave.disabled = true;
        }
    }

    function saveCustomRace() {
        if(!builderRace.name || builderRace.pool !== 0) return;
        
        let defPos = DEFAULT_DATA.racialAbilitiesPos;
        
        let defNeg = DEFAULT_DATA.racialAbilitiesNeg;
        
        
        let parts = [];
        builderRace.selections.forEach(s => {
            const def = s.type === 'pos' ? defPos.find(x => x.id === s.id) : defNeg.find(x => x.id === s.id);
            if(!def) return;
            let p = formatSelectionLabel(def, s);
            parts.push(s.type === 'pos' ? p : `*${p}*`);
        });

        const newRaceId = 'race_custom_' + Date.now();
        const customRaceObj = {
            id: newRaceId,
            name: builderRace.name + ' (Custom)',
            description: parts.join(', '),
            isCustom: true,
            selections: JSON.parse(JSON.stringify(builderRace.selections)),
            positives: builderRace.selections.filter(x=>x.type==='pos').map(x=>x.id),
            negatives: builderRace.selections.filter(x=>x.type==='neg').map(x=>x.id)
        };
        
        
        
        
        
        dRaces.push(customRaceObj);
        
        // Refresh select list and select it
        populateSelect(els.raceSelect, dRaces);
        
        // The button handles this now, no need to re-inject standard option
        
        els.raceSelect.value = newRaceId;
        state.race = newRaceId;
        
        document.getElementById('race-builder-modal').style.display = 'none';
        
        try { AudioEngine.playMagic(); } catch(e) {}
        calculateAll();
    }
    
    // --- STORE LOGIC & CART ---
    let storeCart = [];

    function extractWeight(item) {
        const m = (item.extraBenefits || '').match(/Peso:\s*([\d.]+)/i);
        return m ? parseFloat(m[1]) : 0;
    }

    function extractDmgMax(item) {
        if(!item.damage || item.damage === '-') return 0;
        const dmg = item.damage.toLowerCase();
        let val = 0;
        if(dmg.includes('d4')) val = 4;
        else if(dmg.includes('d6')) val = 6;
        else if(dmg.includes('d8')) val = 8;
        else if(dmg.includes('d10')) val = 10;
        else if(dmg.includes('d12')) val = 12;
        
        let multiplier = 1;
        const match = dmg.match(/^(\d+)d/);
        if(match) multiplier = parseInt(match[1]);
        
        return val * multiplier;
    }

    function setupStoreListeners() {
        document.getElementById('btn-close-store').addEventListener('click', () => {
            document.getElementById('store-modal').classList.remove('active');
        });

        // Tabs
        document.querySelectorAll('#shop-categories .store-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('#shop-categories .store-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentShopCategory = e.target.dataset.cat;
                
                const btnMobileOwned = document.getElementById('btn-mobile-owned-items');
                if (btnMobileOwned) btnMobileOwned.classList.remove('active-owned');
                
                updateStoreSortOptions();
                renderStore();
                document.getElementById('shop-grid').scrollTop = 0;
                e.target.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'});
            });
        });

        // Toggle Filters
        const btnToggleFilters = document.getElementById('btn-toggle-filters');
        if (btnToggleFilters) {
            btnToggleFilters.addEventListener('click', () => {
                const row = document.getElementById('shop-filters-row');
                row.style.display = row.style.display === 'none' ? 'flex' : 'none';
            });
        }

        // Inputs
        ['shop-search', 'shop-price-min', 'shop-price-max', 'shop-minstr', 'shop-sort-by', 'shop-search-mobile'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.addEventListener('input', renderStore);
        });
        const noAmmoEl = document.getElementById('shop-no-ammo');
        if(noAmmoEl) noAmmoEl.addEventListener('change', renderStore);
        
        const infFundsEl = document.getElementById('shop-infinite-funds');
        if(infFundsEl) infFundsEl.addEventListener('change', () => { calculateAll(); renderStore(); renderCart(); });

        // Mobile UI Hooks
        const btnCloseMobile = document.getElementById('btn-close-store-mobile');
        if (btnCloseMobile) btnCloseMobile.addEventListener('click', () => { document.getElementById('store-modal').classList.remove('active'); });

        const btnToggleFiltersMobile = document.getElementById('btn-toggle-filters-mobile');
        if (btnToggleFiltersMobile) btnToggleFiltersMobile.addEventListener('click', () => {
            const row = document.getElementById('shop-filters-row');
            row.style.display = row.style.display === 'none' ? 'flex' : 'none';
        });

        // Mobile Carousel & Toggle "Owned" Logic
        const shopCatList = [
            { cat: 'all', label: 'Todas as Áreas' },
            { cat: 'Armas Brancas', label: 'Armas Brancas' },
            { cat: 'Armas de Fogo/Longa Distância', label: 'Longa Distância' },
            { cat: 'Armaduras', label: 'Armaduras' },
            { cat: 'Escudos', label: 'Escudos' },
            { cat: 'Utilidades', label: 'Utilidades' }
        ];
        let mobileCatIndex = 0;
        
        function updateMobileCapsule() {
            const capsuleText = document.getElementById('car-capsule-text');
            if (capsuleText) capsuleText.textContent = shopCatList[mobileCatIndex].label;
            
            currentShopCategory = shopCatList[mobileCatIndex].cat;
            
            // Sync with desktop tabs
            document.querySelectorAll('#shop-categories .store-tab-btn').forEach(b => {
                const isActive = b.dataset.cat === currentShopCategory;
                b.classList.toggle('active', isActive);
            });
            
            updateStoreSortOptions();
            renderStore();
            const grid = document.getElementById('shop-grid');
            if (grid) grid.scrollTop = 0;
        }

        const btnCarLeft = document.getElementById('btn-car-left');
        if (btnCarLeft) {
            btnCarLeft.addEventListener('click', () => {
                const btnMobileOwned = document.getElementById('btn-mobile-owned-items');
                if (btnMobileOwned) btnMobileOwned.classList.remove('active-owned');
                mobileCatIndex = (mobileCatIndex - 1 + shopCatList.length) % shopCatList.length;
                updateMobileCapsule();
            });
        }
        
        const btnCarRight = document.getElementById('btn-car-right');
        if (btnCarRight) {
            btnCarRight.addEventListener('click', () => {
                const btnMobileOwned = document.getElementById('btn-mobile-owned-items');
                if (btnMobileOwned) btnMobileOwned.classList.remove('active-owned');
                mobileCatIndex = (mobileCatIndex + 1) % shopCatList.length;
                updateMobileCapsule();
            });
        }

        const btnMobileOwned = document.getElementById('btn-mobile-owned-items');
        if (btnMobileOwned) {
            btnMobileOwned.addEventListener('click', () => {
                btnMobileOwned.classList.toggle('active-owned');
                
                if (btnMobileOwned.classList.contains('active-owned')) {
                    currentShopCategory = 'owned';
                    const capsule = document.getElementById('car-capsule-text');
                    if(capsule) capsule.textContent = '🎒 Meus Itens';
                    
                    document.querySelectorAll('#shop-categories .store-tab-btn').forEach(b => b.classList.remove('active'));
                    updateStoreSortOptions();
                    renderStore();
                    const grid = document.getElementById('shop-grid');
                    if (grid) grid.scrollTop = 0;
                } else {
                    // Restore previous carousel category
                    updateMobileCapsule();
                }
            });
        }

        const btnMobileOpenCart = document.getElementById('btn-mobile-open-cart');
        const storeSidebarCart = document.getElementById('store-sidebar-cart');
        if (btnMobileOpenCart && storeSidebarCart) {
            btnMobileOpenCart.addEventListener('click', () => storeSidebarCart.classList.add('cart-open'));
        }
        
        const btnCloseCartMobile = document.getElementById('btn-close-cart-mobile');
        if (btnCloseCartMobile && storeSidebarCart) {
            btnCloseCartMobile.addEventListener('click', () => storeSidebarCart.classList.remove('cart-open'));
        }

        // Cart Actions
        const btnEmptyCart = document.getElementById('btn-empty-cart');
        const overlayConfirm = document.getElementById('cart-confirm-overlay');
        const btnConfirmYes = document.getElementById('btn-confirm-empty-yes');
        const btnConfirmNo = document.getElementById('btn-confirm-empty-no');

        if(btnEmptyCart && overlayConfirm) {
            btnEmptyCart.addEventListener('click', () => {
                if(storeCart.length > 0) {
                    overlayConfirm.style.display = 'flex';
                }
            });

            btnConfirmNo.addEventListener('click', () => {
                overlayConfirm.style.display = 'none';
            });

            btnConfirmYes.addEventListener('click', () => {
                storeCart.length = 0;
                renderCart();
                overlayConfirm.style.display = 'none';
                showToast("Carrinho esvaziado com sucesso!", "success");
            });
        }

        const btnCheckout = document.getElementById('btn-checkout-cart');
        if(btnCheckout) {
            btnCheckout.addEventListener('click', () => {
                let cartTotal = storeCart.reduce((sum, ci) => sum + (ci.cost * ci.qty), 0);
                let moneySpent = 0;
                state.equipment.forEach(eqId => { const d = dEq.find(x => x.id === eqId); if(d) moneySpent += d.cost; });
                const availableFunds = (500 + (state.boughtFunds * 500)) - moneySpent;
                const isInfinite = document.getElementById('shop-infinite-funds')?.checked;

                if (!isInfinite && cartTotal > availableFunds) {
                    alert(`Fundos insuficientes! O carrinho custa $${cartTotal}, mas você só tem $${availableFunds}.`);
                    return;
                }

                storeCart.forEach(ci => {
                    addEquipment(ci.id, ci.qty); // This adds to state and handles multiple additions natively inside calculateAll / render logic! Wait addEquipment handles array pushes.
                });
                
                AudioEngine.playCoin();
                storeCart = [];
                renderCart();
                renderStore();
                showToast("Compra finalizada com sucesso!");
            });
        }
    }

    function updateStoreSortOptions() {
        const cat = currentShopCategory;
        const sortBy = document.getElementById('shop-sort-by');
        if (!sortBy) return;

        // Reset to Alpha to prevent invalid selections if necessary
        // sortBy.value = 'alpha'; // optional

        // Hide/Show context-specific sort options
        document.querySelectorAll('.sort-opt-dmg').forEach(el => el.style.display = (cat === 'Armas Brancas' || cat === 'Armas de Fogo/Longa Distância' || cat === 'all') ? '' : 'none');
        document.querySelectorAll('.sort-opt-str').forEach(el => el.style.display = (cat === 'Armas Brancas' || cat === 'Armas de Fogo/Longa Distância' || cat === 'Armaduras' || cat === 'all') ? '' : 'none');
        document.querySelectorAll('.sort-opt-armor').forEach(el => el.style.display = (cat === 'Armaduras' || cat === 'Escudos' || cat === 'all') ? '' : 'none');
    }

    function openStore() {
        try {
            document.getElementById('store-modal').classList.add('active');
            updateStoreSortOptions();
            renderStore();
            renderCart();
        } catch(e) {
            console.error("Store error: ", e);
            alert("Erro ao abrir catálogo: " + e.message);
        }
    }

    function renderCart() {
        const list = document.getElementById('cart-items-list');
        const countSpan = document.getElementById('cart-total-value');
        const btnCheckout = document.getElementById('btn-checkout-cart');

        if (!list) return;

        list.innerHTML = '';
        let total = 0;

        if (storeCart.length === 0) {
            list.innerHTML = '<div style="text-align:center; padding: 20px; font-size: 0.8rem; color: #888;">Nenhum item adicionado à lista.</div>';
            countSpan.textContent = '$0';
            btnCheckout.disabled = true;
            return;
        }

        storeCart.forEach((item, index) => {
            const subtotal = item.cost * item.qty;
            total += subtotal;

            const ci = document.createElement('div');
            ci.className = 'cart-item';
            ci.innerHTML = `
                <div class="cart-item-header">
                    <span class="cart-item-title">${item.name}</span>
                    <button class="btn-remove-cart" data-index="${index}" title="Remover">🗑️</button>
                </div>
                <div class="cart-item-controls">
                    <div class="qty-selector" style="transform: scale(0.9); transform-origin: left center;">
                        <button class="qty-btn dec-cart-item" data-index="${index}">-</button>
                        <span style="width: 15px; display: inline-block; text-align: center;">${item.qty}</span>
                        <button class="qty-btn inc-cart-item" data-index="${index}" data-cost="${item.cost}">+</button>
                    </div>
                    <span class="cart-item-price">$${subtotal}</span>
                </div>
            `;
            list.appendChild(ci);
        });

        countSpan.textContent = '$' + total;

        let moneySpent = 0;
        state.equipment.forEach(eqId => { const def = dEq.find(x => x.id === eqId); if(def) moneySpent += def.cost; });
        const availableFunds = (500 + (state.boughtFunds * 500)) - moneySpent;
        const isInfinite = document.getElementById('shop-infinite-funds')?.checked;

        btnCheckout.disabled = (!isInfinite && total > availableFunds) || storeCart.length === 0;

        list.querySelectorAll('.btn-remove-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                storeCart.splice(idx, 1);
                renderCart();
            });
        });

        list.querySelectorAll('.dec-cart-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                if (storeCart[idx].qty > 1) {
                    storeCart[idx].qty--;
                    renderCart();
                }
            });
        });

        list.querySelectorAll('.inc-cart-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                const cost = parseInt(e.currentTarget.dataset.cost);
                
                // Currently in cart
                const cartTotal = storeCart.reduce((sum, ci) => sum + (ci.cost * ci.qty), 0);
                
                if (cartTotal + cost <= availableFunds) {
                    storeCart[idx].qty++;
                    renderCart();
                } else {
                    showToast(`Fundos insuficientes para adicionar mais deste item!`, "warning");
                }
            });
        });
    }

    function renderStore() {
        const grid = document.getElementById('shop-grid');
        grid.innerHTML = '';
        
        const searchInputD = document.getElementById('shop-search');
        const searchInputM = document.getElementById('shop-search-mobile');
        const search = window.innerWidth <= 768 && searchInputM ? searchInputM.value.toLowerCase() : (searchInputD ? searchInputD.value.toLowerCase() : '');
        const pMin = parseInt(document.getElementById('shop-price-min').value) || 0;
        const pMax = parseInt(document.getElementById('shop-price-max').value) || 999999;
        const maxMinStr = parseInt(document.getElementById('shop-minstr').value) || 99;
        const noAmmoObj = document.getElementById('shop-no-ammo');
        const noAmmo = noAmmoObj ? noAmmoObj.checked : false;
        
        const sortMode = document.getElementById('shop-sort-by') ? document.getElementById('shop-sort-by').value : 'alpha';

        let moneySpent = 0;
        state.equipment.forEach(eqId => { const def = dEq.find(d => d.id === eqId); if(def) moneySpent += def.cost; });
        const maxFunds = 500 + (state.boughtFunds * 500);
        const availableFunds = maxFunds - moneySpent;
        const isInfinite = document.getElementById('shop-infinite-funds')?.checked;
        
        document.querySelectorAll('.store-modal-funds-val').forEach(el => el.textContent = isInfinite ? '∞' : availableFunds);
    
        let filteredItems = dEq.filter(item => {
            if(currentShopCategory === 'owned') {
                if(!state.equipment || !state.equipment.includes(item.id)) return false;
            } else if(currentShopCategory !== 'all' && item.category !== currentShopCategory) {
                return false;
            }
            if(search && !item.name.toLowerCase().includes(search)) return false;
            if(item.cost < pMin || item.cost > pMax) return false;
            if(item.minStr > maxMinStr) return false;
            if(noAmmo && item.requiresAmmo) return false;
            return true;
        });

        // Apply Sorting
        filteredItems.sort((a, b) => {
            if (sortMode === 'price_asc') return a.cost - b.cost;
            if (sortMode === 'price_desc') return b.cost - a.cost;
            if (sortMode === 'weight_asc') return extractWeight(a) - extractWeight(b);
            if (sortMode === 'weight_desc') return extractWeight(b) - extractWeight(a);
            if (sortMode === 'dmg_asc') return extractDmgMax(a) - extractDmgMax(b);
            if (sortMode === 'dmg_desc') return extractDmgMax(b) - extractDmgMax(a);
            if (sortMode === 'str_asc') return (a.minStr||0) - (b.minStr||0);
            if (sortMode === 'str_desc') return (b.minStr||0) - (a.minStr||0);
            if (sortMode === 'armor_asc') return (a.armor||0) - (b.armor||0);
            if (sortMode === 'armor_desc') return (b.armor||0) - (a.armor||0);
            // Default: alpha
            return a.name.localeCompare(b.name);
        });

        if(filteredItems.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding: 20px;">Nenhum equipamento localizou as suas restrições de busca.</div>';
            return;
        }

        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card-pro';
            
            let statsHtml = '';
            if(item.damage && item.damage !== '-') statsHtml += `<span>🥊 <strong>Dano:</strong> ${item.damage}</span>`;
            if(item.minStr > 0) statsHtml += `<span>💪 <strong>Mín Força:</strong> d${item.minStr}</span>`;
            if(item.armor > 0) statsHtml += `<span>🛡️ <strong>Armadura:</strong> +${item.armor}</span>`;
            if(item.requiresAmmo) statsHtml += `<span>🏹 <strong>Exige Munição</strong></span>`;
            if(item.extraBenefits) statsHtml += `<div class="item-p-desc">${item.extraBenefits}</div>`;
    
            const isInfinite = document.getElementById('shop-infinite-funds')?.checked;
            const canAfford = isInfinite || item.cost <= availableFunds;
            const ownedCount = state.equipment.filter(eq => eq === item.id).length;
            
            let qtyRefundHtml = '';
            if (ownedCount > 0) {
                let qtySelector = '';
                if(ownedCount > 1) {
                    qtySelector = `
                        <div class="qty-selector">
                            <button class="qty-btn dec-refund" data-id="${item.id}">-</button>
                            <span id="refund-qty-val-${item.id}">1</span>
                            <button class="qty-btn inc-refund" data-id="${item.id}" data-max="${ownedCount}">+</button>
                        </div>
                    `;
                } else {
                    qtySelector = `<span id="refund-qty-val-${item.id}" style="display:none;">1</span>`;
                }

                qtyRefundHtml = `
                    <div class="item-p-refund-area">
                        <span style="color:#e74c3c; font-weight:bold; font-size:0.8rem;">🎒 Possui: ${ownedCount}</span>
                        ${qtySelector}
                        <button class="btn-refund-sm" data-id="${item.id}" data-cost="${item.cost}">Vender</button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div style="flex: 1 1 auto; display: flex; flex-direction: column;">
                    <div class="item-p-header">
                        <h4 class="item-p-title">${item.name}</h4>
                        <span class="item-p-price">$${item.cost}</span>
                    </div>
                    <div class="item-p-stats">${statsHtml}</div>
                </div>
                <div style="flex: 0 0 auto; margin-top: auto;">
                    <div class="item-p-actions">
                        <button class="btn-cart-btn" data-id="${item.id}" data-name="${item.name}" data-cost="${item.cost}">+ 🛒</button>
                        <button class="btn-buy-btn ${!canAfford ? 'disabled' : ''}" style="${!canAfford ? 'opacity:0.5;cursor:not-allowed;' : ''}" data-id="${item.id}" data-cost="${item.cost}" ${!canAfford ? 'disabled' : ''}>
                            ⚡ Comprar
                        </button>
                    </div>
                    ${qtyRefundHtml}
                </div>
                <div class="purchase-qty-capsule">
                    <button class="qty-btn dec-buy" data-id="${item.id}">-</button>
                    <span id="buy-qty-val-${item.id}">1</span>
                    <button class="qty-btn inc-buy" data-id="${item.id}" data-cost="${item.cost}">+</button>
                </div>
            `;
            grid.appendChild(card);
        });
    
        // Actions Binding
        grid.querySelectorAll('.dec-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const span = document.getElementById(`buy-qty-val-${id}`);
                let v = parseInt(span.textContent);
                if(v > 1) span.textContent = v - 1;
            });
        });

        grid.querySelectorAll('.inc-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const cost = parseInt(e.currentTarget.dataset.cost);
                const span = document.getElementById(`buy-qty-val-${id}`);
                let v = parseInt(span.textContent);

                let cMoneySpent = 0;
                state.equipment.forEach(eqId => { const def = dEq.find(x => x.id === eqId); if(def) cMoneySpent += def.cost; });
                const cMaxFunds = 500 + (state.boughtFunds * 500);
                const cAvailableFunds = cMaxFunds - cMoneySpent;
                const isInfinite = document.getElementById('shop-infinite-funds')?.checked;

                if (isInfinite || (v + 1) * cost <= cAvailableFunds) {
                    span.textContent = v + 1;
                } else {
                    showToast(`Fundos insuficientes para mais unidades!`, "warning");
                }
            });
        });

        grid.querySelectorAll('.btn-buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
               const id = e.currentTarget.dataset.id;
               const cost = parseInt(e.currentTarget.dataset.cost);
               const qty = parseInt(document.getElementById(`buy-qty-val-${id}`)?.textContent) || 1;
               
               // Re-verify funds
               let cMoneySpent = 0;
               state.equipment.forEach(eqId => { const def = dEq.find(x => x.id === eqId); if(def) cMoneySpent += def.cost; });
               const cMaxFunds = 500 + (state.boughtFunds * 500);
               const cAvailableFunds = cMaxFunds - cMoneySpent;
               const isInfinite = document.getElementById('shop-infinite-funds')?.checked;
               
               if(!isInfinite && cost * qty > cAvailableFunds) {
                   showToast(`Fundos insuficientes!`, "error");
                   return;
               }

               AudioEngine.playCoin();
               for(let i=0; i<qty; i++) {
                   addEquipment(id, 1);
               }
               showToast(`Comprado ${qty}x!`, "success");
               renderStore();
               renderCart();
            });
        });

        grid.querySelectorAll('.btn-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const name = e.currentTarget.dataset.name;
                const cost = parseInt(e.currentTarget.dataset.cost);
                const qty = parseInt(document.getElementById(`buy-qty-val-${id}`)?.textContent) || 1;
                
                // Add or increment in cart
                let existing = storeCart.find(ci => ci.id === id);
                if (existing) {
                    existing.qty += qty;
                } else {
                    storeCart.push({ id, name, cost, qty });
                }
                
                showToast(`Adicionado ao carrinho (${qty}x)!`, "info");
                renderCart();
                document.getElementById(`buy-qty-val-${id}`).textContent = "1"; // reset qty
            });
        });

        // Refund Binding
        grid.querySelectorAll('.dec-refund').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const span = document.getElementById(`refund-qty-val-${id}`);
                let v = parseInt(span.textContent);
                if(v > 1) span.textContent = v - 1;
            });
        });
        grid.querySelectorAll('.inc-refund').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const max = parseInt(e.currentTarget.dataset.max);
                const span = document.getElementById(`refund-qty-val-${id}`);
                let v = parseInt(span.textContent);
                if(v < max) span.textContent = v + 1;
            });
        });
        grid.querySelectorAll('.btn-refund-sm').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const cost = parseInt(e.currentTarget.dataset.cost);
                const amountToRefund = parseInt(document.getElementById(`refund-qty-val-${id}`).textContent) || 1;
                
                // Remove exactly amountToRefund instances of id from state.equipment
                let removedCount = 0;
                for (let i = state.equipment.length - 1; i >= 0; i--) {
                    if (state.equipment[i] === id && removedCount < amountToRefund) {
                        state.equipment.splice(i, 1);
                        removedCount++;
                    }
                }
                
                if (removedCount > 0) {
                    AudioEngine.playClick();
                    showToast(`Reembolsado ${removedCount}x ($${cost * removedCount})`, "success");
                    calculateAll(); // rebuilds UI and saves
                    renderStore();
                    renderCart();
                    renderEquipmentList(); // Updates the character sheet visual list
                }
            });
        });
    }

    function setupModeToggle() {
        const btnEdit = document.getElementById('btn-mode-edit');
        const btnAesthetic = document.getElementById('btn-mode-aesthetic');
        
        btnEdit.addEventListener('click', () => {
            isAesthetic = false;
            btnEdit.classList.add('active');
            btnAesthetic.classList.remove('active');
            document.body.classList.remove('mode-aesthetic');
            document.getElementById('character-sheet').style.display = 'block';
            document.getElementById('epic-presentation-card').style.display = 'none';
            document.getElementById('aesthetic-customizer').style.display = 'none';
        });
        
        btnAesthetic.addEventListener('click', () => {
            isAesthetic = true;
            btnAesthetic.classList.add('active');
            btnEdit.classList.remove('active');
            document.body.classList.add('mode-aesthetic');
            document.getElementById('character-sheet').style.display = 'none';
            document.getElementById('epic-presentation-card').style.display = 'flex';
            document.getElementById('aesthetic-customizer').style.display = 'block';
            if (typeof renderEpicCard === 'function') renderEpicCard();
        });
    }

    function renderEpicCard() {
        const charName = document.getElementById('char-name');
        const cName = charName ? charName.value : state.name || 'Herói Desconhecido';
        const clOpts = dClasses.find(c => c.id === state.charClass);
        const clName = clOpts ? clOpts.name : '';
        const myRace = dRaces.find(r => r.id === state.race);
        const raceStr = myRace ? myRace.name : 'Desconhecida';
        
        let titleBadge = raceStr;
        if(clName) titleBadge = titleBadge ? `${titleBadge} ${clName}` : clName;

        const epicCharName = document.getElementById('epic-char-name');
        if (epicCharName) epicCharName.textContent = cName.toUpperCase();
        
        const epicCharRace = document.getElementById('epic-char-race');
        if (epicCharRace) epicCharRace.textContent = titleBadge.toUpperCase();
        
        const imgEl = document.getElementById('epic-portrait');
        const miniPortrait = document.getElementById('mini-portrait-img');
        
        if (state.uploadedPortraitSrc) {
            imgEl.src = state.uploadedPortraitSrc;
            if (miniPortrait) {
                miniPortrait.src = state.uploadedPortraitSrc;
                // Reveal the preview UI if it was restored
                const previewContainer = document.getElementById('mini-preview-container');
                const btnClear = document.getElementById('btn-clear-image');
                const instructions = document.querySelector('.upload-instructions');
                if (previewContainer) previewContainer.style.display = 'block';
                if (btnClear) btnClear.style.display = 'block';
                if (instructions) instructions.style.display = 'none';
            }
            
            // Re-calculate math dimensions if restoring from save data
            const tempImg = new Image();
            tempImg.onload = () => {
                if (typeof natW !== 'undefined') {
                    // Update global natW / natH if possible, handled mostly by applyPortraitImage but good to ensure
                    // Actually, JavaScript scope might not let us reassign natW if it's let in initCardExporter.
                    // Instead, we ensure it's calculated during the proper event or we dispatch a custom event.
                }
            };
            tempImg.src = state.uploadedPortraitSrc;
        } else {
            const svgDefault = 'data:image/svg+xml;utf8,<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="%231a1a1a"/></svg>';
            imgEl.src = svgDefault;
            if (miniPortrait) miniPortrait.src = '';
        }

        // Medallions
        document.getElementById('epic-parry').textContent = document.getElementById('stat-parry').textContent;
        const resText = document.getElementById('stat-toughness').textContent;
        document.getElementById('epic-toughness').textContent = resText.split(' ')[0]; // removes "(+x)"
        document.getElementById('epic-pace').textContent = document.getElementById('stat-pace').textContent;
        const benniesEl = document.getElementById('stat-bennies');
        document.getElementById('epic-bennies').textContent = benniesEl ? benniesEl.textContent : '3';

        // Lists
        const listH = document.getElementById('epic-list-hindrances');
        listH.innerHTML = '';
        state.hindrances.forEach(h => {
             const def = dHinds.find(dh => dh.id === h);
             if(def) listH.innerHTML += `<li>${def.name}</li>`;
             else if(typeof h === 'object') {
                 const dof = dHinds.find(dh => dh.id === h.id);
                 if(dof) listH.innerHTML += `<li>${dof.name}</li>`;
             }
        });

        const listE = document.getElementById('epic-list-edges');
        listE.innerHTML = '';
        
        let epicActiveEdges = [...state.edges];
        const edgeClOpts = dClasses.find(c => c.id === state.charClass);
        if(edgeClOpts && edgeClOpts.edges) {
            epicActiveEdges.push(...edgeClOpts.edges);
        }
        
        epicActiveEdges.forEach(eId => {
             const idStr = typeof eId === 'object' ? eId.id : eId;
             const def = dEdges.find(de => de.id === idStr);
             if(def) {
                 let nameToDisplay = def.name;
                 if (typeof eId === 'object' && eId.subName) nameToDisplay += ` (${eId.subName})`;
                 listE.innerHTML += `<li>${nameToDisplay}</li>`;
             }
        });
        


        const listP = document.getElementById('epic-list-powers');
        if(listP) {
             listP.innerHTML = '';
             state.powers.forEach(pId => {
                  const def = dPowers.find(dp => dp.id === pId);
                  if(def) listP.innerHTML += `<li style="background:var(--accent-red, #ff4c4c); color:white; padding: 2px 8px; border-radius:12px; font-size: 0.8rem; font-weight:bold;">${def.name}</li>`;
             });
             const powersSect = document.getElementById('epic-powers-section');
             if(powersSect) {
                  powersSect.style.display = state.powers.length > 0 ? 'block' : 'none';
                  const countP = document.getElementById('epic-powers-count');
                  if(countP) countP.textContent = state.powers.length;
             }
        }

        const getAbbr = (name) => {
            if(name === 'Agilidade') return 'Agi.';
            if(name === 'Astúcia') return 'Ast.';
            if(name === 'Espírito') return 'Esp.';
            if(name === 'Força') return 'For.';
            if(name === 'Vigor') return 'Vig.';
            return name.substring(0,3) + '.';
        };

        // Attributes Caps
        let attrsHTML = '';
        dAttrs.forEach(a => {
            const baseVal = state.attributes[a.id];
            if(baseVal) {
                const raceMod = state.raceAttrMods && state.raceAttrMods[a.id] ? state.raceAttrMods[a.id] : 0;
                let finalVal = baseVal + raceMod;
                if(finalVal < 1) finalVal = 1;
                if(finalVal >= DICE.length) finalVal = DICE.length - 1; // safe bounds
                
                attrsHTML += `<div class="attr-capsule">
                    <div class="attr-name">${getAbbr(a.name)}</div>
                    <div class="attr-dice-circle">${DICE[finalVal]}</div>
                </div>`;
            }
        });
        document.getElementById('epic-attributes').innerHTML = attrsHTML;

        // Skills Caps
        let skillsHTML = '';
        dSkills.forEach(s => {
             if(state.skills[s.id]) {
                 const eld = state.elderlySkills[s.id] || 0;
                 const val = state.skills[s.id] + eld;
                 skillsHTML += `<div class="skill-capsule">
                    <div class="skill-name">${s.name}</div>
                    <div class="skill-dice-circle">${DICE[val > 5 ? 5 : val]}</div>
                 </div>`;
             }
        });
        document.getElementById('epic-skills').innerHTML = skillsHTML;

        // Equipment List
        const eqList = document.getElementById('epic-equipment-list');
        eqList.innerHTML = '';
        let totalCost = 0;
        let cats = {};
        state.equipment.forEach(eId => {
             const def = dEq.find(d => d.id === eId);
             if(def) {
                 totalCost += def.cost;
                 if(!cats[def.category]) cats[def.category] = [];
                 cats[def.category].push(def);
             }
        });
        
        // Calculate remaining funds
        let hasPobreza = state.hindrances && state.hindrances.includes('h-pobreza');
        let baseFunds = hasPobreza ? 250 : 500;
        let maxFunds = baseFunds + ((state.boughtFunds || 0) * baseFunds);
        let availableFunds = maxFunds - totalCost;
        
        const isInfinite = document.getElementById('shop-infinite-funds')?.checked;
        document.getElementById('epic-funds').textContent = isInfinite ? '∞ Livre' : ('$' + availableFunds);
        
        Object.keys(cats).forEach(catName => {
            // Count quantities
            let freq = {}; 
            cats[catName].forEach(item => { freq[item.name] = (freq[item.name] || 0) + 1; });
            const itemStrs = Object.keys(freq).map(k => freq[k] > 1 ? `${k} (x${freq[k]})` : k);
            eqList.innerHTML += `<div><span class="epic-eq-cat">${catName}:</span> ${itemStrs.join(', ')}</div>`;
        });
    }

    // Function to handle aesthetic mode customization parameters
    function initEpicCustomizer() {
        // Initialize Accordion Logic 
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const body = item.querySelector('.accordion-body');
                const wasActive = item.classList.contains('active');
                
                // Close all others
                document.querySelectorAll('.accordion-item').forEach(other => {
                    other.classList.remove('active');
                    const otherBody = other.querySelector('.accordion-body');
                    if(otherBody) otherBody.style.display = 'none';
                });
                
                // Toggle clicked
                if (!wasActive) {
                    item.classList.add('active');
                    if(body) body.style.display = 'block';
                }
            });
        });

        const titleContainer = document.getElementById('epic-title-container');
        const epicCharName = document.getElementById('epic-char-name');
        const divTop = document.getElementById('epic-divider-top');
        const divBottom = document.getElementById('epic-divider-bottom');
        if (!epicCharName || !titleContainer) return;

        // State defaults
        let state = {
            vpos: 'top',
            hpos: 'center',
            fill: 'solid',
            solidColor: '#ffeba1',
            gradDir: 'to right',
            gradColors: [
                { color: '#ffeba1', pos: 0 },
                { color: '#b88645', pos: 50 },
                { color: '#4a3821', pos: 100 }
            ],
            opacity: 1,
            effects: {
                shadow: { active: false, x: 2, y: 2, blur: 4, color: '#000000' },
                glow: { active: false, blur: 10, color: '#dcb360' },
                outline: { active: false, blur: 2, color: '#000000' }
            },
            hasDivider: false,
            divColor: '#dcb360',
            divThickness: 2,
            divWidth: 80,
            imgZoom: 1,
            imgPanX: 0.5,
            imgPanY: 0.2,
            imgHeight: 600,
            miniZoom: 1,
            miniPanX: 0.5,
            miniPanY: 0.2,
            miniHeight: 600,
            bgOpacity: 0.95,
            imgNatW: 1,
            imgNatH: 1
        };

        // Epic Portrait Panning Maths
        const epicPortrait = document.getElementById('epic-portrait');
        const epicHeaderBg = document.querySelector('.epic-header-bg');

        if (epicPortrait) {
            epicPortrait.addEventListener('load', () => {
                if (epicPortrait.naturalWidth > 1) {
                    state.imgNatW = epicPortrait.naturalWidth;
                    state.imgNatH = epicPortrait.naturalHeight;
                    renderImageTransform();
                }
            });
            if (epicPortrait.complete && epicPortrait.naturalWidth > 1) {
                state.imgNatW = epicPortrait.naturalWidth;
                state.imgNatH = epicPortrait.naturalHeight;
            }
        }

        const renderImageTransform = () => {
            const cW = 800;
            const cH = 1700;
            const baseScale = Math.max(cW / state.imgNatW, cH / state.imgNatH);

            if (epicPortrait && epicPortrait.src !== '') {
                const scaledW = state.imgNatW * baseScale * state.imgZoom;
                const scaledH = state.imgNatH * baseScale * state.imgZoom;
                const excessX = scaledW - cW;
                const excessY = scaledH - cH;
                state.imgPanX = Math.max(0, Math.min(1, state.imgPanX));
                state.imgPanY = Math.max(0, Math.min(1, state.imgPanY));
                const leftOffset = -1 * (excessX * state.imgPanX);
                const topOffset = -1 * (excessY * state.imgPanY);
                epicPortrait.style.width = `${scaledW}px`;
                epicPortrait.style.height = `${scaledH}px`;
                epicPortrait.style.left = `${leftOffset}px`;
                epicPortrait.style.top = `${topOffset}px`;
            }

            const miniPortrait = document.getElementById('mini-portrait-img');
            if (miniPortrait && miniPortrait.src !== '') {
                const miniScaledW = state.imgNatW * baseScale * state.miniZoom;
                const miniScaledH = state.imgNatH * baseScale * state.miniZoom;
                const miniExcessX = miniScaledW - cW;
                const miniExcessY = miniScaledH - cH;
                state.miniPanX = Math.max(0, Math.min(1, state.miniPanX));
                state.miniPanY = Math.max(0, Math.min(1, state.miniPanY));
                const miniLeftOffset = -1 * (miniExcessX * state.miniPanX);
                const miniTopOffset = -1 * (miniExcessY * state.miniPanY);
                miniPortrait.style.width = `${miniScaledW}px`;
                miniPortrait.style.height = `${miniScaledH}px`;
                miniPortrait.style.left = `${miniLeftOffset}px`;
                miniPortrait.style.top = `${miniTopOffset}px`;
            }
        };

        const renderLayout = () => {
            const spacer = document.getElementById('epic-image-spacer');
            const bgMask = document.getElementById('epic-content-bg');
            const wrapper = document.querySelector('.epic-card-wrapper');
            const miniLayer = document.getElementById('mini-data-layer');
            const miniSpacer = document.getElementById('mini-image-spacer');
            
            // Invert the logical behavior: higher numbers mean higher info box start (smaller spacer)
            // Giving extra 40px clearance (base 1350 instead of 1310) to prevent overlap with race text
            const calcEpicSpacer = 1350 - state.imgHeight;
            const calcMiniSpacer = 1350 - state.miniHeight;

            // Fixed base spacer logic
            if (spacer) {
                spacer.style.height = `${calcEpicSpacer}px`;
                spacer.style.display = 'block';
            }
            if (miniSpacer) {
                miniSpacer.style.height = `${calcMiniSpacer}px`;
                miniSpacer.style.display = 'block';
            }

            if (bgMask) {
                bgMask.style.top = `${calcEpicSpacer}px`;
                bgMask.style.bottom = 'auto';
                bgMask.style.height = `${Math.max(0, 1700 - calcEpicSpacer)}px`;
                const op = state.bgOpacity;
                bgMask.style.background = `linear-gradient(to bottom, rgba(20,15,10,0) 0%, rgba(20,15,10,${Math.min(1, op)}) 250px, rgba(10,5,0,${op}) 100%)`;
            }
            
            const miniBgMask = document.getElementById('mini-content-bg');
            if (miniBgMask) {
                miniBgMask.style.top = `${calcMiniSpacer}px`;
                miniBgMask.style.bottom = 'auto';
                miniBgMask.style.height = `${Math.max(0, 1700 - calcMiniSpacer)}px`;
                const op = state.bgOpacity;
                miniBgMask.style.background = `linear-gradient(to bottom, rgba(20,15,10,0) 0%, rgba(20,15,10,${Math.min(1, op)}) 250px, rgba(10,5,0,${op}) 100%)`;
            }
        };

        const renderTitle = () => {
            // Container Positioning
            if (state.vpos === 'bottom') {
                titleContainer.classList.add('bottom-pos');
            } else {
                titleContainer.classList.remove('bottom-pos');
            }

            // Container Alignment
            titleContainer.style.justifyContent = state.hpos === 'left' ? 'flex-start' : (state.hpos === 'right' ? 'flex-end' : 'center');
            titleContainer.style.paddingLeft = state.hpos === 'left' ? '40px' : '0';
            titleContainer.style.paddingRight = state.hpos === 'right' ? '40px' : '0';
            epicCharName.style.textAlign = state.hpos;

            // Fill & Gradient
            if (state.fill === 'solid') {
                epicCharName.classList.remove('is-gradient');
                epicCharName.style.background = 'none';
                epicCharName.style.webkitBackgroundClip = 'unset';
                epicCharName.style.webkitTextFillColor = 'unset';
                epicCharName.style.color = state.solidColor;
            } else {
                epicCharName.classList.add('is-gradient');
                const gradStops = state.gradColors.map(c => `${c.color} ${c.pos}%`).join(', ');
                const isRadial = state.gradDir === 'radial';
                const gradSyntax = isRadial ? `radial-gradient(circle, ${gradStops})` : `linear-gradient(${state.gradDir}, ${gradStops})`;
                epicCharName.style.background = gradSyntax;
                epicCharName.style.webkitBackgroundClip = 'text';
                epicCharName.style.color = 'transparent';
                epicCharName.style.webkitTextFillColor = 'transparent';
            }

            // Opacity (only affects text)
            epicCharName.style.opacity = state.opacity;

            // Effects
            let dropShadows = [];
            if (state.effects.shadow.active) {
                const e = state.effects.shadow;
                dropShadows.push(`drop-shadow(${e.x}px ${e.y}px ${e.blur}px ${e.color})`);
            }
            if (state.effects.glow.active) {
                const e = state.effects.glow;
                dropShadows.push(`drop-shadow(0px 0px ${e.blur}px ${e.color}) drop-shadow(0px 0px ${e.blur * 2}px ${e.color})`);
            }
            if (state.effects.outline.active) {
                const o = state.effects.outline.blur; const c = state.effects.outline.color;
                dropShadows.push(`drop-shadow(-${o}px -${o}px 0 ${c}) drop-shadow(${o}px -${o}px 0 ${c}) drop-shadow(-${o}px ${o}px 0 ${c}) drop-shadow(${o}px ${o}px 0 ${c})`);
            }

            if (dropShadows.length === 0) {
                epicCharName.style.filter = 'none';
                epicCharName.style.textShadow = '';
            } else {
                epicCharName.style.filter = dropShadows.join(' ');
                epicCharName.style.textShadow = 'none'; // Clear text shadow to ensure filter holds rendering explicitly
            }

            // Divider Lines
            divTop.style.display = 'none';
            divBottom.style.display = 'none';
            if (state.hasDivider) {
                let activeDiv = state.vpos === 'top' ? divBottom : divTop;
                activeDiv.style.display = 'block';
                activeDiv.style.width = `${state.divWidth}%`;
                activeDiv.style.height = `${state.divThickness}px`;
                activeDiv.style.background = `linear-gradient(90deg, transparent, ${state.divColor}, transparent)`;
            }
        };

        // UI Bindings
        document.getElementById('cust-name-vpos').addEventListener('change', e => { state.vpos = e.target.value; renderTitle(); });
        
        const hposBtns = document.getElementById('cust-name-hpos').querySelectorAll('.t-btn');
        hposBtns.forEach(b => b.addEventListener('click', e => {
            hposBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            state.hpos = e.target.getAttribute('data-val');
            renderTitle();
        }));

        const fillToggleBtns = document.getElementById('cust-name-fill-toggle').querySelectorAll('.t-btn');
        fillToggleBtns.forEach(b => b.addEventListener('click', e => {
            fillToggleBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            state.fill = e.target.getAttribute('data-val');
            document.getElementById('group-name-gradient').style.display = state.fill === 'gradient' ? 'block' : 'none';
            document.getElementById('group-name-solid').style.display = state.fill === 'solid' ? 'block' : 'none';
            renderTitle();
        }));

        document.getElementById('cust-name-solid-color').addEventListener('input', e => { state.solidColor = e.target.value; renderTitle(); });

        const gradDirBtns = document.getElementById('cust-name-grad-dir').querySelectorAll('.t-btn');
        gradDirBtns.forEach(b => b.addEventListener('click', e => {
            gradDirBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            state.gradDir = e.target.getAttribute('data-val');
            renderTitle();
        }));

        // Gradient Colors Array Logic
        const gradList = document.getElementById('cust-grad-colors-list');
        const renderGradColorsUI = () => {
            gradList.innerHTML = '';
            state.gradColors.forEach((gc, idx) => {
                const li = document.createElement('li');
                li.style = "display:flex; align-items:center; gap:5px;";
                li.innerHTML = `
                    <input type="color" value="${gc.color}" data-idx="${idx}" class="grad-c-input" style="height:25px; width:40px; border:1px solid #4a3821; border-radius:3px; outline:none; padding:0; cursor:pointer;">
                    <input type="range" value="${gc.pos}" min="0" max="100" data-idx="${idx}" class="grad-p-input" style="flex:1;">
                    <span style="font-size:0.7rem; color:#aaa; width:30px; text-align:right;">${gc.pos}%</span>
                    <button data-idx="${idx}" class="btn-rm-grad" style="background:#5a1a1a; color:#ffeba1; border:none; border-radius:3px; cursor:pointer;" ${state.gradColors.length <= 1 ? 'disabled' : ''}>✕</button>
                `;
                gradList.appendChild(li);
            });
            // bind events
            gradList.querySelectorAll('.grad-c-input').forEach(i => i.addEventListener('input', e => { state.gradColors[e.target.dataset.idx].color = e.target.value; renderTitle(); }));
            gradList.querySelectorAll('.grad-p-input').forEach(i => i.addEventListener('input', e => { 
                state.gradColors[e.target.dataset.idx].pos = parseInt(e.target.value); 
                e.target.nextElementSibling.textContent = e.target.value + '%';
                renderTitle(); 
            }));
            gradList.querySelectorAll('.btn-rm-grad').forEach(b => b.addEventListener('click', e => {
                if (state.gradColors.length > 1) {
                    state.gradColors.splice(parseInt(e.target.dataset.idx), 1);
                    renderGradColorsUI(); renderTitle();
                }
            }));
        };
        document.getElementById('btn-add-grad-color').addEventListener('click', () => {
            let lastPos = state.gradColors.length > 0 ? state.gradColors[state.gradColors.length - 1].pos : 0;
            let newPos = Math.min(100, lastPos + 20);
            state.gradColors.push({ color: '#ffffff', pos: newPos });
            renderGradColorsUI(); renderTitle();
        });
        renderGradColorsUI();

        // Font Logic
        const fontSelect = document.getElementById('cust-name-font');
        fontSelect.addEventListener('change', e => {
            epicCharName.style.fontFamily = e.target.value;
        });
        document.getElementById('cust-font-upload').addEventListener('change', e => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const customFont = new FontFace('EpicCustomFont', evt.target.result);
                    customFont.load().then((font) => {
                        document.fonts.add(font);
                        epicCharName.style.fontFamily = 'EpicCustomFont';
                        
                        // Add to dropdown visually
                        let opt = Array.from(fontSelect.options).find(o => o.value === 'EpicCustomFont');
                        if(!opt) {
                            opt = document.createElement('option');
                            opt.value = 'EpicCustomFont';
                            opt.textContent = `Upload: ${file.name}`;
                            fontSelect.prepend(opt);
                        }
                        fontSelect.value = 'EpicCustomFont';
                    }).catch(err => alert("Erro ao carregar fonte customizada: " + err));
                };
                reader.readAsArrayBuffer(file);
            }
        });

        // Effects Object Binding Logic
        ['shadow', 'glow', 'outline'].forEach(type => {
            const chk = document.getElementById(`cust-fx-${type}`);
            const cfgPanel = document.getElementById(`cfg-fx-${type}`);
            if(!chk || !cfgPanel) return;
            
            chk.addEventListener('change', e => {
                state.effects[type].active = e.target.checked;
                cfgPanel.style.display = e.target.checked ? 'block' : 'none';
                renderTitle();
            });
            // bind inputs inside it
            cfgPanel.querySelectorAll('.fx-cfg').forEach(inp => {
                inp.addEventListener('input', e => {
                    if (e.target.dataset.field === 'color') {
                        state.effects[type].color = e.target.value;
                    } else {
                        state.effects[type][e.target.dataset.field] = parseFloat(e.target.value) || 0;
                    }
                    renderTitle();
                });
            });
        });

        // Opacity
        const opSlider = document.getElementById('cust-name-opacity')
        opSlider.addEventListener('input', e => {
            state.opacity = e.target.value;
            document.getElementById('lbl-name-opacity').textContent = Math.round(state.opacity * 100) + '%';
            renderTitle();
        });

        // Divider
        document.getElementById('cust-name-divider').addEventListener('change', e => {
            state.hasDivider = e.target.checked;
            document.getElementById('group-divider-configs').style.display = state.hasDivider ? 'flex' : 'none';
            renderTitle();
        });
        document.getElementById('cust-div-color').addEventListener('input', e => { state.divColor = e.target.value; renderTitle(); });
        document.getElementById('cust-div-thickness').addEventListener('input', e => { state.divThickness = e.target.value; renderTitle(); });
        document.getElementById('cust-div-width').addEventListener('input', e => { 
            state.divWidth = e.target.value; 
            document.getElementById('lbl-div-width').textContent = state.divWidth + '%';
            renderTitle(); 
        });

        // Image Zoom & Pan Events
        const zoomSlider = document.getElementById('cust-img-zoom');
        if (zoomSlider) {
            zoomSlider.addEventListener('input', e => {
                state.imgZoom = parseFloat(e.target.value);
                document.getElementById('lbl-img-zoom').textContent = state.imgZoom.toFixed(2) + 'x';
                renderImageTransform();
            });
        }
        const miniZoomSlider = document.getElementById('mini-img-zoom');
        if (miniZoomSlider) {
            miniZoomSlider.addEventListener('input', e => {
                state.miniZoom = parseFloat(e.target.value);
                document.getElementById('lbl-mini-zoom').textContent = state.miniZoom.toFixed(2) + 'x';
                renderImageTransform();
            });
        }

        let draggingTarget = null, lastMouseX = 0, lastMouseY = 0, activeDragMultiplier = 1;

        const startPan = (x, y, target, scale = 1) => {
            if (!state.uploadedPortraitSrc) return;
            draggingTarget = target;
            lastMouseX = x;
            lastMouseY = y;
            activeDragMultiplier = scale || 1;
        };

        const endPan = () => { draggingTarget = null; };

        const doPan = (x, y) => {
            if (!draggingTarget) return;
            const dx = (x - lastMouseX) * activeDragMultiplier;
            const dy = (y - lastMouseY) * activeDragMultiplier;
            lastMouseX = x; lastMouseY = y;

            const cW = 800;
            const cH = 1700;
            const baseScale = Math.max(cW / state.imgNatW, cH / state.imgNatH);
            
            if (draggingTarget === 'epic') {
                const excessX = (state.imgNatW * baseScale * state.imgZoom) - cW;
                const excessY = (state.imgNatH * baseScale * state.imgZoom) - cH;
                let currentPixelX = -1 * (excessX * state.imgPanX) + dx;
                let currentPixelY = -1 * (excessY * state.imgPanY) + dy;
                currentPixelX = Math.min(0, Math.max(-excessX, currentPixelX));
                currentPixelY = Math.min(0, Math.max(-excessY, currentPixelY));
                state.imgPanX = excessX > 0 ? (currentPixelX / -excessX) : 0.5;
                state.imgPanY = excessY > 0 ? (currentPixelY / -excessY) : 0.5;
            } else if (draggingTarget === 'mini') {
                const excessX = (state.imgNatW * baseScale * state.miniZoom) - cW;
                const excessY = (state.imgNatH * baseScale * state.miniZoom) - cH;
                let currentPixelX = -1 * (excessX * state.miniPanX) + dx;
                let currentPixelY = -1 * (excessY * state.miniPanY) + dy;
                currentPixelX = Math.min(0, Math.max(-excessX, currentPixelX));
                currentPixelY = Math.min(0, Math.max(-excessY, currentPixelY));
                state.miniPanX = excessX > 0 ? (currentPixelX / -excessX) : 0.5;
                state.miniPanY = excessY > 0 ? (currentPixelY / -excessY) : 0.5;
            }

            renderImageTransform();
        };

        // Escuta comum de movimento do Viewport / Document
        document.addEventListener('mousemove', e => doPan(e.clientX, e.clientY));
        document.addEventListener('mouseup', () => { 
            const eSpacer = document.getElementById('epic-image-spacer');
            if(eSpacer) eSpacer.style.cursor = 'grab'; 
            const mSpacer = document.getElementById('mini-image-spacer');
            if(mSpacer) mSpacer.style.cursor = 'grab';
            endPan(); 
        });
        document.addEventListener('touchmove', e => {
            if(draggingTarget && e.touches.length === 1) {
                e.preventDefault();
                doPan(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, {passive: false});
        document.addEventListener('touchend', endPan);

        // Disparo via Card Real (Scale Dinamico CSS)
        const epicImageSpacer = document.getElementById('epic-image-spacer');
        if (epicImageSpacer && epicHeaderBg) {
            epicImageSpacer.style.cursor = 'grab';
            epicImageSpacer.addEventListener('mousedown', e => { 
                epicImageSpacer.style.cursor = 'grabbing'; 
                const scale = epicHeaderBg.offsetWidth / epicHeaderBg.getBoundingClientRect().width;
                startPan(e.clientX, e.clientY, 'epic', scale); 
            });
            epicImageSpacer.addEventListener('touchstart', e => {
                if(e.touches.length === 1) {
                    const scale = epicHeaderBg.offsetWidth / epicHeaderBg.getBoundingClientRect().width;
                    startPan(e.touches[0].clientX, e.touches[0].clientY, 'epic', scale);
                }
            }, {passive: false});
        }
        
        // Disparo via Mini-Preview Simulator (Scale 0.1875 Fixo)
        const miniImageSpacer = document.getElementById('mini-image-spacer');
        if (miniImageSpacer) {
             miniImageSpacer.style.cursor = 'grab';
             miniImageSpacer.addEventListener('mousedown', e => { 
                 e.preventDefault();
                 miniImageSpacer.style.cursor = 'grabbing'; 
                 startPan(e.clientX, e.clientY, 'mini', 1 / 0.1875); 
             });
             miniImageSpacer.addEventListener('touchstart', e => {
                 if(e.touches.length === 1) {
                     e.preventDefault();
                     startPan(e.touches[0].clientX, e.touches[0].clientY, 'mini', 1 / 0.1875);
                 }
             }, {passive: false});
        }

        // Add Layout Event Listeners
        const heightSlider = document.getElementById('cust-img-height');
        if (heightSlider) {
            heightSlider.addEventListener('input', e => {
                state.imgHeight = parseInt(e.target.value);
                document.getElementById('lbl-img-height').textContent = state.imgHeight + 'px';
                renderLayout();
                renderImageTransform();
            });
        }
        const miniHeightSlider = document.getElementById('mini-img-height');
        if (miniHeightSlider) {
            miniHeightSlider.addEventListener('input', e => {
                state.miniHeight = parseInt(e.target.value);
                document.getElementById('lbl-mini-height').textContent = state.miniHeight + 'px';
                renderLayout();
                renderImageTransform();
            });
        }

        const opacitySlider = document.getElementById('cust-bg-opacity');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', e => {
                state.bgOpacity = parseFloat(e.target.value);
                document.getElementById('lbl-bg-opacity').textContent = Math.round(state.bgOpacity * 100) + '%';
                renderLayout();
            });
        }

        // Sync initial UI state for Color Panels
        document.getElementById('group-name-gradient').style.display = state.fill === 'gradient' ? 'block' : 'none';
        document.getElementById('group-name-solid').style.display = state.fill === 'solid' ? 'block' : 'none';

        renderLayout(); // Initial run
        renderTitle(); // Initial run
        renderImageTransform();
    }



    function populateSelect(el, data) {
        el.innerHTML = '';
        if(data.length === 0) {
            el.innerHTML = '<option value="">Sem dados</option>';
            return;
        }
        data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            let label = item.name;
            if(item.cost) label += ` ($${item.cost})`;
            if(item.type && !item.name.includes(item.type)) label += ` (${item.type})`;
            opt.textContent = label;
            el.appendChild(opt);
        });
    }

    // --- RENDERERS ---

    function renderAttrSkillCard() {
        if(!els.attrTabsMenu || !els.attrTabContent) return;
        
        // 0. Render Standalone Attributes (Força e Vigor)
        ['attr_strength', 'attr_vigor'].forEach((id, index) => {
            const attrDef = dAttrs.find(a => a.id === id);
            // Standalone containers are numbered 4 and 5 in the HTML (id: attr-standalone-4, attr-standalone-5)
            const containerId = id === 'attr_strength' ? 'attr-standalone-4' : 'attr-standalone-5';
            const container = document.getElementById(containerId);
            if(container && attrDef) {
                const baseVal = state.attributes[id];
                const raceMod = state.raceAttrMods[id] || 0;
                const attrVal = baseVal + raceMod;
                const clampedVal = attrVal < 1 ? 1 : (attrVal >= DICE.length ? DICE.length - 1 : attrVal);

                container.innerHTML = `
                    <div class="standalone-attr-circle">
                        <strong>${attrDef.name}</strong>
                        <span class="dice-value" ${raceMod > 0 ? 'style="color:#27ae60;"' : ''}>${DICE[clampedVal]}</span>
                        <div class="standalone-controls edit-only">
                            <button class="dec-attr" data-id="${id}">-</button>
                            <button class="inc-attr" data-id="${id}">+</button>
                        </div>
                    </div>
                `;
                // Check if maxed out for visual flair
                if(attrVal >= 5) container.querySelector('.standalone-attr-circle').classList.add('max-level');
                
                container.querySelector('.dec-attr').addEventListener('click', (e) => {
                    if(state.attributes[id] > 1) { 
                        AudioEngine.playThud();
                        state.attributes[id]--; renderAttrSkillCard(); calculateAll(); 
                    } else {
                        AudioEngine.playError();
                        e.target.parentElement.parentElement.classList.add('error-shake');
                        setTimeout(()=>e.target.parentElement.parentElement.classList.remove('error-shake'), 300);
                    }
                });
                container.querySelector('.inc-attr').addEventListener('click', (e) => {
                    if(state.attributes[id] < 5) { 
                        AudioEngine.playThud();
                        state.attributes[id]++; renderAttrSkillCard(); calculateAll(); 
                    } else {
                        AudioEngine.playError();
                        e.target.parentElement.parentElement.classList.add('error-shake');
                        setTimeout(()=>e.target.parentElement.parentElement.classList.remove('error-shake'), 300);
                    }
                });
            }
        });

        // 1. Render Tab Menu
        els.attrTabsMenu.innerHTML = '';
        dAttrs.filter(a => ['attr_agility', 'attr_smarts', 'attr_spirit'].includes(a.id)).forEach(attr => {
            const btn = document.createElement('div');
            btn.className = `attr-tab-btn ${activeAttrTabId === attr.id ? 'active' : ''}`;
            btn.textContent = attr.name;
            btn.addEventListener('click', () => {
                AudioEngine.playClick();
                activeAttrTabId = attr.id;
                renderAttrSkillCard(); 
            });
            els.attrTabsMenu.appendChild(btn);
        });

        // 2. Render Active Tab Content
        els.attrTabContent.innerHTML = '';
        const currentAttr = dAttrs.find(a => a.id === activeAttrTabId);
        if(!currentAttr) return;

        const baseVal = state.attributes[currentAttr.id];
        const raceMod = state.raceAttrMods[currentAttr.id] || 0;
        const attrVal = baseVal + raceMod;
        const clampedVal = attrVal < 1 ? 1 : (attrVal >= DICE.length ? DICE.length - 1 : attrVal);
        
        // HTML do Atributo
        const attrDiv = document.createElement('div');
        attrDiv.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px dashed var(--border-color);';
        attrDiv.innerHTML = `
            <div>
                <strong style="font-size: 1.2rem; color: var(--primary-color);">${currentAttr.name}</strong> 
                <span class="edit-only" style="font-size:0.9rem; color:var(--secondary-color); margin-left:5px;">(Atributo)</span>
            </div>
            <div class="die-controls" style="background: rgba(0,0,0,0.03); padding: 5px 10px; border-radius: 8px;">
                <button class="die-btn dec-attr edit-only" data-id="${currentAttr.id}" style="width: 30px; height: 30px;">-</button>
                <span class="die-value" style="font-size: 1.3rem; margin: 0 10px; min-width: 45px; text-align: center; color: ${raceMod > 0 ? '#27ae60' : 'var(--primary-color)'};">${DICE[clampedVal]}</span>
                <button class="die-btn inc-attr edit-only" data-id="${currentAttr.id}" style="width: 30px; height: 30px;">+</button>
            </div>
        `;
        els.attrTabContent.appendChild(attrDiv);

        attrDiv.querySelector('.dec-attr').addEventListener('click', (e) => {
            if(state.attributes[currentAttr.id] > 1) { 
                AudioEngine.playThud();
                state.attributes[currentAttr.id]--; renderAttrSkillCard(); calculateAll(); 
            } else {
                AudioEngine.playError();
                e.target.parentElement.classList.add('error-shake');
                setTimeout(()=>e.target.parentElement.classList.remove('error-shake'), 300);
            }
        });
        attrDiv.querySelector('.inc-attr').addEventListener('click', (e) => {
            if(state.attributes[currentAttr.id] < 5) { 
                AudioEngine.playThud();
                state.attributes[currentAttr.id]++; renderAttrSkillCard(); calculateAll(); 
            } else {
                AudioEngine.playError();
                e.target.parentElement.classList.add('error-shake');
                setTimeout(()=>e.target.parentElement.classList.remove('error-shake'), 300);
            }
        });

        // HTML das Perícias
        const skillsSection = document.createElement('div');
        skillsSection.innerHTML = `<h3 style="margin-bottom: 10px; font-size: 1rem; color: var(--secondary-color);">Perícias Vinculadas</h3>`;
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'skill-check-grid';

        const filteredSkills = dSkills.filter(s => s.linked === currentAttr.name);
        const hasIdoso = state.hindrances.some(h => (typeof h === 'object' ? h.id : h) === 'hind_idoso');

        filteredSkills.forEach(skillDef => {
            const hasSkill = state.skills[skillDef.id] !== undefined;
            const baseSkillVal = hasSkill ? state.skills[skillDef.id] : 1;
            const eldVal = state.elderlySkills[skillDef.id] || 0;
            const raceSMod = (state.raceSkillMods[skillDef.id] || 0) + (state.classSkillMods[skillDef.id] || 0);
            const totalVal = baseSkillVal + eldVal;
            
            const raceModVisual = raceSMod > 0 ? `+${raceSMod}` : (raceSMod < 0 ? `${raceSMod}` : ``);
            const raceModStyle = raceSMod > 0 ? `color: #27ae60;font-size:0.85rem;margin-left:4px;font-weight:bold;` : `color: #e74c3c;font-size:0.85rem;margin-left:4px;font-weight:bold;`;
            const raceModHtml = raceSMod !== 0 ? `<sup style="${raceModStyle}">${raceModVisual}</sup>` : '';

            const skItem = document.createElement('div');
            skItem.className = 'skill-check-item';

            if(hasSkill) {
                let eldControls = '';
                if(hasIdoso && currentAttr.name === 'Astúcia') {
                    eldControls = `
                    <div class="die-controls edit-only" style="margin-top: 5px; justify-content: flex-end; align-items: center; background: rgba(138,43,226, 0.05); padding: 5px; border-radius: 4px;">
                        <span style="font-size: 0.75rem; color: #dda0dd; margin-right: auto; font-weight: bold;">Idoso (+1 cada)</span>
                        <button class="die-btn dec-eld" data-id="${skillDef.id}" style="background: rgba(138,43,226, 0.2); width: 22px; height: 22px; display: inline-flex; justify-content: center; align-items: center; font-size: 1rem; border-color: rgba(138,43,226, 0.5);">-</button>
                        <span class="die-value" style="color: #dda0dd; width: 25px; text-align: center; display: inline-block; font-size: 0.9rem;">+${eldVal}</span>
                        <button class="die-btn inc-eld" data-id="${skillDef.id}" style="background: rgba(138,43,226, 0.2); width: 22px; height: 22px; display: inline-flex; justify-content: center; align-items: center; font-size: 1rem; border-color: rgba(138,43,226, 0.5);">+</button>
                    </div>`;
                }

                const decBtn = (skillDef.isCore && baseSkillVal === 1) 
                    ? '<span class="edit-only" style="width: 26px; height: 26px; display: inline-block;"></span>'
                    : `<button class="die-btn dec-skill edit-only" data-id="${skillDef.id}" style="width: 26px; height: 26px; display: inline-flex; justify-content: center; align-items: center;">-</button>`;
                
                skItem.style.flexDirection = 'column';
                skItem.style.alignItems = 'stretch';
                skItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <label class="skill-check-label edit-only" style="flex:1;">
                            <input type="checkbox" checked ${skillDef.isCore ? 'disabled' : ''} data-id="${skillDef.id}" class="skill-toggler">
                            ${skillDef.name} ${raceModHtml}
                        </label>
                        <span class="aesthetic-only" style="display:none; font-weight:bold; flex:1;">${skillDef.name} ${raceModHtml}</span>
                        <div class="die-controls" style="justify-content: flex-end; align-items: center;">
                            ${decBtn}
                            <span class="die-value" style="width: 32px; text-align: center; display: inline-block; font-size: 1.1rem; color: var(--primary-color)">${DICE[totalVal > 5 ? 5 : totalVal]}</span>
                            <button class="die-btn inc-skill edit-only" data-id="${skillDef.id}" style="width: 26px; height: 26px; display: inline-flex; justify-content: center; align-items: center;">+</button>
                        </div>
                    </div>
                    ${eldControls ? eldControls : ''}
                `;
            } else {
                skItem.innerHTML = `
                    <label class="skill-check-label edit-only" style="width: 100%;">
                        <input type="checkbox" data-id="${skillDef.id}" class="skill-toggler">
                        ${skillDef.name} ${raceModHtml}
                    </label>
                `;
            }
            skillsGrid.appendChild(skItem);
        });

        skillsSection.appendChild(skillsGrid);
        els.attrTabContent.appendChild(skillsSection);

        if(isAesthetic) {
            skillsGrid.querySelectorAll('.aesthetic-only').forEach(el => el.style.display = 'block');
            skillsGrid.querySelectorAll('.skill-check-item').forEach(el => {
                if(!el.querySelector('input[type="checkbox"]:checked')) {
                     el.style.display = 'none';
                } else {
                     el.style.border = 'none';
                     el.style.padding = '5px 0';
                     el.style.borderBottom = '1px dashed var(--border-color)';
                     el.style.minHeight = 'auto';
                }
            });
        }

        els.attrTabContent.querySelectorAll('.skill-toggler').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const sId = e.target.dataset.id;
                if(e.target.checked) {
                    AudioEngine.playClick();
                    state.skills[sId] = 1;
                }
                else {
                    AudioEngine.playClick();
                    delete state.skills[sId];
                    if(state.elderlySkills[sId]) delete state.elderlySkills[sId];
                }
                renderAttrSkillCard(); calculateAll();
            });
        });

        els.attrTabContent.querySelectorAll('.dec-skill').forEach(btn => btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if(state.skills[id] > 1) { 
                AudioEngine.playThud();
                state.skills[id]--; renderAttrSkillCard(); calculateAll(); 
            } else {
                AudioEngine.playError();
                e.target.parentElement.parentElement.classList.add('error-shake');
                setTimeout(()=>e.target.parentElement.parentElement.classList.remove('error-shake'), 300);
            }
        }));

        els.attrTabContent.querySelectorAll('.inc-skill').forEach(btn => btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const eldVal = state.elderlySkills[id] || 0;
            if(state.skills[id] + eldVal < 5) { 
                AudioEngine.playThud();
                state.skills[id]++; renderAttrSkillCard(); calculateAll(); 
            } else {
                AudioEngine.playError();
                e.target.parentElement.parentElement.classList.add('error-shake');
                setTimeout(()=>e.target.parentElement.parentElement.classList.remove('error-shake'), 300);
            }
        }));

        els.attrTabContent.querySelectorAll('.dec-eld').forEach(btn => btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            if(state.elderlySkills[id] > 0) { 
                AudioEngine.playThud();
                state.elderlySkills[id]--; renderAttrSkillCard(); calculateAll(); 
            } else {
                AudioEngine.playError();
                e.target.parentElement.parentElement.classList.add('error-shake');
                setTimeout(()=>e.target.parentElement.parentElement.classList.remove('error-shake'), 300);
            }
        }));

        els.attrTabContent.querySelectorAll('.inc-eld').forEach(btn => btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const eldVal = state.elderlySkills[id] || 0;
            const baseVal = state.skills[id];
            
            let ext = 0;
            Object.values(state.elderlySkills).forEach(v => ext += v);
            if(ext < 5 && baseVal + eldVal < 5) {
                AudioEngine.playThud();
                state.elderlySkills[id] = eldVal + 1;
                renderAttrSkillCard(); calculateAll();
            } else {
                AudioEngine.playError();
                e.target.parentElement.parentElement.classList.add('error-shake');
                setTimeout(()=>e.target.parentElement.parentElement.classList.remove('error-shake'), 300);
            }
        }));
    }

    function renderSimpleList(idList, definitionList, element, onRemove) {
        element.innerHTML = '';
        idList.forEach((item, index) => {
            const id = typeof item === 'object' ? item.id : item;
            const def = definitionList.find(d => d.id === id);
            if(!def) return;
            const div = document.createElement('div');
            div.className = 'item-row';
            let extra = '';
            if(def.cost) extra += `($${def.cost}) `;
            if(def.type && !def.name.includes(def.type)) extra += `(${def.type}) `;
            
            let displayName = def.name;
            if (typeof item === 'object' && item.subName) {
                displayName += ` (${item.subName})`;
            }
            
            // Especialidades de Itens Comprados (Novo Data)
            if(def.damage && def.damage !== '-') extra += `[Crit: ${def.damage}] `;
            if(def.armor && def.armor > 0) extra += `[Arm: +${def.armor}]`;

            let descHtml = '';
            if (def.description && id.startsWith('pow_')) {
                descHtml = `<span style="display:block; font-size: 0.8em; color: var(--text-color); margin-top: 4px; line-height: 1.25; opacity: 0.85;">${def.description}</span>`;
            }

            div.innerHTML = `<span><strong style="color:var(--primary-color);">${displayName}</strong> <small>${extra}</small>${descHtml}</span> <button class="remove-btn btn-danger edit-only" data-idx="${index}">X</button>`;
            element.appendChild(div);
        });
        element.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => {
            onRemove(parseInt(e.target.dataset.idx));
        }));
    }

    function renderHindrances() {
        els.hindranceList.innerHTML = '';
        state.hindrances.forEach((hindObj, index) => {
            const isObj = typeof hindObj === 'object';
            const hId = isObj ? hindObj.id : hindObj;
            let severity = isObj ? hindObj.severity : null;
            
            const def = dHinds.find(d => d.id === hId);
            if(!def) return;
            if(!severity) severity = def.type;
            
            const div = document.createElement('div');
            div.className = 'item-row';
            let extra = `(${severity})`;
            
            div.innerHTML = `<span><strong style="color:var(--primary-color);">${def.name}</strong> <small>${extra}</small></span> <button class="remove-btn btn-danger edit-only" data-idx="${index}">X</button>`;
            els.hindranceList.appendChild(div);
        });
        els.hindranceList.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.idx);
            
            const removingId = typeof state.hindrances[idx] === 'object' ? state.hindrances[idx].id : state.hindrances[idx];
            if(removingId === 'hind_idoso') {
                state.elderlySkills = {};
                renderAttrSkillCard();
            }

            state.hindrances.splice(idx, 1);
            autoRefundHindrancePoints();
            calculateAll();
            renderHindrances();
            renderAttrSkillCard();
        }));
    }

    function addHindrance(id) {
        if(!id) return;
        const hDef = dHinds.find(d => d.id === id);
        if(!hDef) return;
        
        // Verifica alternância em complicações que servem tanto para Menor quanto para Maior
        let severity = hDef.type;
        if(severity === 'Menor/Maior') {
            severity = els.hindToggleCheck.checked ? 'Maior' : 'Menor';
        }
        
        // Adiciona objeto estruturado no array do personagem
        state.hindrances.push({ id, severity });
        autoRefundHindrancePoints();
        calculateAll();
        renderHindrances();
        renderAttrSkillCard();
        
        els.hindranceSelect.value = '';
        els.hindranceSelect.dispatchEvent(new Event('change'));
    }
    
    function addEdge(id) {
        if(!id) return;
        const edDef = dEdges.find(d => d.id === id);
        let pushObj = id;
        
        if (edDef && edDef.requireInput === 'arcane_type') {
            const selType = document.getElementById('select-arcane-type').value;
            if (!selType) return; // Precisa escolher o arcano
            const selArcane = edDef.arcaneTypes.find(t => t.id === selType);
            if (selArcane) {
                pushObj = { id: id, subName: selArcane.name, arcId: selArcane.id, pp: selArcane.pp, powers: selArcane.powers, skill: selArcane.skill };
            }
        }

        state.edges.push(pushObj);
        calculateAll();
        renderEdges();
        els.edgeSelect.value = '';
        els.edgeSelect.dispatchEvent(new Event('change'));
    }

    function renderEdges() {
        renderSimpleList(state.edges, dEdges, els.edgeList, (idx) => {
            state.edges.splice(idx, 1);
            calculateAll();
            renderEdges(); // Re-render so the list reflects the removal
        });
    }

    function addPower(id) {
        if(!id) return;
        state.powers.push(id);
        calculateAll();
        renderPowers();
        els.powerSelect.value = '';
        els.powerSelect.dispatchEvent(new Event('change'));
    }

    function renderPowers() {
        renderSimpleList(state.powers, dPowers, els.powerList, (idx) => {
            state.powers.splice(idx, 1);
            calculateAll();
            renderPowers(); // Re-render so the list reflects the removal
        });
    }

    function renderArcaneTracker() {
        const trPowers = document.getElementById('tracker-powers-count');
        const trPowersMax = document.getElementById('tracker-powers-max');
        const trPPMax = document.getElementById('tracker-pp-max');
        const lockMsg = document.getElementById('powers-locked-msg');
        const pwrContainer = document.getElementById('powers-container');
        
        const pwrTrackerDiv = document.getElementById('powers-tracker');
        if (trPowers) {
            trPowersMax.textContent = state.arcaneMaxPowers || 0;
            trPowers.textContent = state.powers.length;
            trPPMax.textContent = state.arcaneMaxPP || 0;
            
            if (pwrTrackerDiv) {
                if (state.powers.length > (state.arcaneMaxPowers || 0)) {
                    pwrTrackerDiv.className = 'points-tracker edit-only tracker-red';
                } else if (state.powers.length === (state.arcaneMaxPowers || 0)) {
                    pwrTrackerDiv.className = 'points-tracker edit-only tracker-green';
                } else {
                    pwrTrackerDiv.className = 'points-tracker edit-only';
                }
            }
        }
        
        if (!state.hasArcane) {
            if(lockMsg) lockMsg.style.display = 'block';
            if(pwrContainer) pwrContainer.style.display = 'none';
        } else {
            if(lockMsg) lockMsg.style.display = 'none';
            if(pwrContainer) pwrContainer.style.display = 'block';
        }
        
        if(els.btnAddPower) {
            els.btnAddPower.disabled = (state.powers.length >= (state.arcaneMaxPowers || 0));
            // Previne falha do disabled se um poder estiver selecionado recenemente no dropdown mas sem slots livres
            if(!els.btnAddPower.disabled && els.powerSelect.value) {
                 els.btnAddPower.disabled = false;
            } else {
                 els.btnAddPower.disabled = true;
            }
        }
    }
    function renderEquipmentList() {
        els.eqList.innerHTML = '';
        const grouped = {};
        
        // Agrupando via contagem
        state.equipment.forEach((id, index) => {
            if(!grouped[id]) grouped[id] = { count: 0, indexList: [] };
            grouped[id].count++;
            grouped[id].indexList.push(index);
        });

        Object.keys(grouped).forEach(id => {
            const def = dEq.find(d => d.id === id);
            if(!def) return;
            const count = grouped[id].count;
            // Pegamos o ultimo indice da pilha desse ID pra remover sempre 1 unidade do fim da conta local
            const indexToRemove = grouped[id].indexList[grouped[id].indexList.length - 1]; 

            const div = document.createElement('div');
            div.className = 'item-row';
            let extra = '';
            
            const totalCost = def.cost * count;
            extra += `($${totalCost}) `;
            if(def.type) extra += `(${def.type}) `;
            if(def.damage && def.damage !== '-') extra += `[Dano: ${def.damage}] `;
            if(def.armor && def.armor > 0) extra += `[Arm: +${def.armor}]`;

            const nameDisplay = count > 1 ? `${def.name} (x${count})` : def.name;

            div.innerHTML = `<span><strong style="color:var(--primary-color);">${nameDisplay}</strong> <small>${extra}</small></span> <button class="remove-btn btn-danger edit-only" data-idx="${indexToRemove}">-1</button>`;
            els.eqList.appendChild(div);
        });

        // Remocao subtrai apenas 1 daquele tipo
        els.eqList.querySelectorAll('.remove-btn').forEach(btn => btn.addEventListener('click', (e) => {
            state.equipment.splice(parseInt(e.target.dataset.idx), 1);
            calculateAll();
            renderEquipmentList();
            
            // Re-render loja se estiver aberta
            const storeModal = document.getElementById('store-modal');
            if(storeModal && storeModal.classList.contains('active')) renderStore();
        }));
    }

    function addEquipment(id, qty = 1) {
        if(!id || qty < 1) return;
        for(let i=0; i<qty; i++) state.equipment.push(id);
        calculateAll();
        renderEquipmentList();
    }

    function autoRefundHindrancePoints() {
        let generated = 0;
        state.hindrances.forEach(h => {
             const sev = typeof h === 'object' ? h.severity : dHinds.find(d=>d.id===h)?.type;
             generated += sev === 'Maior' ? 2 : 1;
        });
        let spent = (state.boughtAttr*2) + state.boughtSkill + (state.boughtEdges*2) + state.boughtFunds;
        
        while(spent > generated) {
            if(state.boughtFunds > 0) { state.boughtFunds--; spent -= 1; continue; }
            if(state.boughtSkill > 0) { state.boughtSkill--; spent -= 1; continue; }
            if(state.boughtEdges > 0) { state.boughtEdges--; spent -= 2; continue; }
            if(state.boughtAttr > 0) { state.boughtAttr--; spent -= 2; continue; }
            break;
        }
    }

    function calculateAll() {
        let generatedHind = 0;
        
        let hasJovemMenor = false;
        let hasJovemMaior = false;
        let hasPobreza = false;
        let freeEdges = 0;
        let extraBennies = 0;
        let basePacePenalty = 0;
        let toughnessModifier = 0;
        let parryModifier = 0;
        let boughtFundsMod = 0;
        let hasIdoso = false;
        let hasArcane = false;
        let arcaneMaxPowers = 0;
        let arcaneMaxPP = 0;
        
        let bonusAttrPoints = 0;
        let bonusSkillPoints = 0;
        
        if (state.level >= 1) bonusAttrPoints += 1;
        if (state.level >= 2) freeEdges += 1;
        if (state.level >= 3) bonusSkillPoints += 2;
        if (state.level >= 4) bonusSkillPoints += 2;
        
        state.raceAttrMods = {};
        state.raceSkillMods = {};
        state.classSkillMods = {};

        // --- RACE PARSING LOGIC ---
        let racePassives = [];
        const myRace = dRaces.find(r => r.id === state.race);
        if (myRace) {
            if (myRace.isCustom) {
                // Parse Custom Race Config
                let defPos = DEFAULT_DATA.racialAbilitiesPos;
                
                
                let defNeg = DEFAULT_DATA.racialAbilitiesNeg;
                
                if (myRace.selections) {
                    myRace.selections.forEach(s => {
                        const isPos = s.type === 'pos';
                        const def = isPos ? defPos.find(x => x.id === s.id) : defNeg.find(x => x.id === s.id);
                        if (!def) return;
                        
                        let qty = (def.type === 'stack') ? (s.level + 1) : 1;
                        let pId = s.id;
                        
                        if (isPos) {
                            if(pId === 'rap_action') racePassives.push({text: "Ação Adicional (Ignora -2)", color: '#004085'});
                            else if(pId === 'rap_adaptable' || pId === 'rap_edge') freeEdges++;
                            else if(pId === 'rap_reach') { racePassives.push({text: `Alcance +${qty}`, color: '#004085'}); }
                            else if(pId === 'rap_parry') parryModifier += qty;
                            else if(pId === 'rap_armor') { toughnessModifier += (2 * qty); racePassives.push({text: `Armadura Natural +${2 * qty}`, color: '#004085'}); }
                            else if(pId === 'rap_pace') basePacePenalty += (2 * qty);
                            else if(pId === 'rap_resilience') toughnessModifier += qty;
                            else if(pId === 'rap_sizeup') { toughnessModifier += qty; racePassives.push({text: `Tamanho +${qty}`, color: '#004085'}); }
                            else if(pId === 'rap_power_base') { hasArcane = true; arcaneMaxPowers += 1; arcaneMaxPP += 15; racePassives.push({text: `Poder Arcano (Base)`, color: '#004085'}); }
                            else if(pId === 'rap_power_add') { arcaneMaxPowers += qty; racePassives.push({text: `Poder Arcano (+${qty})`, color: '#004085'}); }
                            else if(pId === 'rap_attr_boost') { bonusAttrPoints++; racePassives.push({text: `+1 Pt. Atributo (${s.text || 'Livre'})`, color: '#004085'}); }
                            else if(pId === 'rap_skill') {
                                if (s.level === 0) { bonusSkillPoints += 1; racePassives.push({text: `d4 Perícia Racial (${s.text || 'Livre'})`, color: '#004085'}); }
                                else { bonusSkillPoints += 2; racePassives.push({text: `d6 Perícia Racial (${s.text || 'Livre'})`, color: '#004085'}); }
                            }
                            else if(pId === 'rap_skill_bonus') { racePassives.push({text: `Mod +2 Perícia (${s.text || 'Livre'})`, color: '#004085'}); }
                            else {
                                let label = formatSelectionLabel(def, s);
                                racePassives.push({ text: label, color: '#9b59b6' });
                            }
                        } else {
                            if(pId === 'ran_lowparry') parryModifier -= qty;
                            else if(pId === 'ran_fragile') toughnessModifier -= qty;
                            else if(pId === 'ran_lowpace') {
                                if (s.level === 0) basePacePenalty -= 1;
                                else basePacePenalty -= 3;
                            }
                            else if(pId === 'ran_sizedown') { toughnessModifier -= 1; racePassives.push({text: `Tamanho -1`, color: '#e74c3c'}); }
                            else if(pId === 'ran_mind_hind') {
                                // A complicação concedeu o ponto equilibradamente, mas não subtrai/soma limite global de complicações.
                                let label = formatSelectionLabel(def, s);
                                racePassives.push({ text: label, color: '#e74c3c' });
                            }
                            else {
                                let label = formatSelectionLabel(def, s);
                                racePassives.push({ text: label, color: '#e74c3c' });
                            }
                        }
                    });
                } else {
                    // LEGACY FALLBACK Apenas para não crachar se houver cache antigo
                    if (myRace.positives) {
                        myRace.positives.forEach(pId => {
                            if(pId === 'rap_attr_boost') bonusAttrPoints++;
                            else if(pId === 'rap_skill4') bonusSkillPoints += 1;
                            else if(pId === 'rap_skill6') bonusSkillPoints += 2;
                        });
                    }
                }
            } else {
                // Homebrew Races parsing
                if (myRace.id === 'race_humano') { 
                    freeEdges++; 
                    bonusSkillPoints += 2;
                }
                else if (myRace.id === 'race_anao') { 
                    state.raceAttrMods['attr_vigor'] = 1;
                    state.raceSkillMods['skill_taunt'] = 1;
                    state.raceSkillMods['skill_riding'] = -1;
                    basePacePenalty += 1;
                    racePassives.push({text: 'Visão no Escuro'});
                }
                else if (myRace.id === 'race_elfo') { 
                    state.raceAttrMods['attr_agility'] = 1;
                    state.raceSkillMods['skill_notice'] = 1;
                    state.raceSkillMods['skill_intimidation'] = -1;
                    basePacePenalty -= 1;
                    racePassives.push({text: 'Visão no Escuro'});
                    racePassives.push({text: '-1 Agi c/ Armadura Pesada', color: '#e74c3c'});
                }
                else if (myRace.id === 'race_gnomo') { 
                    state.raceAttrMods['attr_spirit'] = 1;
                    if(state.raceChoices['gnome_pos']) state.raceSkillMods[state.raceChoices['gnome_pos']] = 1;
                    if(state.raceChoices['gnome_neg']) state.raceSkillMods[state.raceChoices['gnome_neg']] = -1;
                    basePacePenalty += 1;
                    racePassives.push({text: 'Máx Força d10, Sem Arm. Pesada', color: '#e74c3c'});
                }
                else if (myRace.id === 'race_orc') { 
                    state.raceAttrMods['attr_strength'] = 1;
                    state.raceSkillMods['skill_intimidation'] = 1;
                    state.raceSkillMods['skill_persuasion'] = -1;
                    state.raceSkillMods['skill_operate'] = 2; // "+2 para operar mecanismos"
                    racePassives.push({text: 'Visão no Escuro'});
                }
                else if (myRace.id === 'race_tocado') { 
                    state.raceAttrMods['attr_smarts'] = 1;
                    if(state.raceChoices['touched_pos']) state.raceSkillMods[state.raceChoices['touched_pos']] = 1;
                    if(state.raceChoices['touched_neg']) state.raceSkillMods[state.raceChoices['touched_neg']] = -1;
                    const qObj = state.raceChoices['touched_quality'] || {};
                    let qualText = qObj.name ? qObj.name : 'Qualidade Amaldiçoada';
                    if (qObj.desc) qualText += ` - ${qObj.desc}`;
                    racePassives.push({text: qualText, color: '#004085'});
                    
                    const dObj = state.raceChoices['touched_defect'] || {};
                    let defText = dObj.name ? dObj.name : 'Defeito Amaldiçoado';
                    if (dObj.desc) defText += ` - ${dObj.desc}`;
                    racePassives.push({text: defText, color: '#e74c3c'});
                }
                else if (myRace.id === 'race_metamorfo') { 
                    if(state.raceChoices['shift_attr']) state.raceAttrMods[state.raceChoices['shift_attr']] = 1;
                    state.raceSkillMods['skill_survival'] = 1;
                    state.raceSkillMods['skill_shooting'] = -1;
                    basePacePenalty -= 2; // -2 pts de correr (em 4 patas)
                    racePassives.push({text: 'Hab. Natural: ' + (state.raceChoices['shift_nat'] || 'Nenhuma')});
                    racePassives.push({text: '+2 Perceber (Cidades)'});
                }
            }
        }
        // -----------------------

        // --- CLASS PARSING LOGIC ---
        let activeEdges = [...state.edges];
        let classPassives = [];
        
        const myClass = dClasses.find(c => c.id === state.charClass);
        if (myClass) {
            // Apply Class auto edges
            if (myClass.edges) {
                activeEdges.push(...myClass.edges);
            }
            
            // Apply Class direct skill bonuses
            if (myClass.bonuses) {
                myClass.bonuses.forEach(b => {
                    if(b.type === 'skill') state.classSkillMods[b.target] = (state.classSkillMods[b.target] || 0) + b.amount;
                });
            }
            
            // Apply Class choices skill bonuses
            if (myClass.choices) {
                myClass.choices.forEach(ch => {
                    if (state.classChoices[ch.id]) {
                        state.classSkillMods[state.classChoices[ch.id]] = (state.classSkillMods[state.classChoices[ch.id]] || 0) + 1;
                    }
                });
            }
            
            // Custom passives added explicitly for class (like companions)
            if (myClass.passives) {
                myClass.passives.forEach(p => classPassives.push({text: p.text, color: p.color || '#dcb360'}));
            }
        }
        
        state.hindrances.forEach(h => {
             const hid = typeof h === 'object' ? h.id : h;
             const def = dHinds.find(d => d.id === hid);
             const sev = typeof h === 'object' ? h.severity : def?.type;
             
             if(def && def.effects) {
                 if(def.effects.jovem) {
                     if(sev === 'Maior') { hasJovemMaior = true; extraBennies += 2; }
                     else { hasJovemMenor = true; extraBennies += 1; }
                 }
                 if(def.effects.poverty) hasPobreza = true;
                 if(def.effects.free_edges) freeEdges += def.effects.free_edges;
                 if(def.effects.bennies) extraBennies += def.effects.bennies;
                 if(def.effects.pace) basePacePenalty += def.effects.pace;
                 if(def.effects.toughness) toughnessModifier += def.effects.toughness;
             }
             if(hid === 'hind_idoso') hasIdoso = true;
             
             generatedHind += sev === 'Maior' ? 2 : 1;
        });

        const idosoTracker = document.getElementById('elderly-tracker-container');
        if(idosoTracker) idosoTracker.style.display = hasIdoso ? 'block' : 'none';

        const badgeContainer = document.getElementById('passive-badges');
        const badgeSection = document.getElementById('passive-penalties-section');
        const epicBadgeContainer = document.getElementById('epic-passive-badges');

        if(badgeContainer && badgeSection) {
            badgeContainer.innerHTML = '';
            if(epicBadgeContainer) epicBadgeContainer.innerHTML = '';

            const createBadge = (text, color = '#28a745') => {
                const sp = document.createElement('span');
                sp.textContent = text;
                sp.style.cssText = `background: ${color}; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);`;
                badgeContainer.appendChild(sp);

                if(epicBadgeContainer) {
                    const spEpic = document.createElement('span');
                    spEpic.textContent = text;
                    spEpic.style.cssText = `display: inline-block; background: ${color}; color: #fff; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 3px 5px rgba(0,0,0,0.5); margin: 2px;`;
                    epicBadgeContainer.appendChild(spEpic);
                }
            };

            if(hasIdoso) createBadge('-1 rolar Agi/For/Vig', 'var(--accent-red, #ff4d4d)');
            if(hasJovemMaior) createBadge('Jovem (M) [-1 pts]', '#e74c3c');
            else if(hasJovemMenor) createBadge('Jovem (m)', '#e74c3c');
            if(hasPobreza) createBadge('Pobreza (-$250)', '#e74c3c');
            
            racePassives.forEach(p => createBadge(p.text, p.color || '#dcb360'));
            classPassives.forEach(p => createBadge(p.text, p.color || '#4CAF50'));
            
            if(freeEdges > 0) createBadge(`+${freeEdges} Vantagem`, '#28a745');
            
            state.hindrances.forEach(h => {
                 const def = dHinds.find(d => d.id === (typeof h === 'object' ? h.id : h));
                 if(def && def.effects) {
                     if(def.effects.intimidate) createBadge(`${def.effects.intimidate} Intimidar`);
                     if(def.effects.vigor_fatigue) createBadge(`${def.effects.vigor_fatigue} Vigor Fadiga`);
                     if(def.effects.athletics) createBadge(`${def.effects.athletics} Atletismo`);
                     if(def.effects.stealth) createBadge(`${def.effects.stealth} Furtividade`);
                     if(def.effects.vision) createBadge(`${def.effects.vision} Visão`);
                     if(def.effects.fear) createBadge(`${def.effects.fear} Rolar Medo`);
                     if(def.effects.notice_hearing) createBadge(`Audição -`);
                     if(def.effects.persuasion) createBadge(`${def.effects.persuasion} Persuadir`);
                     if(def.effects.mechanical) createBadge(`${def.effects.mechanical} Mecânica`);
                     if(def.effects.verbal) createBadge(`${def.effects.verbal} Interação Verbal`);
                     if(def.effects.swim) createBadge(`${def.effects.swim} Nadar/Água`);
                     if(def.effects.common_knowledge) createBadge(`${def.effects.common_knowledge} C. Gerais`);
                     if(def.effects.notice) createBadge(`${def.effects.notice} Perceber`);
                    if(def.effects.resist_taunt) createBadge(`${def.effects.resist_taunt} Resistir Provocar`);
                     if(def.effects.two_handed) createBadge(`${def.effects.two_handed} Mão Dupla`);
                     if(def.effects.vision_range) createBadge(`${def.effects.vision_range} Visão Longe`);
                 }
            });
            
            activeEdges.forEach(eId => {
                const idStr = typeof eId === 'object' ? eId.id : eId;
                const def = dEdges.find(d => d.id === idStr);
                if(def) {
                    if(def.id === 'edge_antecedente_arcano' || def.id.includes('arcano') || def.id.includes('pwr') || def.type === 'Poder' || def.type === 'Poderes') hasArcane = true;
                    if (typeof eId === 'object' && eId.arcId) {
                        arcaneMaxPowers += (eId.powers || 0);
                        arcaneMaxPP += (eId.pp || 0);
                    }
                    if(def.effects) {
                         if(def.effects.toughness) toughnessModifier += def.effects.toughness;
                         if(def.effects.parry) parryModifier += def.effects.parry;
                         if(def.effects.pace) basePacePenalty += def.effects.pace;
                         if(def.effects.bennies) extraBennies += def.effects.bennies;
                         if(def.effects.bought_funds) boughtFundsMod += def.effects.bought_funds;
                         if(def.effects.power_count) arcaneMaxPowers += def.effects.power_count;
                         if(def.effects.pp_mod) arcaneMaxPP += def.effects.pp_mod;
                         
                         // Create Badges for Edges that give text bonuses
                         if(def.effects.notice) createBadge(`+${def.effects.notice} Perceber`, '#004085');
                         if(def.effects.natural_healing) createBadge(`+${def.effects.natural_healing} Cura Nat.`, '#004085');
                         if(def.effects.run_die) createBadge(`d${def.effects.run_die} Correr`, '#004085');
                         if(def.effects.size) createBadge(`Tam +${def.effects.size}`, '#004085');
                    }
                }
            });

            const sectPowers = document.getElementById('section-powers');
            if(sectPowers) sectPowers.style.display = 'block';

            badgeSection.style.display = badgeContainer.children.length > 0 ? 'block' : 'none';
        }

        let elderlySkillCost = 0;
        Object.keys(state.elderlySkills).forEach(sId => { elderlySkillCost += state.elderlySkills[sId]; });
        if(document.getElementById('val-elderly-used')) { document.getElementById('val-elderly-used').textContent = elderlySkillCost; }

        let spentHind = (state.boughtAttr*2) + state.boughtSkill + (state.boughtEdges*2) + state.boughtFunds;

        if(document.getElementById('val-hind-avail')) document.getElementById('val-hind-avail').textContent = generatedHind - spentHind;
        if(document.getElementById('val-hind-spent')) document.getElementById('val-hind-spent').textContent = spentHind;
        
        els.btnAddHind.disabled = (generatedHind >= 4);

        els.buyAttr.disabled = (spentHind + 2 > generatedHind);
        els.buyEdge.disabled = (spentHind + 2 > generatedHind);
        els.buySkill.disabled = (spentHind + 1 > generatedHind);
        els.buyFunds.disabled = (spentHind + 1 > generatedHind);

        let attrCost = 0;
        Object.values(state.attributes).forEach(val => attrCost += (val - 1));
        
        let baseMaxAttr = 5;
        if(hasJovemMaior) baseMaxAttr = 3;
        else if(hasJovemMenor) baseMaxAttr = 4;
        const maxAttr = baseMaxAttr + state.boughtAttr + bonusAttrPoints;
        
        document.getElementById('val-attr-used').textContent = attrCost;
        document.getElementById('val-attr-max').textContent = maxAttr;
        
        document.querySelectorAll('.inc-attr').forEach(btn => {
            const attrId = btn.dataset.id;
            btn.disabled = (attrCost >= maxAttr || state.attributes[attrId] === 5);
        });

        let skillCost = 0;
        Object.keys(state.skills).forEach(sId => {
            const skillDef = dSkills.find(s => s.id === sId);
            if(!skillDef) return;
            const linkAttrId = dAttrs.find(a => a.name === skillDef.linked)?.id;
            const attrVal = linkAttrId ? state.attributes[linkAttrId] : 1;
            const curVal = state.skills[sId];

            if(!skillDef.isCore) skillCost += 1;
            for(let step = 2; step <= curVal; step++) {
                if(step <= attrVal) skillCost += 1;
                else skillCost += 2;
            }
        });

        let baseMaxSkill = 12;
        if(hasJovemMaior || hasJovemMenor) baseMaxSkill = 10;
        const maxSkill = baseMaxSkill + state.boughtSkill + bonusSkillPoints;
        
        document.getElementById('val-skill-used').textContent = skillCost;
        document.getElementById('val-skill-max').textContent = maxSkill;
        
        document.querySelectorAll('.inc-skill').forEach(btn => {
            const cId = btn.dataset.id;
            const sDef = dSkills.find(s => s.id === cId);
            const lkAttr = dAttrs.find(a => a.name === sDef.linked)?.id;
            const aV = lkAttr ? state.attributes[lkAttr] : 1;
            const cV = state.skills[cId];
            const eldVal = state.elderlySkills[cId] || 0;
            
            const nextStepCost = (cV >= aV) ? 2 : 1;
            btn.disabled = (skillCost + nextStepCost > maxSkill || (cV + eldVal) === 5);
        });
        
        document.querySelectorAll('.inc-eld').forEach(btn => {
            const cId = btn.dataset.id;
            const cV = state.skills[cId];
            const eldVal = state.elderlySkills[cId] || 0;
            btn.disabled = (elderlySkillCost >= 5 || (cV + eldVal) === 5);
        });
        
        if(els.btnAddSkill) els.btnAddSkill.disabled = (skillCost + 1 > maxSkill);

        const selectedRace = dRaces.find(r => r.id === state.race);
        let maxEdges = state.boughtEdges + freeEdges;
        state.maxEdges = maxEdges;
        els.btnAddEdge.disabled = (state.edges.length >= maxEdges);
        els.btnAddEdge.textContent = `Adicionar (${state.edges.length}/${maxEdges})`;

        let moneySpent = 0;
        let totalArmor = 0;
        state.equipment.forEach(eqId => {
            const def = dEq.find(d => d.id === eqId);
            if(def) { moneySpent += def.cost; if(def.armor > totalArmor) totalArmor = def.armor; }
        });
        let baseFunds = hasPobreza ? 250 : 500;
        const maxFunds = baseFunds + (state.boughtFunds * baseFunds) + (boughtFundsMod * baseFunds);
        
        const isInfinite = document.getElementById('shop-infinite-funds')?.checked;

        if (isInfinite) {
            document.getElementById('val-funds-used').textContent = "---";
            document.getElementById('val-funds-max').textContent = "∞";
            document.getElementById('tracker-funds').className = "points-tracker edit-only tracker-green";
        } else {
            document.getElementById('val-funds-used').textContent = moneySpent;
            document.getElementById('val-funds-max').textContent = maxFunds;
            document.getElementById('tracker-funds').className = `points-tracker edit-only ${moneySpent === maxFunds ? 'tracker-green' : (moneySpent > maxFunds ? 'tracker-red' : '')}`;
        }
        
        document.getElementById('tracker-attributes').className = `points-tracker edit-only ${attrCost === maxAttr ? 'tracker-green' : (attrCost > maxAttr ? 'tracker-red' : '')}`;
        document.getElementById('tracker-skills').className = `points-tracker edit-only ${skillCost === maxSkill ? 'tracker-green' : (skillCost > maxSkill ? 'tracker-red' : '')}`;

        let pace = (selectedRace && selectedRace.name === 'Anão') ? 5 : 6;
        pace += basePacePenalty;
        if(pace < 1) pace = 1;
        
        let baseBennies = 3 + extraBennies;
        if(baseBennies < 0) baseBennies = 0;
        if(document.getElementById('stat-bennies')) {
            document.getElementById('stat-bennies').textContent = baseBennies;
        }

        const fightingDef = dSkills.find(s => s.name === 'Lutar');
        const fValRaw = fightingDef ? (state.skills[fightingDef.id] || 0) : 0;
        const fValElderly = fightingDef ? (state.elderlySkills[fightingDef.id] || 0) : 0;
        const fVal = fValRaw + fValElderly;
        const fDice = fVal === 0 ? 0 : [0, 4, 6, 8, 10, 12][fVal];
        const parry = 2 + Math.floor(fDice / 2) + parryModifier;

        const vigDef = dAttrs.find(a => a.name === 'Vigor')?.id;
        const vigVal = vigDef ? state.attributes[vigDef] : 1;
        const vigDice = [0, 4, 6, 8, 10, 12][vigVal];
        const toughness = 2 + Math.floor(vigDice / 2) + toughnessModifier;

        els.statPace.textContent = pace;
        els.statParry.textContent = parry;
        els.statToughness.textContent = `${toughness + totalArmor} ${totalArmor > 0 ? '(+'+totalArmor+')' : ''}`;
        
        state.arcaneMaxPowers = arcaneMaxPowers;
        state.arcaneMaxPP = arcaneMaxPP;
        state.hasArcane = hasArcane;
        
        // --- LEVEL UP VALIDATION ---
        const btnLevelUp = document.getElementById('btn-level-up');
        const descLevelUp = document.getElementById('level-up-desc');
        if (btnLevelUp && descLevelUp) {
            let canLevelUp = true;
            let warnMsg = "";

            if (!state.race || !state.charClass) {
                canLevelUp = false;
                warnMsg = "Requer seleção de Raça e Classe.";
            } else {
                const myRace = dRaces.find(r => r.id === state.race);
                if (myRace && myRace.choices && myRace.choices.some(c => !state.raceChoices[c.id])) {
                    canLevelUp = false;
                    warnMsg = "Requer escolhas de opções da Raça pendentes.";
                }
                const myClass = dClasses.find(c => c.id === state.charClass);
                if (myClass && myClass.choices && myClass.choices.some(c => !state.classChoices[c.id])) {
                    canLevelUp = false;
                    warnMsg = "Requer escolhas de opções da Classe pendentes.";
                }
            }

            if (canLevelUp) {
                if (attrCost < maxAttr) {
                    canLevelUp = false;
                    warnMsg = "Requer que gaste todos os seus Pontos de Atributo.";
                } else if (skillCost < maxSkill) {
                    canLevelUp = false;
                    warnMsg = "Requer que gaste todos os seus Pontos de Perícia.";
                } else if (state.edges.length < state.maxEdges) {
                    canLevelUp = false;
                    warnMsg = "Requer que gaste todas as Vantagens limitadas.";
                }
            }

            if (state.level >= 4) {
                canLevelUp = false;
                warnMsg = "Nível Máximo Alcançado.";
            }

            btnLevelUp.disabled = !canLevelUp;
            if (!canLevelUp && state.level < 4) {
                btnLevelUp.textContent = "Subir de Nível";
                descLevelUp.textContent = warnMsg;
            } else if (state.level >= 4) {
                btnLevelUp.textContent = "Nível Máximo";
                descLevelUp.textContent = warnMsg;
            } else {
                btnLevelUp.textContent = "⭐️ Subir de Nível";
                if (state.level === 0) descLevelUp.textContent = "Você ganhará: +1 Ponto de Atributo.";
                else if (state.level === 1) descLevelUp.textContent = "Você ganhará: +1 Vantagem Livre.";
                else if (state.level === 2) descLevelUp.textContent = "Você ganhará: +1 Avanço em Perícia (2pts).";
                else if (state.level === 3) descLevelUp.textContent = "Você ganhará: +1 Avanço em Perícia (2pts).";
            }
        }

        if(typeof renderArcaneTracker === 'function') renderArcaneTracker();
        updateRefundBoxes();
    }

    function updateRefundBoxes() {
        // Atributos & Skills
        const ptsAttrSkill = (state.boughtAttr * 2) + state.boughtSkill;
        const totalBuysAttrSkill = state.boughtAttr + state.boughtSkill;
        const boxAttrSkill = document.getElementById('refund-box-attrskill');
        const lblAttrSkill = document.getElementById('lbl-refund-attrskill-total');
        const btnRefundAttr = document.getElementById('btn-refund-attr');
        const btnRefundSkill = document.getElementById('btn-refund-skill');

        if (boxAttrSkill) {
            boxAttrSkill.style.display = totalBuysAttrSkill > 0 ? 'flex' : 'none';
            if (lblAttrSkill) lblAttrSkill.textContent = ptsAttrSkill;
            if (btnRefundAttr) btnRefundAttr.style.display = state.boughtAttr > 0 ? 'block' : 'none';
            if (btnRefundSkill) btnRefundSkill.style.display = state.boughtSkill > 0 ? 'block' : 'none';
        }

        // Edges
        const ptsEdge = state.boughtEdges * 2;
        const boxEdge = document.getElementById('refund-box-edge');
        const lblEdge = document.getElementById('lbl-refund-edge-total');
        if (boxEdge) {
            boxEdge.style.display = state.boughtEdges > 0 ? 'flex' : 'none';
            if (lblEdge) lblEdge.textContent = ptsEdge;
        }

        // Funds
        const boxFunds = document.getElementById('refund-box-funds');
        const lblFunds = document.getElementById('lbl-refund-funds-total');
        if (boxFunds) {
            boxFunds.style.display = state.boughtFunds > 0 ? 'flex' : 'none';
            if (lblFunds) lblFunds.textContent = state.boughtFunds;
        }
    }

    // --- EXPORT SYSTEM (Fidelidade Visual Absoluta) ---
    // html2canvas has known limitations with modern CSS. This system
    // temporarily patches the DOM before capture and restores it after.

    function prepareDOMforCapture() {
        const savedState = {
            wasAesthetic: isAesthetic,
            overrides: [] // [{element, prop, oldValue}]
        };

        // 1. Force aesthetic mode if not already active
        const epicSheet = document.getElementById('epic-presentation-card');
        const charSheet = document.getElementById('character-sheet');
        const customizer = document.getElementById('aesthetic-customizer');

        if (!isAesthetic) {
            isAesthetic = true;
            document.body.classList.add('mode-aesthetic');
            charSheet.style.display = 'none';
            epicSheet.style.display = 'flex';
            renderEpicCard();
        }

        // Helper to save and override a style
        function override(el, prop, newVal) {
            savedState.overrides.push({ el, prop, oldVal: el.style[prop] });
            el.style[prop] = newVal;
        }

        // 2. Hide the customizer during capture
        if (customizer) override(customizer, 'display', 'none');

        // 3. Remove outer box-shadow from epic sheet and force dimensions for capture
        override(epicSheet, 'boxShadow', 'none');
        override(epicSheet, 'height', '1700px');

        // 4. RESET transform scaling
        const wrapper = epicSheet.querySelector('.epic-card-wrapper');
        if (wrapper) {
            override(wrapper, 'transform', 'none');
        }

        // 5. Fix -webkit-background-clip:text (html2canvas cannot render it)
        //    Convert gradient text to solid gold color
        epicSheet.querySelectorAll('*').forEach(el => {
            const cs = getComputedStyle(el);
            if (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') {
                override(el, 'webkitBackgroundClip', 'border-box');
                override(el, 'backgroundClip', 'border-box');
                override(el, 'webkitTextFillColor', 'initial');
                override(el, 'color', '#f9e596');
                override(el, 'background', 'transparent');
                override(el, 'textShadow', '2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(220,179,96,0.6)');
            }
        });

        // 6. Replace backdrop-filter with solid opaque background (unsupported by html2canvas)
        epicSheet.querySelectorAll('*').forEach(el => {
            const cs = getComputedStyle(el);
            if (cs.backdropFilter && cs.backdropFilter !== 'none') {
                override(el, 'backdropFilter', 'none');
                override(el, 'webkitBackdropFilter', 'none');
                // Make semi-transparent backgrounds fully opaque
                const bg = cs.backgroundColor;
                if (bg && bg.startsWith('rgba')) {
                    const match = bg.match(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+)/);
                    if (match) {
                        override(el, 'backgroundColor', `rgb(${match[1]}, ${match[2]}, ${match[3]})`);
                    }
                }
            }
        });

        // 7. Convert CSS filter: drop-shadow() to text-shadow (for ALL text elements)
        //    html2canvas has partial/broken filter support
        const epicCharName = document.getElementById('epic-char-name');
        if (epicCharName && state.effects) {
            let dropShadows = [];
            if (state.effects.shadow && state.effects.shadow.active) {
                const e = state.effects.shadow;
                dropShadows.push(`${e.x}px ${e.y}px ${e.blur}px ${e.color}`);
            }
            if (state.effects.glow && state.effects.glow.active) {
                const e = state.effects.glow;
                dropShadows.push(`0px 0px ${e.blur}px ${e.color}`);
                dropShadows.push(`0px 0px ${e.blur * 2}px ${e.color}`);
            }
            if (state.effects.outline && state.effects.outline.active) {
                const o = state.effects.outline.blur; const c = state.effects.outline.color;
                dropShadows.push(`-${o}px -${o}px 0 ${c}`);
                dropShadows.push(`${o}px -${o}px 0 ${c}`);
                dropShadows.push(`-${o}px ${o}px 0 ${c}`);
                dropShadows.push(`${o}px ${o}px 0 ${c}`);
            }
            if (dropShadows.length > 0) {
                override(epicCharName, 'filter', 'none');
                override(epicCharName, 'textShadow', dropShadows.join(', '));
            }
        }

        // 8. Convert filter:drop-shadow on h1 elements to text-shadow fallback
        epicSheet.querySelectorAll('h1, h2, h3').forEach(el => {
            if (el === epicCharName) return; // already handled above
            const cs = getComputedStyle(el);
            if (cs.filter && cs.filter !== 'none' && cs.filter.includes('drop-shadow')) {
                const match = cs.filter.match(/drop-shadow\((.+?)\)/);
                if (match) {
                    override(el, 'filter', 'none');
                    override(el, 'textShadow', match[1]);
                }
            }
        });

        return { sheet: epicSheet, savedState };
    }

    function resetDOMafterCapture(savedState) {
        // Restore all overridden styles in reverse order
        for (let i = savedState.overrides.length - 1; i >= 0; i--) {
            const { el, prop, oldVal } = savedState.overrides[i];
            el.style[prop] = oldVal;
        }

        // Restore mode if it was switched
        if (!savedState.wasAesthetic) {
            isAesthetic = false;
            document.body.classList.remove('mode-aesthetic');
            document.getElementById('character-sheet').style.display = 'block';
            document.getElementById('epic-presentation-card').style.display = 'none';
            document.getElementById('aesthetic-customizer').style.display = 'none';
        }
    }

    // --- Export Preview System ---
    function showExportPreview(imgDataUrl, fileName, type) {
        const overlay = document.getElementById('export-preview-overlay');
        const body = document.getElementById('export-preview-body');
        const title = document.getElementById('export-preview-title');
        const btnDownload = document.getElementById('btn-export-download');

        title.textContent = type === 'pdf' 
            ? '📜 Pré-visualização — PDF' 
            : '🖼️ Pré-visualização — Imagem';

        body.innerHTML = '';
        const img = document.createElement('img');
        img.src = imgDataUrl;
        img.alt = 'Pré-visualização da exportação';
        body.appendChild(img);

        // Store download data for the button
        btnDownload._downloadData = { imgDataUrl, fileName, type };

        overlay.classList.add('active');
        AudioEngine.playClick();
    }

    // Close preview modal
    document.getElementById('btn-close-export-preview').addEventListener('click', () => {
        document.getElementById('export-preview-overlay').classList.remove('active');
    });
    document.getElementById('export-preview-overlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.remove('active');
        }
    });

    // Download button inside preview
    document.getElementById('btn-export-download').addEventListener('click', function() {
        const data = this._downloadData;
        if (!data) return;

        if (data.type === 'pdf') {
            // Rebuild PDF from the stored canvas image
            const { jsPDF } = window.jspdf;
            const img = new Image();
            img.onload = function() {
                const pdfWidth = img.naturalWidth;
                const pdfHeight = img.naturalHeight;
                const orientation = pdfWidth > pdfHeight ? 'l' : 'p';
                const pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'px',
                    format: [pdfWidth, pdfHeight]
                });
                pdf.setFillColor(10, 5, 0);
                pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
                pdf.addImage(data.imgDataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(data.fileName);
            };
            img.src = data.imgDataUrl;
        } else {
            const link = document.createElement('a');
            link.download = data.fileName;
            link.href = data.imgDataUrl;
            link.click();
        }

        AudioEngine.playCoin();
    });

    async function exportImg() {
        const { sheet, savedState } = prepareDOMforCapture();
        const charName = document.getElementById('char-name').value || 'Personagem';
        try {
            const canvas = await html2canvas(sheet, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#0a0500',
                logging: false
            });
            const imgDataUrl = canvas.toDataURL('image/png');
            const fileName = `${charName.replace(/ /g, '_')}_SWADE.png`;
            resetDOMafterCapture(savedState);
            showExportPreview(imgDataUrl, fileName, 'img');
        } catch (e) {
            console.error('Export IMG Error:', e);
            alert("Falha ao exportar imagem.");
            resetDOMafterCapture(savedState);
        }
    }

    async function exportPDF() {
        const { sheet, savedState } = prepareDOMforCapture();
        const charName = document.getElementById('char-name').value || 'Personagem';
        try {
            const canvas = await html2canvas(sheet, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#0a0500',
                logging: false
            });
            const imgDataUrl = canvas.toDataURL('image/png');
            const fileName = `${charName.replace(/ /g, '_')}_SWADE.pdf`;
            resetDOMafterCapture(savedState);
            showExportPreview(imgDataUrl, fileName, 'pdf');
        } catch (e) {
            console.error('Export PDF Error:', e);
            alert("Falha ao exportar PDF.");
            resetDOMafterCapture(savedState);
        }
    }

    init();
});

window.showCustomToast = function(msg) {
    const toast = document.getElementById('custom-toast');
    const content = document.getElementById('custom-toast-content');
    if(toast && content) {
        content.textContent = msg;
        toast.classList.remove('toast-hidden');
        toast.classList.add('toast-show');
        setTimeout(() => {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hidden');
        }, 4000);
    }
};


