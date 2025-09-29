const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark")) {
    document.body.classList.replace("dark", "light");
    themeBtn.innerHTML =
      '<img src="./images/bedtime.svg" width="20" alt=""> Dark Mode';
  } else {
    document.body.classList.replace("light", "dark");
    themeBtn.innerHTML =
      '<img src="./images/clear-day.svg" width="20" alt=""> Light Mode';
  }
});
