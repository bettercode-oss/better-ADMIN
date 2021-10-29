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

  hasPermission(permission) {
    const memberPermissions = new Set( this.memberInformation().permissions ? this.memberInformation().permissions : []);
    return memberPermissions.has(permission);
  }
}

const instance = new MemberContext()
export {instance as MemberContext}
