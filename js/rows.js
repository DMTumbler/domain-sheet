let locCount = 0, assetCount = 0, unitCount = 0, logCount = 0, obsCount = 0;

function addMainObstacle(row) {
    row = row || {};
    const id = 'mobs' + (obsCount++);
    const tr = document.createElement('tr');
    tr.id = id;
    const selVal = row.select || '__custom';
    const matchVal = row.match || 0;
    tr.innerHTML = '<td>' + locFieldHTML('mo', row.loc || '') + '</td>' +
        '<td><select class="mo-select" onchange="onObstaclePick(\'' + id + '\')">' + obstacleOptions(selVal) + '</select>' +
        '<div class="mo-vs" style="font-size:9px;color:var(--sub);margin-top:2px;"></div>' +
        (selVal === '__custom' ? '<input type="text" class="mo-custom-vs" placeholder="e.g. Wealth/Poverty" value="' + (row.customVs || '') + '" style="margin-top:2px;font-size:11px;" oninput="recalcObstacles()">' : '') +
        '</td>' +
        '<td><input type="number" class="mo-level" value="' + (row.level || 3) + '" oninput="recalcObstacles()"></td>' +
        '<td><select class="mo-match" onchange="recalcObstacles()">' +
        UNIT_OPTS_FOR_OBSTACLE.map(function (o, i) {
            return '<option value="' + i + '"' + (matchVal == i ? ' selected' : '') + '>' + o + '</option>';
        }).join('') +
        '</select></td>' +
        '<td class="mo-mult" style="font-size:11px;color:var(--sub);text-align:center;">×1</td>' +
        '<td class="mo-roll" style="font-weight:bold;text-align:center;"></td>' +
        '<td style="text-align:center;"><input type="checkbox" class="mo-drain" onchange="recalcObstacles()" ' + (row.drain ? 'checked' : '') + '></td>' +
        '<td><input type="text" value="' + (row.notes || '') + '"></td>' +
        '<td><button class="del-btn" onclick="document.getElementById(\'' + id + '\').remove();recalcAll();">×</button></td>';
    document.getElementById('main-obstacle-body').appendChild(tr);
    onObstaclePick(id);
}

function onObstaclePick(id) {
    const row = document.getElementById(id);
    const sel = row.querySelector('.mo-select');
    const vsDiv = row.querySelector('.mo-vs');
    const td = sel.closest('td');
    const existingCustom = td.querySelector('.mo-custom-vs');
    if (sel.value === '__custom') {
        vsDiv.textContent = '';
        if (!existingCustom) {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.className = 'mo-custom-vs';
            inp.placeholder = 'e.g. Wealth/Poverty';
            inp.style.marginTop = '2px';
            inp.style.fontSize = '11px';
            inp.oninput = recalcObstacles;
            td.appendChild(inp);
        }
    } else {
        if (existingCustom) existingCustom.remove();
        const o = OBSTACLE_TABLE.find(function (x) {
            return x.name === sel.value;
        });
        vsDiv.textContent = 'Needs: ' + SAVE_UNIT[o.save];
    }
    recalcObstacles();
}

function addLoc(row) {
    row = row || {};
    const id = 'loc' + (locCount++);
    const tr = document.createElement('tr');
    tr.id = id;
    tr.innerHTML = '<td><input type="text" value="' + (row.name || '') + '" placeholder="Shen Yu" oninput="refreshLocationDropdowns()"></td>' +
        '<td><input type="text" value="' + (row.type || '') + '" placeholder="City"></td>' +
        '<td><input type="number" class="loc-mil" value="' + (row.mil || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="loc-wea" value="' + (row.wea || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="loc-soc" value="' + (row.soc || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="text" value="' + (row.notes || '') + '" placeholder="Obstacle: Xenophobia"></td>' +
        '<td><button class="del-btn" onclick="document.getElementById(\'' + id + '\').remove();recalcAll();refreshLocationDropdowns();">×</button></td>';
    document.getElementById('loc-body').appendChild(tr);
    refreshLocationDropdowns();
}

function addAsset(row) {
    row = row || {};
    const id = 'asset' + (assetCount++);
    const tr = document.createElement('tr');
    tr.id = id;
    const selVal = row.select || '__custom';
    tr.innerHTML = '<td><select class="a-select" onchange="onAssetPick(\'' + id + '\')">' + assetOptions(selVal) + '</select><div class="a-type" style="font-size:9px;color:var(--sub);margin-top:2px;"></div></td>' +
        '<td>' + locFieldHTML('a', row.loc || '') + '</td>' +
        '<td><input type="number" class="a-mil" value="' + (row.mil || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="a-wea" value="' + (row.wea || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="a-soc" value="' + (row.soc || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="a-mil-up" value="' + (row.milUp || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="a-wea-up" value="' + (row.weaUp || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="a-soc-up" value="' + (row.socUp || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="a-disr" value="' + (row.disr || 0) + '" oninput="renderPlayerView()"></td>' +
        '<td><input type="text" value="' + (row.notes || '') + '"></td>' +
        '<td><button class="del-btn" onclick="document.getElementById(\'' + id + '\').remove();recalcAll();">×</button></td>';
    document.getElementById('asset-body').appendChild(tr);
    if (selVal !== '__custom') {
        onAssetPick(id);
    }
}

function onAssetPick(id) {
    const row = document.getElementById(id);
    const sel = row.querySelector('.a-select');
    const mIn = row.querySelector('.a-mil'), wIn = row.querySelector('.a-wea'), sIn = row.querySelector('.a-soc');
    const typeSpan = row.querySelector('.a-type');
    if (sel.value === '__custom') {
        mIn.readOnly = false;
        wIn.readOnly = false;
        sIn.readOnly = false;
        mIn.style.background = '';
        wIn.style.background = '';
        sIn.style.background = '';
        typeSpan.textContent = '';
    } else {
        const a = ASSET_TABLE.find(function (x) {
            return x.name === sel.value;
        });
        mIn.value = a.m;
        wIn.value = a.w;
        sIn.value = a.s;
        mIn.readOnly = true;
        wIn.readOnly = true;
        sIn.readOnly = true;
        mIn.style.background = 'var(--bg)';
        wIn.style.background = 'var(--bg)';
        sIn.style.background = 'var(--bg)';
        typeSpan.textContent = a.type;
    }
    recalcAll();
}

function addUnit(row) {
    row = row || {};
    const id = 'unit' + (unitCount++);
    const tr = document.createElement('tr');
    tr.id = id;
    const selVal = row.select || '__custom';
    tr.innerHTML = '<td><select class="u-select" onchange="onUnitPick(\'' + id + '\')">' + unitOptions(selVal) + '</select></td>' +
        '<td>' + locFieldHTML('u', row.loc || '') + '</td>' +
        '<td><input type="number" class="u-mil-up" value="' + (row.milUp || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="u-wea-up" value="' + (row.weaUp || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="number" class="u-soc-up" value="' + (row.socUp || 0) + '" oninput="recalcAll()"></td>' +
        '<td><input type="text" value="' + (row.hp || '') + '" placeholder="18/18"></td>' +
        '<td><input type="text" value="' + (row.notes || '') + '"></td>' +
        '<td><button class="del-btn" onclick="document.getElementById(\'' + id + '\').remove();recalcAll();">×</button></td>';
    document.getElementById('unit-body').appendChild(tr);
    if (selVal !== '__custom') {
        onUnitPick(id);
    }
}

function onUnitPick(id) {
    const row = document.getElementById(id);
    const sel = row.querySelector('.u-select');
    const mIn = row.querySelector('.u-mil-up'), wIn = row.querySelector('.u-wea-up'),
        sIn = row.querySelector('.u-soc-up');
    if (sel.value === '__custom') {
        mIn.readOnly = false;
        wIn.readOnly = false;
        sIn.readOnly = false;
        mIn.style.background = '';
        wIn.style.background = '';
        sIn.style.background = '';
    } else {
        const u = UNIT_TABLE.find(function (x) {
            return x.name === sel.value;
        });
        mIn.value = u.m;
        wIn.value = u.w;
        sIn.value = u.s;
        mIn.readOnly = true;
        wIn.readOnly = true;
        sIn.readOnly = true;
        mIn.style.background = 'var(--bg)';
        wIn.style.background = 'var(--bg)';
        sIn.style.background = 'var(--bg)';
    }
    recalcAll();
}

function addLog(row) {
    row = row || {};
    const id = 'log' + (logCount++);
    const div = document.createElement('div');
    div.className = 'log-row';
    div.id = id;
    div.innerHTML = '<div class="log-head">' +
        '<div><label>Turn</label><input type="text" value="' + (row.turn || '') + '"></div>' +
        '<div><label>Action 1</label><input type="text" value="' + (row.a1 || '') + '" placeholder="Accumulate Treasure — success"></div>' +
        '<div><label>Action 2</label><input type="text" value="' + (row.a2 || '') + '" placeholder="Establish Asset (Palisade) — fail"></div>' +
        '</div><div class="log-notes"><textarea placeholder="Notes, complications, hooks for next session">' + (row.notes || '') + '</textarea></div>' +
        '<button class="del-btn" style="float:right;margin-top:-10px;" onclick="document.getElementById(\'' + id + '\').remove()">× remove entry</button>';
    document.getElementById('log-body').appendChild(div);
}
