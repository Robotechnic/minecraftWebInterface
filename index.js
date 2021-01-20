//setup environement variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

if (!process.env.CONFIG_OK){
	console.log("Please run configure script before start server")
	process.exit()
}

const express = require("express")
var app = express()

const http = require('http').createServer(app);
const io = require("socket.io")(http)

const helmet = require("helmet")
app.use(helmet({
	contentSecurityPolicy :false //setup it by my own
}))

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
    			  "default-src 'self';"+
    			  "script-src 'self';" +
    			  "base-uri 'self';" +
    			  "frame-ancestors 'self';"+
    			  "img-src 'self';"+
    			  "object-src 'none';"+
    			  "form-action 'self';" +
    			  "style-src 'self' fonts.googleapis.com;"+
    			  "font-src 'self' fonts.gstatic.com;");
    next()
})

//setup db
const db = require("./database/setupDb")

const expressSession = require("express-session")
const mariadbStore = require("./database/mariadbSessionStore")
const sessionManager = expressSession({
    secret:process.env.SESSION_SECRET || "default secret 123548962@/*-+ ;)",
    name:"sessionID",
    resave:false,
    saveUninitialized:false,
    store:new mariadbStore(db,"sessions"),
    cookie:{
        sameSite:"Strict",
        httpOnly:true,
        maxAge:7 * 24 * 60 * 60 * 1000, //1 week
        secure: process.env.SECURE,
    }
})
app.use(sessionManager)
io.use(sessionManager)

const bodyparser = require("body-parser")
app.use(bodyparser.urlencoded({extended:false}))

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'))

const {csrfToken,csrfParse} = require("./middlewares/csrfToken")

app.use(require("./middlewares/connected"))

app.get("/",csrfToken,(req,res)=>{
    res.render("main.ejs",{serverIp:process.env.MINECRAFT_IP})
})

app.post("/",csrfToken,(req,res)=>{
    res.redirect("/")
})

app.use("/user",require("./routes/user.js")(db))
app.use("/minecraft",require("./routes/minecraftConfig.js"))

http.listen(process.env.PORT,()=>{
	console.log("Le serveur est lancé sur le port ",process.env.PORT)
})