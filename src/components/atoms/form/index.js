import React from "react";
import { Form as AntForm } from 'antd';
import PropTypes from "prop-types";
const Form = ({onFinish, form, children}) => {
  return <AntForm form={form} onFinish={onFinish}>
    {children}
  </AntForm>
};

Form.propTypes = {
  onFinish: PropTypes.func,
  children: PropTypes.any,
  form: PropTypes.any
};

export { Form }