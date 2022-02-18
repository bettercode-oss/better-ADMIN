import React from 'react';
import {Result} from "antd";

export const PageNotFound = ({location}) => {
  return (
    <Result
      status="404"
      title="이 페이지는 존재하지 않습니다."
      subTitle={location.pathname}
    />
  )
};


