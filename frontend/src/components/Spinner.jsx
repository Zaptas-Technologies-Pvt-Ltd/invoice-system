import React from "react";
function Spinner() {
  return (
    <div className="flex items-center justify-center space-x-2 spinner-parent">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
  );
}
export default Spinner;
