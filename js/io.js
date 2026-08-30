function exportData() {
    const data = {
        version: 1,
        header: {
            domain: val('hdr-domain'), capital: val('hdr-capital'), ruler: val('hdr-ruler'),
            region: val('hdr-region'), turn: val('hdr-turn'), actions: val('hdr-actions')
        },
        treasure: val('treasure'),
        atrocity: val('atrocity'),
        locations: [],
        assets: [],
        units: [],
        obstacles: [],
        log: []
    };

    document.querySelectorAll('#loc-body tr').forEach(function (row) {
        const tds = row.querySelectorAll('td');
        data.locations.push({
            name: tds[0].querySelector('input').value,
            type: tds[1].querySelector('input').value,
            mil: tds[2].querySelector('input').value,
            wea: tds[3].querySelector('input').value,
            soc: tds[4].querySelector('input').value,
            notes: tds[5].querySelector('input').value
        });
    });

    document.querySelectorAll('#asset-body tr').forEach(function (row) {
        const tds = row.querySelectorAll('td');
        data.assets.push({
            select: tds[0].querySelector('select').value,
            loc: locFieldValue(tds[1]),
            mil: tds[2].querySelector('input').value,
            wea: tds[3].querySelector('input').value,
            soc: tds[4].querySelector('input').value,
            milUp: tds[5].querySelector('input').value,
            weaUp: tds[6].querySelector('input').value,
            socUp: tds[7].querySelector('input').value,
            disr: tds[8].querySelector('input').value,
            notes: tds[9].querySelector('input').value
        });
    });

    document.querySelectorAll('#unit-body tr').forEach(function (row) {
        const tds = row.querySelectorAll('td');
        data.units.push({
            select: tds[0].querySelector('select').value,
            loc: locFieldValue(tds[1]),
            milUp: tds[2].querySelector('input').value,
            weaUp: tds[3].querySelector('input').value,
            socUp: tds[4].querySelector('input').value,
            hp: tds[5].querySelector('input').value,
            notes: tds[6].querySelector('input').value
        });
    });

    document.querySelectorAll('#main-obstacle-body tr').forEach(function (row) {
        const tds = row.querySelectorAll('td');
        const sel = tds[1].querySelector('.mo-select');
        const customVsInput = tds[1].querySelector('.mo-custom-vs');
        data.obstacles.push({
            loc: locFieldValue(tds[0]),
            select: sel.value,
            customVs: customVsInput ? customVsInput.value : '',
            level: tds[2].querySelector('input').value,
            match: tds[3].querySelector('select').value,
            drain: tds[6].querySelector('input[type=checkbox]').checked,
            notes: tds[7].querySelector('input').value
        });
    });

    document.querySelectorAll('#log-body .log-row').forEach(function (div) {
        const inputs = div.querySelectorAll('.log-head input');
        const textarea = div.querySelector('textarea');
        data.log.push({
            turn: inputs[0] ? inputs[0].value : '',
            a1: inputs[1] ? inputs[1].value : '',
            a2: inputs[2] ? inputs[2].value : '',
            notes: textarea ? textarea.value : ''
        });
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const nameSlug = (data.header.domain || 'domain-sheet').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'domain-sheet';
    a.href = url;
    a.download = nameSlug + '-turn' + (data.header.turn || '1') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showImportStatus('Exported.', false);
}

function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function showImportStatus(msg, isError) {
    const el = document.getElementById('import-status');
    el.textContent = msg;
    el.style.color = isError ? 'var(--accent)' : 'var(--sub)';
    if (!isError) {
        setTimeout(function () {
            if (el.textContent === msg) el.textContent = '';
        }, 4000);
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        let data;
        try {
            data = JSON.parse(e.target.result);
        } catch (err) {
            showImportStatus('That file is not valid JSON — import cancelled.', true);
            event.target.value = '';
            return;
        }
        if (!data || typeof data !== 'object' || !('locations' in data)) {
            showImportStatus('That file does not look like a domain sheet export — import cancelled.', true);
            event.target.value = '';
            return;
        }
        applyImportedData(data);
        event.target.value = '';
    };
    reader.onerror = function () {
        showImportStatus('Could not read that file — import cancelled.', true);
        event.target.value = '';
    };
    reader.readAsText(file);
}

function applyImportedData(data) {
    const h = data.header || {};
    setVal('hdr-domain', h.domain);
    setVal('hdr-capital', h.capital);
    setVal('hdr-ruler', h.ruler);
    setVal('hdr-region', h.region);
    setVal('hdr-turn', h.turn);
    setVal('hdr-actions', h.actions);
    setVal('treasure', data.treasure);
    setVal('atrocity', data.atrocity);

    document.getElementById('loc-body').innerHTML = '';
    document.getElementById('asset-body').innerHTML = '';
    document.getElementById('unit-body').innerHTML = '';
    document.getElementById('main-obstacle-body').innerHTML = '';
    document.getElementById('log-body').innerHTML = '';

    (data.locations || []).forEach(function (l) {
        addLoc({name: l.name, type: l.type, mil: l.mil, wea: l.wea, soc: l.soc, notes: l.notes});
    });
    (data.assets || []).forEach(function (a) {
        addAsset({
            select: a.select,
            loc: a.loc,
            mil: a.mil,
            wea: a.wea,
            soc: a.soc,
            milUp: a.milUp,
            weaUp: a.weaUp,
            socUp: a.socUp,
            disr: a.disr,
            notes: a.notes
        });
    });
    (data.units || []).forEach(function (u) {
        addUnit({
            select: u.select,
            loc: u.loc,
            milUp: u.milUp,
            weaUp: u.weaUp,
            socUp: u.socUp,
            hp: u.hp,
            notes: u.notes
        });
    });
    (data.obstacles || []).forEach(function (o) {
        addMainObstacle({
            loc: o.loc,
            select: o.select,
            customVs: o.customVs,
            level: o.level,
            match: o.match,
            drain: o.drain,
            notes: o.notes
        });
    });
    (data.log || []).forEach(function (l) {
        addLog({turn: l.turn, a1: l.a1, a2: l.a2, notes: l.notes});
    });

    refreshLocationDropdowns();
    recalcObstacles();
    atroc();
    showImportStatus('Imported ' + (h.domain ? ('"' + h.domain + '"') : 'domain sheet') + '.', false);
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.value = value;
}
