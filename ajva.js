function updateDropDownVisibility(id, visibility) {
    if (visibility) {
        document.getElementById(id)?.classList?.toggle('show');
    } else {
        document.getElementById(id)?.classList?.remove('show');
    }
}

function scrollCarousel(direction) {
    const track = document.getElementById('carousel-track');
    const card = track.querySelector('.creator-card');
    if (!card) return;

    const scrollAmount = card.offsetWidth + 20; // includes margin
    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}
