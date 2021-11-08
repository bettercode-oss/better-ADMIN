import {CHANGE_MEMBER_CONTEXT_EVENT_TOPIC, EventBroadcaster} from "../event/event.broadcaster";

class MemberContext {
  constructor() {
    this._memberInformation = {
      id: "",
      type: "",
      typeName: "",
      name: "",
      roles: [],
      permissions: [],
      picture: "",
    };

    this._available = false;
  }

  set memberInformation(memberInformation) {
    this._memberInformation = memberInformation;
    EventBroadcaster.broadcast(CHANGE_MEMBER_CONTEXT_EVENT_TOPIC, memberInformation);
  }

  get memberInformation() {
    return this._memberInformation;
  }

  get available() {
    return this._available;
  }

  hasPermission(permission) {
    const memberPermissions = new Set( this.memberInformation().permissions ? this.memberInformation().permissions : []);
    return memberPermissions.has(permission);
  }
}

const instance = new MemberContext()
export {instance as MemberContext}
