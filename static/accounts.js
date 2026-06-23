let accountList = document.querySelectorAll(".account")
let search = document.getElementById("search-account")

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