var email = document.querySelector("#email").text;
var button = document.querySelector(".copy-button");

button.addEventListener("click", function () {
  navigator.clipboard
    .writeText(email)
    .then(function () {
      if (button.classList.value.includes("success")) return;
      button.setAttribute("aria-label", "email address copied to clipboard");
      button.setAttribute("role", "alert");
      button.innerHTML += "copied";
      button.classList.add("success");
    })
    .catch(function (e) {
      console.error(e);
    });
});
