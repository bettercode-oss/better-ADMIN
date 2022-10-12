import React from "react";
import classNames from 'classnames';
import PropTypes from "prop-types";

import { darken, lighten } from 'polished';
import AntInput, { InputProps as AntInputProps, } from 'antd/lib/input/index';
import styled from "styled-components";
import theme from '../styles/theme';
import { SearchOutlined, DiffOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';

const InputDefault = styled(AntInput)`
    ${props => theme.inputCommon} ;
`;

export const Input = ({ ...props }) => {
    const input = (
        <InputDefault {...props} placeholder={props.holder}/>
    );
    return input;
};


Input.propTypes = {
    holder: PropTypes.string.isRequired,
    type: PropTypes.string,
    size: PropTypes.string,
};



