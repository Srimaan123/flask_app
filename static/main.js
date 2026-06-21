let plane = document.getElementById("paper-plane")
let search = document.getElementById("search")
let username = document.querySelector("#username")

plane.addEventListener("click",()=>{
    window.location.href = `/accounts/${username.textContent}`
});
search.addEventListener("click",()=>{
    window.location.href = `/search/${username.textContent}`
})

let icons = document.querySelectorAll(".icons")
icons.forEach(icon=>{
    icon.classList.add("fa-regular")
})