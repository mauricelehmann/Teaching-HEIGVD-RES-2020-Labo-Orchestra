/* Moment module for the timestamp */
var time = require('moment');

/* https://nodejs.org/api/dgram.html */
const dgram = require('dgram');

/* Import protocol information */
const PROTOCOL = require('../../PROTOCOL/PROTOCOL.js');


function AuditorServer(){

	//Init. UDP4 socket server with dgram module
	this.UDP4Server = dgram.createSocket('udp4');


	//Listening on the multicast
	//https://nodejs.org/api/dgram.html#dgram_socket_addmembership_multicastaddress_multicastinterface
	this.UDP4Server.bind(PROTOCOL.PORT, () => {
	  this.UDP4Server.addMembership(PROTOCOL.MULTICAST);
	  console.log('Listening on the multicast : ' + PROTOCOL.MULTICAST);
	});


	this.UDP4Server.on('message', (data, source) => {

		var musicianData = JSON.parse(data);
		console.log(musicianData);
  		//const information = JSON.parse(msg);

  		//allMusician.set(information.uuid, [information.instrument, information.timestamp]);
	});


}


//Start the auditor server
var AuditorServer = new AuditorServer();
