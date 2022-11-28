import React from "react";
import {Card as AntCard} from 'antd';
import PropTypes from "prop-types";

export const Card = ({children}) => {
  return <AntCard>
    {children}
  </AntCard>
};

Card.propTypes = {
  children: PropTypes.any
};
