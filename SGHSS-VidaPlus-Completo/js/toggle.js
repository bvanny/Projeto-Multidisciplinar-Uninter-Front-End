document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');

    if (btn && sidebar) {
        btn.onclick = function() {
            sidebar.classList.toggle('open');
        };

        if (content) {
            content.onclick = function() {
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            };
        }
    }
});