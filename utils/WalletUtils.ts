import web3modal from "web3modal";
import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

let web3Modal: web3modal | null = null;

export async function getLibrary() {
  web3Modal = new web3modal({
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.INFURA_ID,
        },
      },
    },
  });
  const provider = await web3Modal?.connect();
  const library = new providers.Web3Provider(provider);

  return library;
}

export async function connect() {
  const library = await getLibrary();
  const signer = library.getSigner();

  return signer.getAddress();
}

export async function sign(message: string) {
  const library = await getLibrary();
  const signer = library.getSigner();
  const sig = await signer.signMessage(message);

  return sig;
}
