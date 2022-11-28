import React from "react";
import { Form as AntForm } from 'antd';
import PropTypes from "prop-types";
const Form = ({onFinish, children}) => {
  return <AntForm onFinish={onFinish}>
    {children}
  </AntForm>
};

Form.propTypes = {
  onFinish: PropTypes.func,
  children: PropTypes.any,
};

export { Form }