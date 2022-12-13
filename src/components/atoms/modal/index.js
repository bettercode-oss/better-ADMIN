import React from "react";
import {Modal as AntModal} from 'antd';
import PropTypes from "prop-types";

export const Modal = ({title, open, width, okText, cancelText, onOk, onCancel, onAfterClose, children}) => {
  return <AntModal title={title} open={open} okText={okText} cancelText={cancelText}
                   onOk={onOk} onCancel={onCancel} width={width} afterClose={onAfterClose}>
    {children}
  </AntModal>
};

Modal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  width: PropTypes.number,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onAfterClose: PropTypes.func,
  children: PropTypes.any
};

Modal.defaultProps = {
  open: false,
  width: 520,
  okText: "예",
  cancelText: "아니오"
};

export const SimpleModal = ({title, open, width, onCancel, onAfterClose, children}) => {
  return <AntModal title={title} open={open} onCancel={onCancel} footer={null} width={width} afterClose={onAfterClose}>
    {children}
  </AntModal>
};

SimpleModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  width: PropTypes.number,
  onCancel: PropTypes.func,
  onAfterClose: PropTypes.func,
  children: PropTypes.any
};

SimpleModal.defaultProps = {
  open: false,
  width: 520
};