import React from "react";
import { Route, Routes } from "react-router-dom";

import Header from "../components/organisms/Header";
import Main from "../pages/Main";
import View from "../pages/View";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/product/:id" element={<View />} />
      </Routes>
    </>
  );
};

export default App;
