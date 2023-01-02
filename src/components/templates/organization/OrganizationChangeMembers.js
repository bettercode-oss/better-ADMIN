import React, {useEffect, useState} from "react";
import {Button, Descriptions, Form, message, Select} from 'antd';
import {PageHeader} from '@ant-design/pro-layout';
import {OrganizationService} from "../../../services/organization.service";
import {MemberService} from "../../../services/member.service";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {FormItemLayout, FormTailItemLayout} from "../../modules/layout/from-item";

const {Option} = Select;

const OrganizationChangeMembers = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  let params = useParams();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    MemberService.getMembersApproved({page: 0}).then((response) => {
      setAllMembers(response.data.result);

      OrganizationService.getOrganizationById(params.organizationId).then((res) => {
        const organization = res.data;
        setOrganization(organization);
        form.setFieldsValue({
          assignMembers: organization.members ? organization.members.map(member => String(member.id)) : []
        });
      });
    });
  }, [params, form]);

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
        title="멤버 변경"
        subTitle="조직의 멤버를 변경 합니다."
        onBack={handleBack}
      >
        {organization &&
          <Descriptions>
            <Descriptions.Item label="조직 이름">{organization.name}</Descriptions.Item>
          </Descriptions>}
        <Form {...FormItemLayout} form={form} onFinish={save}>
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
export default OrganizationChangeMembers;
