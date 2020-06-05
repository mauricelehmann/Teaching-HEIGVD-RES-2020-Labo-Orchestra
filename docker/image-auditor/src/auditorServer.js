/* Moment module for the timestamp */
var time = require('moment');

/* https://nodejs.org/api/dgram.html */
const dgram = require('dgram');

/* Import protocol information */
const PROTOCOL = require('../../PROTOCOL/PROTOCOL.js');

/* For using the TCP connexion between the localhost user and the auditor server */
const net = require('net');


/**
 * AuditorServer
 * Listening on the multicast for musicians data using UDP
 * Listening on the TCP port for the user requests
 */
function AuditorServer(){

	//Init. UDP4 socket server with dgram module
	this.UDP4Server = dgram.createSocket('udp4');
	//Init the TCP server for connexion from host
	//https://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener
	this.TCPServer = net.createServer();

	//We store all the musician data, with a map wich contains
	// - key : musician id
	// - value : [ timestamp , instruments ]
	this.orchestra = new Map();

	//Setup the udp server and his behavior
	this.setupUDPServer();
	//Setup the TCP server and his behavior
	this.setupTCPServer();

}

/**
 * Update the map of musicians
 * @param  {[type]} data
 * @return {[void
 */
AuditorServer.prototype.updateMusician = function( data ){

	//Update the map of musicians
	this.orchestra.set(
		data.id,
		[
			data.timestamp,
			data.instrument
		]
	);
}

AuditorServer.prototype.getAliveMusicians = function() {
	var aliveMusicians = [];

	//For each musician on the map, we keep the ones who are being updated
	//since 5 seconds
	this.orchestra.forEach((data, key) => {

		//Check the time diff between the actual time and the stored time of the last
		//input from the musician
		var timeDifference = time().diff(data[0]);
		//If the diff is smaller than 5000 milliseconds, we keep it
		if(timeDifference < PROTOCOL.TIME_MUSICIAN_IS_ALIVE){
			aliveMusicians.push(
				{
					uuid : key,
					instrument : data[1],
					activeSince : data[0]
				}
			);
		}
	});

	return aliveMusicians;
}


/**
 * TCP server
 * @return {[void]}
 */
AuditorServer.prototype.setupTCPServer = function() {
	//Make the TCP server listend on the port
	this.TCPServer.listen(PROTOCOL.PORT);

	//Behavior of the TCPServer when a connexion occure
	this.TCPServer.on('connection', (TCPSocket) => {

		//Get the musicians that updated their data since less than 5 seconds
		var aliveMusician = this.getAliveMusicians();

		//Send the data to the host througt TCP
		TCPSocket.write(JSON.stringify(aliveMusician)+ '\r\n');
		TCPSocket.end();
	});
}
/**
 * UDP server
 * @return {[void]}
 */
AuditorServer.prototype.setupUDPServer = function() {

	//Listening on the multicast
	//https://nodejs.org/api/dgram.html#dgram_socket_addmembership_multicastaddress_multicastinterface
	this.UDP4Server.bind(PROTOCOL.PORT, () => {
	  this.UDP4Server.addMembership(PROTOCOL.MULTICAST);
	  console.log('Listening on the multicast : ' + PROTOCOL.MULTICAST);
	});

	//Action on every 'message' we get from the multicast
	this.UDP4Server.on('message', (data, source) => {

		//Parse the data from musicianServer and update the map
		this.updateMusician(JSON.parse(data));

		//console.log("Orchestra stored data :");
		//console.log(this.orchestra);
	});
}

//Start the auditor server
var AuditorServer = new AuditorServer();
