import React from "react";
import { Form as AntForm } from 'antd';
import PropTypes from "prop-types";

const FormItem = ({name, rules, children}) => {
  return <AntForm.Item name={name} rules={rules} >
    {children}
  </AntForm.Item>
};

FormItem.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.any,
  children: PropTypes.any,
};

export { FormItem }