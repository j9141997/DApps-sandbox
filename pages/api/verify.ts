import type { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";

type Data = {
  isVerified: boolean;
};

interface Body {
  address: string;
  signature: string;
  message: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { address, signature, message }: Body = req.body;
  const digest = ethers.utils.hashMessage(message);
  const actual = ethers.utils.recoverAddress(digest, signature);

  res.status(200).json({ isVerified: actual === address });
}
