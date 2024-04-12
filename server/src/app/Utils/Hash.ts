/**
 *  Cryptography Functions
 *
 *  Forked from AndiDittrich/AesUtil.js
 *  https://gist.github.com/AndiDittrich/4629e7db04819244e843
 */

import crypto, { CipherGCM, CipherGCMTypes, DecipherGCM } from "crypto";
import { Password } from "../types";
import fs from "fs";
import { rootPath } from "../libs/utils/helpers";

export class Encrypter {
  /**
   * Get encryption/decryption algorithm
   */
  private static getAlgorithm(): CipherGCMTypes {
    return "aes-256-gcm";
  }

  /**
   * Get encrypted string prefix
   */
  private static getEncryptedPrefix(): string {
    return "enc::";
  }

  /**
   * Derive 256 bit encryption key from password, using salt and iterations -> 32 bytes
   * @param password
   * @param salt
   * @param iterations
   */
  private static deriveKeyFromPassword(
    password: Password,
    salt: Buffer,
    iterations: number
  ): Buffer {
    return crypto.pbkdf2Sync(password, salt, iterations, 32, "sha512");
  }

  /**
   * Encrypt AES 256 GCM
   * @param plainText
   * @param password
   */
  public static encryptAesGcm(
    plainText: string | object,
    password: Password
  ): string | undefined {
    try {
      if (typeof plainText === "object") {
        plainText = JSON.stringify(plainText);
      } else {
        plainText = String(plainText);
      }

      const algorithm: CipherGCMTypes = this.getAlgorithm();

      // Generate random salt -> 64 bytes
      const salt = crypto.randomBytes(64);

      // Generate random initialization vector -> 16 bytes
      const iv = crypto.randomBytes(16);

      // Generate random count of iterations between 10.000 - 99.999 -> 5 bytes
      const iterations =
        Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

      // Derive encryption key
      const encryptionKey = this.deriveKeyFromPassword(
        password,
        salt,
        Math.floor(iterations * 0.47 + 1337)
      );

      // Create cipher
      // @ts-ignore: TS expects the wrong createCipher return type here
      const cipher: CipherGCM = crypto.createCipheriv(
        algorithm,
        encryptionKey,
        iv
      );

      // Update the cipher with data to be encrypted and close cipher
      const encryptedData = Buffer.concat([
        cipher.update(plainText, "utf8"),
        cipher.final(),
      ]);

      // Get authTag from cipher for decryption // 16 bytes
      const authTag = cipher.getAuthTag();

      // Join all data into single string, include requirements for decryption
      const output = Buffer.concat([
        salt,
        iv,
        authTag,
        Buffer.from(iterations.toString()),
        encryptedData,
      ]).toString("hex");

      return this.getEncryptedPrefix() + output;
    } catch (error) {
      console.error("Encryption failed!");
      console.error(error);
      return void 0;
    }
  }

  /**
   * Decrypt AES 256 GCM
   * @param cipherText
   * @param password
   */
  public static decryptAesGcm(
    cipherText: string,
    password: Password
  ): string | undefined {
    try {
      const algorithm: CipherGCMTypes = this.getAlgorithm();

      const cipherTextParts = cipherText.split(this.getEncryptedPrefix());

      // If it's not encrypted by this, reject with undefined
      if (cipherTextParts.length !== 2) {
        console.error(
          "Could not determine the beginning of the cipherText. Maybe not encrypted by this method."
        );
        return void 0;
      } else {
        cipherText = cipherTextParts[1];
      }

      const inputData: Buffer = Buffer.from(cipherText, "hex");

      // Split cipherText into partials
      const salt: Buffer = inputData.subarray(0, 64);
      const iv: Buffer = inputData.subarray(64, 80);
      const authTag: Buffer = inputData.subarray(80, 96);
      const iterations: number = parseInt(
        inputData.subarray(96, 101).toString("utf-8"),
        10
      );
      const encryptedData: Buffer = inputData.subarray(101);

      // Derive key
      const decryptionKey = this.deriveKeyFromPassword(
        password,
        salt,
        Math.floor(iterations * 0.47 + 1337)
      );

      // Create decipher
      // @ts-ignore: TS expects the wrong createDecipher return type here
      const decipher: DecipherGCM = crypto.createDecipheriv(
        algorithm,
        decryptionKey,
        iv
      );
      decipher.setAuthTag(authTag);

      // Decrypt data
      // @ts-ignore: TS expects the wrong createDecipher return type here
      // const decrypted =
      //   decipher.update(encryptedData, "binary", "utf-8") +
      //   decipher.final("utf-8");

      const decrypted = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]).toString();

      try {
        return JSON.parse(decrypted);
      } catch (error) {
        return decrypted;
      }
    } catch (error) {
      console.error("Decryption failed!");
      console.error(error);
      return void 0;
    }
  }

  public static sign(data: any) {
    const privateKey = fs.readFileSync(`${rootPath}/private-key.pem`, "utf8");
    const sign = crypto.createSign("SHA1");
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey);
    // console.log("Signature:", signature.toString("base64"));
    return signature.toString("hex");
  }

  public static verify(data: any, signature: any) {
    const publicKey = fs.readFileSync(`${rootPath}/public-key.pem`, "utf8");
    const verify = crypto.createVerify("SHA1");
    verify.update(data);
    // verify.write(data);
    verify.end();
    const verified = verify.verify(publicKey, signature, "hex");

    // console.log("===Hashes===:", crypto.getHashes());
    return verified;
  }

  public static SHA1(str: string) {
    return crypto.createHash("sha1").update(str).digest("hex");
  }

  public static SHA256(str: string) {
    return crypto.createHmac("sha256", "secret").update(str).digest("hex");
  }

  public static hashEquals(uknownstr: string, hashstring: string) {
    return uknownstr === hashstring;
  }
}
