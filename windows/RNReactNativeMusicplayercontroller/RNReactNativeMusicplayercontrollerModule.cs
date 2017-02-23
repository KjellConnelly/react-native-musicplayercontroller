using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Com.Reactlibrary.RNReactNativeMusicplayercontroller
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNReactNativeMusicplayercontrollerModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNReactNativeMusicplayercontrollerModule"/>.
        /// </summary>
        internal RNReactNativeMusicplayercontrollerModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNReactNativeMusicplayercontroller";
            }
        }
    }
}
