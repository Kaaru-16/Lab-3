const reservationButton = document.querySelector('.reservation-button');
const reservationDialog = document.querySelector('#reservation-dialog');
const closeButton = reservationDialog.querySelector('.dialog-close');

reservationButton.addEventListener('click', () => {
    reservationDialog.showModal();
});

closeButton.addEventListener('click', () => {
    reservationDialog.close();
});

reservationDialog.addEventListener('click', (event) => {
    if (event.target !== reservationDialog) return;

    const bounds = reservationDialog.getBoundingClientRect();
    const outsideDialog = event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom;

    if (outsideDialog) reservationDialog.close();
});
