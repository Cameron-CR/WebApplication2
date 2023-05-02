const loginsec = document.querySelector('.login-section')
const loginlink = document.querySelector('.login-link')
const registerlink = document.querySelector('.register-link')
registerlink.addEventListener('click', () => {
    loginsec.classList.add('active')
})
loginlink.addEventListener('click', () => {
    loginsec.classList.remove('active')
})

function redirectToIndex() {
    window.location.href = "/Index.cshtml";
}

document.getElementById("loginBtn").addEventListener("click", (event) => {
    event.preventDefault(); 

    var password = localStorage.getItem("password", password);
    var email = localStorage.getItem("email", email);

    var loginEmail = document.getElementById("loginEmail").value
    var loginPassword = document.getElementById("loginPassword").value

    if (loginEmail === "" && loginPassword === "") {
        alert("Please enter email and password.")
    }else if (loginEmail != email && loginPassword != password) {
        alert("That account does not exist. Please try again!")
        loginEmail.value = ""
        loginPassword.value = ""
    } else if (loginEmail != email && loginPassword == password) {
        alert("Username Invalid!")
        loginEmail.value = ""
        loginPassword.value = ""
    } else if (loginPassword != password && loginEmail == email) {
        alert("Password Incorrect!")
        loginEmail.value = ""
        loginPassword.value = ""
    } else {
        window.location.href = "/Home/Index"; 
    }

    




});


    const signupBtn = document.getElementById("signupBtn");

    signupBtn.addEventListener("click", function(e) {
        e.preventDefault(); 

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value.toString();
    const password = document.getElementById("password").value;


    
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    
        alert("Account created successfully!");

        registerlink.addEventListener('click', () => {
            loginsec.classList.add('active')
        })
  });


