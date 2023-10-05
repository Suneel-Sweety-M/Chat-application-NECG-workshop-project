const app = document.querySelector(".app");
const socket = io();

let uname;
//========= Code for Join Page ========
app
  .querySelector(".join-screen #join-user")
  .addEventListener("click", function () {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      app.querySelector(".join-screen .err").classList.remove("hide");
      return;
    }
    app.querySelector(".join-screen .err").classList.add("hide");
    socket.emit("newuser", username);
    uname = username;
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  });

//========= Code for Chat Page ========
app
  .querySelector(".chat-screen #form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    
    let message = app.querySelector(".chat-screen #message-input").value;
    if (message.length == 0) {
      return;
    }

    renderMessage("my", { username: uname, text: message });
    socket.emit("chat", { username: uname, text: message });

    app.querySelector(".chat-screen #message-input").value = "";
  });

//========= Code for Exit Button ========
app
  .querySelector(".chat-screen #exit-chat")
  .addEventListener("click", function () {
    socket.emit("exituser", uname);
    window.location.href = window.location.href;
  });

//========= Interaction with socket.io ========

socket.on("update", function (update) {
  renderMessage("update", update);
});

socket.on("chat", function (message) {
  renderMessage("other", message);
});

//========= Code for Rendering the messages ========

function renderMessage(type, message) {
  let messageContainer = app.querySelector(".chat-screen .messages");
  if (type == "my") {
    let el = document.createElement("div");
    el.setAttribute("class", "message my-message");
    el.innerHTML = `
        <div>
            <div class="name">You</div>
            <div class="text">${message.text}</div>
        </div>
        `;
    messageContainer.appendChild(el);
  } else if (type == "other") {
    let el = document.createElement("div");
    el.setAttribute("class", "message other-message");
    el.innerHTML = `
        <div>
            <div class="name">${message.username}</div>
            <div class="text">${message.text}</div>
        </div>
        `;
    messageContainer.appendChild(el);
  } else if (type == "update") {
    let el = document.createElement("div");
    el.setAttribute("class", "update");
    el.innerHTML = message;
    messageContainer.appendChild(el);
  }

//========= Code for Moving the chat screen Page on message sent ========

  messageContainer.scrollTop =
    messageContainer.scrollHeight - messageContainer.clientHeight;
}
