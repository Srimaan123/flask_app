let content = document.querySelector(".content")
let username = document.getElementById("username").textContent
let div = document.createElement("div")

async function fetchNotifications(){
    let data = {
        "username": username
    }
    let response = await fetch("/api/notifications",{
        method: "POST",
        headers:{
            "Content-Type":"Application/json"
        },
        body: JSON.stringify(data)
    })
    let notifications = await  response.json()
    let heading = document.createElement("h1")
    if (notifications.usernames.length == 0){
        heading.textContent = `You are all caught up`
        heading.setAttribute("class"," text-xl font-medium text-black font-['Inter']")
        content.append(heading)
    }
    else{
        heading.textContent = `You have ${notifications.usernames.length} follow ${notifications.usernames.length > 1 ? "requests" : "request"}`
        heading.setAttribute("class","w-10/12 text-xl font-medium text-black font-['Inter']")
        content.append(heading)
        div.setAttribute("class","w-10/12 flex flex-col items-center")
        for (let i = 0; i < notifications.usernames.length; i++) {
            let currentRequest = notifications.usernames[i]
            const element = notifications.usernames[i];
            let heading = document.createElement("h1")
            let li = document.createElement("div")
            let profilePic = document.createElement("div")
            let wrap = document.createElement("div")
            let btnWrap = document.createElement("div")
            let name = document.createElement("h1")
            let AcceptBtn = document.createElement("button")
            rejectBtn = document.createElement("button")

            wrap.setAttribute("class","flex gap-2")
            btnWrap.setAttribute("class","flex gap-2")
            profilePic.setAttribute("class","w-8 h-8 rounded-full bg-red-200")
            li.setAttribute("class","w-10/12 rounded-xl p-2 flex items-center hover:bg-zinc-50 rounded-xl border-1 border-slate-200 justify-between mb-2")
            name.setAttribute("class","text-xl text-black font-['Inter'] font-bold")
            name.textContent = element
            AcceptBtn.setAttribute("class","p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white")
            AcceptBtn.textContent = "Accept"
            rejectBtn.setAttribute("class","p-2 rounded-xl bg-red-500 hover:bg-red-600 text-white")
            rejectBtn.textContent = "reject"
            wrap.append(profilePic,name)
            btnWrap.append(AcceptBtn,rejectBtn)
            li.append(wrap,btnWrap)
            div.append(li)
            content.append(div)
            AcceptBtn.addEventListener("click",async ()=>{
                let data = {
                    "accepted_by": username,
                    "accepted_to": currentRequest
                }
                let acceptRequest = await fetch("/api/accept",{
                    method: "POST",
                    headers:{
                        "Content-Type": "Application/json"
                    },
                    body:JSON.stringify(data)
                })
                let acceptResponse = await acceptRequest.json()
                if(acceptResponse.accepted == 'True'){
                    AcceptBtn.textContent = "Accepted",
                    AcceptBtn.setAttribute("class","p-2 rounded-xl bg-white hover:bg-zinc-100 border border-gray-200")
                }
            })
            rejectBtn.addEventListener("click",async ()=>{
                let data = {
                    "rejected_by": username,
                    "rejected_to": currentRequest
                }
                let rejectRequest = await fetch("/api/reject",{
                    method: "POST",
                    headers:{
                        "Content-Type": "Application/json"
                    },
                    body:JSON.stringify(data)
                })
                let rejectResponse = await rejectRequest.json()
                if(rejectResponse.rejected == 'True'){
                    rejectBtn.textContent = "rejected",
                    rejectBtn.setAttribute("class","p-2 rounded-xl bg-white hover:bg-zinc-100 border border-gray-200")
                }
            })
        }
    }
    
}
fetchNotifications()