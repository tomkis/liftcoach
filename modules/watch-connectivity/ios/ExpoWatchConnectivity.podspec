require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoWatchConnectivity'
  s.version        = package['version']
  s.summary        = 'Watch Connectivity bridge for Expo'
  s.homepage       = 'https://github.com/tomkis/liftcoach'
  s.license        = 'MIT'
  s.author         = 'tomkis'
  s.source         = { git: '' }
  s.platforms      = { ios: '15.1' }
  s.swift_version  = '5.0'

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'WatchConnectivity'

  s.source_files = '**/*.swift'
end
