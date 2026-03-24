import SwiftUI

struct ContentView: View {
    @EnvironmentObject var connectivity: WatchConnectivityService

    var body: some View {
        VStack(spacing: 8) {
            if connectivity.isWorkoutActive {
                Image(systemName: "figure.strengthtraining.functional")
                    .font(.system(size: 40))
                    .foregroundColor(.green)
                Text("Workout Active")
                    .font(.headline)
            } else {
                Image(systemName: "dumbbell.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.blue)
                Text("LiftCoach")
                    .font(.headline)
            }
        }
    }
}
