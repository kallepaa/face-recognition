/* MagicMirror²
 * Node Helper: FaceRecognization
 *
 * By Kalle Paananen
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const Log = require("logger")
const mqtt=require('mqtt');

module.exports = NodeHelper.create({
	_self: null,
	_person_id: null,
	start: function () {
		Log.log("Starting node helper for: " + this.name);
		_self = this;
	},
	socketNotificationReceived: function (notification, payload) {
		if (notification === "FACE_RECOGNIZATION.INIT") {

			const messageCallback = (personId) => {
				this.sendSocketNotification("FACE_RECOGNIZATION.DATA_RECEIVED", {
				  personId: personId,
				  time: Date.now()
				});
			  };

			_self.url = payload.url;
			_self.topic = payload.topic;
			_self.client = mqtt.connect(payload.url,{});
			_self.client.on("connect", function(){
				Log.log("Client connected.");
				_self.client.subscribe(_self.topic,{qos:1});
			});
			_self.client.on("error", function(error){
				Log.log("Client connect failed. Reason:" + error);
			});			
			_self.client.on("message", function(topic, message){
				o = JSON.parse("" + message);
				Log.log(o);
				messageCallback(o.person_id)
			});
		}
	}
});
