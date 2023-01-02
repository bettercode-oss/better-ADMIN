import React from "react";
import {Layout as AntLayout} from 'antd';
import PropTypes from "prop-types";

const DEFAULT_BACKGROUND_COLOR = "#fff";

export const Header = ({ backgroundColor, children }) => {
  return <AntLayout.Header style={{background: backgroundColor ? backgroundColor : DEFAULT_BACKGROUND_COLOR, paddingInline: "10px"}}>
    {children}
  </AntLayout.Header>;
};

Header.propTypes = {
  backgroundColor: PropTypes.string,
  children: PropTypes.any
};

Header.defaultProps = {
  backgroundColor: DEFAULT_BACKGROUND_COLOR
};

