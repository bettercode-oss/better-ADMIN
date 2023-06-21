import {Descriptions, Divider} from "antd";
import React from "react";
import {IWebHookCallSpec} from "@/client/settings/webhook-settings";

interface IWebHookSpecProps {
  initialValues: Partial<IWebHookCallSpec>;
}

const NotificationWebHookSpec = ({initialValues}: IWebHookSpecProps) => {
  return (
    <>
      <Descriptions title="URL" bordered>
        <Descriptions.Item label="HTTP Method"
                           span={3}>{initialValues.httpRequestMethod}</Descriptions.Item>
        <Descriptions.Item label="Request URL" span={3}>{initialValues.url}</Descriptions.Item>
        <Descriptions.Item label="Access Token"
                           span={3}>{initialValues.accessToken}</Descriptions.Item>
      </Descriptions>
      <Divider/>
      <Descriptions title="Sample Request" bordered>
        <Descriptions.Item span={3}>{initialValues.sampleRequest}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default React.memo(NotificationWebHookSpec);