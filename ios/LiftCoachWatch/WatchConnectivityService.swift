import Foundation
import WatchConnectivity

class WatchConnectivityService: NSObject, ObservableObject, WCSessionDelegate {
  @Published var isWorkoutActive = false

  override init() {
    super.init()
    if WCSession.isSupported() {
      let session = WCSession.default
      session.delegate = self
      session.activate()
    }
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}

  func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    handlePayload(message)
  }

  func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
    handlePayload(applicationContext)
  }

  private func handlePayload(_ payload: [String: Any]) {
    guard let type = payload["type"] as? String, type == "workoutStarted" else { return }
    DispatchQueue.main.async {
      self.isWorkoutActive = true
    }
  }
}
