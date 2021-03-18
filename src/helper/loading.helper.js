import {EventBroadcaster} from "../event/event.broadcaster";

const LOADING_EVENT_TOPIC_NAME = "SHOW_LOADING";

export function showLoading() {
  EventBroadcaster.broadcast(LOADING_EVENT_TOPIC_NAME, {show: true})
}

export function hideLoading() {
  EventBroadcaster.broadcast(LOADING_EVENT_TOPIC_NAME, {show: false})
}
