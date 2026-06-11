let username = document.getElementById("username");
let password = document.getElementById("password")
let form = document.querySelector(".form")
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
        },
        body: JSON.stringify(data)
    })
    if(response){
        let p = document.createElement("p")
        p.textContent = "your account is successfully created"
        p.setAttribute("class","text-xl text-green-400")
        form.appendChild(p)
    }else{
        let p = document.createElement("p")
        p.textContent = "your account is not created"
        p.setAttribute("class","text-xl text-red-400")
        form.appendChild(p)
    }
})