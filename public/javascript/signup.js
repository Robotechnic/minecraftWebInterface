const signUpForm = document.getElementById("signUpForm")
var signupRequest = new XMLHttpRequest()

//signup http request
signupRequest.addEventListener("load",(event)=>{
	if (signupRequest.status == 200){
		var data = JSON.parse(signupRequest.responseText)

		if (data.result){
			alert("Votre compte a été créé avec succés !")
			window.location = "/"
		} else {
			signUpForm.pseudo.focus()
			switch (data.err) {
				case "pseudo":
					signUpForm.pseudo.focus()
					break
				case "pseudoExist":
					signUpForm.pseudo.focus()
					break
				case "password":
					signUpForm.password.focus()
					break
				case "passwordRepeat":
					signUpForm.passwordRepeat.focus()
					break
				case "mailExist":
					signUpForm.mail.focus()
					break
				case "input":
					dispError(signUpForm,"Veuillez remplir tous les champs")
					break
				case "token":
					console.log('invalid token')
					window.location.reload()
				break
				default:
					dispError(signUpForm,"Une erreur interne est survenue veuillez recommencer plus tard")
				break
			}
			checkAll()
		}
	} else {
		logInError("Une erreur est survenue veuillez recommencer plus tard.")
	}
	signUpForm.classList.remove("wait")

})


signUpForm.addEventListener("submit",(event)=>{
	event.preventDefault()
	checkAll(true)
	var invalid = document.querySelectorAll(".validator .error")
	if (invalid.length != 0){
		signUpForm[invalid[0].parentNode.getAttribute("for")].focus()
	} else {
		var formData = new FormData(event.target)

		signUpForm.classList.add("wait")
		signupRequest.open("POST","/user/signup")
		signupRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
		signupRequest.send(encode(formData))
	}
})