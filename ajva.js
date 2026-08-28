function updateDropDownVisibility(id, visibility) {
    if (visibility) {
        document.getElementById(id)?.classList?.toggle('show');
    } else {
        document.getElementById(id)?.classList?.remove('show');
    }
}

// ======================
// CAROUSEL (made in angers)
// ======================
let carouselCards = [];
let carouselIndex = 0;
let carouselTimer = null;

const CAROUSEL_AUTOPLAY_DELAY = 3000; // ms entre chaque slide auto

function buildCarouselCard(game) {
    const card = document.createElement('div');
    card.className = 'creator-card';

    const imageMarkup = `<img src="${game.img}" alt="${game.title}">`;
    const imageBlock = game['link-game']
        ? `<a href="${game['link-game']}" target="_blank">${imageMarkup}</a>`
        : imageMarkup;

    const creatorMarkup = game.creator
        ? (game['link-creator']
            ? `<p><a href="${game['link-creator']}" target="_blank">${game.creator}</a></p>`
            : `<p>${game.creator}</p>`)
        : '';

    card.innerHTML = `
        ${imageBlock}
        <div class="creator-info">
            <h3>${game.title}</h3>
            ${creatorMarkup}
            ${game.description ? `<p>${game.description}</p>` : ''}
        </div>
    `;

    return card;
}

// Ne fait QUE déplacer/mettre à jour le style des cartes déjà présentes dans le DOM.
// Aucune reconstruction de contenu ici : c'est ce qui rend le glissement fluide.
function positionCarousel() {
    const track = document.getElementById('carousel-track');
    const wrapper = document.querySelector('.carousel-wrapper');
    if (!track || !wrapper || !carouselCards.length) return;

    const cardWidth = carouselCards[0].offsetWidth;
    const gapValue = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    const step = cardWidth + gapValue;
    const wrapperWidth = wrapper.offsetWidth;
    const centerOffset = (wrapperWidth - cardWidth) / 2;

    track.style.transform = `translateX(${centerOffset - carouselIndex * step}px)`;

    const total = carouselCards.length;
    carouselCards.forEach((card, i) => {
        let distance = i - carouselIndex;
        if (distance > total / 2) distance -= total;
        if (distance < -total / 2) distance += total;
        card.classList.toggle('is-active', distance === 0);
    });
}

function updateDots() {
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === carouselIndex);
    });
}

function goToSlide(index) {
    const total = carouselCards.length;
    if (!total) return;
    carouselIndex = ((index % total) + total) % total;
    positionCarousel();
    updateDots();
}

function nextSlide() {
    goToSlide(carouselIndex + 1);
}

function prevSlide() {
    goToSlide(carouselIndex - 1);
}

function startCarouselAutoplay() {
    stopCarouselAutoplay();
    carouselTimer = setInterval(nextSlide, CAROUSEL_AUTOPLAY_DELAY);
}

function stopCarouselAutoplay() {
    if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
    }
}

function buildDots(games) {
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    games.forEach((game, i) => {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot' + (i === carouselIndex ? ' active' : '');
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', `Voir ${game.title}`);
        dot.addEventListener('click', () => {
            goToSlide(i);
            startCarouselAutoplay();
        });
        dotsContainer.appendChild(dot);
    });
}

fetch('./static/Data/carousel.json')
    .then(response => response.json())
    .then(data => {
        if (!data.length) return;

        const track = document.getElementById('carousel-track');
        const wrapper = document.querySelector('.carousel-wrapper');
        if (!track || !wrapper) return;

        track.innerHTML = '';
        data.forEach(game => track.appendChild(buildCarouselCard(game)));
        carouselCards = Array.from(track.children);

        buildDots(data);
        positionCarousel();
        startCarouselAutoplay();

        wrapper.addEventListener('mouseenter', stopCarouselAutoplay);
        wrapper.addEventListener('mouseleave', startCarouselAutoplay);
        window.addEventListener('resize', positionCarousel);
    })
    .catch(error => console.error('Erreur chargement carousel JSON:', error));


// ======================
// TEAM (bureau)
// ======================
fetch('./static/Data/team.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('team-container');
        if (!container) return;

        data.forEach(member => {
            const card = document.createElement('div');
            card.className = 'team-card';

            card.innerHTML = `
                <div class="card-image">
                    <img src="${member.image || './static/images/bureau/user_icon.png'}" alt="${member.name}" />
                    ${member.role && member.role.trim() !== ''
                ? `<div class="badge">${member.role}</div>`
                : ''}
                </div>

                <div class="card-body">
                    <p class="name">${member.name}</p>
                    ${member.description ? `<p class="description">${member.description}</p>` : ''}
                </div>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => console.error('Erreur chargement team JSON:', error));


// ======================
// MEMBERS
// ======================
fetch('./static/Data/member.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('members-container');
        if (!container) return;

        function createCard(member) {
            const card = document.createElement('div');
            card.className = 'member-card';

            const links = [];
            if (member.links.website) links.push(`<a href="${member.links.website}" target="_blank">Site</a>`);
            if (member.links.twitch) links.push(`<a href="${member.links.twitch}" target="_blank">Twitch</a>`);
            if (member.links.youtube) links.push(`<a href="${member.links.youtube}" target="_blank">YouTube</a>`);
            if (member.links.games) {
                member.links.games.forEach(game => {
                    if (game.name && game.link) {
                        links.push(`<a href="${game.link}" target="_blank">${game.name}</a>`);
                    }
                });
            }
            card.innerHTML = `
                <div class="card-image">
                    <img src="${member.image || './static/images/bureau/user_icon.png'}" alt="${member.name}" />
                    ${member.role ? `<span class="member-badge">${member.role}</span>` : ''}

                    <div class="card-overlay">
                        ${member.description ? `<p class="member-description">${member.description}</p>` : ''}
                        ${links.length ? `<p class="member-links">${links.join(' | ')}</p>` : ''}
                    </div>
                </div>

                <p class="member-name">${member.name}</p>
            `;

            return card;
        }

        data.forEach(member => {
            container.appendChild(createCard(member));
        });
    })
    .catch(error => console.error('Erreur chargement member JSON:', error));