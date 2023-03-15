import React, {useEffect, useState} from "react";
import {Button, Form, Input, message} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import WebHookService from "../../../../services/webhook.service";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {FormItemLayout, FormTailItemLayout} from "../../../modules/layout/from-item";

let editWebHookId = null;
const NotificationWebHookForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  let params = useParams();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (params.webhookId) {
      setEditMode(true);
      WebHookService.getWebHook(params.webhookId).then((res) => {
        const webhook = res.data;
        editWebHookId = webhook.id;
        form.setFieldsValue({
          name: webhook.name,
          description: webhook.description,
        });
      });
    }
  }, [params, form]);

  const save = (values) => {
    const webHook = {
      name: values.name,
      description: values.description,
    };

    setLoading(true);
    if (editMode) {
      WebHookService.updateWebHook(editWebHookId, webHook).then(handleSuccess).finally(() => {
        setLoading(false);
      });
    } else {
      WebHookService.createWebHook(webHook).then(handleSuccess).finally(() => {
        setLoading(false);
      });
    }
  }

  const handleSuccess = () => {
    message.success("저장 되었습니다.");
  }

  const handleBack = () => {
    if(searchParams.get('backUrl')) {
      navigate(searchParams.get('backUrl'));
    } else {
      navigate(-1);
    }
  }

  return (
    <>
      <PageHeader
        title={editMode ? "알림 웹훅 수정" : "알림 웹훅 생성"}
        subTitle={editMode ? "알림 웹훅을 수정합니다." : "알림 웹훅을 생성합니다."}
        onBack={handleBack}
      >
        <Form {...FormItemLayout} form={form} onFinish={save}>
          <Form.Item
            name="name"
            label="웹훅 이름"
            rules={[{
              required: true,
              message: '웹훅 이름을 입력해 주세요.',
            }]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="description"
            label="웹훅 설명"
          >
            <Input/>
          </Form.Item>
          <Form.Item {...FormTailItemLayout}>
            <Button type="primary" loading={loading} htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>
      </PageHeader>
    </>
  )
};
export default NotificationWebHookForm;
