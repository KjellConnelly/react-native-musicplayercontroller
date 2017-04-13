"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MusicPlayerController = function () {
    function MusicPlayerController() {
        _classCallCheck(this, MusicPlayerController);
    }

    _createClass(MusicPlayerController, null, [{
        key: "requestPermission",
        value: function requestPermission(title, message, grantedHandler, previouslyGrantedHandler, declinedHandler) {
            previouslyGrantedHandler();
        }
    }, {
        key: "presentPicker",
        value: function presentPicker(webSaveToLocalStorage, successHandler, cancelHandler) {
            var input = document.getElementById("MusicPlayerControllerInput");
            if (input != null) {
                document.body.removeChild(input);
                input = null;
            }

            input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("style", "display:none;");
            input.setAttribute("id", "MusicPlayerControllerInput");
            input.setAttribute("accept", "audio/*");
            input.onchange = function (event) {
                var files = event.target.files;
                if (files.length == 0) {
                    cancelHandler();
                } else {
                    var metadata = [{ "title": files[0].name }];
                    if (webSaveToLocalStorage) {} else {}
                    successHandler(metadata);
                }
            };
            document.body.appendChild(input);
            input.click();
        }
    }, {
        key: "preloadMusic",
        value: function preloadMusic(repeatMode, successHandler, errorHandler) {
            if (document.getElementById("MusicPlayerControllerInput") == null) {
                errorHandler();
            } else {
                var files = document.getElementById("MusicPlayerControllerInput").files;
                var file = files[0];
                var audio = document.getElementById("MusicPlayerControllerAudio");
                if (audio != null) {
                    document.body.removeChild(audio);
                    audio = null;
                }

                audio = document.createElement("audio");
                audio.setAttribute("style", "display:none;");
                audio.id = "MusicPlayerControllerAudio";
                audio.preload = "auto";
                document.body.appendChild(audio);

                var loops = repeatMode != "none";
                var reader = new FileReader();
                reader.onload = function (e) {
                    audio.setAttribute('src', e.target.result);
                    audio.loop = loops;
                    successHandler();
                };
                reader.readAsDataURL(file);
            }
        }
    }, {
        key: "playMusic",
        value: function playMusic(successHandler, errorHandler) {
            var audio = document.getElementById("MusicPlayerControllerAudio");
            if (audio == null) {
                errorHandler();
            } else {
                audio.play();
                successHandler();
            }
        }
    }, {
        key: "stopMusic",
        value: function stopMusic(successHandler, errorHandler) {
            var audio = document.getElementById("MusicPlayerControllerAudio");
            if (audio == null) {
                errorHandler();
            } else {
                audio.pause();
                audio.currentTime = 0;
                successHandler();
            }
        }
    }, {
        key: "pauseMusic",
        value: function pauseMusic(successHandler, errorHandler) {
            var audio = document.getElementById("MusicPlayerControllerAudio");
            if (audio == null) {
                errorHandler();
            } else {
                audio.pause();
                successHandler();
            }
        }
    }, {
        key: "isPlaying",
        value: function isPlaying(isPlayingHandler, notPlayingHandler) {
            var audio = document.getElementById("MusicPlayerControllerAudio");
            if (audio == null) {
                notPlayingHandler();
            } else {
                if (audio.duration > 0 && !audio.paused) {
                    isPlayingHandler();
                } else {
                    notPlayingHandler();
                }
            }
        }
    }]);

    return MusicPlayerController;
}();

exports.default = MusicPlayerController;