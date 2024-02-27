import React, { useState, useEffect } from "react";

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
  const [signature, setSignature] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      onChange({ title, content, image: selectedImage, price, signature });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  return (
    <div className="flex flex-col border w-full">
      <label className="h-[200px] relative">
        {imagePreview && (
          <div className=" ">
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute inset-0 object-cover w-[180px] h-[180px]  mx-[auto] my-[auto]"
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
          {!imagePreview && <span className="text-gray-500">Select Image</span>}
        </label>
      </label>
      <label className="p-5 border">
        <p>Title</p>
        <input
          className="border w-full"
          type="text"
          value={title}
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
      </label>
      <label className="p-5 border">
        <p>Wei</p>
        <input
          className="border w-full"
          type="text"
          value={price}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue)) {
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
        Content:
        <textarea
          className="border w-full h-[200px] resize-none"
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
