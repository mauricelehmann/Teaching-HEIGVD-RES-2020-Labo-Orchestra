/* Moment module for the timestamp */
var time = require('moment');

/* https://nodejs.org/api/dgram.html */
const dgram = require('dgram');

/** Using uuid v4 to get an unique id
	https://www.npmjs.com/package/uuid$
	usage : uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
*/
const { v4: uuidv4 } = require('uuid');

/* Import protocol information */
const PROTOCOL = require('../../PROTOCOL/PROTOCOL.js');

//Define the instruments and their sounds
const INSTRUMENTS = {
	piano : 'ti-ta-ti',
	trumpet : 'pouet',
	flute	: 'trulu',
	violin : 'gzi-gzi',
	drum :	'boum-boum',
	default : 'oink-oink',
};

function MusicianServer(instrumentName) {

	//Default values for unknown instrument
	if(!(instrumentName in INSTRUMENTS)){
		this.instrumentSound = INSTRUMENTS['default'];
		this.instrumentName = 'unknown instrument';
	}else{
		this.instrumentSound = INSTRUMENTS[instrumentName];
		this.instrumentName = instrumentName;
	}

	//Init. UDP4 socket server with dgram module
	this.UDP4Server = dgram.createSocket('udp4');

	//Init the id of the musician
	this.id = uuidv4();

	//Send the message on loop
	setInterval(this.sendMsg.bind(this), PROTOCOL.TIME_INTERVAL);
}

MusicianServer.prototype.getPayload = function() {
	var data = {
		id : this.id,
		instrument : this.instrumentName,
		sound : this.instrumentSound,
		timestamp : time(),
	};

	return Buffer.from(JSON.stringify(data));
}

/**
 * Send musician informations on the multicast
 * @return {[void]}
 */
MusicianServer.prototype.sendMsg = function() {

	//Get the payload
	var serializedMessage = this.getPayload();

	this.UDP4Server.send
	(
		serializedMessage,
		0 ,
		serializedMessage.length,
		PROTOCOL.PORT,
		PROTOCOL.MULTICAST,
		() => {
			console.log("Send a payload on " +  PROTOCOL.MULTICAST + ":" + PROTOCOL.PORT);
			console.log("payload : " + serializedMessage);
		}
	);
}


//Get the arguments from the docker command launch node js
const arg = process.argv[2];

var musician = new MusicianServer(arg);
