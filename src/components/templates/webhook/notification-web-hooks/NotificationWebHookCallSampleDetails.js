import React, {useEffect, useState} from "react";
import {Descriptions, Divider} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import WebHookService from "../../../../services/webhook.service";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";

const NotificationWebHookCallSampleDetails = () => {
  const navigate = useNavigate();
  let params = useParams();
  const [searchParams] = useSearchParams();

  const [webHookDetails, setWebHookDetails] = useState(null);

  useEffect(() => {
    if (params.webhookId) {
      WebHookService.getWebHook(params.webhookId).then(response => {
        setWebHookDetails(response.data);
      });
    }
  }, [params]);

  const handleBack = () => {
    if(searchParams.get('backUrl')) {
      navigate(searchParams.get('backUrl'));
    } else {
      navigate(-1);
    }
  }

  return (
    <>
      {webHookDetails &&
        <PageHeader
          title="알림 웹훅 호출 예시"
          subTitle={`${webHookDetails.name}`}
          onBack={handleBack}
        >
          <Descriptions title="URL" bordered>
            <Descriptions.Item label="HTTP Method"
                               span={3}>{webHookDetails.webHookCallSpec.httpRequestMethod}</Descriptions.Item>
            <Descriptions.Item label="Request URL" span={3}>{webHookDetails.webHookCallSpec.url}</Descriptions.Item>
            <Descriptions.Item label="Access Token"
                               span={3}>{webHookDetails.webHookCallSpec.accessToken}</Descriptions.Item>
          </Descriptions>
          <Divider/>
          <Descriptions title="Sample Request" bordered>
            <Descriptions.Item span={3}>{webHookDetails.webHookCallSpec.sampleRequest}</Descriptions.Item>
          </Descriptions>
        </PageHeader>
        }
    </>
  )
};
export default NotificationWebHookCallSampleDetails;
