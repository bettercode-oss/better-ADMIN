import React from "react";
import { Typography as AntTypography } from 'antd';
import PropTypes from "prop-types";
const { Text: AntText } = AntTypography;

export const Text = ({ type, children }) => {
  return <AntText type={type}>{children}</AntText>;
};

Text.propTypes = {
  type: PropTypes.string,
  children: PropTypes.any
};



