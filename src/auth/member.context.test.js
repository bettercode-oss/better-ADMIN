import { MemberContext } from './member.context';
import { EventBroadcaster, MEMBER_CONTEXT_AVAILABLE_EVENT_TOPIC } from '../event/event.broadcaster';

jest.mock('../event/event.broadcaster');

describe('hasPermission', () => {
  test('permission 이 null 인 경우', () => {
    // given
    MemberContext.memberInformation.permissions = ['MANAGE_MEMBERS', 'MANAGE_ORGANIZATION'];
    const permission = null;

    // when
    const actual = MemberContext.hasPermission(permission);

    // then
    const expected = false;
    expect(actual).toEqual(expected);
  });

  test('permission 값이 있는 경우', () => {
    // given
    MemberContext.memberInformation.permissions = ['MANAGE_MEMBERS', 'MANAGE_ORGANIZATION'];
    const permission = 'MANAGE_MEMBERS';

    // when
    const actual = MemberContext.hasPermission(permission);

    // then
    const expected = true;
    expect(actual).toEqual(expected);
  });

  test('permission 값이 다른 경우', () => {
    // given
    MemberContext.memberInformation.permissions = ['MANAGE_MEMBERS', 'MANAGE_ORGANIZATION'];
    const permission = 'TEST_PERMISSION';

    // when
    const actual = MemberContext.hasPermission(permission);

    // then
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe('set memberInformation', () => {
  test('memberInformation 값이 있는 경우', () => {
    // given
    MemberContext.memberInformation = {
      id: 'TEST_ID',
      type: 'TEST_TYPE',
      typeName: 'TEST_TYPE_NAME',
      name: 'TEST_NAME',
      roles: ['TEST_ROLE'],
      permissions: ['TEST_PERMISSION'],
      picture: 'TEST_PICTURE',
    };

    // when
    const actual = MemberContext.available;
    const event = { msg: actual };
    EventBroadcaster.broadcast(MEMBER_CONTEXT_AVAILABLE_EVENT_TOPIC, event);

    // then
    const expected = true;
    expect(actual).toEqual(expected);
    expect(EventBroadcaster.broadcast).toBeCalledTimes(2);
    expect(EventBroadcaster.broadcast).toBeCalledWith(MEMBER_CONTEXT_AVAILABLE_EVENT_TOPIC, { msg: expected });
  });

  test('memberInformation 값이 없는 경우', () => {
    // given
    MemberContext.memberInformation = null;

    // when
    const actual = MemberContext.available;

    // then
    const expected = false;
    expect(actual).toEqual(expected);
  });
});
