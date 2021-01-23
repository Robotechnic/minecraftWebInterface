const socket = io()

socket.on("connect",(data)=>{
	console.log("Socket connected")
})

socket.on("disconnect",(data)=>{
	console.log("Socket disconnected")
})

socket.on("log",(text)=>{
	var p = document.createElement("p")
	p.appendChild(document.createTextNode(text))
	p.classList.add("consoleOutput__log")
	document.querySelectorAll(".consoleOutput").forEach((element)=>{
		element.appendChild(p)

	})
})

document.querySelectorAll(".start").forEach((element)=>{
	element.addEventListener("click",(event)=>{
		socket.emit("start")
	})
})

document.querySelectorAll(".consoleView__input").forEach((element)=>{
	element.addEventListener("submit",(event)=>{
		event.preventDefault()
		socket.emit("command",event.target.commande.value)
	})
})