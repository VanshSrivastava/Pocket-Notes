$(document).ready(function () {
  $(".login-info-box").fadeOut();
  $(".login-show").addClass("show-log-panel");
});

$('.login-reg-panel input[type="radio"]').on("change", function () {
  if ($("#log-login-show").is(":checked")) {
    $(".register-info-box").fadeOut();
    $(".login-info-box").fadeIn();

    $(".white-panel").addClass("right-log");
    $(".register-show").addClass("show-log-panel");
    $(".login-show").removeClass("show-log-panel");
  } else if ($("#log-reg-show").is(":checked")) {
    $(".register-info-box").fadeIn();
    $(".login-info-box").fadeOut();

    $(".white-panel").removeClass("right-log");

    $(".login-show").addClass("show-log-panel");
    $(".register-show").removeClass("show-log-panel");
  }
});

function toggleThis() {
  var element = document.getElementById("navbarSupportedContent");
  element.classList.toggle("show");
} 


let sgi = document.getElementById("signin-controller");
let lgi = document.getElementById("login-controller");
sgi.addEventListener("submit", (e) => {
  e.preventDefault();
  user = document.getElementById("sg-name").value;
  email = document.getElementById("sg-email").value;
  pass = document.getElementById("sg-pass").value;
  confirmpass = document.getElementById("sg-cpass").value;
  const details = { user, email, pass, confirmpass };
  fetch("/signedin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        console.log("yes jara hai");
        window.location.replace("/");
      } else {
        console.log("else");
        window.location.reload();
      }
    })
    
    .catch((err) => {
      console.error(err);
    })
  });


lgi.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("lg-email").value;
  const pass = document.getElementById("lg-pass").value;
  const details = { email, pass };
  fetch("/loggedin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        console.log("yes jara hai");
        window.location.replace("/");
      } else {
        console.log(data);
        
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

