function switchTab(which) {
    document.getElementById('gm-tab').style.display = which === 'gm' ? 'block' : 'none';
    document.getElementById('player-tab').style.display = which === 'player' ? 'block' : 'none';
    document.getElementById('tab-btn-gm').classList.toggle('active', which === 'gm');
    document.getElementById('tab-btn-player').classList.toggle('active', which === 'player');
    if (which === 'player') renderPlayerView();
}

function renderPlayerView() {
    const pvTitle = document.getElementById('pv-title');
    if (!pvTitle) return; // player tab not yet in DOM during early init

    const domainName = (document.getElementById('hdr-domain') || {}).value || 'Midgard Domain Sheet';
    const capital = (document.getElementById('hdr-capital') || {}).value || '';
    const ruler = (document.getElementById('hdr-ruler') || {}).value || '';
    const turn = (document.getElementById('hdr-turn') || {}).value || '1';
    const actionsPer = (document.getElementById('hdr-actions') || {}).value || '2';
    pvTitle.innerHTML = (domainName || 'Midgard Domain Sheet') + ' <small>Turn ' + turn + (capital ? ' — ' + capital : '') + '</small>';

    // Stat block
    const stats = ['mil', 'wea', 'soc'];
    const labels = {mil: 'Military', wea: 'Wealth', soc: 'Social'};
    const block = document.getElementById('pv-stat-block');
    block.innerHTML = '';
    stats.forEach(function (k) {
        const pts = document.getElementById(k + '-pts').value;
        const upk = document.getElementById(k + '-upk').value;
        const mod = document.getElementById(k + '-mod').value;
        const over = (parseInt(pts) || 0) - (parseInt(upk) || 0) < 0;
        block.innerHTML += '<div class="pv-stat ' + k + '">' +
            '<div class="pv-stat-name">' + labels[k] + '</div>' +
            '<div class="pv-stat-num">' + mod + '</div>' +
            '<div class="pv-stat-mod">score ' + pts + ' &middot; upkeep ' + upk + '</div>' +
            (over ? '<div class="pv-stat-warn">Over upkeep — shed something</div>' : '') +
            '</div>';
    });

    // Obstacle warnings — only ones actively draining a held location
    const warnDiv = document.getElementById('pv-obstacle-warnings');
    warnDiv.innerHTML = '';
    document.querySelectorAll('#main-obstacle-body tr').forEach(function (row) {
        const drain = row.querySelector('.mo-drain');
        if (drain && drain.checked) {
            const locTd = row.querySelector('td:first-child');
            const loc = locFieldValue(locTd) || 'a location';
            const selEl = row.querySelector('.mo-select');
            const obsName = selEl.value === '__custom' ? 'An obstacle' : selEl.value;
            const level = row.querySelector('.mo-level').value;
            warnDiv.innerHTML += '<div class="pv-obstacle-warn">' + obsName + ' is draining <b>' + loc + '</b> (level ' + level + '). </div>';
        }
    });

    // Locations
    const locList = document.getElementById('pv-locations');
    locList.innerHTML = '';
    const locRows = document.querySelectorAll('#loc-body tr');
    if (!locRows.length) {
        locList.innerHTML = '<li class="pv-empty">No locations yet.</li>';
    }
    locRows.forEach(function (row) {
        const name = row.querySelector('td:nth-child(1) input').value || '(unnamed)';
        const type = row.querySelector('td:nth-child(2) input').value;
        const m = row.querySelector('.loc-mil').value, w = row.querySelector('.loc-wea').value,
            s = row.querySelector('.loc-soc').value;
        locList.innerHTML += '<li><span>' + name + (type ? ' <span class="pv-sub">(' + type + ')</span>' : '') + '</span><span class="pv-sub">M' + m + ' / W' + w + ' / S' + s + '</span></li>';
    });

    // Assets
    const assetList = document.getElementById('pv-assets');
    assetList.innerHTML = '';
    const assetRows = document.querySelectorAll('#asset-body tr');
    if (!assetRows.length) {
        assetList.innerHTML = '<li class="pv-empty">No assets yet.</li>';
    }
    assetRows.forEach(function (row) {
        const sel = row.querySelector('.a-select');
        const name = sel.value === '__custom' ? 'Custom asset' : sel.value;
        const locTd = row.querySelectorAll('td')[1];
        const loc = locFieldValue(locTd);
        const m = row.querySelector('.a-mil').value, w = row.querySelector('.a-wea').value,
            s = row.querySelector('.a-soc').value;
        const disr = parseInt(row.querySelector('.a-disr').value) || 0;
        const disrTag = disr > 0 ? ' <span class="pv-disr-tag">Disruption ' + disr + ' — ' + disr + '-in-6 chance to ignore orders</span>' : '';
        assetList.innerHTML += '<li><span>' + name + (loc ? ' <span class="pv-sub">— ' + loc + '</span>' : '') + disrTag + '</span><span class="pv-sub">M' + (m >= 0 ? '+' : '') + m + ' / W' + (w >= 0 ? '+' : '') + w + ' / S' + (s >= 0 ? '+' : '') + s + '</span></li>';
    });

    // Units
    const unitList = document.getElementById('pv-units');
    unitList.innerHTML = '';
    const unitRows = document.querySelectorAll('#unit-body tr');
    if (!unitRows.length) {
        unitList.innerHTML = '<li class="pv-empty">No units yet.</li>';
    }
    unitRows.forEach(function (row) {
        const sel = row.querySelector('.u-select');
        const name = sel.value === '__custom' ? 'Custom unit' : sel.value;
        const locTd = row.querySelectorAll('td')[1];
        const loc = locFieldValue(locTd);
        const hp = row.querySelector('td:nth-child(6) input') ? row.querySelector('td:nth-child(6) input').value : '';
        unitList.innerHTML += '<li><span>' + name + (loc ? ' <span class="pv-sub">— ' + loc + '</span>' : '') + '</span><span class="pv-sub">' + (hp || '') + '</span></li>';
    });

    // Treasury
    document.getElementById('pv-treasury').textContent = (document.getElementById('treasure').value || '0') + ' Treasure';
    const pvWeaPts = parseInt(document.getElementById('wea-pts').value) || 0;
    document.getElementById('pv-stipend').textContent = 'Plus: ' + (pvWeaPts * 100).toLocaleString() + ' gp free requisition this turn (100gp × Wealth score, no roll)';

    // Atrocity
    const atrocity = parseInt(document.getElementById('atrocity').value) || 0;
    document.getElementById('pv-atrocity').textContent = atrocity + ' Atrocity';
    const pvAtrocityNote = document.getElementById('pv-atrocity-note');
    if (atrocity <= 0) {
        pvAtrocityNote.textContent = 'No penalty currently.';
    } else {
        const atrocityPenalty = 2 + Math.floor(atrocity / 4);
        pvAtrocityNote.textContent = '−' + atrocityPenalty + ' upkeep penalty to all stats.';
    }

    // This turn
    document.getElementById('pv-actions').innerHTML =
        '<div><b>' + actionsPer + '</b> action(s) this turn' + (ruler ? ' — led by ' + ruler : '') + '</div>';

    renderActionCards();
}

function renderActionCards() {
    const grid = document.getElementById('pv-action-cards');
    if (!grid || grid.dataset.filled) return;
    grid.innerHTML = DOMAIN_ACTIONS.map(function (a) {
        return '<div class="pv-action-card"><h4>' + a.name + '</h4><p>' + a.what + '</p><p class="pv-how">' + a.how + '</p></div>';
    }).join('');
    grid.dataset.filled = '1';
}
