import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: "#00b96b",
          // colorPrimary: "#242c58",
          // colorBorder : "#242c58"
        }
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
</BrowserRouter>,
);
