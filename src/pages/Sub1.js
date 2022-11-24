import React, {useEffect} from "react";

function Sub1() {

  useEffect(() => {
    console.log('Sub1 - useEffect')
  }, []);


  return <div>
    <h1>Sub1 Page</h1>
  </div>;
}

export default Sub1;
