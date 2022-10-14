import React from "react";
import Tooltip from 'antd/lib/tooltip';
import Popconfirm from 'antd/lib/popconfirm';
import classNames from 'classnames';
import PropTypes from "prop-types";

import AntButton, { ButtonProps as AntButtonProps, } from 'antd/lib/button/index';
import AntPopconfirm, { popconfirmProps as AntPopconfirmProps, } from 'antd/lib/popconfirm/index';
import styled from "styled-components";
import theme from '../styles/theme';
import "./style.less";

/* const ButtonDefine = styled(AntButton)`
` */

export type ButtonProps = AntButtonProps & {
  tooltip?: React.ReactNode;
};
export type popconfirmProps = AntPopconfirmProps & {
  popconfirm?: React.ReactNode;
};

export const Button = ({ classname, tooltip, popconfirm, icon, ...props }) => {
  const confirm = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(null), 3000);
    });
  const button = (
    <AntButton {...props} className={'csms ' + classname} icon={icon}>
      {props.label}
    </AntButton>
  );
  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }
  if (popconfirm) {
    return <Popconfirm title={popconfirm}>{button}</Popconfirm>;
  }
  return button;
};


Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.bool,
  tooltip: PropTypes.string,
  popconfirm: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};



