let username = document.getElementById("username");
let password = document.getElementById("password")

let createBtn = document.getElementById("create")

createBtn.addEventListener("click",async ()=>{
    let data = {
        "username": username.value,
        "password": password.value
    }
    let response = fetch("/create",{
        method:"POST",
        headers:{
            "Content-Type": "Application/json"
        }
    })
})