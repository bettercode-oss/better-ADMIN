import {v4 as uuidv4} from 'uuid';

const topics = {}
export class EventBroadcaster {
  static broadcast = (topic, args) => {
    if (!topics[topic]) return;
    Object.values(topics[topic]).forEach(fn => {
      if (fn) fn(args)
    });
  }

  static on = (topic, fn) => {
    if (!topics[topic]) topics[topic] = {};
    const id = uuidv4();
    topics[topic][id] = fn;
    return () => {
      topics[topic][id] = null;
      delete topics[topic][id];
    }
  }
}

