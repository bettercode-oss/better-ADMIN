import React from "react";
import * as queryString from "query-string";
import axios from "axios";
import {Redirect} from 'react-router'
import {adminConfig} from "../../config/admin.config";
import {message} from "antd";

const OAuthLoginResult = (props) => {
  const query = queryString.parse(props.location.search);
  if(query.error) {
    if(query.error === "server-internal-error") {
      message.error(adminConfig.errorMessage.serverInternalError);
    } else {
      message.error(query.error);
    }

    return <Redirect to={adminConfig.authentication.loginUrl}/>
  } else {
    axios.defaults.headers['Authorization'] = `Bearer ${query.accessToken}`;
    return <Redirect to={query.returnUrl}/>;
  }
};

export default OAuthLoginResult;
