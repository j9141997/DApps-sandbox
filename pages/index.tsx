import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { ABI, MEGAMI_CONTRACT_ADDRESS } from "../constants";
import { connect, getLibrary, sign } from "../utils/WalletUtils";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const fetchMessage = useCallback(async () => {
    const res = await fetch("/api/message");

    return await res.json();
  }, []);

  const handleClick = useCallback(async () => {
    setAddress(await connect());
  }, []);

  const handleSign = useCallback(async () => {
    const { message } = await fetchMessage();
    const sig = await sign(message);

    const res = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message,
        address,
        signature: sig,
      }),
    });
    const { isVerified } = await res.json();
    setVerified(isVerified);
  }, [address, fetchMessage]);

  const getOwnerOf = useCallback(async (tokenId: string) => {
    const library = await getLibrary();
    const contract = new ethers.Contract(
      MEGAMI_CONTRACT_ADDRESS,
      ABI as any,
      library.getSigner()
    );

    const address = await contract.ownerOf(tokenId);
    console.log({ address });
  }, []);

  return (
    <main>
      <h2>hello world</h2>
      <pre>address: {address ?? "-"}</pre>
      <button onClick={handleClick}>connect</button>

      <hr />

      <p>verified: {String(verified)}</p>
      <button onClick={handleSign}>sign</button>

      <hr />
      <button
        onClick={() => {
          getOwnerOf("3215");
        }}
      >
        getOwnerOf
      </button>
    </main>
  );
}
