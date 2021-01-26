const socket = io()

//status gesture
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
		if (event.sender.classList.contains("start"))
			document.querySelectorAll(".consoleOutput").forEach((element)=>{
				element.innerHTML = ""
			})
		socket.emit("start")
	})
})

document.querySelectorAll(".consoleView__input").forEach((element)=>{
	element.addEventListener("submit",(event)=>{
		event.preventDefault()
		socket.emit("command",event.target.commande.value)
	})
})


//infos display gesture
socket.on("statusChanged",status=>{
	console.log("New status :",status)
	document.querySelectorAll(".status").forEach((element)=>{
		element.innerText = status
	})
	document.querySelectorAll(".start,.stop").forEach((element)=>{
		if (status == "Offline"){
			element.classList.remove("stop")
			element.classList.add("start")
		} else {
			element.classList.add("stop")
			element.classList.remove("start")
		}
	})

	document.querySelectorAll(".consoleView").forEach((element)=>{
		if (status == "Online" || status == "Start-up"){
			element.classList.remove("offline")
		} else {
			element.classList.add("offline")
		}
	})
})

socket.on("newPlayerAmount",amount=>{
	console.log("New player amount:",amount)
	document.querySelectorAll(".connectedPlayers").forEach((element)=>{
		element.innerText = amount.players + "/" + amount.max + " players"
	}) 
})