let plane = document.getElementById("paper-plane")
let search = document.getElementById("search")
let username = document.querySelector("#username")

plane.addEventListener("click",()=>{
    window.location.href = "/messages"
});
search.addEventListener("click",()=>{
    window.location.href = `/search/${username.textContent}`
})