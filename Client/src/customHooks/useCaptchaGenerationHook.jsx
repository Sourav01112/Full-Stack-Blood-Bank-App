import React, { useEffect, useState } from "react";

export const useCaptchaGenerationHook = (lengthInput) => {
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    generator();
  }, []);

  function generator(newLength) {
    setLoading(true);
    setTimeout(() => {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789";

      let length = newLength || lengthInput;

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      setCaptcha(result);
      setLoading(false);
    }, 1000);
  }

  function setNewLength(newLength) {
    generator(newLength);
  }

  return [loading, captcha, setNewLength];
};

