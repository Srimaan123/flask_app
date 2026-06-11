let search = document.getElementById("search-bar")
let suggList = document.querySelector(".suggestion-list")

search.addEventListener("input",async (e)=>{
    text = e.target.value
    if(text == ""){
        suggList.innerHTML = ""
        return
    }
    suggList.innerHTML = ""
    let data = {
        "query": text
    }
    let response = await fetch("/api/search",{
        method:"POST",
        headers:{
            "Content-Type": "Application/json",
        },
        body: JSON.stringify(data)
    })
    response = await response.json()
    for(let i = 0;i<response.body.length;i++){
        let li = document.createElement("li")
        let profilePic = document.createElement("div")
        let name = document.createElement("h1")

        profilePic.setAttribute("class","w-8 h-8 rounded-full bg-red-200")
        li.setAttribute("class","p-2 flex gap-2 items-center  hover:bg-zinc-50 rounded-xl border-1 border-slate-200")
        name.setAttribute("class","text-xl text-black font-['Inter'] font-bold")
        name.textContent = response.body[i]
        li.setAttribute("id",`li-${i}`)
        li.append(profilePic,name)
        suggList.appendChild(li)
    }
})

//-----injected code
let plane = document.getElementById("paper-plane")
let searchIcon = document.getElementById("search")
let username = document.querySelector("#username")
let home = document.querySelector("#home")

plane.addEventListener("click",()=>{
    window.location.href = "/messages"
});
searchIcon.addEventListener("click",()=>{
    window.location.href = `/search/${username.textContent}`
})
home.addEventListener("click",()=>{
    window.location.href = `/main/${username.textContent}`
})