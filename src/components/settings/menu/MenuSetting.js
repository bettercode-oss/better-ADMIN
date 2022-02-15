import React, {useState} from "react";
import Menus from "./Menus";
import MenuForm from "./MenuForm";
import {CREATE_MODE, EDIT_MODE, VIEW_MODE} from "../AppSettings";

export const MENU_TYPE_URL = "URL";
export const MENU_TYPE_SUB_MENU = "SUB_MENU";

const MenuSetting = () => {
  const [mode, setMode] = useState(VIEW_MODE);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const getContent = (mode) => {
    if (mode === CREATE_MODE || mode === EDIT_MODE) {
      return <MenuForm mode={mode} onBack={handleOnBack} selectedMenu={selectedMenu}/>
    } else {
      return <Menus onCreateMenu={handleCreateMenu} onCreateSubMenu={handleCreateSubMenu} onChangeMenu={handleChangeMenu}/>
    }
  }

  const handleOnBack = () => {
    setMode(VIEW_MODE);
    setSelectedMenu(null);
  }

  const handleCreateMenu = () => {
    setMode(CREATE_MODE);
    setSelectedMenu(null);
  }

  const handleCreateSubMenu = (selectedMenu) => {
    setMode(CREATE_MODE);
    setSelectedMenu(selectedMenu);
  }

  const handleChangeMenu = (selectedMenu) => {
    setMode(EDIT_MODE);
    setSelectedMenu(selectedMenu);
  }

  return (
    <>
      {getContent(mode)}
    </>
  )
};
export default MenuSetting;
