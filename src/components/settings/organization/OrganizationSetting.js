import React, {useState} from "react";
import Organizations from "./Organizations";
import OrganizationForm from "./OrganizationForm";
import OrganizationRoleChange from "./OrganizationRoleChange";
import OrganizationMemberChange from "./OrganizationMemberChange";

const VIEW_MODE = "VIEW";
const CREATE_MODE = "CREATE";
const ROLE_CHANGE_MODE = "ROLE-CHANGE";
const MEMBER_CHANGE_MODE = "MEMBER-CHANGE";
const NAME_CHANGE_MODE = "NAME-CHANGE";

const OrganizationSetting = () => {
  const [mode, setMode] = useState(VIEW_MODE);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const getContent = (mode) => {
    if (mode === CREATE_MODE || mode === NAME_CHANGE_MODE) {
      return <OrganizationForm mode={mode} onBack={handleOnBack} selectedOrganization={selectedOrganization}/>
    } else if (mode === ROLE_CHANGE_MODE) {
      return <OrganizationRoleChange onBack={handleOnBack} organization={selectedOrganization}/>
    } else if (mode === MEMBER_CHANGE_MODE) {
      return <OrganizationMemberChange onBack={handleOnBack} organization={selectedOrganization}/>
    } else {
      return <Organizations onCreateOrganization={handleCreateOrganization} onCreateDepartment={handleCreateDepartment}
                            onRoleChange={handleRoleChange} onMemberChange={handleMemberChange} onChangeOrganizationName={handleChangeOrganizationName}/>
    }
  }

  const handleOnBack = () => {
    setMode(VIEW_MODE);
    setSelectedOrganization(null);
  }

  const handleCreateOrganization = () => {
    setMode(CREATE_MODE);
    setSelectedOrganization(null);
  }

  const handleCreateDepartment = (selectedOrganization) => {
    setMode(CREATE_MODE);
    setSelectedOrganization(selectedOrganization);
  }

  const handleRoleChange = (selectedOrganization) => {
    setMode(ROLE_CHANGE_MODE);
    setSelectedOrganization(selectedOrganization);
  }

  const handleMemberChange = (selectedOrganization) => {
    setMode(MEMBER_CHANGE_MODE);
    setSelectedOrganization(selectedOrganization);
  }

  const handleChangeOrganizationName = (selectedOrganization) => {
    setMode(NAME_CHANGE_MODE);
    setSelectedOrganization(selectedOrganization);
  }

  return (
    <>
      {getContent(mode)}
    </>
  )
};
export default OrganizationSetting;
