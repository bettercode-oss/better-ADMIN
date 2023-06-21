import DefaultForm from "@/components/shared/form/ui/default-form";
import FormGroup from "@/components/shared/form/ui/form-group";
import FormSection from "@/components/shared/form/ui/form-section";
import {Alert, Button, Divider, Form, Input, message, Radio, Skeleton} from "antd";
import {useForm} from "antd/lib/form/Form";
import React, {useEffect, useState} from "react";
import {IDooraySetting, updateDooraySetting, useDooraySetting} from "@/client/settings/login-settings";

const DooraySettingsForm = () => {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [setting, setSetting] = useState<any>();

  const [messageApi, contextHolder] = message.useMessage();
  const {data, error, isLoading: isSettingLoading} = useDooraySetting();

  useEffect(() => {
    setSetting(data);
    form.setFieldsValue({
      used: data?.used,
      domain: data?.domain,
      authorizationToken: data?.authorizationToken,
    });
  }, [data, form])

  if (error) {
    return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="warning" className="my-5"/>;
  }

  if (isSettingLoading) {
    return <Skeleton className="my-5"/>;
  }

  const handleFinish = async (formValue: IDooraySetting) => {
    try {
      setIsLoading(true);
      await updateDooraySetting(formValue);
      messageApi.success("저장 되었습니다");
    } catch (error) {
      messageApi.error("에러가 발생했습니다");
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleChangeUsed = () => {
    setSetting({...setting, used: !setting.used});
  }

  return (
    <>
      {contextHolder}
      <DefaultForm<IDooraySetting> form={form} onFinish={handleFinish}>
        <FormSection title="두레이 설정" description="두레이 아이디/비밀번호로 사이트에 로그인할 수 있도록 설정합니다.">
          <FormGroup title="사용여부*">
            <Form.Item colon={false} name="used">
              <Radio.Group onChange={handleChangeUsed}>
                <Radio value={true}>사용함</Radio>
                <Radio value={false}>사용 안 함</Radio>
              </Radio.Group>
            </Form.Item>
          </FormGroup>
          {setting?.used &&
            <>
              <Divider/>
              <FormGroup title="Dooray 도메인*">
                <Form.Item
                  colon={false}
                  name="domain"
                  rules={[
                    {
                      required: true,
                      message: '두레이 도메인을 입력해 주세요.',
                    },
                  ]}
                >
                  <Input/>
                </Form.Item>
              </FormGroup>
              <Divider/>
              <FormGroup title="Dooray API 인증 토큰*">
                <Form.Item
                  colon={false}
                  name="authorizationToken"
                  rules={[
                    {
                      required: true,
                      message: '두레이 API 토큰을 입력해 주세요.',
                    },
                  ]}
                >
                  <Input/>
                </Form.Item>
              </FormGroup>
            </>}
        </FormSection>
        <div className="text-center">
          <Button htmlType="submit" type="primary" loading={isLoading}>
            저장
          </Button>
        </div>
      </DefaultForm>
    </>
  );
};

export default React.memo(DooraySettingsForm);
