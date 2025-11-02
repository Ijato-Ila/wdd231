document.addEventListener("DOMContentLoaded", () => {
  const courses = [
    { code: "CSE 110", name: "Introduction to Programming", credits: 2, category: "CSE", completed: true },
    { code: "CSE 111", name: "Programming with Functions", credits: 2, category: "CSE", completed: true },
    { code: "CSE 210", name: "Programming with Classes", credits: 2, category: "CSE", completed: true },
    { code: "WDD 130", name: "Web Fundamentals", credits: 3, category: "WDD", completed: true },
    { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 3, category: "WDD", completed: true },
    { code: "WDD 231", name: "Web Frontend Development I", credits: 3, category: "WDD", completed: false } // In progress
  ];

  const coursesContainer = document.getElementById("coursesContainer");
  const totalCreditsEl = document.getElementById("totalCredits");

  // Function to render courses
  function renderCourses(filter = "all") {
    coursesContainer.innerHTML = "";

    const filteredCourses =
      filter === "all" ? courses : courses.filter(course => course.category === filter);

    let totalCredits = 0;

    filteredCourses.forEach(course => {
      const courseCard = document.createElement("div");
      courseCard.classList.add("course-card");

      // Style completed vs in-progress
      if (course.completed) {
        courseCard.classList.add("completed");
      } else {
        courseCard.classList.add("in-progress");
      }

      courseCard.innerHTML = `
        <h3>${course.code}</h3>
        <p>${course.name}</p>
        <p><strong>Credits:</strong> ${course.credits}</p>
        <p class="status">${course.completed ? "✅ Completed" : "🟡 In Progress"}</p>
      `;

      coursesContainer.appendChild(courseCard);

      if (course.completed) totalCredits += course.credits;
    });

    totalCreditsEl.textContent = totalCredits;
  }

  // Initial render
  renderCourses();

  // Filter buttons
  document.getElementById("allBtn").addEventListener("click", () => {
    setActiveButton("allBtn");
    renderCourses("all");
  });

  document.getElementById("wddBtn").addEventListener("click", () => {
    setActiveButton("wddBtn");
    renderCourses("WDD");
  });

  document.getElementById("cseBtn").addEventListener("click", () => {
    setActiveButton("cseBtn");
    renderCourses("CSE");
  });

  function setActiveButton(activeId) {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById(activeId).classList.add("active");
  }
});
