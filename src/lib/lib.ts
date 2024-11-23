"use server";
import argon2 from "argon2";

export const verifyPassword = async (
  inputPassword: string,
  storedHash: string
): Promise<boolean> => {
  const isMatch = await argon2.verify(storedHash, inputPassword);
  return isMatch;
};
