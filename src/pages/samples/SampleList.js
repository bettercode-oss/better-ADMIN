import React from "react";
import { Link } from "react-router-dom";

const SampleList = () => (
  <>
    <div>
      <h1>Sample List</h1>
      <Link to="/sample-details">
        <button>Sample Details</button>
      </Link>
    </div>
  </>
);

export default SampleList;
