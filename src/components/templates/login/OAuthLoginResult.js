import React from "react";
import axios from "axios";
import {Navigate, useLocation, useSearchParams} from "react-router-dom";
import {adminConfig} from "../../../config/admin.config";
import {message} from "antd";

const OAuthLoginResult = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  if(searchParams.get('error')) {
    if(searchParams.error === "server-internal-error") {
      message.error(adminConfig.errorMessage.serverInternalError);
    } else {
      message.error(searchParams.get('error'));
    }

    return <Navigate to={adminConfig.authentication.loginUrl} replace state={{from: location}}/>;
  } else {
    axios.defaults.headers['Authorization'] = `Bearer ${searchParams.get('accessToken')}`;
    return <Navigate to={searchParams.get('returnUrl')} replace state={{from: location}}/>;
  }
};

export default OAuthLoginResult;
