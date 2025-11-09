// Async function to fetch members from JSON
async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    const members = await response.json();

    const directory = document.getElementById('directory');
    directory.innerHTML = '';

    members.forEach(member => {
      const card = document.createElement('div');
      card.className = 'business-card';

      card.innerHTML = `
        <div>
          <h3>${member.name}</h3>
          <p><strong>Membership Level:</strong> ${member.membershipLevel}</p>
        </div>
        <div>
          <p><strong>Address:</strong> ${member.address}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
        </div>
        <div>
          <p>${member.description}</p>
        </div>
      `;

      directory.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading members:', error);
  }
}

// Call the function to load members
loadMembers();

// Grid/List toggle buttons
const gridBtn = document.getElementById('grid-btn');
const listBtn = document.getElementById('list-btn');
const directory = document.getElementById('directory');

gridBtn.addEventListener('click', () => {
  directory.classList.remove('list-view');
  directory.classList.add('grid-view');
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
  directory.classList.remove('grid-view');
  directory.classList.add('list-view');
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
});

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();
