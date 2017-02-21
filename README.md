# react-native-musicplayercontroller

This is my first public repo, and I'm still in the process of setting this repo up to work with the current project I'm working on, and for others. So bare with me.

#*When Done* Description
This module is being created so React-Native (and React-Native for Web) users can easily ask their users to select a song from their Library. iOS will access their Music Library for songs/playlists that are currently on their device (not in the Cloud) using MPMusicPlayerController. This is the basis for the other Android and Web versions which I will try to mimic as closely as possible.

I expect you to be able to call the presentViewController method once, then the native code handle the rest until a callback is called to Javascript which will return various metadata, as well as a way to play the music.

#Install
```
npm install --save react-native-musicplayercontroller
```

```javascript
import presentMethod from 'react-native-musicplayercontroller'

presentMethod() // will add callbacks. But this is just how to open the controller
```


#TODO:
1. Setup Test Repo and integrate with current project
2. Write iOS Version
3. Write Web Version
4. Hope someone writes the Android version
5. Possibly write the Android version

I have experience with MPMusicPlayerController using iOS Objective-C and Swift, so step 1-3 will be done for sure. 5 is unknown since I haven't written Java since my intro to programming class over 10 years ago.'

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
