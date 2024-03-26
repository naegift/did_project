import React, { useState } from "react";

interface RegistrationNFTProps {
  onChange: (data: {
    title: string;
    content: string;
    image: File | null;
    price: string;
    signature: string;
  }) => void;
}

const RegistrationNFT: React.FC<RegistrationNFTProps> = ({ onChange }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState<string>("0");
  const [signature] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      onChange({
        title,
        content,
        image: selectedImage,
        price,
        signature,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  return (
    <div className="flex flex-col border w-full">
      <label className="h-[300px] relative">
        {imagePreview && (
          <div className=" ">
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute inset-0 object-cover w-[250px] h-[250px]  mx-[auto] my-[auto]"
            />
          </div>
        )}

        <label className="absolute inset-0 flex items-center justify-center w-full h-full cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {!imagePreview && <span className="text-gray-500">Select Items</span>}
        </label>
      </label>
      <div className="relative w-[80%] ml-[50px] mt-[100px]">
        <input
          className="text-base text-gray-800 w-full border-b border-gray-300 pb-2 pl-2 focus:outline-none "
          placeholder="Title"
          type="text"
          value={title}
          id="inputField"
          onChange={(e) => {
            setTitle(e.target.value);
            onChange({
              title: e.target.value,
              content,
              image,
              price,
              signature,
            });
          }}
        />
        {/* <label className="absolute text-gray-500 left-2 text-lg bottom-2 transition-all duration-200">
          Title
        </label> */}
        <span className="block absolute bottom-0 left-0 bg-gray-600 w-0 h-2 transition-all duration-500"></span>
      </div>
      <label className="mt-[20px] p-5 border">
        <p>ETH</p>
        <input
          className="text-base text-gray-800 w-full border-b border-gray-300 pb-2 pl-2 focus:outline-none"
          type="text"
          placeholder="ex) 0.00001"
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*\.?\d*$/.test(inputValue)) {
              setPrice(inputValue);
              onChange({
                title,
                content,
                image,
                price: inputValue,
                signature,
              });
            }
          }}
        />
      </label>

      <label className="p-5 border">
        <textarea
          className="border w-full h-[200px] resize-none"
          placeholder="Content:"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            onChange({
              title,
              content: e.target.value,
              image,
              price,
              signature,
            });
          }}
        />
      </label>
    </div>
  );
};

export default RegistrationNFT;
