import ExpoModulesCore
import WatchConnectivity

public class WatchConnectivityModule: Module {
  private let sessionDelegate = SessionDelegate()

  public func definition() -> ModuleDefinition {
    Name("WatchConnectivity")

    OnCreate {
      self.sessionDelegate.activate()
    }

    AsyncFunction("sendWorkoutStarted") { (promise: Promise) in
      self.sessionDelegate.sendWorkoutStarted()
      promise.resolve(nil)
    }
  }
}

private class SessionDelegate: NSObject, WCSessionDelegate {
  private var session: WCSession?

  func activate() {
    guard WCSession.isSupported() else { return }
    session = WCSession.default
    session?.delegate = self
    session?.activate()
  }

  func sendWorkoutStarted() {
    guard let session, session.activationState == .activated else { return }

    let payload: [String: Any] = ["type": "workoutStarted"]

    if session.isReachable {
      session.sendMessage(payload, replyHandler: nil) { [weak self] _ in
        try? self?.session?.updateApplicationContext(payload)
      }
    } else {
      try? session.updateApplicationContext(payload)
    }
  }

  func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}
  func sessionDidBecomeInactive(_ session: WCSession) {}
  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }
}
