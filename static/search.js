let search = document.getElementById("search-bar")
let suggList = document.querySelector(".suggestion-list")
let username = document.querySelector("#username")
search.addEventListener("input",async (e)=>{
    let text = e.target.value
    if(text == ""){
        suggList.innerHTML = ""
        return
    }
    suggList.innerHTML = ""
    let data = {
        "query": text,
        "username": username.textContent
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
        let currentTarget = response.body[i]
        let li = document.createElement("li")
        let profilePic = document.createElement("div")
        let wrap = document.createElement("div")
        let name = document.createElement("h1")
        let followBtn = document.createElement("button")

        wrap.setAttribute("class","flex gap-2")
        profilePic.setAttribute("class","w-12 h-12 rounded-full bg-red-200")
        li.setAttribute("class","p-2 flex items-center  hover:bg-zinc-50 rounded-xl border-1 border-slate-200 justify-between")
        name.setAttribute("class","text-[16px] text-black font-['Inter'] font-bold")
        name.textContent = response.body[i]
        li.setAttribute("id",`li-${i}`)
        if(response.isaccepted[i] == "True"){
            followBtn.setAttribute("class","followed bg-white border-1 border-gray-200 hover:bg-zinc-100 text-black p-2 rounded-xl")
            followBtn.setAttribute("value",`followed-${username.textContent}-${currentTarget}`)
            followBtn.textContent = "unfollow"
        }
        else if(response.isrequested[i] == "True"){
            followBtn.setAttribute("class","rejected bg-white border-1 border-gray-200 hover:bg-zinc-50 text-black p-2 rounded-xl")
            followBtn.setAttribute("value",`rejected-${username.textContent}-${currentTarget}`)
            followBtn.textContent = "rejected"
        }
        else if (response.isrequested[i] == "False"){
            followBtn.setAttribute("class","followed bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl")
            followBtn.setAttribute("value",`notfollowed-${username.textContent}-${currentTarget}`)
            followBtn.textContent = "follow"
        }
        else if(response.isrequested[i] == "True"){
            followBtn.setAttribute("class","followed bg-white border-1 border-gray-200 hover:bg-zinc-50 text-black p-2 rounded-xl")
            followBtn.setAttribute("value",`requested-${username.textContent}-${currentTarget}`)
            followBtn.textContent = "requested"
        }
        
        wrap.append(profilePic,name)
        li.append(wrap,followBtn)
        suggList.appendChild(li)
        followBtn.addEventListener("click",async ()=>{
            let code = followBtn.value
            let data = {
                "code": code
            }
            let clickResponse = await fetch("/api/request",{
                method: "POST",
                headers:{
                    "Content-Type":"Application/json"
                },
                body:JSON.stringify(data)
            })
            clickResponse = await clickResponse.json()
            
            if(clickResponse.status == "requested"){
                followBtn.setAttribute("class","followed bg-white border-1 border-gray-200 hover:bg-zinc-50 text-black p-2 rounded-xl")
                followBtn.setAttribute("value",`requested-${username.textContent}-${currentTarget}`)
                followBtn.textContent = "requested"
            }
            else if(clickResponse.status == "notfollowed"){
                followBtn.setAttribute("class","followed bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-xl")
                followBtn.setAttribute("value",`notfollowed-${username.textContent}-${currentTarget}`)
                followBtn.textContent = "follow"
            }
        })
    }
})

//-----injected code
let plane = document.getElementById("paper-plane")
let searchIcon = document.getElementById("search")

let home = document.querySelector("#home")


searchIcon.addEventListener("click",()=>{
    window.location.href = `/search/${username.textContent}`
})
home.addEventListener("click",()=>{
    window.location.href = `/main/${username.textContent}`
})