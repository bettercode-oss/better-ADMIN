import React, {useState} from "react";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {AuthService} from "../../../auth/auth.service";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../../event/event.broadcaster";
import {adminConfig} from "../../../config/admin.config";
import {SimpleModal} from "../../atoms/modal";
import {Form} from "../../atoms/form";
import {FormItem} from "../../atoms/form/form-item";
import {TextInput} from "../../atoms/text-input";
import {Button} from "../../atoms/button";
import {message} from "antd";

const DoorayLogin = ({show, onLoginSuccess, onClose}) => {
  const [loading, setLoading] = useState(false);
  const loginWithDooray = (values) => {
    const signId = values.id;
    const password = values.password;

    setLoading(true);
    AuthService.loginWithDooray(signId, password).then(() => {
      onLoginSuccess();
    }).catch(error => {
      if (error.response && error.response.status === 400) {
        message.warn("아이디 혹은 비밀번호를 확인해 주세요.")
      } else {
        EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <SimpleModal title="두레이 로그인" footer={null} open={show} onCancel={onClose} width={400}>
        <Form
          onFinish={loginWithDooray}
        >
          <FormItem
            name="id"
            rules={[
              {
                required: true,
                message: '아이디를 입력해 주세요.',
              },
            ]}
          >
            <TextInput prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="아이디"/>
          </FormItem>
          <FormItem
            name="password"
            rules={[
              {
                required: true,
                message: '비밀번호를 입력해 주세요.',
              },
            ]}
          >
            <TextInput
              prefix={<LockOutlined className="site-form-item-icon"/>}
              type="password"
              placeholder="비밀번호"
            />
          </FormItem>
          <FormItem>
            <Button label="로그인" type="primary" htmlType="submit" loading={loading}/>
          </FormItem>
        </Form>
      </SimpleModal>
    </>
  )
}
export default DoorayLogin;
