let textBox = document.querySelector(".text-box")
let sendBtn = document.querySelector(".button")
let messages = document.querySelector(".messages")
let messageList = document.querySelectorAll(".message")

function ScrollToBottom(){
    messages.scrollTop = messages.offsetHeight
}

function setMessage(message,appendAs){
    let msg = document.createElement("div")
    let p = document.createElement("p")
    if(appendAs == "sender"){
        msg.setAttribute("class","message bg-green-200 w-5/12 p-2 mb-2 rounded-xl self-end")
        p.setAttribute("class","text-xl text-white")
        p.textContent = message
        msg.append(p)
        messages.append(msg)
    }else{
        msg.setAttribute("class","message bg-gray-200 w-5/12 p-2 mb-2 rounded-xl")
        p.setAttribute("class","text-xl text-white")
        p.textContent = message
        msg.append(p)
        messages.append(msg)
    }
}

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
    textBox.value = ""
})


let scrollBtn = document.querySelector(".scroll-btn")
if (messages.scrollHeight > messages.offsetHeight){
    scrollBtn.style.display = "flex"
    offset = messages.offsetHeight-messages.scrollHeight
    scrollBtn.addEventListener("click",()=>{
        ScrollToBottom()
    })
}

async function fetchNewMessages(){
    let response = await fetch(`/api/fetch_new_messages/${document.getElementById("username").textContent}-${document.querySelector(".reciever").textContent}-${messageList.length}`,{
        method: "POST"
    });
    let data = await response.json()
    if (data.reload == "yes"){
        messages.innerHTML = ""
        data.messages.forEach((message,i)=>{
            let sender;
            if (data.senders[i] == document.querySelector("#username").textContent){
                sender = "sender"
            }else{
                sender = "reciever"
            }
            setMessage(message,sender);
        })
    }else{
        return;
    }
}
setInterval(fetchNewMessages, 1000);
