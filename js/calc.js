function modFor(pts) {
    pts = Math.max(0, pts || 0);
    if (pts >= 16) {
        return 3 + Math.floor((pts - 16) / 5) + 1 - 1 + Math.floor((pts - 15) / 5);
    } // fallback, overwritten below
    return 0;
}

function computeMod(pts) {
    pts = Math.max(0, pts || 0);
    if (pts <= 5) return 0;
    if (pts <= 10) return 1;
    if (pts <= 15) return 2;
    const base = 3;
    const extra = Math.floor((pts - 16) / 5) + 1;
    return base + extra;
}

function calc(key) {
    const pts = parseInt(document.getElementById(key + '-pts').value) || 0;
    const upk = parseInt(document.getElementById(key + '-upk').value) || 0;
    const mod = computeMod(pts);
    const modEl = document.getElementById(key + '-mod');
    modEl.value = (mod >= 0 ? '+' : '') + mod;
    const netEl = document.getElementById(key + '-net');
    const diff = pts - upk;
    if (diff < 0) {
        netEl.className = 'stat-net net-bad';
        netEl.textContent = 'Over upkeep by ' + Math.abs(diff) + ' — shed assets';
    } else {
        netEl.className = 'stat-net net-ok';
        netEl.textContent = diff + ' point' + (diff === 1 ? '' : 's') + ' capacity remaining';
    }
}

function atroc() {
    const a = parseInt(document.getElementById('atrocity').value) || 0;
    const note = document.getElementById('atroc-note');
    if (a <= 0) {
        note.textContent = 'No penalty. A domain with any Atrocity suffers a −2 upkeep penalty to stats; the penalty worsens by 1 for every 4 points.';
    } else {
        const penalty = 2 + Math.floor(a / 4);
        note.textContent = 'Current upkeep penalty: −' + penalty + ' added to stats upkeep. Rebel unit pool if deposed: ' + a + ' points.';
    }
    recalcAll();
}

function sumClass(cls) {
    const els = document.querySelectorAll('.' + cls);
    let total = 0;
    els.forEach(function (el) {
        total += parseInt(el.value) || 0;
    });
    return total;
}

function obstacleValueFor(row) {
    const sel = row.querySelector('.mo-select');
    if (sel.value === '__custom') {
        const custom = row.querySelector('.mo-custom-vs');
        const txt = custom ? custom.value : '';
        const parts = txt.split('/');
        return parts[0] ? parts[0].trim() : null;
    }
    const o = OBSTACLE_TABLE.find(function (x) {
        return x.name === sel.value;
    });
    return o ? o.value : null;
}

function recalcObstacles() {
    recalcAll();
    const baseDC = 12;
    const mMod = computeMod(parseInt(document.getElementById('mil-pts').value) || 0);
    const wMod = computeMod(parseInt(document.getElementById('wea-pts').value) || 0);
    const sMod = computeMod(parseInt(document.getElementById('soc-pts').value) || 0);
    const modByValue = {Military: mMod, Wealth: wMod, Social: sMod};

    document.querySelectorAll('#main-obstacle-body tr').forEach(function (row) {
        const level = parseInt(row.querySelector('.mo-level').value) || 0;
        const matchIdx = parseInt(row.querySelector('.mo-match').value) || 0;
        const mult = matchIdx === 0 ? 1 : (matchIdx === 1 ? 2 : 3);
        row.querySelector('.mo-mult').textContent = '×' + mult;

        const value = obstacleValueFor(row);
        const mod = value && modByValue[value] !== undefined ? modByValue[value] : 0;
        const penalty = level * mult;
        const rollNeeded = baseDC - mod + penalty;
        row.querySelector('.mo-roll').textContent = 'd20 ≥ ' + rollNeeded;
    });
}

function sumDrainPenalty() {
    let total = 0;
    document.querySelectorAll('#main-obstacle-body tr').forEach(function (row) {
        const drain = row.querySelector('.mo-drain').checked;
        if (drain) {
            const level = parseInt(row.querySelector('.mo-level').value) || 0;
            total += Math.ceil(level / 2);
        }
    });
    return total;
}

function recalcAll() {
    const atrocity = parseInt(document.getElementById('atrocity').value) || 0;
    const atrocPenalty = atrocity > 0 ? (2 + Math.floor(atrocity / 4)) : 0;
    const obsPenalty = sumDrainPenalty();

    const milPts = sumClass('loc-mil') + sumClass('a-mil');
    const weaPts = sumClass('loc-wea') + sumClass('a-wea');
    const socPts = sumClass('loc-soc') + sumClass('a-soc');

    const milUp = sumClass('a-mil-up') + sumClass('u-mil-up') + atrocPenalty + obsPenalty;
    const weaUp = sumClass('a-wea-up') + sumClass('u-wea-up') + atrocPenalty + obsPenalty;
    const socUp = sumClass('a-soc-up') + sumClass('u-soc-up') + atrocPenalty + obsPenalty;

    document.getElementById('mil-pts').value = milPts;
    document.getElementById('wea-pts').value = weaPts;
    document.getElementById('soc-pts').value = socPts;
    document.getElementById('mil-upk').value = milUp;
    document.getElementById('wea-upk').value = weaUp;
    document.getElementById('soc-upk').value = socUp;

    const stipend = weaPts * 100;
    const stipendAmountEl = document.getElementById('stipend-amount');
    const stipendWealthEl = document.getElementById('stipend-wealth');
    if (stipendAmountEl) {
        stipendAmountEl.textContent = stipend.toLocaleString() + ' gp';
    }
    if (stipendWealthEl) {
        stipendWealthEl.textContent = weaPts;
    }

    calc('mil');
    calc('wea');
    calc('soc');
    renderPlayerView();
}
