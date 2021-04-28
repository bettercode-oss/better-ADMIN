import {EventBroadcaster, SHOW_LOADING_EVENT_TOPIC} from "../event/event.broadcaster";

export function showLoading() {
  EventBroadcaster.broadcast(SHOW_LOADING_EVENT_TOPIC, {show: true})
}

export function hideLoading() {
  EventBroadcaster.broadcast(SHOW_LOADING_EVENT_TOPIC, {show: false})
}
