import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader, Radio} from "antd";
import SiteService from "../site.service";

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 12},
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 10,
      offset: 7,
    }
  },
};

const SETTING_KEY = "google-workspace-login";

const GoogleWorkspaceSetting = () => {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SiteService.getSetting(SETTING_KEY).then(response => {
      setSetting(response.data);
      form.setFieldsValue({
        used: response.data.used ? true : false,
        domain: response.data.domain,
        clientId: response.data.clientId,
        clientSecret: response.data.clientSecret,
        redirectUri: response.data.redirectUri,
      });
    });
  }, [form]);

  const saveSetting = (values) => {
    const newSetting = {
      used: values.used,
      domain: values.domain,
      clientId: values.clientId,
      clientSecret: values.clientSecret,
      redirectUri: values.redirectUri,
    }

    setLoading(true);
    SiteService.saveSetting(SETTING_KEY, newSetting).then(() => {
      message.success("저장 되었습니다.");
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleChangeUsed = () => {
    setSetting({...setting, used: !setting.used});
  }

  return (
    <>
      <PageHeader
        title="구글 워크스페이스(Workspace) 로그인"
        subTitle="구글 워크스페이스 계정으로 로그인할 수 있도록 설정합니다."
      >
        {setting &&
        <Form {...formItemLayout} form={form} onFinish={saveSetting}>
          <Form.Item colon={false} label="구글 워크스페이스 로그인" name="used">
            <Radio.Group onChange={handleChangeUsed}>
              <Radio value={true}>사용함</Radio>
              <Radio value={false}>사용 안 함</Radio>
            </Radio.Group>
          </Form.Item>
          {setting.used &&
          <>
            <Form.Item
              colon={false}
              name="domain"
              label="구글 워크스페이스 도메인"
              rules={[
                {
                  required: true,
                  message: '구글 워크스페이스 도메인을 입력해 주세요.',
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              colon={false}
              name="clientId"
              label="client_id"
              rules={[
                {
                  required: true,
                  message: 'client_id 를 입력해 주세요.',
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              colon={false}
              name="clientSecret"
              label="client_secret"
              rules={[
                {
                  required: true,
                  message: 'client_secret 를 입력해 주세요.',
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              colon={false}
              name="redirectUri"
              label="redirect_uri"
              rules={[
                {
                  required: true,
                  message: 'redirect_uri 을 입력해 주세요.',
                },
              ]}
            >
              <Input/>
            </Form.Item>
          </>}
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" loading={loading} htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>}
      </PageHeader>
    </>
  )
};
export default GoogleWorkspaceSetting;
