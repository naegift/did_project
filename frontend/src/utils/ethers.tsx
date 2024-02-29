import { ethers } from "ethers";

export async function runEthers(
  title: string,
  content: string,
  price: string
) {
  try {
    if (!window.ethereum) {
      throw new Error(
        "Ethereum 지갑을 찾을 수 없습니다."
      );
    }

    const provider =
      new ethers.providers.Web3Provider(
        window.ethereum
      );
    console.log("provider: ", provider);

    const wallets =
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    const address = wallets[0];
    console.log("address: ", address);

    const signer =
      provider.getSigner(address);
    // const ethPrice = ethers.utils.parseUnits(price, "ether");
    const message = {
      title,
      content,
      price,
    };

    const signature =
      await signer.signMessage(
        JSON.stringify(message)
      );
    console.log(
      "Message sign post body: ",
      { ...message, signature }
    );

    const messageSeller =
      ethers.utils.verifyMessage(
        JSON.stringify(message),
        signature
      );
    console.log(
      "messageSeller: ",
      messageSeller
    );

    return { message, signature };
  } catch (error) {
    console.error(
      "Error running ethers:",
      error
    );
    throw error;
  }
}
