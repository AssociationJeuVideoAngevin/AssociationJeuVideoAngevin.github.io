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