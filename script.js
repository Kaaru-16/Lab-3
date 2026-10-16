// Home navigation: use dark text over light sections.
const navbar = document.querySelector('.navbar');
const darkSections = [...document.querySelectorAll('.home-banner, .bestsellers, footer')];
const aboutSection = document.getElementById('about');

if (aboutSection) {
    function updateNavigationColor() {
        const belowHeader = navbar.offsetHeight + 1;
        const overDarkSection = darkSections.some(section => {
            const bounds = section.getBoundingClientRect();
            return bounds.top <= belowHeader && bounds.bottom > belowHeader;
        });
        navbar.classList.toggle('navbar-on-light', !overDarkSection);
        const aboutBounds = aboutSection.getBoundingClientRect();
        navbar.classList.toggle('navbar-in-about',
            aboutBounds.top <= belowHeader && aboutBounds.bottom > belowHeader);
    }

    window.addEventListener('scroll', updateNavigationColor, { passive: true });
    window.addEventListener('resize', updateNavigationColor);
    updateNavigationColor();

    // Keep direct section links aligned after the custom fonts load.
    document.fonts.ready.then(() => {
        const section = document.getElementById(window.location.hash.slice(1));
        if (section) section.scrollIntoView({ behavior: 'instant' });
        updateNavigationColor();
    });
}

// Reservations on both pages.
const reservationDialog = document.getElementById('reservation-dialog');

function closeReservation() {
    reservationDialog.close();
}

document.querySelector('.reservation-button').addEventListener('click', () => reservationDialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', closeReservation);
reservationDialog.addEventListener('click', event => {
    if (event.target !== reservationDialog) return;
    const bounds = reservationDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
        closeReservation();
    }
});

// Filters, sorting, and card highlights on the Menu page.
const menuGrid = document.getElementById('menu-grid');

if (menuGrid) {
    const cards = [...menuGrid.querySelectorAll('.menu-card')];
    const categories = document.querySelectorAll('.category-button');
    const menuStatus = document.getElementById('menu-status');
    const emptyMenu = document.getElementById('empty-menu');
    const sortSelect = document.getElementById('menu-sort');
    let selectedCategory = document.querySelector('.category-button[aria-pressed="true"]');

    function updateMenuStatus(label, count) {
        const sortLabel = sortSelect.value === 'default' ? ''
            : ` <span>Sorted by ${sortSelect.selectedOptions[0].textContent}.</span>`;
        menuStatus.innerHTML = `Showing <strong>${count}</strong> dishes in ${label}.${sortLabel}`;
    }

    function setDishHover(card, active) {
        card.classList.toggle('is-hovered', active);
        card.setAttribute('aria-pressed', String(active));
    }

    function toggleDishHover(card) {
        const active = card.dataset.hoverPinned !== 'true';
        card.dataset.hoverPinned = String(active);
        setDishHover(card, active);
    }

    function filterMenu(button) {
        selectedCategory = button;
        let count = 0;
        cards.forEach(card => {
            card.hidden = !card.dataset.categories.split(' ').includes(button.dataset.category);
            card.dataset.hoverPinned = 'false';
            setDishHover(card, false);
            if (!card.hidden) count++;
        });
        categories.forEach(category => category.setAttribute('aria-pressed', String(category === button)));
        emptyMenu.hidden = count > 0;
        updateMenuStatus(button.textContent.trim(), count);
    }

    function sortMenu() {
        const sorted = [...cards];
        if (sortSelect.value !== 'default') {
            const direction = sortSelect.value === 'low' ? 1 : -1;
            sorted.sort((first, second) => (first.dataset.price - second.dataset.price) * direction);
        }
        sorted.forEach(card => menuGrid.appendChild(card));
        filterMenu(selectedCategory);
    }

    categories.forEach(button => button.addEventListener('click', () => filterMenu(button)));
    sortSelect.addEventListener('change', sortMenu);

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => setDishHover(card, true));
        card.addEventListener('mouseleave', () => {
            if (card.dataset.hoverPinned !== 'true') setDishHover(card, false);
        });
        card.addEventListener('focus', () => setDishHover(card, true));
        card.addEventListener('blur', () => {
            card.dataset.hoverPinned = 'false';
            setDishHover(card, false);
        });
        card.addEventListener('click', () => toggleDishHover(card));
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDishHover(card);
            }
        });
    });
    filterMenu(selectedCategory);
}

// Scroll Must Try Dishes with the pointer.
const bestsellerSection = document.querySelector('.bestsellers');
const dishCarousel = document.querySelector('.dish-carousel');

if (bestsellerSection && dishCarousel) {
    bestsellerSection.addEventListener('mousemove', event => {
        const rect = bestsellerSection.getBoundingClientRect();
        // Get mouse X position relative to the section (0 to 1)
        const mouseX = event.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, mouseX / rect.width));

        const maxScroll = dishCarousel.scrollWidth - dishCarousel.clientWidth;
        dishCarousel.scrollLeft = percentage * maxScroll;
    });
}