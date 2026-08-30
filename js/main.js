// seed with example rows so the auto-sum is visible immediately
addLoc({name: 'Hjalmarsund', type: 'Resource (Good Fishing)', wea: 4});
addLoc();
addAsset({select: 'Shrine', loc: 'Hjalmarsund'});
addAsset({select: 'School', loc: 'Hjalmarsund'});
addMainObstacle({loc: 'Shen Yu', select: 'Xenophobia', level: 5, match: 0});
addUnit({select: 'Gadaal Scouts', loc: 'Hjalmarsund', hp: '18/18'});
addLog();
recalcObstacles();
atroc();

// show full option text on hover/focus for any select truncated by the fixed table layout
document.addEventListener('change', function (e) {
    if (e.target.tagName === 'SELECT') {
        e.target.title = e.target.options[e.target.selectedIndex].text;
    }
});
document.querySelectorAll('select').forEach(function (sel) {
    sel.title = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '';
});
