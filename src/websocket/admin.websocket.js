import {adminConfig} from "../config/admin.config";
import {EventBroadcaster, SHOW_WEB_HOOK_MESSAGE_EVENT_TOPIC} from "../event/event.broadcaster";

class AdminWebsocket {
  init(memberId) {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connect(memberId);
    }
  }

  connect(memberId) {
    let uri = 'ws:';
    if (adminConfig.authentication.authAPI().startsWith('https')) {
      uri = 'wss:';
    }
    this.ws = new WebSocket(`${uri}${adminConfig.webSocketUrl()}/${memberId}`)

    this.ws.onopen = function () {
      console.log('websocket Connected');
    }

    this.ws.onmessage = (evt) => {
      if (evt.data === "ping") {
        return;
      }

      const msg = JSON.parse(evt.data);
      EventBroadcaster.broadcast(SHOW_WEB_HOOK_MESSAGE_EVENT_TOPIC, msg);
    }
  }
}

const instance = new AdminWebsocket()
export {instance as AdminWebSocket}
