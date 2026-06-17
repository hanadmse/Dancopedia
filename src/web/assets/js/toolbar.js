(() => {
    const updateToolbarOffset = () => {
        const toolbar = document.querySelector('#toolbar-container');
        if (!toolbar) return;
        const nav = toolbar.querySelector('.site-nav');
        if (!nav) return;
        document.documentElement.style.setProperty('--toolbar-offset', `${nav.offsetHeight}px`);
    };

    updateToolbarOffset();
    window.addEventListener('load', updateToolbarOffset);
    window.addEventListener('resize', updateToolbarOffset);

    const nav = document.querySelector('.site-nav');
    if (window.ResizeObserver && nav) {
        new ResizeObserver(updateToolbarOffset).observe(nav);
    }
})();
