import React, {useState} from "react";
import {Form as AntForm, message} from "antd";
import {FormOutlined, LockOutlined, UserOutlined} from "@ant-design/icons";
import {MemberService} from "../../../services/member.service";
import {adminConfig} from "../../../config/admin.config";
import {Form} from "../../atoms/form";
import {FormItem} from "../../atoms/form/form-item";
import {TextInput} from "../../atoms/text-input";
import {Button} from "../../atoms/button";
import {EventBroadcaster, SHOW_ERROR_MESSAGE_EVENT_TOPIC} from "../../../event/event.broadcaster";
import {SimpleModal} from "../../atoms/modal";

const MemberSignUp = ({show, onClose}) => {
  const [form] = AntForm.useForm()
  const [loading, setLoading] = useState(false);

  const signUp = (values) => {
    const signUpMember = {
      signId: values.id,
      name: values.name,
      password: values.password,
    }

    setLoading(true);
    MemberService.signUpMember(signUpMember).then(() => {
      setLoading(false);
      message.success("신청되었습니다.");
    }).catch(error => {
      if (error.response && error.response.status === 400 && error.response.data === "duplicated") {
        message.warn("이미 존재하는 아이디입니다.")
      } else {
        EventBroadcaster.broadcast(SHOW_ERROR_MESSAGE_EVENT_TOPIC, adminConfig.errorMessage.serverInternalError);
      }
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleAfterClose = () => {
    form.resetFields();
  }

  return (
    <SimpleModal title="계정 신청" open={show} onCancel={onClose} width={400} onAfterClose={handleAfterClose}>
      <Form
        form={form}
        onFinish={signUp}
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
          <TextInput prefix={<UserOutlined/>} placeholder="아이디"/>
        </FormItem>
        <FormItem
          name="name"
          rules={[
            {
              required: true,
              message: '이름을 입력해 주세요.',
            },
          ]}
        >
          <TextInput prefix={<FormOutlined/>} placeholder="이름"/>
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
          <TextInput type="password" prefix={<LockOutlined/>} placeholder="비밀번호"/>
        </FormItem>
        <FormItem
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '비밀번호를 다시 한번 입력해 주세요.',
            },
            ({getFieldValue}) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('입력한 비밀번호와 다릅니다. 동일하게 입력해주세요.');
              },
            }),
          ]}
        >
          <TextInput type="password" prefix={<LockOutlined/>} placeholder="비밀번호 확인"/>
        </FormItem>
        <FormItem>
          <Button label="계정 신청" type="primary" htmlType="submit" loading={loading}/>
        </FormItem>
      </Form>
    </SimpleModal>
  )
}
export default MemberSignUp;
