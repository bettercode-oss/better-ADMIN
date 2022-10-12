import React from "react";
import Tooltip from 'antd/lib/tooltip';
import classNames from 'classnames';
import PropTypes from "prop-types";

import { darken, lighten } from 'polished';
import AntButton, { ButtonProps as AntButtonProps, } from 'antd/lib/button/index';
import styled from "styled-components";
import theme from '../styles/theme';
import { SearchOutlined, DiffOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';

const IconButton = styled(AntButton)`
    ${props => theme.buttonCommon} ;
    background-color: ${props => theme.colors.orange};
    border-color: ${props => theme.colors.orange};
    :hover {
      background-color: ${lighten(0.1, theme.colors.orange)};
      border-color: ${lighten(0.1, theme.colors.orange)};
    }
    :active ,:focus{
      background-color: ${darken(0.2, theme.colors.orange)};
      border-color: ${darken(0.2, theme.colors.orange)};
    }
`;

const NormalButton = styled(AntButton)`
    ${props => theme.buttonCommon} ;
    background-color: #fff;
    border-color: ${props => theme.colors.ligthgray};
    :hover {
      color: #222;
      background-color: ${darken(0.1, '#fff')};
      border-color: ${darken(0.1, theme.colors.ligthgray)};
    }
    :active , :focus{
      color: #222;
      background-color: ${darken(0.2, '#fff')};
      border-color: ${darken(0.2, theme.colors.ligthgray)};    
    }
`;
const SearchButton = styled(AntButton)`
    ${props => theme.buttonCommon} ;
    color: #fff;
    background-color: ${props => theme.colors.darkgray};
    border-color: ${props => theme.colors.darkgray};
    :hover {
      color: #fff;
      background-color: ${lighten(0.1, theme.colors.darkgray)};
      border-color: ${lighten(0.1, theme.colors.darkgray)};
    }
    :active , :focus{
      color: #fff;
      background-color: ${lighten(0.2, theme.colors.darkgray)};
      border-color: ${lighten(0.2, theme.colors.darkgray)};    
    }
`;


export type ButtonProps = AntButtonProps & {
  tooltip?: React.ReactNode;
};

export const BtnRegist = ({ tooltip, ...props }) => {
  const button = (
        <IconButton {...props}  icon={<DiffOutlined />}>
          {props.label}
        </IconButton>
  );
  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }
  return button;
};

export const BtnDown = ({ tooltip, ...props }) => {
  const button = (
        <NormalButton {...props} icon={<DownloadOutlined />}>
          {props.label}
        </NormalButton>
  );
  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }
  return button;
};

export const BtnDelete = ({ tooltip, ...props }) => {
  const button = (
        <NormalButton {...props} icon={<DeleteOutlined />}>
          {props.label}
        </NormalButton>
  );
  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }
  return button;
};

export const BtnRefresh = ({ tooltip, ...props }) => {
  const button = (
        <NormalButton {...props} icon={<ReloadOutlined />}>
          {props.label}
        </NormalButton>
  );
  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }
  return button;
};

export const BtnSearch = ({ tooltip, ...props }) => {
  const button = (
        <SearchButton {...props} icon={<SearchOutlined />}>
          {props.label}
        </SearchButton>
  );
  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }
  return button;
};

BtnRegist.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  size: PropTypes.string,
  loading: PropTypes.bool,
  tooltip: PropTypes.string,
  onClick: PropTypes.func,
};



