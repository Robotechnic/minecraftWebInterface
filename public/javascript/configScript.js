var configRequest = new XMLHttpRequest()
const paramUrl = "/minecraft/property"
var configView = document.querySelector(".configView")
var saveButton = document.querySelector(".configView__saveButton")

var modified = []

encode = data =>{
	var encoded = ""
	for (var [key, value] of data.entries()) { 
	  encoded += encodeURIComponent(key)+"="+encodeURIComponent(value)+"&"
	}
	return encoded
}

//init cofigList
if (configView){
	console.log('load')
	configRequest.addEventListener("load",(event)=>{
		
		if (configRequest.status == 200){
			var data = JSON.parse(configRequest.responseText)
			if (data.err){
				console.log(data.err)
			} else if (configRequest.type == "get"){
				for (i in data.property) {
					var label = document.createElement("label")
					label.classList.add("configView__item__text")
					label.setAttribute("for", i)
					label.appendChild(document.createTextNode(i+" :"))
					configView.appendChild(label)
					var input = document.createElement("input")
					input.setAttribute("name",i)
					input.setAttribute("id",i)
					input.classList.add("configView__item__input")
					switch (typeof data.property[i]) {
						case "boolean":
							input.setAttribute("type","checkbox")
							input.checked = data.property[i]
							break;
						case "number":
							input.setAttribute("type","number")
							break;
						case "string":
							input.setAttribute("type","text")
							break;
						default:
							input.setAttribute("type","text")
							break;
					}
					input.value = data.property[i]
					configView.appendChild(input)

					input.addEventListener("input",(event)=>{
						modifications(event.target)
					})
				}
			} else if (configRequest.type == "modify"){
				saveButton.classList.remove("edit")
				saveButton.classList.remove("saving")
				modified = []
			}
		}
	})

	configRequest.type = "get"
	configRequest.open("GET",paramUrl)
	configRequest.send()
}

//if anny modifications
modifications = (input) =>{
	if (!saveButton.classList.contains("saving")){
		saveButton.classList.add("edit")
	}
	if (modified.indexOf(input.getAttribute("id")) == -1)
		modified.push(input.getAttribute("id"))
}

saveButton.addEventListener("click",(event)=>{
	if (configRequest.readyState == 4){
		saveButton.classList.remove("edit")
		saveButton.classList.add("saving")

		var form = new FormData()
		modified.forEach( (element) => {
			var input = document.getElementById(element)
			if (input.getAttribute("type") == "checkbox")
				var value = input.checked
			else
				var value = input.value
			form.append(element,value)
		})
		form.append("_csrf",event.target.getAttribute("csrf"))
		configRequest.type = "modify"
		configRequest.open("POST",paramUrl)
		configRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		console.log(form,encode(form))
		configRequest.send(encode(form))
	}
})