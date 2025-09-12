const lightBtn = document.querySelector("#lightBtn");
const darkBtn = document.querySelector("#darkBtn");

lightBtn.addEventListener("click", () => {
  document.body.classList.remove("dark");
});

darkBtn.addEventListener("click", () => {
  document.body.classList.add("dark");
});
