import React, {useEffect, useState} from "react";
import {Descriptions, Divider, PageHeader} from 'antd';
import {WebHookService} from "./webhook.service";

const WebHookDetails = ({selectedWebHook, onBack}) => {
  const [webHookDetails, setWebHookDetails] = useState(null);

  useEffect(() => {
    WebHookService.getWebHook(selectedWebHook.id).then(response => {
      setWebHookDetails(response.data);
    });
  }, [selectedWebHook]);

  return (
    <>
      <PageHeader
        title="웹훅(WebHook) 호출 예시"
        subTitle={`${selectedWebHook.name}`}
        onBack={onBack}
      >
        {webHookDetails &&
          <>
            <Descriptions title="URL" bordered>
              <Descriptions.Item label="HTTP Method" span={3}>{webHookDetails.webHookCallSpec.httpRequestMethod}</Descriptions.Item>
              <Descriptions.Item label="Request URL" span={3}>{webHookDetails.webHookCallSpec.url}</Descriptions.Item>
              <Descriptions.Item label="Access Token" span={3}>{webHookDetails.webHookCallSpec.accessToken}</Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="Sample Request" bordered>
              <Descriptions.Item span={3}>{webHookDetails.webHookCallSpec.sampleRequest}</Descriptions.Item>
            </Descriptions>
          </>
        }
      </PageHeader>
    </>
  )
};
export default WebHookDetails;
