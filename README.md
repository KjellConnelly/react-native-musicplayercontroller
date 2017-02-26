# react-native-musicplayercontroller

This module is being created so React-Native (and React-Native for Web) users can easily ask their users to select a song from their Library, and have some playback options, even between sessions. iOS will access their Music Library for songs/playlists that are currently on their device (not in the Cloud) using ```MPMediaPickerController```, and playback will be with ```[MPMusicPlayerController applicationMusicPlayer]``` This is the basis for the other Android and Web versions which I will try to mimic as closely as possible.


## Current State
I got an initial iOS and Web version working. So far it works with my project, and the functions you call should be exactly the same on both platforms. There are certain things that are not 100% the same in the execution though, so check out the Known Issues section near the bottom of this page for more details.

I updated one function to have an extra argument: ```presentPicker(webSaveToLocalStorage, successHandler, cancelHandler)```

I haven't started working on the Android version yet, but soon. I know there is a folder for the Windows version, but the only Windows OS I have is Windows8, and it's on a $300 laptop from 2014. So it's not the platform I want to develop on. Maybe someday I'll add functionality for this, but don't hold your breath. Until then, you can still run your app on windows with a WebView (think cordova), and use the web version of this module. The reason the folder is there in the first place is because I used a starter library.

## Installation

```
npm install --save react-native-musicplayercontroller
react-native link
```

If your Xcode project has more than one Target, you will need to navigate to ```Libraries > RNReactNativeMusicplayercontroller.xcodeproj > Products > libRNReactNativeMusicplayercontroller.a``` and drag this into each Target's ```Build Phases > Link Binary with Libraries```. There should already be a few .a files in there, so it's pretty obvious. react-native link only links to the first Target.

## Usage
```javascript
import MusicPlayerController from 'react-native-musicplayercontroller'
```
 A) Users must pick a song/playlist from their device at least once before they can play audio from within your app. Without user selection, iOS apps have no access to their music library.

We'll save the memory of this track for you between app usage. It will be saved to NSUserDefaults (iOS), and thus will be erased when they delete the app. Or it will be overwritten when they choose a new track/playlist. Currently, this code only allows for one song/playlist to be saved between users picking them.

Here's how to present the Music Picker modally:
```javascript
MusicPlayerController.presentPicker(false, (metadata)=>{
  // Successfully saved MPMediaItemCollection to NSUserDefaults.
  //    Returns an array of metadata for each track (not all MPMediaItem
  //    fields are copied, only the blantantly needed ones)
    alert(metadata[0]["title"])
}, ()=>{
  // Opened, but user tapped Cancel
  alert("Cancel")
})
```

###### MPMediaPickerController - iOS
![alt text](https://raw.githubusercontent.com/kjellconnelly/react-native-musicplayercontroller/master/example/picker_ios.gif "MPMediaPickerController - iOS")

###### input type='file' - web
![alt text](https://raw.githubusercontent.com/kjellconnelly/react-native-musicplayercontroller/master/example/picker_web.gif "<input type='file' /> - web")

*note* that the first argument is false. This has to do with the web version only (unused variable on iOS and Android, but we still put it there so we don't have different code calls). It has to do with whether you want to save the sound file locally. Due to web restrictions, we can't save a link to the file the user selected between page refreshes. So we need to make a local copy of the music file and save it to local storage. Since local storage is fairly small on most browsers (usually 5MB), we wouldn't want to save it if we plan to use local storage for anything else, or have users pick files that are larger than 5MB. So this is optional. On iOS and Android, we actually can save a link. So the memory usage is pretty much no existant. 

B) Once the user has an actual track/playlist chosen, you can access this always, even when the user closes and reopens your app. But you need to preload the music so the player is cached. If you just call the playMusic method, and music hasn't been preloaded, it will fail.
```javascript
MusicPlayerController.preloadMusic("all", (metadata)=>{
  // Successful preload
}, ()=>{
  // Failed to preload music. Potentially lots of reasons, such as the music file being removed from the device.
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
3. ~~Write Web Version~~ Initial Complete
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
Should work for iOS 8.0+ (devices from late 2014 or later). Only physically tested on iOS 10.2

#### Web
Should work for all modern browsers, though users can only select mp3, ogg, and wav files. Who uses ogg and wav anyways? 
1. Chrome 4.0 (2010) 
2. IE 9.0 (2011, mp3 only)
3. Firefox (2009)
4. Safari (2009, mp3 and wav only)
5. Opera (2007)
6. Edge (2016)
Also works on Mobile Browsers
1. iOS Safari & Chrome (2016)
2. Android Browser (2013)
3. Android Chrome (2017)

## Known Issues
The web version has a few issues:
1. Due to web restrictions, we can't save a link to the audio file selected beyond browser refreshes. So in order to compensate, you can choose to either save the entire audio file to local storage (which has a 5-10 mb maximum), or not save it. Saving on other platforms just saves the link.
**Note that as of the current version, this bool is irrelevent, as both ```true``` and ```false``` will not save to Local Storage (this is because my project doesn't need it, but I might add this functionality some day if someone needs it, or I do.). Nevertheless, you still need to include it.**
2. If opens the Picker dialog, and clicks cancel without selecting an audio file, your cancelHandler won't be called. But if they select a file, and the successHandler is called, then open the Picker dialog again, and click cancel, the cancelHandler will be called. Weird web issues...
3. Audio is played using the ```<audio />``` tag. This means that users can only use mp3, wav, and ogg files. We recommend mp3 since they work on all browsers, while the others vary.
4. ```repeatMode``` was originally created for iOS. We're setting ```'none'``` has non repeating (plays once), and all other values as repeating forever. This is because you cannot select a playlist, but only an audio file.
5. I'm not sure how to get actual metadata from a mp3 or wav, so for ```metadata```, it will only hold one key: ```title```, which is the audio file name.

## Common Debugging Issues

##### If you just downloaded the new version of this package...
Open your app's package.json file and make sure under dependencies, react-native-musicplayercontroller has a version number you're okay with. I like to do: ```"react-native-musicplayercontroller": "*"``` because it always prioritizes the latest version. Then:
```
npm update react-native-musicplayercontroller
```
... then you will want to restart the React-Native server. So kill that process in your terminal and restart it:
```
react-native start
```
And of course, rebuild the actual app (Xcode > Build & Run, or ```react-native run-ios```)

##### If you're testing on simulator

Unfortunately MPMediaPickerController doesn't work on the iOS Simulator. So you just get an alert if you try to open the Picker. And since you can't pick an item, playing them won't work either because you won't have anything selected.

##### Types of metadata?

I was lazy and didn't include all types of metadata... just the ones I personally want:
 ```objc
 @"artist" : item.artist,
 @"title" : item.title,
 @"albumTitle" : item.albumTitle,
 @"playbackDuration" : @(item.playbackDuration)
 ```
Oh, and web only has ```title```, which actually shows the filename.

##### I can't do...

I know, I know. There's a lot that may be difficult to do with this module as of now. But it allows for the situation where you want a user to be able to select some music from their own library, and play is back within your own app. And that's my focus for now. Please ask any questions or ask for a feature and I'll see what I can do.
