module.exports = (req,res,next) =>{
	if (req.session.pseudo){
		req.connected = true
		res.locals.connected = true
	} else {
		req.connected = false
		res.locals.connected = false
	}
	next();
}