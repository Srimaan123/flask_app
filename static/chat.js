let textBox = document.querySelector(".text-box")
let sendBtn = document.querySelector(".button")
let messages = document.querySelector(".messagea")

sendBtn.addEventListener("click",async()=>{
    text = textBox.value;
    if (text === ""){
        return;
    }

    let chatResponse = await fetch("/api/chats",{
        method: "POST",
        headers:{
            "Content-type": "Application/json"
        },
        body: JSON.stringify({
            "username": document.querySelector("#username").textContent,
            "reciever": document.querySelector(".reciever").textContent,
            "message": text,
            "method": "send"
        })
    })
    chatResponse = await chatResponse.json()
    location.reload()
    textBox.value = ""
})

async function fetchNewMessages(){
    
}