updateDocumentView = (hash) => {
	hash = hash.substr(1)
	document.querySelectorAll(".pageSection").forEach(element => {
		//console.log(element.classList)
		element.classList.remove("visible")
	})
	if (hash.length > 0){
		var element = document.getElementById(hash)
		if (element)
			element.classList.add("visible")
		else
			window.location.hash = ""
	}
	else
		document.querySelectorAll(".basePage")[0].classList.add("visible")
}

if ("onhashchange" in window) { // event supported?
		window.onhashchange = function () {
			updateDocumentView(window.location.hash)
	}
} else { // event not supported:
	var storedHash = window.location.hash
	window.setInterval(function () {
		if (window.location.hash != storedHash) {
			storedHash = window.location.hash
			updateDocumentView(hash)
		}
	}, 100)
}

updateDocumentView(window.location.hash)