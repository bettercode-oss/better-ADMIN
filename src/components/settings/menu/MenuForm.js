import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, PageHeader, Radio, Select} from 'antd';
import {MenuService} from "./menu.service";
import {AccessControlService} from "../access-control/access.control.service";
import {CHANGE_MENU_SETTING_EVENT_TOPIC, EventBroadcaster} from "../../../event/event.broadcaster";
import {EDIT_MODE, FormItemLayout, FormTailItemLayout} from "../AppSettings";
import {MENU_TYPE_SUB_MENU, MENU_TYPE_URL} from "./MenuSetting";

const {Option} = Select;

const MenuForm = ({mode, selectedMenu, onBack}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [allPermissions, setAllPermissions] = useState([]);
  const [menuType, setMenuType] = useState(selectedMenu ? selectedMenu.type : MENU_TYPE_SUB_MENU);

  useEffect(() => {
    AccessControlService.getPermissions({page: 0}).then((response) => {
      setAllPermissions(response.data.result);

      if (mode === EDIT_MODE) {
        form.setFieldsValue({
          type: menuType,
          name: selectedMenu.name,
          icon: selectedMenu.icon,
          link: selectedMenu.link,
          disabled: selectedMenu.disabled,
          accessPermissions: selectedMenu.accessPermissions ? selectedMenu.accessPermissions.map(permission => String(permission.id)) : []
        });
      } else {
        form.setFieldsValue({
          type: menuType,
          disabled: false,
        });
      }
    }).catch((err) => {
      console.log(err);
    });
  }, [form, menuType, selectedMenu, mode]);

  const save = (values) => {
    const menu = {
      name: values.name,
      icon: values.icon,
      disabled: values.disabled,
      accessPermissionIds: values.accessPermissions ? values.accessPermissions.map(id => Number(id)) : [],
    };

    if (menuType === MENU_TYPE_URL) {
      menu.link = values.link;
    }

    setLoading(true);
    if (mode === EDIT_MODE) {
      setLoading(true);
      MenuService.updateMenu(selectedMenu.id, menu).then(() => {
        message.success("저장 되었습니다.");
        EventBroadcaster.broadcast(CHANGE_MENU_SETTING_EVENT_TOPIC);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      if(selectedMenu && selectedMenu.id) {
        menu.parentMenuId = selectedMenu.id;
      }

      MenuService.createMenu(menu).then(() => {
        message.success("저장 되었습니다.");
        EventBroadcaster.broadcast(CHANGE_MENU_SETTING_EVENT_TOPIC);
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  const handleMenuTypeChanged = (e) => {
    setMenuType(e.target.value);
  }

  return (
    <>
      <PageHeader
        title={mode === EDIT_MODE ? "메뉴 수정" : "메뉴 추가"}
        subTitle={mode === EDIT_MODE ? "메뉴를 수정합니다." : "메뉴를 추가 합니다."}
        onBack={onBack}
      >
        <Form {...FormItemLayout} form={form} onFinish={save}>
          <Form.Item label="유형" name="type" rules={[
            {
              required: true,
              message: '유형을 선택해 주세요.',
            },
          ]}>
            <Radio.Group onChange={handleMenuTypeChanged}>
              <Radio value={MENU_TYPE_SUB_MENU}>상위 메뉴</Radio>
              <Radio value={MENU_TYPE_URL}>화면 메뉴</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="name"
            label="이름"
            rules={[
              {
                required: true,
                message: '이름을 입력해 주세요.',
              },
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            name="icon"
            label="아이콘명"
          >
            <Input/>
          </Form.Item>
          {menuType === 'URL' &&
            <Form.Item
              name="link"
              label="화면 URL"
              rules={[
                {
                  required: true,
                  message: '화면 URL을 입력해 주세요.',
                },
              ]}
            >
              <Input/>
            </Form.Item>}
          <Form.Item
            name="accessPermissions"
            label="접근 권한"
          >
            <Select
              mode="multiple"
              allowClear
              showArrow
              style={{width: '100%'}}
              placeholder="권한을 선택해 주세요.(여러 권한 검색하여 선택할 수 있습니다)"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allPermissions && allPermissions.map(permission => (
                <Option key={permission.id}>{permission.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="사용여부" name="disabled" rules={[
            {
              required: true,
              message: '사용 여부를 선택해 주세요.',
            },
          ]}>
            <Radio.Group>
              <Radio value={false}>사용함</Radio>
              <Radio value={true}>사용 안 함</Radio>
            </Radio.Group>
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
export default MenuForm;
