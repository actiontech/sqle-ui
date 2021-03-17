import EmitterKey from '../data/EmitterKey';

type EmitterFunction = Function & {
  event_emitter_once?: boolean;
};

class EventEmitter {
  private readonly events = new Map<EmitterKey, EmitterFunction[]>();

  public subscribe(eventKey: EmitterKey, callback: EmitterFunction) {
    const tempEvents = this.events.get(eventKey) ?? [];
    tempEvents.push(callback);
    this.events.set(eventKey, tempEvents);
  }

  public unsubscribe(eventKey: EmitterKey, callback: EmitterFunction) {
    if (!this.events.has(eventKey)) {
      return;
    }
    let tempEvents = this.events.get(eventKey) || [];
    tempEvents = tempEvents.filter((e) => e !== callback);
    this.events.set(eventKey, tempEvents);
  }

  public once(eventKey: EmitterKey, callback: EmitterFunction) {
    callback.event_emitter_once = true;
    this.subscribe(eventKey, callback);
  }

  public emit<T = any>(eventKey: EmitterKey, ...args: T[]) {
    if (!this.events.has(eventKey)) {
      return;
    }
    let tempEvents = this.events.get(eventKey) ?? [];
    const shouldDeleteCallback: EmitterFunction[] = [];
    for (const c of tempEvents) {
      if (c.event_emitter_once) {
        shouldDeleteCallback.push(c);
      }
      c(...args);
    }
    tempEvents = tempEvents.filter((e) => !shouldDeleteCallback.includes(e));
    this.events.set(eventKey, tempEvents);
  }
}

export default new EventEmitter();
