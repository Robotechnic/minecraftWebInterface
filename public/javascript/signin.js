var signin = document.getElementById("signIn")


encode = data =>{ //encode form data to XMLHttpRequest header
	var encoded = ""
	for (var [key, value] of data.entries()) { 
	  encoded += encodeURIComponent(key)+"="+encodeURIComponent(value)+"&"
	}
	return encoded
}

if (signin){ //if element exist

	//get necesary childs
	var signinForm = signin.children[0]
	var signInErrorDisplay = signinForm.querySelectorAll(".form__error")[0]

	//display error on the page
	setSignInError = (errorText="") =>{
		signInErrorDisplay.innerText = errorText
		if (errorText)
			console.error(errorText)
	}

	//signin things
	var signinRequest = new XMLHttpRequest()

	signinRequest.addEventListener("load",(event)=>{
		if (signinRequest.status == 200){
			var data = JSON.parse(signinRequest.responseText)
			if (data.result){
				document.location = "#"
				window.location.reload()
			} else {
				//console.log('Error:',data.error)
				switch (data.err) {
					case "pseudo":
						setSignInError("Le pseudo est invalide")
						break
					case "password":
						setSignInError("Le mot de passe est invalide")
						break
					case "input":
						setSignInError("Veuillez remplir tous les champs")
						break
					case "token":
						console.log('invalid token')
						setSignInError("Votre token d'autentification est invalide")
						setTimeout(1000,()=>{
							window.location.reload()
						})
					break
					default:
						setSignInError("Une erreur interne est survenue veuillez recommencer plus tard")
					break
				}
			}
		} else {
			logInError("Une erreur est survenue veuillez recommencer plus tard.")
		}
		signinForm.classList.remove("wait")

	})

	//on submit, disable send and create a request
	signinForm.addEventListener("submit",(event)=>{
		event.preventDefault()

		var formData = new FormData(event.target)

		signinForm.classList.add("wait")
		signinRequest.open("POST","/user/signin")
		signinRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		signinRequest.send(encode(formData))
	})
}