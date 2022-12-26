import React from "react";
import {Dropdown as AntDropdown} from 'antd';
import PropTypes from "prop-types";
import styled from "styled-components";

const PointerCursor = styled.span`
  cursor: pointer;
  padding-bottom: 10px;
`

export const Dropdown = ({items, onClick, trigger, children}) => {
  return <AntDropdown
    menu={{
      items,
      onClick
    }}
    trigger={trigger}
  >
    <PointerCursor>
      {children}
    </PointerCursor>
  </AntDropdown>
};

Dropdown.propTypes = {
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func
};

Dropdown.defaultProps = {
  trigger: 'hover'
};



