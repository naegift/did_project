import React from "react";
import { Route, Routes } from "react-router-dom";

import Header from "../components/organisms/Header";
import Main from "../pages/Main";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
};

export default App;
