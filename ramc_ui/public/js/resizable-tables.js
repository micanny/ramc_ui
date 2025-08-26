function makeTableResizable(table) {
    if (!table || table.classList.contains('resizable-table-init')) return;

    const ths = table.querySelectorAll('thead th');
    ths.forEach(th => {
        // Apply to all th elements for broader compatibility
        th.style.position = 'relative';
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        th.appendChild(resizer);
        makeResizable(th, resizer);
    });
    table.classList.add('resizable-table-init');
}

function makeResizable(th, resizer) {
    let x = 0;
    let w = 0;

    const mouseDownHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();

        x = e.clientX;
        const styles = window.getComputedStyle(th);
        w = parseInt(styles.width, 10);

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        resizer.classList.add('resizing');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    const mouseMoveHandler = function(e) {
        const dx = e.clientX - x;
        const newWidth = w + dx;
        if (newWidth > 50) { // Minimum column width
            th.style.width = `${newWidth}px`;
        }
    };

    const mouseUpHandler = function() {
        resizer.classList.remove('resizing');
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
}
