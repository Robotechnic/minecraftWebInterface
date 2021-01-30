var requestedLists = {}

updatePlayerList = (name) => {
	requestedLists[name].open("GET",`/minecraft/get/${name}`)
	requestedLists[name].type = "update"
	requestedLists[name].send()
}

delPlayerListElement = (name,pseudo,csrf) => {
	requestedLists[name].open("POST",`/minecraft/del/${name}/${pseudo}`)
	requestedLists[name].type = "del"
	requestedLists[name].setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	requestedLists[name].send(`_csrf=${csrf}`)
}

addPlayerListElement = (name,pseudo,csrf) => {
	requestedLists[name].open("POST",`/minecraft/add/${name}/${pseudo}`)
	requestedLists[name].type = "add"
	requestedLists[name].setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	requestedLists[name].send(`_csrf=${csrf}`)
}


//first, fill list
document.querySelectorAll(".playerList").forEach((element)=>{

	if (element.getAttribute("name")){
		requestedLists[element.getAttribute("name")] = new XMLHttpRequest()
		requestedLists[element.getAttribute("name")].addEventListener("load",event=>{
			// console.log(requestedLists[element.getAttribute("name")])
			if (requestedLists[element.getAttribute("name")].status == 200){
				// console.log(requestedLists[element.getAttribute("name")].responseText)
				element.classList.remove("error")
				var data = JSON.parse(requestedLists[element.getAttribute("name")].responseText)
				console.log(data)
				if (requestedLists[element.getAttribute("name")].type == "update") {
					if (data.err){
						element.classList.add("error")
						console.log(data.err)
					} 
					var list = element.querySelectorAll(".playerList__list")[0]
					list.innerHTML = ""
					for (var i = 0; i < data.list.length; i++){
						var li = document.createElement("li")
						li.classList.add("playerList__list__item")
						li.appendChild(document.createTextNode(data.list[i].name))
						var button = document.createElement("button")
						button.classList.add("playerList__list__item__button")
						button.setAttribute("id",`delete.${element.getAttribute("name")}.${data.list[i].name}`)
						button.addEventListener("click", (event)=>{
							var target = event.target
							if (target.nodeName == "IMG")
								target = target.parentNode

							const params = target.getAttribute("id").split(".")
							console.log(params)
							delPlayerListElement(params[1],params[2])
						})
						var img = document.createElement("img")
						img.setAttribute("src", "/images/trash.png")
						button.appendChild(img)
						li.appendChild(button)
						list.appendChild(li)
					}
				} else if (requestedLists[element.getAttribute("name")].type == "del"){
					if (data.err){
						if (data.err == "pseudo"){
							alert("Le pseudo minecraft n'existe pas")
						} else {
							alert("Une erreur est survene durant la supression du joeur")
						}
						console.log(data.err)
					} else 
						console.log('deleted succesfuly')
					updatePlayerList(element.getAttribute("name"))

				} else if (requestedLists[element.getAttribute("name")].type = "add") {
					if (data.err){
						if (data.err == "pseudo"){
							alert("Le pseudo minecraft n'existe pas")
						} else {
							alert("Une erreur est survene durant l'ajout du joeur")
						}
						console.log(data.err)
					} else 
						console.log('added succesfuly')
					updatePlayerList(element.getAttribute("name"))
				}
			} else {
				element.classList.add("error")
			}
		})

		element.querySelectorAll(".playerList__addButton")[0].setAttribute("id",`add.${element.getAttribute("name")}`)
		element.querySelectorAll(".playerList__addButton")[0].addEventListener("click",(event)=>{
			const params = event.target.getAttribute("id").split(".")
			console.log(params)
			const pseudo = prompt("Pseudo:")
			if (pseudo.length > 0)
				addPlayerListElement(params[1],pseudo)
		})

		updatePlayerList(element.getAttribute("name"))
	}
})