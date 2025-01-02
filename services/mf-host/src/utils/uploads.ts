import { SignUrlArgs } from "@/types";

const getSHA256Hash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const binaryString = hashArray.map((byte) => String.fromCharCode(byte)).join("");
  return btoa(binaryString);
};

export const getSignUrlArgs = async (file: File): Promise<SignUrlArgs> => {
  const { type } = file;
  const checksum = await getSHA256Hash(file);

  return { type, checksum };
};
