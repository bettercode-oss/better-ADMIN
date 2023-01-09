import {EventBroadcaster} from "./event.broadcaster";
import {v4 as uuidv4} from 'uuid';

describe('broadcast', () => {
  test('구독자가 한 명인 경우', () => {
    // given
    const topic = "test-topic";
    const event = {msg : "테스트 입니다."}

    EventBroadcaster.topics()[topic] = {}
    EventBroadcaster.topics()[topic][uuidv4()] = (e) => {
      // then
      expect(e).toEqual({msg : "테스트 입니다."});
    }

    // when
    EventBroadcaster.broadcast(topic, event)
  });

  test('구독자가 여러 명인 경우', () => {
    // given
    const topic = "test-topic";
    const event = {msg : "테스트 입니다."}

    EventBroadcaster.topics()[topic] = {}
    EventBroadcaster.topics()[topic][uuidv4()] = (e) => {
      // then
      expect(e).toEqual({msg : "테스트 입니다."});
    }
    EventBroadcaster.topics()[topic][uuidv4()] = (e) => {
      // then
      expect(e).toEqual({msg : "테스트 입니다."});
    }

    // when
    EventBroadcaster.broadcast(topic, event)
  });
});

describe('on', () => {
  test('구독자가 한 명인 경우', () => {
    // given
    const topic = "test-topic";

    EventBroadcaster.on(topic, (e) => {
      // then
      expect(e).toEqual({msg : "테스트 입니다."});
    })

    // when
    Object.values(EventBroadcaster.topics()[topic]).forEach(fn => {
      if (fn) fn({msg : "테스트 입니다."})
    });
  });

  test('구독자가 여러명인 경우', () => {
    // given
    const topic = "test-topic";

    EventBroadcaster.on(topic, (e) => {
      // then
      expect(e).toEqual({msg : "테스트 입니다."});
    })

    EventBroadcaster.on(topic, (e) => {
      // then
      expect(e).toEqual({msg : "테스트 입니다."});
    })

    // when
    Object.values(EventBroadcaster.topics()[topic]).forEach(fn => {
      if (fn) fn({msg : "테스트 입니다."})
    });
  });

});