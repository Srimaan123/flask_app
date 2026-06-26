let accountList = document.querySelectorAll(".account")
let search = document.getElementById("search-account")
let accountNames = document.querySelectorAll(".account-name")

accountList.forEach(account => {
    account.addEventListener("click",async ()=>{
        let clickedAccount = account;

        let name = clickedAccount.querySelector(".account-name")
        window.location.href = `/chat/${document.querySelector('#username').textContent}-${name.textContent}`
    })
});

search.addEventListener("input",async (e)=>{
    accountList.forEach(account=>{account.style.display = "none"})
    let text = e.target.value;
    if (text == ""){
        accountList.forEach(account=>{account.style.display = "flex"})
    }
    let accountResponse = await fetch("/api/accounts",{
        method: "POST",
        headers:{
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({
            "query": text,
            "username": document.getElementById("username").textContent
        })
    })
    
    accountResponse = await accountResponse.json()
    for (let i = 0; i < accountResponse.accounts.length; i++) {
        const element = accountResponse.accounts[i];
        for (let j = 0; j < accountList.length; j++) {
            const account = accountList[j];
            let accName = account.querySelector(".account-name").textContent
            if (element == accName){
                account.style.display = "flex"
            }
        }
    }
})

async function isNewMessages(){
    let response = await fetch(`/api/has_new_messages/${document.querySelector("#username").textContent}`,{
        method: "POST",
        headers:{
            "Pragma": "no-cache",
            "Cache-Control":"no-cache"
        }
    })
    let data = await response.json()
    if (data.new_message_recieved == "True"){
        for(let i = 0;i < accountList.length;i++){
            let account = accountList[i]
            let accountName = account.querySelector(".account-name")
            if (data.senders.includes(accountName.textContent)){
                account.querySelector(".new-messages").textContent = "new"
                account.querySelector(".new-messages").style.display = "inline-block"
            }
            else{
                account.querySelector(".new-messages").style.display = "none"
            }
        }
    }
}

isNewMessages()

setInterval(async ()=>{
    let response = await fetch(`api/fetch_active/${document.querySelector("#username").textContent}`)
    let data = response.json()
    for(let i = 0;i < data.active.length;i++){
        if(data.active.includes(accountNames[i])){
            accountList[i].querySelector(".active-indicator").style.display = "flex"
        }
    }
},1000)

setInterval(async ()=>{
    let response = fetch("/api/update_lasst_seen")
})