"use strict";
const socket = io("http://localhost:8000");

const userName = prompt("Enter your name to join");
const form = document.getElementById('send-form');
const messageInput = document.getElementById("messageInp");
const messageContainer =document.querySelector('.container');
const sound = new Audio('../ting.mp3');


const capitalized = (word)=>{
    let newWord =word[0].toUpperCase() + word.slice(1).toLowerCase();
    return newWord;
}

const append =(message,position)=>{
  const messageElement =document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add(position);
  messageElement.classList.add('message');
  messageContainer.append(messageElement);
  if(position === 'left'){
    sound.play();
  }
}


if(userName === null){
    userName="unknown user";
}

form.addEventListener('submit',(e)=>{
     e.preventDefault();
     const message = messageInput.value;
     append(`You: ${message}`,'right');
     socket.emit('send',message);
     messageInput.value="";
})

socket.emit('new-user-joined', capitalized(userName));

socket.on('user-joined', name =>{
    append(`${name} joined the Chat`,'left');
})

socket.on('receive',data =>{
    append(`${data.name}: ${data.message}`,'left');
})

socket.on('leave',name=>{
    append(`${name} left the chat`,'left');
})