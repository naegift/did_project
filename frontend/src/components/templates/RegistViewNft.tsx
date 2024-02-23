import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ViewBox from "../molecules/ViewBox";
import axios from "axios";

interface ProductDetails {
  title: string;
  content: string;
  image: string;
  price: string;
  signature: string;
}

const RegistViewNft: React.FC = () => {
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(
    null
  );

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/product/${id}`
        );
        setProductDetails(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);
  return (
    <div>{productDetails && <ViewBox productDetails={productDetails} />}</div>
  );
};

export default RegistViewNft;
