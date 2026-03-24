import SwiftUI

@main
struct LiftCoachWatchApp: App {
    @StateObject private var connectivity = WatchConnectivityService()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(connectivity)
        }
    }
}
