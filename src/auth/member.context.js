class MemberContext {
  constructor() {
    this._memberInformation = {};
  }

  set memberInformation(memberInformation) {
    this._memberInformation = memberInformation;
  }

  get memberInformation() {
    return this._memberInformation;
  }
}

const instance = new MemberContext()
export {instance as MemberContext}
