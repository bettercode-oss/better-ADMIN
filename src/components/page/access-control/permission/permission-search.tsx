import DefaultSearchForm from "@/components/shared/form/ui/default-search-form";
import FieldInline from "@/components/shared/form/ui/field-inline";
import FormSearch from "@/components/shared/form/ui/form-search";
import {Button, Form, Input} from "antd";
import {useForm} from "antd/lib/form/Form";
import {Search} from "lucide-react";
import {useRouter} from "next/router";
import React, {useCallback} from "react";

const PermissionSearch: React.FC = () => {
  const [form] = useForm();
  const router = useRouter();

  const handleFinish = useCallback(
    (formValue: any) => {
      router.push({
        pathname: router.pathname,
        query: {...router.query, ...formValue},
      });
    },
    [router]
  );

  if (router.query.name) {
    form.setFieldsValue({
      name: router.query.name
    });
  }

  return (
    <DefaultSearchForm form={form} onFinish={handleFinish}>
      <FormSearch>
        <FieldInline>
          <Form.Item label="권한 이름" name="name">
            <Input placeholder="권한 이름을 입력해주세요" data-testid="search-name-input" />
          </Form.Item>
        </FieldInline>
      </FormSearch>
      <div className="flex justify-center gap-2">
        <Button htmlType="submit" className="btn-with-icon" icon={<Search/>} data-testid="search-btn">
          검색
        </Button>
        <Button htmlType="submit" className="btn-with-icon" onClick={() => form.resetFields()}>
          초기화
        </Button>
      </div>
    </DefaultSearchForm>
  );
};

export default React.memo(PermissionSearch);
