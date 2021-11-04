import React, {useEffect, useState} from "react";
import {Button, Form, message, PageHeader, Select} from 'antd';
import {MemberService} from "../member/member.service";
import {OrganizationService} from "./organization.service";

const {Option} = Select;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 12},
    md: {span: 24},
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
    MemberService.getMembersApproved({page: 0}).then((response) => {
      setAllMembers(response.data.result);
      form.setFieldsValue({
        assignMembers: organization.members ? organization.members.map(member => String(member.id)) : []
      });
    });
  }, [form, organization]);

  const save = (values) => {
    const assignMembers = {
      memberIds: values.assignMembers ? values.assignMembers.map(memberId => Number(memberId)) : [],
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
            <Select
              mode="multiple"
              allowClear
              showArrow
              style={{width: '100%'}}
              placeholder="멤버를 선택해 주세요.(여러명을 검색하여 선택할 수 있습니다)"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allMembers && allMembers.map(member => (
                <Option key={member.id}>{member.name + '(' + member.candidateId + ')'}</Option>
              ))}
            </Select>
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
