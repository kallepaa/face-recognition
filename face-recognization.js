/* MagicMirror²
 * Module: FaceRecognization
 *
 * By Kalle Paananen
 * MIT Licensed.
 */

Module.register("face-recognization", {
	// Default module config.
	defaults: {
		url: "mqtt://localhost:1883",
		topic: "magic-mirror/face-recognization"
	},
	start() {
		_self = this;
		_self.viewModel = {
			personId: "",
			title: "loading..."
		}
		_self._initCommunication();
	},
	getTemplate: function () {
		return "face-recognization.njk";
	},
	getTemplateData: function () {
		return _self.viewModel;
	},
	socketNotificationReceived: function (notificationName, payload) {
		console.log(payload);
		if (notificationName === "FACE_RECOGNIZATION.DATA_RECEIVED") {
			if (payload && payload.personId) {
				_self.viewModel = {
					personId: payload.personId
				}				
				_self.sendNotification("PERSON_RECOGNIZED", { personId: payload.personId });
			} else {
				_self.viewModel = {
					personId: null
				}
				_self.sendNotification("PERSON_DISMISSED", { personId: null });
			}
		}
		this.updateDom();
	},
	_initCommunication() {
		this.sendSocketNotification("FACE_RECOGNIZATION.INIT", {
			url: _self.config.url,
			topic: _self.config.topic
		});
	}
});