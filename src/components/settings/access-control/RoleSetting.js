import React, {useState} from "react";
import RoleList from "./RoleList";
import RoleForm from "./RoleForm";
import {CREATE_MODE, EDIT_MODE, VIEW_MODE} from "../AppSettings";

const RoleSetting = () => {
  const [mode, setMode] = useState(VIEW_MODE);
  const [selectedRole, setSelectedRole] = useState(null);

  const getContent = (mode) => {
    if (mode === CREATE_MODE) {
      return <RoleForm mode={mode} onBack={handleOnBack}/>;
    } else if(mode === EDIT_MODE) {
      return <RoleForm mode={mode} selectedRole={selectedRole} onBack={handleOnBack}/>;
    } else {
      return <RoleList onCreate={handleCreateRole} onEdit={handleEdit}/>;
    }
  }

  const handleOnBack = () => {
    setMode(VIEW_MODE);
  }

  const handleCreateRole = () => {
    setMode(CREATE_MODE);
  }

  const handleEdit = (role) => {
    setSelectedRole(role);
    setMode(EDIT_MODE);
  }

  return (
    <>
      {getContent(mode)}
    </>
  )
};
export default RoleSetting;
