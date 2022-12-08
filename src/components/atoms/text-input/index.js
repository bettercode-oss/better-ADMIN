import React from "react";
import { Input as AntInput } from 'antd';
import PropTypes from "prop-types";

export const TextInput = ({ type, placeholder, prefix, suffix, maxLength, defaultValue, onChange }) => {
  return <AntInput type={type} placeholder={placeholder} prefix={prefix} suffix={suffix}
                   maxLength={maxLength} defaultValue={defaultValue} onChange={onChange}/>
};

TextInput.propTypes = {
  type: PropTypes.oneOf(["text", "password"]),
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  maxLength: PropTypes.number,
  prefix: PropTypes.any,
  suffix: PropTypes.any,
  onChange: PropTypes.func
};

TextInput.defaultProps = {
  type: 'text'
};