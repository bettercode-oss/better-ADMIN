import React, {useState} from "react";
import PermissionList from "./PermissionList";
import PermissionForm from "./PermissionForm";
import {CREATE_MODE, EDIT_MODE, VIEW_MODE} from "../AppSettings";

const PermissionSetting = () => {
  const [mode, setMode] = useState(VIEW_MODE);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const getContent = (mode) => {
    if (mode === CREATE_MODE) {
      return <PermissionForm mode={mode} onBack={handleOnBack}/>
    } else if(mode === EDIT_MODE){
      return <PermissionForm mode={mode} selectedPermission={selectedPermission} onBack={handleOnBack}/>
    } else {
      return <PermissionList onCreate={handleCreate} onEdit={handleEdit}/>
    }
  }

  const handleOnBack = () => {
    setMode(VIEW_MODE);
  }

  const handleCreate = () => {
    setMode(CREATE_MODE);
  }

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    setMode(EDIT_MODE);
  }

  return (
    <>
      {getContent(mode)}
    </>
  )
};
export default PermissionSetting;
