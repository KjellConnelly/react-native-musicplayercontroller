
Pod::Spec.new do |s|
  s.name         = "RNReactNativeMusicplayercontroller"
  s.version      = "1.0.3"
  s.summary      = "RNReactNativeMusicplayercontroller"
  s.description  = <<-DESC
                  Class to modally display MPMediaPickerViewController and play music from a user's device using MPMusicPlayerController (iOS), and its Android/Web equivilents
                   DESC
  s.homepage     = "https://github.com/KjellConnelly/react-native-musicplayercontroller.git"
  s.license      = "MIT"
  s.author             = { "Kjell Connelly" => "kjellapps@gmail.com" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/KjellConnelly/react-native-musicplayercontroller.git", :tag => "v#{s.version}" }
  s.source_files  = "RNReactNativeMusicplayercontroller/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end
