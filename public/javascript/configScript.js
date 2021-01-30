var configRequest = new XMLHttpRequest()
const paramUrl = "/minecraft/property"
var configView = document.querySelector(".configView")
var saveButton = document.querySelector(".configView__saveButton")

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
			} else {
				for (i in data.property) {
					var label = document.createElement("label")
					label.classList.add("configView__item__text")
					label.setAttribute("for", i)
					label.appendChild(document.createTextNode(i+" :"))
					configView.appendChild(label)
					var input = document.createElement("input")
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

					input.addEventListener("keydown",modifications)
				}
			}
		}
	})

	configRequest.open("GET",paramUrl)
	configRequest.send()
}

//if anny modifications
modifications = () =>{
	if (!saveButton.classList.contains("saving")){
		saveButton.classList.add("edit")
	}
}

saveButton.addEventListener("click",(event)=>{
	if (configRequest.readyState == 4){
		
	}
})