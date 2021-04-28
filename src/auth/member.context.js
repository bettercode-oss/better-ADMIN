import {
  CHANGE_MEMBER_CONTEXT_EVENT_TOPIC,
  EventBroadcaster
} from "../event/event.broadcaster";

class MemberContext {
  constructor() {
    this._memberInformation = {};
  }

  set memberInformation(memberInformation) {
    this._memberInformation = memberInformation;
    EventBroadcaster.broadcast(CHANGE_MEMBER_CONTEXT_EVENT_TOPIC, memberInformation)
  }

  get memberInformation() {
    return this._memberInformation;
  }
}

const instance = new MemberContext()
export {instance as MemberContext}
