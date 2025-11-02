// Display current year and last modified date
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("currentyear");
  const lastModifiedElement = document.getElementById("lastModified");

  const currentYear = new Date().getFullYear();
  const lastModified = document.lastModified;

  if (yearElement) yearElement.textContent = currentYear;
  if (lastModifiedElement) lastModifiedElement.textContent = `Last Modified: ${lastModified}`;
});
