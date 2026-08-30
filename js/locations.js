function currentLocationNames() {
    const names = [];
    document.querySelectorAll('#loc-body tr').forEach(function (row) {
        const input = row.querySelector('td:first-child input');
        const val = input ? input.value.trim() : '';
        if (val) names.push(val);
    });
    return names;
}

function locSelectOptions(selected) {
    const names = currentLocationNames();
    const known = names.includes(selected);
    let out = '<option value="__custom"' + (!known ? ' selected' : '') + '>— Type your own —</option>';
    names.forEach(function (n) {
        out += '<option value="' + n + '"' + (selected === n ? ' selected' : '') + '>' + n + '</option>';
    });
    return out;
}

function locFieldHTML(cls, currentVal) {
    const known = currentLocationNames().includes(currentVal);
    let html = '<select class="' + cls + '-loc-select" onchange="onLocFieldPick(this)">' + locSelectOptions(known ? currentVal : '') + '</select>';
    if (!known) {
        html += '<input type="text" class="' + cls + '-loc-custom" placeholder="Location name" value="' + (currentVal || '') + '" style="margin-top:2px;font-size:12px;" oninput="recalcAll()">';
    }
    return html;
}

function onLocFieldPick(sel) {
    const cls = sel.className.replace('-loc-select', '');
    const td = sel.closest('td');
    const existing = td.querySelector('.' + cls + '-loc-custom');
    if (sel.value === '__custom') {
        if (!existing) {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.className = cls + '-loc-custom';
            inp.placeholder = 'Location name';
            inp.style.marginTop = '2px';
            inp.style.fontSize = '12px';
            inp.oninput = function () {
                recalcAll();
            };
            td.appendChild(inp);
        }
    } else if (existing) {
        existing.remove();
    }
    recalcAll();
}

function locFieldValue(td) {
    const sel = td.querySelector('select');
    if (!sel) return '';
    if (sel.value === '__custom') {
        const custom = td.querySelector('input[type=text]');
        return custom ? custom.value.trim() : '';
    }
    return sel.value;
}

function refreshLocationDropdowns() {
    ['mo', 'a', 'u'].forEach(function (cls) {
        document.querySelectorAll('.' + cls + '-loc-select').forEach(function (sel) {
            const names = currentLocationNames();
            const stillValid = sel.value !== '__custom' && names.includes(sel.value);
            const keep = stillValid ? sel.value : '__custom';
            sel.innerHTML = locSelectOptions(keep);
        });
    });
}
