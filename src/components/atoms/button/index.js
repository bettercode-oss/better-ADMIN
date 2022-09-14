import React from "react";
import { Button as AntButton } from 'antd';
import PropTypes from "prop-types";

export const Button = ({...props}) => {
  return (
    <AntButton {...props}>
      {props.label}
    </AntButton>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  onClick: PropTypes.func
};

Button.defaultProps = {
  type: 'primary',
  size: 'middle'
};

