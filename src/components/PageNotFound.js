import React from 'react';
import {Result} from "antd";
import {useLocation} from "react-router-dom";

export const PageNotFound = () => {
  let location = useLocation();

  return (
    <Result
      status="404"
      title="이 페이지는 존재하지 않습니다."
      subTitle={location.pathname}
    />
  )
};


