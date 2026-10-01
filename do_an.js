const loginLink = document.querySelector(".menu  a:nth-child(6)");
const loginBox = document.querySelector(".login");

loginLink.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (loginBox.style.display === "none" || loginBox.style.display === "") {
    loginBox.style.display = "flex";
  } else {
    loginBox.style.display = "none";
  }
});
document.addEventListener("click", function () {
  if (loginBox.style.display === "flex") {
    loginBox.style.display = "none";
  }
});

const dangkyclick = document.querySelector(".menu a:nth-child(7)");
const dangkybox = document.querySelector(".dangky");

dangkyclick.addEventListener("click", function (k) {
  k.preventDefault();
  k.stopPropagation();

  if (dangkybox.style.display === "none" || dangkybox.style.display === "") {
    dangkybox.style.display = "flex";
  } else {
    dangkybox.style.display = "none";
  }
});

document.addEventListener("click", function () {
  if (dangkybox.style.display === "flex") {
    dangkybox.style.display = "none";
  }
});
