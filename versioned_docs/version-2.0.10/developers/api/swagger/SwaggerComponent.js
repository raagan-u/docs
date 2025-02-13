import React, { useState, useEffect, useRef } from 'react';
import { SwaggerDoc } from './Swagger';
import CustomAlert from './Alert';

const SwaggerComponent = ({ url }) => {
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
      setTimeout(() => {
        setAlertVisible(false);
      }, 5000);
  }, [alertVisible]);

  const expandFirstTag = () => {
    const firstButton = document.getElementsByClassName("expand-operation")[0];
    if (firstButton) {
      firstButton.click();
    }
  };

  const customResponseInterceptor = (response) => {
    if (response.status === 401) {
      setAlertVisible(true);
    }
    return response;
  };
  
  const message = "401 Unauthorized!\nPlease obtain your API key from the Dev Dashboard or through the Auth endpoint.";
  const formattedMessage = message.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="">
      {alertVisible && (
        <CustomAlert
          message={formattedMessage} 
          onClose={() => setAlertVisible(false)}
        />
      )}

      <SwaggerDoc
        url={url}
        docExpansion="none"
        onComplete={expandFirstTag}
        responseInterceptor={customResponseInterceptor}
      />
    </div>
  );
};

export default SwaggerComponent;