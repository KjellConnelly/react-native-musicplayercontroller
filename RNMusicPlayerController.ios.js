import {NativeModules} from 'react-native'

function presentViewController() {
    const player = NativeModules.RNMusicPlayerController
    player.present((success, message) => {
        if (success) {
            alert("Success! " + message)
        } else {
            alert("Failed to present: " + message)
        }
    })
}

export default presentViewController