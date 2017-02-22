# react-native-musicplayercontroller

This module is being created so React-Native (and React-Native for Web) users can easily ask their users to select a song from their Library, and have some playback options, even between sessions. iOS will access their Music Library for songs/playlists that are currently on their device (not in the Cloud) using ```MPMediaPickerController```, and playback will be with ```[MPMusicPlayerController applicationMusicPlayer]``` This is the basis for the other Android and Web versions which I will try to mimic as closely as possible.

I expect you to be able to call the presentViewController method once, then the native code handle the rest until a callback is called to Javascript which will return various metadata, as well as a way to play the music.

## Current State
Right now, this works decently for iOS only. Will probably be adding some more functionality as I integrate it with my own projects. Please feel free to request features, as I would like this to work for more than just myself.

Web version will be next after fully integrating the iOS version with my own current project. Web because I am so-so in web technologies.

Finally, Android will be last, and will probably take a long time since my Android experience is very, very limited. Would love help from others.

## Install
```
npm install --save react-native-musicplayercontroller
```

```javascript
import MusicPlayerController from 'react-native-musicplayercontroller'
```
Drag RNMusicPlayerController.m and .h into your Xcode project. (When this repo is updated, make sure these two files are either linked to the current ones, or you drag in copies of the new versions)

Sorry - I don't know how to use rnpm link, or react-native link yet. Maybe todo?

## Usage
 A) Users must pick a song/playlist from their device at least once before they can play back within your app. We'll save the memory of this track for you between app usage. It will be saved to NSUserDefaults (iOS), and thus will be erased when they delete the app. Or it will be overwritten when they choose a new track/playlist. Currently, this code only allows for one song/playlist to be saved between users picking them.
```javascript
MusicPlayerController.presentPicker((metadata)=>{
      // Successfully saved MPMediaItemCollection to NSUserDefaults.
      //    Returns an array of metadata for each track (not all MPMediaItem
      //    fields are copied, only the blantantly needed ones)
        alert(metadata[0]["title"])
    }, ()=>{
      // Opened, but user tapped Cancel
      alert("Cancel")
    })
```


B) Once the user has an actual track/playlist chosen, you can access this always, even when the user closes and reopens your app. But you need to preload the music so the player is cached. If you just call the playMusic method, and music hasn't been preloaded, it will fail.
```javascript
MusicPlayerController.preloadMusic("all", (metadata)=>{
      // Successful preload
    }, ()=>{
      // Failed to preload music
    })
```
Note that the first argument is a String. This has to do with the repeatMode. Valid values are:
```javascript
"none", // plays the song or playlist once, and doesn't repeat
"one", // plays the current song on repeat (or if it's a playlist, just the currently selected song)
"all", // plays all tracks on repeat (for a playlist, or a single track)
"default" // The user’s preferred repeat mode. Currently, we always use the applicationMusicPlayer, so whatever Apple set as being the default repeat mode, that will happen. I'm not sure which one it uses though, so avoid picking this unless you know for sure what it does.
```

C) Now you can play music:
```javascript
MusicPlayerController.playMusic(()=>{
        // Successfully playing
      }, ()=>{
        // Failed to play
      })
```

D) Or pause music...
```javascript
MusicPlayerController.pauseMusic(()=>{
      // pausing music
    }, ()=> {
      // failed to pause
    })
```

E) Or stop music
```javascript
MusicPlayerController.stopMusic(()=>{
      // music stopped
    }, ()=> {
      // failed to stop music
    })
```

F) Or check if music is playing 
```javascript
MusicPlayerController.isPlaying(()=>{
      // music is playing
    }, ()=> {
      // music is not playing
    })
```


## TODO:
1. ~~Setup Test Repo and integrate with current project~~
2. ~~Write iOS Version~~ Initial Complete
3. Write Web Version
4. Hope someone writes the Android version
5. Possibly write the Android version


## License
*MIT*

## My Tools
I'm not sure how to add needed dependencies, but this module currently works with React-Native 0.41, and your app needs to be able to use ES6 syntax. React-Native will load the correct .ios.js or .android.js. If you're using react-native-web, you it will load from .web.js. So make sure your packaging tool (I use webpack) is set to load .web.js files:

```javascript
// webpack.config.js

module.exports = {
    // ...
    resolve: {
        extensions: [ '.web.js', '.js' ]
    }
};
```

#### iOS
Should work for iOS 3.0+ (devices from 2009)

## Common Debugging Issues

##### If you just downloaded the new version of this package...
```
npm update react-native-musicplayercontroller
```
... then you will want to restart the React-Native server. So kill that process in your terminal and restart it:
```
react-native run-ios
```
Otherwise your module will be old

##### If you're testing on simulator

Unfortunately MPMusicPlayerController doesn't work on the iOS Simulator. So you just get an alert.

##### Types of metadata?

I was lazy and didn't include all types of metadata... just the ones I personally want:
 ```objc
 @"artist" : item.artist,
 @"title" : item.title,
 @"albumTitle" : item.albumTitle,
 @"playbackDuration" : @(item.playbackDuration)
 ```

##### I can't do...

I know, I know. There's a lot that may be difficult to do with this module as of now. But it allows for the situation where you want a user to be able to select some music from their own library, and play is back within your own app. And that's my focus for now. Please ask any questions or ask for a feature and I'll see what I can do.
