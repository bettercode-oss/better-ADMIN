import React, {useEffect, useState} from "react";
import {Button, Form, InputNumber, message, PageHeader} from "antd";
import SiteService from "../site.service";
import {FormItemLayout, FormTailItemLayout} from "../AppSettings";

const SETTING_KEY = "member-access-logs";

const MemberAccessLogSetting = () => {
  const [form] = Form.useForm();
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    SiteService.getSetting(SETTING_KEY).then(response => {
      setSetting(response.data);
      form.setFieldsValue({
        retentionDays: response.data.retentionDays,
      });
    });
  }, [form]);

  const saveSetting = (values) => {
    // FIXME Number 로 받아야 함...
    const newSetting = {
      retentionDays: values.retentionDays,
    }

    setLoading(true);
    SiteService.saveSetting(SETTING_KEY, newSetting).then(() => {
      message.success("저장 되었습니다.");
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <PageHeader
        title="멤버 접근 로그 설정"
        subTitle="멤버 접근 로그를 설정합니다."
      >
        {setting &&
          <Form {...FormItemLayout} form={form} onFinish={saveSetting}>
            <Form.Item
              colon={false}
              name="retentionDays"
              label="로그 보관 일수"
              rules={[
                {
                  required: true,
                  message: '로그 보관 일수를 입력해 주세요.',
                },
              ]}
            >
              <InputNumber/>
            </Form.Item>
            <Form.Item {...FormTailItemLayout}>
              <Button type="primary" loading={loading} htmlType="submit">
                저장
              </Button>
            </Form.Item>
          </Form>}
      </PageHeader>
    </>
  )
};
export default MemberAccessLogSetting;
