import { ethers } from "ethers";

export async function runEthers(
  title: string | null = null,
  content: string | null = null,
  price: string | null = null
) {
  try {
    if (!window.ethereum) {
      throw new Error("Ethereum 지갑을 찾을 수 없습니다.");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("provider: ", provider);

    const wallets = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = wallets[0];
    console.log("address: ", address);

    const signer = provider.getSigner(address);
    // const ethPrice = ethers.utils.parseUnits(price, "ether");
    const message = {
      title,
      content,
      price,
    };

    const signature = await signer.signMessage(JSON.stringify(message));
    console.log("Message sign post body: ", { ...message, signature });

    const messageSeller = ethers.utils.verifyMessage(
      JSON.stringify(message),
      signature
    );
    console.log("messageSeller: ", messageSeller);

    return { message, signature };
  } catch (error) {
    console.error("Error running ethers:", error);
    alert("서명이 거부되었습니다. 다시 시도해주세요.");
    throw error;
  }
}
