const loginBtn = document.querySelector("#login-btn");
const userName = document.querySelector("#meter-username");
const pass = document.querySelector("#password");
let apiUrl = "http://localhost:3456";

const login = async(username, password) => {
    if(!username || !password) {
        alert("Please enter a username and password!");
        return;
    }
    try {
        const res = await fetch(apiUrl+`/login?username=${username}&password=${password}`, {
            method: 'POST',
        });
        const data = await res.json();
        if(data.status === 200){
            localStorage.setItem('meter', JSON.stringify(data.meter));
            localStorage.setItem('auth', data.token);
            window.location.href = "./dashboard.html";
        }else if(data.status === 404){
            alert("Meter not found!");
            return;
        }else if(data.status === "admin"){
            localStorage.setItem('meter', JSON.stringify(data.meter));
            localStorage.setItem('auth-admin', data.token);
            window.location.href = "./admin.html";
        }else{
            alert(data.message);
            return;
        }
    } catch (error) {
        console.error(error.message);
    }
}

loginBtn.addEventListener("click", function(e) {
    e.preventDefault();
    login(userName.value, pass.value);
})
