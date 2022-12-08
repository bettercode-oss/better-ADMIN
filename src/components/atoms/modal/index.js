import React from "react";
import { Modal as AntModal } from 'antd';
import PropTypes from "prop-types";

export const Modal = ({title, open, width, footer, onCancel, onAfterClose, children}) => {
  return <AntModal title={title} open={open} onCancel={onCancel} footer={footer} width={width} afterClose={onAfterClose}>
    {children}
  </AntModal>
};

Modal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  width: PropTypes.number,
  footer: PropTypes.any,
  onCancel: PropTypes.func,
  onAfterClose: PropTypes.func,
  children: PropTypes.any
};

Modal.defaultProps = {
  open: false,
  width: 520
};





