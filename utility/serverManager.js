const {spawn} = require("child_process")
const EventEmitter = require('events');

const startedMatch  = /\[[0-9:]+\] \[Server thread\/INFO\]: Done/
const newPlayer     = /\[[0-9:]+\] \[Server thread\/INFO\]: ([a-z0-9_\-@]{3,}) joined the game/
const leftPlayer    = /\[[0-9:]+\] \[Server thread\/INFO\]: ([a-z0-9_\-@]{3,}) left the game/



module.exports = class Server extends EventEmitter{

	constructor(maxPlayers = 20){
		super()
		this.playerCount = 0
		this.maxPlayers = maxPlayers
		this.started = false
		this.restart = false
		this.serverStatus = "Offline"
		this.minecraftServer = undefined
	}

	start() {
		if (this.serverStatus == "Start-up")
			return
		
		console.log("Start minecraft server")

		this.minecraftServer = spawn("java",["-Xmx"+process.env.MINECRAFT_RAM+"M",
									  "-Xms"+process.env.MINECRAFT_RAM+"M",
									  "-jar",
									  "server.jar",
									  "nogui"],{
										cwd:process.env.MINECRAFT_PATH
									  })
		
		this.serverStatus = "Start-up"
		this.emit("statusChanged",this.serverStatus)

		this.minecraftServer.stdout.on("data", (data) => {
			this.checkForExpressions(data.toString())
			this.emit("log",data.toString())
			console.log(`${data.toString()}`)
		})

		this.minecraftServer.stderr.on("data", (data) => {
			this.emit("error",data.toString())
			console.error(`stderr: ${data.toString()}`)
		})

		this.minecraftServer.on("close",(code,signal)=>{
			this.serverStatus = "Offline"
			this.emit("statusChanged",this.serverStatus)
			console.log("close programm",code,signal)
			if (this.restart){
				this.restart = false
				this.start()
			}
		})
	}

	restart(){
		this.restart = true
		this.stop()
	}

	stop(){
		this.started = false
		this.minecraftServer.kill()
	}

	checkForExpressions(log){
		if (log.match(startedMatch)){
			this.serverStatus = "Online"
			this.started = true
			this.emit("statusChanged",this.serverStatus)
		} else if (log.match(newPlayer)){
			this.playerCount += 1
			this.emit("newPlayerAmount",this.playerCount)
		} else if (log.match(leftPlayer)) {
			this.playerCount -= 1
			this.emit("newPlayerAmount",this.playerCount)
		}
	}

	command(commande){

	}

}