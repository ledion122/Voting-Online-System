//homepage
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function updateCountdown() {
    const electionDate = new Date('February 9, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = electionDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    animateValue('days', days);
    animateValue('hours', hours);
    animateValue('minutes', minutes);
}

function animateValue(elementId, value) {
    const element = document.getElementById(elementId);
    const current = parseInt(element.textContent);
    if (current !== value) {
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = String(value).padStart(2, '0');
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 300);
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

const pollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.poll-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    const percentage = bar.dataset.percentage;
                    const barFill = bar.querySelector('.bar');
                    barFill.style.setProperty('--percentage', `${percentage}%`);
                }, index * 200);
            });
        }
    });
}, { threshold: 0.5 });

pollObserver.observe(document.querySelector('.poll-chart'));

const loginBtn = document.querySelector('.vote-btn');
const loginModal = document.getElementById('loginModal');
const votingSystem = document.getElementById('votingSystem');
const loginForm = document.getElementById('loginForm');

loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'flex';
    setTimeout(() => {
        loginModal.querySelector('.modal-content').style.opacity = '1';
        loginModal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const personalNumber = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (validateLogin(personalNumber, password)) {
        loginModal.style.display = 'none';
        votingSystem.classList.remove('hidden');
        initializeVotingSystem();
        scrollToVotingSystem();
    }
});

function validateLogin(personalNumber, password) {
    if (personalNumber.length < 6) {
        alert('Numri personal duhet të ketë së paku 6 karaktere!');
        return false;
    }
    if (password.length < 6) {
        alert('Fjalëkalimi duhet të ketë së paku 6 karaktere!');
        return false;
    }
    return true;
}

function scrollToVotingSystem() {
    votingSystem.scrollIntoView({ behavior: 'smooth' });
}

const parties = [
    { id: 1, name: 'Vetëvendosje', deputies: generateDeputies(110, 'Vetëvendosje') },
    { id: 2, name: 'LDK', deputies: generateDeputies(110, 'LDK') },
    { id: 3, name: 'PDK', deputies: generateDeputies(110, 'PDK') },
    { id: 4, name: 'AAK', deputies: generateDeputies(110, 'AAK') }
];

function generateDeputies(count, party) {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Deputeti ${i + 1}`,
        party: party
    }));
}

function initializeVotingSystem() {
    const partyList = document.querySelector('.party-list');
    
    partyList.innerHTML = parties.map((party, index) => `
        <div class="party-option" data-party-id="${party.id}" style="animation: fadeInUp ${0.3 + index * 0.1}s ease forwards">
            <h3>${party.name}</h3>
            <button onclick="showDeputies(${party.id})">Zgjedh Deputetët</button>
        </div>
    `).join('');
}

let selectedDeputies = [];

function showDeputies(partyId) {
    const party = parties.find(p => p.id === partyId);
    const deputyList = document.querySelector('.deputy-list');
    document.querySelector('.party-list').classList.add('hidden');
    deputyList.classList.remove('hidden');

    deputyList.innerHTML = `
        <h3>Zgjedh deputetët e partisë ${party.name}</h3>
        <p>Zgjedh deri në 10 deputetë</p>
        <div class="deputy-grid">
            ${party.deputies.map((deputy, index) => `
                <div class="deputy-option" data-deputy-id="${deputy.id}" 
                     style="animation: fadeInUp ${0.2 + index * 0.02}s ease forwards">
                    <input type="checkbox" id="deputy${deputy.id}" 
                           onchange="handleDeputySelection(this, ${deputy.id})" 
                           ${selectedDeputies.includes(deputy.id) ? 'checked' : ''}>
                    <label for="deputy${deputy.id}">${deputy.name}</label>
                </div>
            `).join('')}
        </div>
        <div class="button-group" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
            <button onclick="submitVote()" class="submit-btn">Përfundo Votimin</button>
            <button onclick="backToParties()" class="back-btn">Kthehu</button>
        </div>
    `;
}

function handleDeputySelection(checkbox, deputyId) {
    if (checkbox.checked) {
        if (selectedDeputies.length >= 10) {
            alert('Nuk mund të zgjedhni më shumë se 10 deputetë!');
            checkbox.checked = false;
            return;
        }
        selectedDeputies.push(deputyId);
        checkbox.parentElement.classList.add('selected');
    } else {
        selectedDeputies = selectedDeputies.filter(id => id !== deputyId);
        checkbox.parentElement.classList.remove('selected');
    }
    updateSelectionCounter();
}

function updateSelectionCounter() {
    const counter = document.createElement('div');
    counter.className = 'selection-counter';
    counter.textContent = `${selectedDeputies.length}/10 deputetë të zgjedhur`;
    const existingCounter = document.querySelector('.selection-counter');
    if (existingCounter) {
        existingCounter.replaceWith(counter);
    } else {
        document.querySelector('.deputy-list h3').after(counter);
    }
}

function backToParties() {
    document.querySelector('.deputy-list').classList.add('hidden');
    document.querySelector('.party-list').classList.remove('hidden');
}

function submitVote() {
    if (selectedDeputies.length === 0) {
        alert('Ju lutem zgjedhni së paku një deputet!');
        return;
    }
    
    votingSystem.innerHTML = `
        <div class="success-message" style="text-align: center; animation: fadeInUp 0.5s ease">
            <h2>Faleminderit për votimin tuaj!</h2>
            <p>Votimi juaj u regjistrua me sukses në sistemin tonë.</p>
            <div class="checkmark">✓</div>
        </div>
    `;
}

window.onclick = (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
};