import React, {useState} from "react";
import WebHooksList from "./WebHooksList";
import {CREATE_MODE, EDIT_MODE, VIEW_DETAILS_MODE, VIEW_MODE} from "../AppSettings";
import WebHookForm from "./WebHookForm";
import WebHookDetails from "./WebHookDetails";


const WebHooksSetting = () => {
  const [mode, setMode] = useState(VIEW_MODE);
  const [selectedWebHook, setSelectedWebHook] = useState(null);

  const getContent = (mode) => {
    if (mode === CREATE_MODE) {
      return <WebHookForm mode={mode} onBack={handleOnBack}/>
    } else if (mode === EDIT_MODE) {
      return <WebHookForm mode={mode} selectedWebHook={selectedWebHook} onBack={handleOnBack}/>
    } else if (mode === VIEW_DETAILS_MODE) {
      return <WebHookDetails selectedWebHook={selectedWebHook} onBack={handleOnBack}/>
    } else {
      return <WebHooksList onCreate={handleCreate} onEdit={handleEdit} onShowDetails={handleShowDetails}/>;
    }
  }

  const handleOnBack = () => {
    setMode(VIEW_MODE);
  }

  const handleCreate = () => {
    setMode(CREATE_MODE);
  }

  const handleEdit = (webHook) => {
    setSelectedWebHook(webHook);
    setMode(EDIT_MODE);
  }

  const handleShowDetails = (webHook) => {
    setSelectedWebHook(webHook);
    setMode(VIEW_DETAILS_MODE);
  }

  return (
    <>
      {getContent(mode)}
    </>
  )
};
export default WebHooksSetting;
