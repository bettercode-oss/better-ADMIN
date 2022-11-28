import React from "react";
import { Button as AntButton } from 'antd';
import PropTypes from "prop-types";

export const Button = ({label, type, htmlType, loading, danger, size, icon, block, onClick}) => {
  return <AntButton type={type} htmlType={htmlType} loading={loading} block={block} danger={danger} size={size} icon={icon}
                    onClick={onClick}>
    {label}
  </AntButton>
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  htmlType: PropTypes.string,
  loading: PropTypes.bool,
  danger: PropTypes.bool,
  size: PropTypes.number,
  icon: PropTypes.any,
  block: PropTypes.bool,
  onClick: PropTypes.func
};

Button.defaultProps = {
  type: 'default',
  size: 'middle',
  loading: false,
  danger: false,
  block: false
};





