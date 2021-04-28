import React, {useState} from "react";
import {Button} from "antd";
import {hideLoading, showLoading} from "../helper/loading.helper";

const Sub2 = () => {
  const [showMessage, setShowMessage] = useState(false);

  return (
    <>
      <div style={{height: "1000px"}}>
        <h1>Sub2 Page 로딩 화면 테스트</h1>
        <Button onClick={() => {
          showLoading();
          // Timeout을 사용하여 비동기 호출 재현
          setTimeout(() => {
            hideLoading();
            setShowMessage(true);
          }, 3000);
        }}>Show Loading</Button>

        {showMessage && <h1>Hello World!!</h1>}
      </div>
    </>
  );
};

export default Sub2;
