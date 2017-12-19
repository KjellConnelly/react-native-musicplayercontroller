//
//  RNReactNativeMusicplayercontroller.m
//
//  Created by Kjell Connelly on 2/20/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNReactNativeMusicplayercontroller.h"

@implementation RNReactNativeMusicplayercontroller
RCTResponseSenderBlock savedCallback;
MPMusicPlayerController *musicPlayer;


RCT_EXPORT_MODULE();

//////////////////////////////////////////////////////////////////////
// Media Picker

RCT_EXPORT_METHOD(presentPicker: (RCTResponseSenderBlock)callback) {
    savedCallback = callback;
    
#if TARGET_IPHONE_SIMULATOR
    savedCallback(@[[NSNumber numberWithInt:2], @[]]);
#else
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *topViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        while (true) {
            if (topViewController.presentedViewController) {
                topViewController = topViewController.presentedViewController;
            } else if ([topViewController isKindOfClass:[UINavigationController class]]) {
                UINavigationController *nav = (UINavigationController *)topViewController;
                topViewController = nav.topViewController;
            } else if ([topViewController isKindOfClass:[UITabBarController class]]) {
                UITabBarController *tab = (UITabBarController *)topViewController;
                topViewController = tab.selectedViewController;
            } else {
                break;
            }
        }
        
        MPMediaPickerController *picker = [[MPMediaPickerController alloc] initWithMediaTypes:MPMediaTypeMusic];
        [picker setShowsCloudItems:false];
        [picker setAllowsPickingMultipleItems:false];
        if ([picker respondsToSelector:@selector(setShowsItemsWithProtectedAssets:)]) {
            [picker setShowsItemsWithProtectedAssets:false];
        }
        [picker setDelegate:self];
        [topViewController presentViewController:picker animated:true completion:^{}];
    });
#endif
}

//////////////////////////////////////////////////////////////////////
// MPMusicPlayerController

RCT_EXPORT_METHOD(setSessionCategory: (NSString *)categoryString: (NSString *)optionString) {
    NSArray *categories = @[@"AVAudioSessionCategoryAmbient",
                            @"AVAudioSessionCategorySoloAmbient",
                            @"AVAudioSessionCategoryPlayback",
                            @"AVAudioSessionCategoryRecord",
                            @"AVAudioSessionCategoryPlayAndRecord",
                            @"AVAudioSessionCategoryMultiRoute"];
    
    NSArray *options = @[   @"AVAudioSessionCategoryOptionMixWithOthers",
                            @"AVAudioSessionCategoryOptionDuckOthers",
                            @"AVAudioSessionCategoryOptionInterruptSpokenAudioAndMixWithOthers",
                            @"AVAudioSessionCategoryOptionAllowBluetooth",
                            @"AVAudioSessionCategoryOptionAllowBluetoothA2DP",
                            @"AVAudioSessionCategoryOptionAllowAirPlay",
                            @"AVAudioSessionCategoryOptionDefaultToSpeaker"];
    
    NSString *theCategory = categories[1];
    for (int i = 0; i < categories.count; i++) {
        if ([[categoryString capitalizedString] isEqualToString:[categories[i] capitalizedString]]) {
            theCategory = categories[i];
        }
    }
    
    if (optionString.length > 0) {
        int optionNumber = 0;
        for (int i = 0; i < options.count; i++) {
            if ([[optionString capitalizedString] isEqualToString:[options[i] capitalizedString]]) {
                optionNumber = i;
            }
        }
        [[AVAudioSession sharedInstance] setCategory:theCategory withOptions:optionNumber error:nil];
    }
    
    [[AVAudioSession sharedInstance] setCategory:theCategory error:nil];
}

RCT_EXPORT_METHOD(preloadMusic: (NSString *)repeatMode:(RCTResponseSenderBlock)callback) {
    if ([[NSUserDefaults standardUserDefaults] valueForKey:@"mediaItemCollection"] != nil) {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSData *data = [[NSUserDefaults standardUserDefaults] valueForKey:@"mediaItemCollection"];
            MPMediaItemCollection *mediaItemCollection = [NSKeyedUnarchiver unarchiveObjectWithData:data];
            NSArray *metadata = [self createMetadataFor:mediaItemCollection];
            musicPlayer = [MPMusicPlayerController applicationMusicPlayer];
            if (musicPlayer == nil) {
                callback(@[[NSNumber numberWithInteger:1], @[]]);
            } else {
                NSLog(@"%@\n%lu", AVAudioSessionCategoryPlayback, AVAudioSessionCategoryOptionDuckOthers);
                if ([repeatMode isEqualToString:@"none"]) {
                    [musicPlayer setRepeatMode:MPMusicRepeatModeNone];
                } else if ([repeatMode isEqualToString:@"one"]) {
                    [musicPlayer setRepeatMode:MPMusicRepeatModeOne];
                } else if ([repeatMode isEqualToString:@"all"]) {
                    [musicPlayer setRepeatMode:MPMusicRepeatModeAll];
                } else {
                    [musicPlayer setRepeatMode:MPMusicRepeatModeDefault];
                }
                
                [musicPlayer setQueueWithItemCollection:mediaItemCollection];
                [musicPlayer prepareToPlayWithCompletionHandler:^(NSError * _Nullable error) {
                    if (error) {
                        callback(@[[NSNumber numberWithInteger:1], @[]]);
                    } else {
                        callback(@[[NSNumber numberWithInteger:0], metadata]);
                    }
                }];
            }
        });
    } else {
        callback(@[[NSNumber numberWithInteger:1], @[]]);
    }
}

RCT_EXPORT_METHOD(playMusic: (RCTResponseSenderBlock)callback) {
    if (musicPlayer != nil) {
        callback(@[[NSNumber numberWithInteger:0], @[]]);
        dispatch_async(dispatch_get_main_queue(), ^{
            [musicPlayer play];
        });
    } else {
        callback(@[[NSNumber numberWithInteger:1], @[]]);
    }
}

RCT_EXPORT_METHOD(stopMusic: (RCTResponseSenderBlock)callback) {
    if (musicPlayer != nil) {
        callback(@[[NSNumber numberWithInteger:0], @[]]);
        [musicPlayer stop];
    } else {
        callback(@[[NSNumber numberWithInteger:1], @[]]);
    }
}

RCT_EXPORT_METHOD(pauseMusic: (RCTResponseSenderBlock)callback) {
    if (musicPlayer != nil) {
        callback(@[[NSNumber numberWithInteger:0], @[]]);
        [musicPlayer pause];
    } else {
        callback(@[[NSNumber numberWithInteger:1], @[]]);
    }
}

RCT_EXPORT_METHOD(isPlaying: (RCTResponseSenderBlock)callback) {
    if (musicPlayer != nil) {
        if ([musicPlayer playbackState] == MPMusicPlaybackStatePlaying) {
            callback(@[[NSNumber numberWithInteger:0], @[]]);
        } else {
            callback(@[[NSNumber numberWithInteger:1], @[]]);
        }
    } else {
        callback(@[[NSNumber numberWithInteger:1], @[]]);
    }
}


//////////////////////////////////////////////////////////////////////
// Delegate Methods

- (void)mediaPickerDidCancel:(MPMediaPickerController *)mediaPicker {
    [mediaPicker dismissViewControllerAnimated:true completion:^{
        savedCallback(@[[NSNumber numberWithInt:1], @[]]);
    }];
}

- (void)mediaPicker:(MPMediaPickerController *)mediaPicker didPickMediaItems:(MPMediaItemCollection *)mediaItemCollection {
    // saving collection as NSData, then to NSUserDefaults
    NSData *data = [NSKeyedArchiver archivedDataWithRootObject:mediaItemCollection];
    [[NSUserDefaults standardUserDefaults] setObject:data forKey:@"mediaItemCollection"];
    
    // Creating metadata
    NSArray *metadata = [self createMetadataFor:mediaItemCollection];
    
    // Callback
    [mediaPicker dismissViewControllerAnimated:true completion:^{
        savedCallback(@[[NSNumber numberWithInt:0], metadata]);
    }];
}

//////////////////////////////////////////////////////////////
// Helper Methods

- (NSArray *) createMetadataFor : (MPMediaItemCollection *) mediaItemCollection {
    NSMutableArray *metadata = [[NSMutableArray alloc] init];
    for (int i = 0; i < mediaItemCollection.items.count; i++) {
        MPMediaItem *item = mediaItemCollection.items[i];
        [metadata addObject:@{
                              @"artist" : item.artist,
                              @"title" : item.title,
                              @"albumTitle" : item.albumTitle,
                              @"playbackDuration" : @(item.playbackDuration)
                              }];
    }
    return metadata;
}

@end

