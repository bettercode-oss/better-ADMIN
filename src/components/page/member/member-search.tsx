import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import {Button, Form, Input, Select, Skeleton} from "antd";
import {useForm} from "antd/lib/form/Form";
import {Search} from "lucide-react";
import {useRouter} from "next/router";
import React, {useCallback} from "react";
import {useSearchFilters} from "@/client/member/member";

const MemberSearch: React.FC = () => {
  const [form] = useForm();
  const router = useRouter();

  const {data: searchFilters, error, isLoading} = useSearchFilters();

  const handleFinish = useCallback(
    (formValue: any) => {
      router.push({
        pathname: router.pathname,
        query: {...router.query, ...formValue},
      });
    },
    [router]
  );

  if (!searchFilters || isLoading) {
    return <Skeleton className="my-5"/>;
  }

  if (router.query.name) {
    form.setFieldsValue({
      name: router.query.name
    });
  }

  if (router.query.types) {
    form.setFieldsValue({
      types: router.query.types
    });
  }

  if (router.query.roles) {
    form.setFieldsValue({
      roles: router.query.roles
    });
  }

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <FieldInline>
          <Form.Item label="이름" name="name">
            <Input placeholder="이름을 입력해주세요"/>
          </Form.Item>
          <Form.Item name="types" label="유형">
            <Select
              allowClear
              mode="multiple"
              showArrow
              placeholder="모두"
              style={{width: '200px'}}
              filterOption={(input, option) => String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {searchFilters && searchFilters.find((searchFilter) => searchFilter.name === 'type')?.filters.map((filter) => (
                <Select.Option key={filter.value}>{filter.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="roles" label="멤버 역할">
            <Select
              allowClear
              mode="multiple"
              showArrow
              placeholder="모두"
              style={{width: '200px'}}
              filterOption={(input, option) => String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {searchFilters && searchFilters.find((searchFilter) => searchFilter.name === 'role')?.filters.map((filter) => (
                <Select.Option key={filter.value}>{filter.text}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </FieldInline>
      </FormSearch>
      <div className="flex justify-center gap-2">
        <Button htmlType="submit" className="btn-with-icon" icon={<Search/>}>
          검색
        </Button>
        <Button htmlType="submit" className="btn-with-icon" onClick={() => form.resetFields()}>
          초기화
        </Button>
      </div>
    </DefaultSearchForm>
  );
};

export default React.memo(MemberSearch);
