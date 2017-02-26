import {NativeModules} from 'react-native'

class MusicPlayerController {
    static presentPicker(webSaveToLocalStorage, successHandler, cancelHandler) {
        const player = NativeModules.RNReactNativeMusicplayercontroller
        player.presentPicker((errorCode, metadata) => {
            if (errorCode == 0) {
                // No Error. User picked
                successHandler(metadata)
            } else if (errorCode == 1) {
                // Able to open Picker, but user tapped Cancel 
                cancelHandler()
            } else if (errorCode == 2) {
                // Cannot open picker - Using Simulator 
                alert("Sorry - iOS doesn't allow MPMusicPlayerController to be opened on the simulator. Please try on an actual device with at least one song in the library (song download from iTunes and in your Music App)")
            }
        })
    }
    
    static preloadMusic(repeatMode, successHandler, errorHandler) {
        const player = NativeModules.RNReactNativeMusicplayercontroller
        player.preloadMusic(repeatMode, (errorCode, metadata) => {
            if (errorCode == 0) {
                // Preload successful (application music player)
                successHandler(metadata)
            } else if (errorCode == 1) {
                // No music to preload (nothing in NSUserDefaults)
                errorHandler()
            }
        })
    }
    
    static playMusic(successHandler, errorHandler) {
        const player = NativeModules.RNReactNativeMusicplayercontroller
        player.playMusic((errorCode, metadata) => {
            if (errorCode == 0) {
                // Successfully played music (even if already playing)
                successHandler()
            } else if (errorCode == 1) {
                // Unable to play music. Did you preload it?
                errorHandler()
            }
        })
    }
    
    static stopMusic(successHandler, errorHandler) {
        const player = NativeModules.RNReactNativeMusicplayercontroller
        player.stopMusic((errorCode, metadata) => {
            if (errorCode == 0) {
                // Successfully stopped music (even if it was already stopped)
                successHandler()
            } else if (errorCode == 1) {
                // Unable to stop music. Did you preload it?
                errorHandler()
            }
        })
    }
    
    static pauseMusic(successHandler, errorHandler) {
        const player = NativeModules.RNReactNativeMusicplayercontroller
        player.pauseMusic((errorCode, metadata) => {
            if (errorCode == 0) {
                // Successfully stopped music (even if it was already stopped)
                successHandler()
            } else if (errorCode == 1) {
                // Unable to stop music. Did you preload it?
                errorHandler()
            }
        })
    }
    
    static isPlaying(isPlayingHandler, notPlayingHandler) {
        const player = NativeModules.RNReactNativeMusicplayercontroller
        player.isPlaying((errorCode, result) => {
            if (errorCode == 0) {
                // Music Player is playing
                isPlayingHandler()
            } else if (errorCode == 1) {
                // Not playing
                notPlayingHandler()
            }
        })
    }
}

export default MusicPlayerController