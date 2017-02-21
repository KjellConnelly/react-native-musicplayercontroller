//
//  RCTMusicPlayer.m
//  ReactNativeWeb
//
//  Created by Kjell Connelly on 2/20/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RNMusicPlayerController.h"

@implementation RNMusicPlayerController

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(present: (RCTResponseSenderBlock)callback) {
  #if TARGET_IPHONE_SIMULATOR
    callback(@[@FALSE, @"Cannot use MediaPlayer on Simulator. Try a real device."]);
  #else
    dispatch_async(dispatch_get_main_queue(), ^{
      UIWindow *keyWindow = [[UIApplication sharedApplication] keyWindow];
      UIViewController *rootViewController = keyWindow.rootViewController;
      MPMusicPlayerController *player = [MPMusicPlayerController applicationMusicPlayer];
      [rootViewController presentViewController:player animated:TRUE completion:^{
        //callback(@[@TRUE, @"success!"]);
      }];
    });
    
    callback(@[@TRUE, @"success!"]);
  #endif
}

RCT_EXPORT_METHOD(test: (RCTResponseSenderBlock)callback) {
  callback(@[@"React Native Module Test Successful!"]);
}

@end
