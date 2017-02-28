# react-native-musicplayercontroller

This module is being created so React-Native (and React-Native for Web) users can easily ask their users to select a song from their Library, and have some playback options, even between sessions. iOS will access their Music Library for songs/playlists that are currently on their device (not in the Cloud) using ```MPMediaPickerController```, and playback will be with ```[MPMusicPlayerController applicationMusicPlayer]``` This is the basis for the other Android and Web versions which I tried to mimic as closely as possible.


## Current State
Initial versions for iOS, Android, and Web have been completed. After a few days of fully integrating and testing on my own current app, I'll bump this to version 1.0.0. Note that the API for all is the same, though the functionality may differ slightly. Check out more of this readme for more details on differences. 

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
 A) Users must pick a song/playlist from their device at least once before they can play audio from within your app. Without user selection, we have no access to their music library.

We'll save the memory of this track for you between app usage. It will be saved to ```NSUserDefaults``` (iOS), ```SharedPreferences``` (android), and possibly ```Local Storage``` (web), and thus will be erased when they delete the app. Or it will be overwritten when they choose a new track/playlist. Currently, this code only allows for one song/playlist to be saved between users picking them.

Here's how to present the Music Picker modally (android users, please use requestPermission method first):
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

###### Intent.ACTION_PICK - Android
![alt text](https://raw.githubusercontent.com/kjellconnelly/react-native-musicplayercontroller/master/example/picker_android.gif "Intent.ACTION_PICK - Android")

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

G) And for Android, you need to ask for permission. This method checks for permission, and gives you 3 different callbacks for different situations. The first two aruments are for a popup that explains to the user why permission is required... The first argument is Title. Second is message:
```javascript
MusicPlayerController.requestPermission("Permission Required",
"We need permission to play audio files from your storage. If you decline, you can always toggle this in Settings.",
()=> { // User just tapped to Accept
    this.presentPicker() // method defined somewhere else that does MusicPlayerController.presentPicker(...)
}, ()=> { // User has already accepted
    this.presentPicker()
}, ()=> {
    alert("Without permission to play audio files, we can only play the default music. If you want to change this, you can change this in your device Settings.")
})
```


**WE RECOMMEND FOR CROSS PLATFORM APPS**
Always do part G if your app uses Android. You can have all the same logic for iOS and Web since we'll simply always call the 'User has already accepted' callback. If you need to handle UI or have some other logic for Android Permissions, check out React Native's APIs: Permissions Android. The specific permission we use here is: ```READ_EXTERNAL_STORAGE``` (java), which is aka ```PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE``` (for React-Native)

If your app doesn't use Android, you won't need this.



## TODO:
1. ~~Setup Test Repo and integrate with current project~~
2. ~~Write iOS Version~~ Initial Complete
3. ~~Write Web Version~~ Initial Complete
4. ~~Hope someone writes the Android version~~ No one did
5. ~~Possibly write the Android version~~ Initial Complete
6. Fix bugs & increase functionality for all platforms as needed


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

#### Android
Works for all React-Native Projects (Marshmallow and above).

#### Web
Should work for all modern browsers, though users can only select mp3, ogg, and wav files. Who uses ogg and wav anyways?  
..1. Chrome 4.0 (2010)  
..2. IE 9.0 (2011, mp3 only)  
..3. Firefox (2009)  
..4. Safari (2009, mp3 and wav only)  
..5. Opera (2007)  
..6. Edge (2016)  
  
Also works on Mobile Browsers  
..1. iOS Safari & Chrome (2016)  
..2. Android Browser (2013)  
..3. Android Chrome (2017)  
  
## Known Issues
*Web Issues*  
..1. Due to web restrictions, we can't save a link to the audio file selected beyond browser refreshes. So in order to compensate, you can choose to either save the entire audio file to local storage (which has a 5-10 mb maximum), or not save it. Saving on other platforms just saves the link.  

**Note that as of the current version, this bool is irrelevent, as both ```true``` and ```false``` will not save to Local Storage (this is because my project doesn't need it, but I might add this functionality some day if someone needs it, or I do). Nevertheless, you still need to include it.**  
..2. If opens the Picker dialog, and clicks cancel without selecting an audio file, your cancelHandler won't be called. But if they select a file, and the successHandler is called, then open the Picker dialog again, and click cancel, the cancelHandler will be called. Weird web issues...  
..3. Audio is played using the ```<audio />``` tag. This means that users can only use mp3, wav, and ogg files. We recommend mp3 since they work on all browsers, while the others vary.  
..4. ```repeatMode``` was originally created for iOS. We're setting ```'none'``` has non repeating (plays once), and all other values as repeating forever. This is because you cannot select a playlist, but only an audio file.  
..5. I'm not sure how to get actual metadata from a mp3 or wav, so for ```metadata```, it will only hold one key: ```title```, which is the audio file name.  

*Android Issues*  
..1. Unlike iOS and Web, you need to user permission to access files (even the ones they pick). Similar to how on iOS, you need permission to access the Microphone. Though the API is the same for iOS, Android, and Web, there is one method that really only needs to be called if you are using Android: requestPermission. If you call this on other platforms, it just runs the 'permission already accepted' handler.  
..2. I'm not exactly sure why the picker slides the current Activity away first as in the example gif. But that's only if you have a new Activity (ViewController basically) ontop of your main one.  
..3. Technically speaking, when you call the stopMusic function, music is actually paused, and after a slight delay, moves to time 0. This is a 100ms delay. I added this here because using the Java API, pausing and seeking to time 0 would seek before fully pausing. And the stop method made me need to prepare the MediaPlayer again. So it will be in the paused state if you go into the Java side of things.  
..4. Since Android lets you pick files you may have randomly put on your device, you may end up with audio files that do not have very good metadata. In this case, if there is no title attributed to the metadata, we will return the filename instead (similar to the web version).  

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
Oh, and web only has ```title```, which actually shows the filename. Android returns filename too if there is no title in the actual metadata.

##### I can't do...

I know, I know. There's a lot that may be difficult to do with this module as of now. But it allows for the situation where you want a user to be able to select some music from their own library, and play is back within your own app. And that's my focus for now. Please ask any questions or ask for a feature and I'll see what I can do.

Star this project if you like it! It's good feedback that someone likes what I've built. And thanks for reading this!
