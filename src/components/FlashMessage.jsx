import React from "react";

function FlashMessage({ flashMessage }) {
  return (
    <div className="floating-alerts">
      {flashMessage.map((msg, index) => {
        return (
          <div key={index} className="alert alert-success text-center floating-alert shadow-sm">
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessage;
