// Async function to fetch members from JSON
async function loadMembers() {
  try {
    const response = await fetch('chamber/data/members.json');
    const members = await response.json();
    
    const directory = document.getElementById('directory');
    directory.innerHTML = '';

    members.forEach(member => {
      const card = document.createElement('div');
      card.className = 'business-card';

      card.innerHTML = `
        <h3>${member.name}</h3>
        <p><strong>Address:</strong> ${member.address}</p>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
        <p><strong>Membership Level:</strong> ${member.membershipLevel}</p>
        <p>${member.description}</p>
      `;

      directory.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading members:', error);
  }
}

// Call the function to load members on page load
loadMembers();
