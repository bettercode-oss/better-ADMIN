import React, {useState} from "react";
import MemberList from "./MemberList";
import MemberRoleChange from "./MemberRoleChange";

const ROLE_CHANGE_MODE = "ROLE-CHANGE";
const VIEW_MODE = "VIEW";

const MemberSetting = () => {
  const [mode, setMode] = useState(VIEW_MODE);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchCondition, setSearchCondition] = useState(null);

  const getContent = (mode) => {
    if (mode === ROLE_CHANGE_MODE) {
      return <MemberRoleChange member={selectedMember} onBack={handleOnBack}/>
    } else {
      return <MemberList initSearchCondition={searchCondition} onRoleChange={handleRoleChange}/>
    }
  }

  const handleOnBack = () => {
    setMode(VIEW_MODE);
  }

  const handleRoleChange = (member, searchCondition) => {
    setSearchCondition(searchCondition);
    setSelectedMember(member);
    setMode(ROLE_CHANGE_MODE);
  }

  return (
    <>
      {getContent(mode)}
    </>
  )
};
export default MemberSetting;
