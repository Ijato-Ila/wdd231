// Load members from the JSON file
async function loadMembers() {
  try {
    const response = await fetch('data/members.json'); // ✅ correct relative path
    const members = await response.json();

    const directory = document.getElementById('directory');
    directory.innerHTML = '';

    // Create a card for each business
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

// Run when page loads
loadMembers();
