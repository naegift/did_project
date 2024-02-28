import React, { useState } from "react";
import Button from "../atoms/button";
import axios from "axios";
import { runEthers } from "../../utils/ethers";
import Loading from "../organisms/Loading";

interface EditNFTProps {
  nftId: string;
  userWalletAddress: string;
}

const EditProduct: React.FC<EditNFTProps> = ({ nftId, userWalletAddress }) => {
  const [loading, setLoading] = useState(true);

  const handleEditProduct = async () => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
    try {
      const newNFTData = {
        title: "",
      };
    } catch (error) {
      console.error("error editing product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="sendBtn1"
        size="mdl"
        label="Edit NFT"
        onClick={handleEditProduct}
      />
       {loading ? <Loading /> : null}
    </div>
  );
};

export default EditProduct;
