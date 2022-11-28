import React from "react";
import { Typography as AntTypography } from 'antd';
import PropTypes from "prop-types";
const { Title: AntTitle } = AntTypography;

export const Title = ({ level, children }) => {
  return <AntTitle level={level}>{children}</AntTitle>;
};

Title.propTypes = {
  level: PropTypes.number,
  children: PropTypes.any
};

Title.defaultProps = {
  level: 1
};



