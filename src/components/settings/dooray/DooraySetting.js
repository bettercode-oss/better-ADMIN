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

const SETTING_KEY = "dooray-login";

const DooraySetting = () => {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SiteService.getSetting(SETTING_KEY).then(response => {
      setSetting(response.data);
      form.setFieldsValue({
        used: response.data.used ? true : false,
        domain: response.data.domain,
        authorizationToken: response.data.authorizationToken,
      });
    });
  }, [form]);

  const saveSetting = (values) => {
    const newSetting = {
      used: values.used,
      domain: values.domain ? values.domain : "",
      authorizationToken: values.authorizationToken ? values.authorizationToken : ""
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
        title="두레이(Dooray) 로그인"
        subTitle="두레이 아이디/비밀번호로 사이트에 로그인할 수 있도록 설정합니다."
      >
        {setting &&
        <Form {...formItemLayout} form={form} onFinish={saveSetting}>
          <Form.Item colon={false} label="Dooray 로그인" name="used">
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
              label="Dooray 도메인"
              rules={[
                {
                  required: true,
                  message: '두레이 도메인을 입력해 주세요.',
                },
              ]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              colon={false}
              name="authorizationToken"
              label="Dooray API 인증 토큰"
              rules={[
                {
                  required: true,
                  message: '두레이 API 토큰을 입력해 주세요.',
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
export default DooraySetting;
