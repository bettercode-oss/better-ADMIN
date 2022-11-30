import React, {useEffect, useState} from "react";
import {Spin} from "antd";
import {EventBroadcaster, SHOW_LOADING_EVENT_TOPIC} from "../../../event/event.broadcaster";

const AutoBackdrop = ({children}) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    EventBroadcaster.on(SHOW_LOADING_EVENT_TOPIC, (data) => {
      setShowLoading(data.show);
    });
  }, []);
  return (
    <>
      <Spin spinning={showLoading}>
        {children}
      </Spin>
    </>
  );
}

export default AutoBackdrop;