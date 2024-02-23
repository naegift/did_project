import React from "react";
import { Route, Routes } from "react-router-dom";

import Header from "../components/organisms/Header";
import Main from "../pages/Main";
import View from "../pages/View";
import ProductWrite from "../pages/ProductWrite";

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/product/:id" element={<View />} />
        <Route path="/product" element={<ProductWrite />} />
      </Routes>
    </>
  );
};

export default App;
