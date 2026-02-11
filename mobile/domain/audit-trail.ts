export class AuditTrail {
  private readonly events: unknown[] = []

  public dispatch(event: unknown) {
    this.events.push(event)
  }

  getTrail() {
    return this.events
  }
}
