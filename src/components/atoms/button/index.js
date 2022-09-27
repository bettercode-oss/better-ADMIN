import React from "react";
// import { Button as AntButton } from 'antd';
import AntButton, { ButtonProps as AntButtonProps, } from 'antd/lib/button/index';
import Tooltip from 'antd/lib/tooltip';
import classNames from 'classnames';
import PropTypes from "prop-types";
import styled from 'styled-components';

/* const ButtonStyled = styled(AntButton)`
    color: blue;
    font-weight: normal;
    :focus {
      color: blue;
      border-color: blue;
    }
    :hover {
      color: red;
      border-color: red;
    }
    &.ant-btn-clicked:after {
      content:'',
      position: absolute,
      top: -1px,
      left: -1px,
      bottom: -1px,
      right:-1px,
      opacity: 0.4,
      -webkit-animation: buttonEffect 0.4s;
      animation: buttonEffect 0.4s;
      display: block,
    }
` ; */

const ButtonStyled = styled(AntButton)`
    font-weight: normal;
    border-radius: 3px;
    background-color: ${props => props.color};
    :hover {
      background-color: darken(${props => props.color}, 50%);
    }
    `;
    /* background-color: {backgroundColor}; */
    // background-color: ${props => (isSelected ? `black` : `#C4C4C4`)};

export type ButtonProps = AntButtonProps & {
  tooltipTitle?: React.ReactNode;
};

export const Button = ({ tooltipTitle,  ...props }) => {
  const button = (
    // <ButtonStyled {...props}>
     <ButtonStyled {...props} style={{backgroundColor:props.backgroundColor, borderColor:props.backgroundColor}}> 
      {props.label}
    </ButtonStyled>
  );
  if (tooltipTitle) {
    return <Tooltip title={tooltipTitle}>{button}</Tooltip>;
  }
  return button;
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  tooltip: PropTypes.string,
  backgroundColor: PropTypes.string,
  onClick: PropTypes.func
};

Button.defaultProps = {
  type: 'primary',
  size: 'middle',
};

