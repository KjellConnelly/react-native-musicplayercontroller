//
//  RNReactNativeMusicplayercontroller.h
//
//  Created by Kjell Connelly on 2/20/17.
//  Copyright © 2017 POP POP LLC. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <MediaPlayer/MediaPlayer.h>
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

@interface RNReactNativeMusicplayercontroller : NSObject <RCTBridgeModule, MPMediaPickerControllerDelegate>

@end

