let loginBtn = document.querySelector("#login");
let username = document.getElementById("username");
let password = document.getElementById("password");


loginBtn.addEventListener("click",async () => {
    let data = {
        "username": username.value,
        'password': password.value
    }
    let response = await fetch("/",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    let data1 = await response.json()
    if(data1.body == "login"){
        window.location.href = `/main/${username.value}`;
    }else{
        alert("login unsuccessful")
    }
})