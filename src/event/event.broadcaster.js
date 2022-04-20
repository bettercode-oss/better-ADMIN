import {v4 as uuidv4} from 'uuid';

const topics = {}

export const SHOW_LOADING_EVENT_TOPIC = "SHOW_LOADING";
export const MEMBER_CONTEXT_AVAILABLE_EVENT_TOPIC = "MEMBER_CONTEXT_AVAILABLE";
export const SHOW_ERROR_MESSAGE_EVENT_TOPIC = "SHOW_ERROR_MESSAGE";
export const SHOW_WEB_HOOK_MESSAGE_EVENT_TOPIC = "SHOW_WEB_HOOK_MESSAGE";
export const INVALID_ACCESS_TOKEN_TOPIC = "INVALID_ACCESS_TOKEN";

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

