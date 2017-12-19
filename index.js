import {NativeModules, Platform, PermissionsAndroid} from 'react-native'

// to transpile to es5 for web: https://babeljs.io/repl/
// check off es2015, react

class MusicPlayerController {
    static async requestPermission(title, message, grantedHandler, previouslyGrantedHandler, declinedHandler) {
        const key = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        if (Platform.OS == 'android') {
            try {
                const preGranted = await PermissionsAndroid.check(key)
                if (preGranted) {
                    previouslyGrantedHandler()
                } else {
                    try {
                        const granted = await PermissionsAndroid.request( key, {'title': title, 'message': message})

                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            grantedHandler()
                        } else {
                            declinedHandler()
                        }
                    } catch (err) {
                        console.warn(err)
                    }
                }
            } catch (error) {

            }
        } else {
            previouslyGrantedHandler()
        }
    }

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

    static setSessionCategory(category, option) {
      if (Platform.OS == 'ios') {
        const player = NativeModules.RNReactNativeMusicplayercontroller
        player.setSessionCategory(category, option)
      }
    }
}

export default MusicPlayerController
