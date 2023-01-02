import React from "react";
import {Layout as AntLayout} from 'antd';
import PropTypes from "prop-types";

const DEFAULT_TEXT_ALIGN = "center";

export const Footer = ({ textAlign, children }) => {
  return <AntLayout.Footer style={{textAlign: textAlign}}>{children}</AntLayout.Footer>;
};

Footer.propTypes = {
  textAlign: PropTypes.string,
  children: PropTypes.any
};

Footer.defaultProps = {
  textAlign: DEFAULT_TEXT_ALIGN
};