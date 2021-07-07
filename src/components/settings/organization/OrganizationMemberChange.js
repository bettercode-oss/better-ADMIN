import React, {useEffect, useState} from "react";
import {Button, Checkbox, Form, PageHeader, Row, message} from 'antd';
import {MemberService} from "../member/member.service";
import {OrganizationService} from "./organization.service";

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

const OrganizationMemberChange = ({organization, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    MemberService.getMembers({page: 0}).then((response) => {
      setAllMembers(response.data.result);
      form.setFieldsValue({
        assignMembers: organization.members ? organization.members.map(member => member.id) : []
      });
    });
  }, [form, organization]);

  const save = (values) => {
    const assignMembers = {
      memberIds: values.assignMembers ? values.assignMembers : [],
    };
    setLoading(true);
    OrganizationService.assignMembers(organization.id, assignMembers).then(() => {
      message.success("저장 되었습니다.");
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <>
      <PageHeader
        title="멤버 편집"
        subTitle="조직의 멤버를 편집 합니다."
        onBack={onBack}
      >
        <Form {...formItemLayout} form={form} onFinish={save}>
          <Form.Item
            name="assignMembers"
          >
            <Checkbox.Group style={{width: '100%'}}>
              {allMembers && allMembers.map(member => (
                <Row key={member.id} style={{textAlign: "center"}}>
                  <Checkbox value={member.id}>{member.name}</Checkbox>
                </Row>
              ))}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" loading={loading} htmlType="submit">
              저장
            </Button>
          </Form.Item>
        </Form>
      </PageHeader>
    </>
  )
};
export default OrganizationMemberChange;
