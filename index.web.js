class MusicPlayerController {
    static requestPermission(grantedHandler, previouslyGrantedHandler, declinedHandler) {
        previouslyGrantedHandler()
    }
    
    static presentPicker(webSaveToLocalStorage, successHandler, cancelHandler) {
        let input = document.getElementById("MusicPlayerControllerInput")
        if (input != null) {
            document.body.removeChild(input)
            input = null
        }
        
        input = document.createElement("input")
        input.setAttribute("type", "file")
        input.setAttribute("style", "display:none;")
        input.setAttribute("id", "MusicPlayerControllerInput")
        input.setAttribute("accept", "audio/*")
        input.onchange = (event) => {
            let files = event.target.files
            if (files.length == 0) {
                cancelHandler()    
            } else {
                let metadata = [{"title" : files[0].name}]
                if (webSaveToLocalStorage) {

                } else {

                }
                successHandler(metadata)
            }
        }
        document.body.appendChild(input)
        input.click()
    }
    
    static preloadMusic(repeatMode, successHandler, errorHandler) {
        if (document.getElementById("MusicPlayerControllerInput") == null) {
            errorHandler()
        } else {
            let files = document.getElementById("MusicPlayerControllerInput").files
            let file = files[0]
            let audio = document.getElementById("MusicPlayerControllerAudio")
            if (audio != null) {
                document.body.removeChild(audio)
                audio = null
            }
            
            audio = document.createElement("audio")
            audio.setAttribute("style", "display:none;")
            audio.id = "MusicPlayerControllerAudio"
            audio.preload = "auto"
            document.body.appendChild(audio)

            let loops = repeatMode != "none"
            let reader = new FileReader()
            reader.onload = function (e) {
                audio.setAttribute('src', e.target.result);
                audio.loop = loops
                successHandler()
            }
            reader.readAsDataURL(file);
        }
    }
    
    static playMusic(successHandler, errorHandler) {
        let audio = document.getElementById("MusicPlayerControllerAudio")
        if (audio == null) {
            errorHandler()
        } else {
            audio.play()  
            successHandler()
        }
    }
    
    static stopMusic(successHandler, errorHandler) {
        let audio = document.getElementById("MusicPlayerControllerAudio")
        if (audio == null) {
            errorHandler()
        } else {
            audio.pause()
            audio.currentTime = 0
            successHandler()
        }
    }
    
    static pauseMusic(successHandler, errorHandler) {
        let audio = document.getElementById("MusicPlayerControllerAudio")
        if (audio == null) {
            errorHandler()
        } else {
            audio.pause()
            successHandler()
        }
    }
    
    static isPlaying(isPlayingHandler, notPlayingHandler) {
        let audio = document.getElementById("MusicPlayerControllerAudio")
        if (audio == null) {
            notPlayingHandler()
        } else {
            if (audio.duration > 0 && !audio.paused) {
                isPlayingHandler()
            } else {
                notPlayingHandler()   
            }
        }
    }
}

export default MusicPlayerController