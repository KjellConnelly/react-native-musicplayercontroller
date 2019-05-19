package com.reactlibrary;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.media.MediaPlayer;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import android.support.v4.content.ContextCompat;
import android.support.v4.app.ActivityCompat;
import android.widget.Toast;

import java.io.IOException;
import java.net.URL;
import android.database.Cursor;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import android.content.SharedPreferences;

public class RNReactNativeMusicplayercontroller extends ReactContextBaseJavaModule {
    private Callback savedHandler;
    private Callback savedPermissionHandler;
    private final ReactApplicationContext reactContext;
    private MediaPlayer mediaPlayer;
    private static final int PERMISSION_REQUEST_CODE = 8081;
    private final ActivityEventListener listener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, final int requestCode, final int resultCode, final Intent data) {
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    if (resultCode == Activity.RESULT_OK && requestCode == 10) {
                        if (ContextCompat.checkSelfPermission(reactContext, android.Manifest.permission.READ_EXTERNAL_STORAGE) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                           /* Got React-Native to handle Permissions. Easier for me to write code in JS than Java
                            if (ActivityCompat.shouldShowRequestPermissionRationale(getCurrentActivity(), android.Manifest.permission.READ_EXTERNAL_STORAGE)) {}
                            ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{android.Manifest.permission.READ_EXTERNAL_STORAGE}, 6969);
                            return;
                            */
                        } else {
                            Uri uri = data.getData();
                            // saving uri
                            SharedPreferences prefs = reactContext.getSharedPreferences("RNReactNativeMusicplayercontroller", 0);
                            SharedPreferences.Editor editor = prefs.edit();
                            editor.putString("RNReactNativeMusicplayercontroller", uri.toString());
                            editor.commit();

                            WritableArray metadata = createMetadataFrom(uri);
                            savedHandler.invoke(0, metadata);
                        }
                    } else {
                      if (savedHandler != null) {
                        savedHandler.invoke(1, "User Tapped Cancel");
                      }
                    }
                }
            }, 1);
        }
    };

    public RNReactNativeMusicplayercontroller(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(listener);
    }

    @Override
        public String getName() {
        return "RNReactNativeMusicplayercontroller";
    }

    private WritableArray createMetadataFrom(Uri uri) {
        MediaMetadataRetriever meta = new MediaMetadataRetriever();
        meta.setDataSource(reactContext, uri);
        String title = meta.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE);
        String artist = meta.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST);
        String album = meta.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM);
        Double duration = Double.valueOf(meta.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)) / 1000.0;
        // If title is null, we return the filename instead.
        if (title == null) {
            String uriString = uri.toString();
            File myFile = new File(uriString);

            if (uriString.startsWith("content://")) {
                Cursor cursor = null;
                try {
                    cursor = getCurrentActivity().getContentResolver().query(uri, null, null, null, null);
                    if (cursor != null && cursor.moveToFirst()) {
                        title = cursor.getString(cursor.getColumnIndex(android.provider.OpenableColumns.DISPLAY_NAME));
                    }
                } finally {
                    cursor.close();
                }
            } else if (uriString.startsWith("file://")) {
                title = myFile.getName();
            }
        }

        // Creates the returnable objects for Javascript
        WritableArray arr = Arguments.createArray();
        WritableMap map = Arguments.createMap();
        map.putString("title", title);
        map.putString("artist", artist);
        map.putString("album", album);
        map.putDouble("duration", duration);
        arr.pushMap(map);

        return arr;
    }

    @ReactMethod
    public void presentPicker(Callback handler) {
        savedHandler = handler;
        Activity currentActivity = getCurrentActivity();
        try {
            Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Audio.Media.EXTERNAL_CONTENT_URI);
            currentActivity.startActivityForResult(intent, 10);
        } catch (Exception e) {
            savedHandler.invoke(1, "Failure here");
        }
    }

    @ReactMethod
    public void preloadMusic(String repeatMode, Callback handler) {
        savedHandler = handler;
        SharedPreferences prefs = reactContext.getSharedPreferences("RNReactNativeMusicplayercontroller", 0);
        String savedUriString = prefs.getString("RNReactNativeMusicplayercontroller", "unknown");
        if (savedUriString != null && savedUriString != "unknown") {
            Uri audioUri = Uri.parse(savedUriString);
            final WritableArray metadata = createMetadataFrom(audioUri);
            boolean looping = repeatMode != "none";
            mediaPlayer = MediaPlayer.create(reactContext, audioUri);
            mediaPlayer.setLooping(looping);
            mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    savedHandler.invoke(0, metadata);
                }
            });
        } else {
            handler.invoke(1, "Nothing to preload");
        }
    }

    @ReactMethod
    public void playMusic(Callback handler) {
        savedHandler = handler;
        if (mediaPlayer != null) {
            mediaPlayer.start();
            handler.invoke(0, "Playing");
        } else {
            handler.invoke(1, "Could not start");
        }
    }

    @ReactMethod
    public void stopMusic(Callback handler) {
        savedHandler = handler;
        if (mediaPlayer != null) {
            mediaPlayer.pause();
            final Handler delayHandler = new Handler();
            delayHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    mediaPlayer.seekTo(0);
                }
            }, 100);
            handler.invoke(0, "Stopping");
        } else {
            handler.invoke(1, "Could not stop");
        }
    }

    @ReactMethod
    public void pauseMusic(Callback handler) {
        savedHandler = handler;
        if (mediaPlayer != null) {
            mediaPlayer.pause();
            handler.invoke(0, "Pausing");
        } else {
            handler.invoke(1, "Could not pause");
        }
    }

    @ReactMethod
    public void isPlaying(Callback handler) {
        savedHandler = handler;
        if (mediaPlayer != null) {
            if (mediaPlayer.isPlaying()) {
                handler.invoke(0, "Is Playing");
            } else {
                handler.invoke(1, "Not Playing");
            }
        } else {
            handler.invoke(1, "Not Playing");
        }
    }
}
