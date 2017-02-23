
Pod::Spec.new do |s|
  s.name         = "RNReactNativeMusicplayercontroller"
  s.version      = "1.0.0"
  s.summary      = "RNReactNativeMusicplayercontroller"
  s.description  = <<-DESC
                  RNReactNativeMusicplayercontroller
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  s.author             = { "Kjell Connelly" => "kjellapps@gmail.com" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/KjellConnelly/react-native-musicplayercontroller.git", :tag => "master" }
  s.source_files  = "RNReactNativeMusicplayercontroller/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end
