import crypto from "crypto";

export class Base32 {
  private static readonly base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  private static readonly pad = "=";

  static encode(s: string): string {
    const a = this.base32Chars;
    const pad = this.pad;
    const len = s.length;
    let o = "";
    let w,
      c,
      r = 0,
      sh = 0; // word, character, remainder, shift

    for (let i = 0; i < len; i += 5) {
      c = s.charCodeAt(i);
      w = 0xf8 & c;
      o += a.charAt(w >> 3);
      r = 0x07 & c;
      sh = 2;

      if (i + 1 < len) {
        c = s.charCodeAt(i + 1);
        w = 0xc0 & c;
        o += a.charAt((r << 2) + (w >> 6));
        o += a.charAt((0x3e & c) >> 1);
        r = c & 0x01;
        sh = 4;
      }

      if (i + 2 < len) {
        c = s.charCodeAt(i + 2);
        w = 0xf0 & c;
        o += a.charAt((r << 4) + (w >> 4));
        r = 0x0f & c;
        sh = 1;
      }

      if (i + 3 < len) {
        c = s.charCodeAt(i + 3);
        w = 0x80 & c;
        o += a.charAt((r << 1) + (w >> 7));
        o += a.charAt((0x7c & c) >> 2);
        r = 0x03 & c;
        sh = 3;
      }

      if (i + 4 < len) {
        c = s.charCodeAt(i + 4);
        w = 0xe0 & c;
        o += a.charAt((r << 3) + (w >> 5));
        o += a.charAt(0x1f & c);
        r = 0;
        sh = 0;
      }
    }

    if (sh !== 0) {
      o += a.charAt(r << sh);
    }

    const padlen = 8 - (o.length % 8);

    if (padlen === 8) {
      return o;
    }
    if (padlen === 1) {
      return o + pad;
    }
    if (padlen === 3) {
      return o + pad + pad + pad;
    }
    if (padlen === 4) {
      return o + pad + pad + pad + pad;
    }
    if (padlen === 6) {
      return o + pad + pad + pad + pad + pad + pad;
    }

    console.log("There was some kind of error");
    console.log(`padlen:${padlen}, r:${r}, sh:${sh}, w:${w}`);
    throw new Error("Invalid Base32 character: " + o);
  }

  static decode(s: string): string {
    const len = s.length;
    const apad = this.base32Chars + this.pad;
    let v,
      x: any,
      r = 0,
      bits = 0,
      c,
      o = "";

    s = s.toUpperCase();

    for (let i = 0; i < len; i += 1) {
      v = apad.indexOf(s.charAt(i));

      if (v >= 0 && v < 32) {
        x = (x << 5) | v;
        bits += 5;

        if (bits >= 8) {
          c = (x >> (bits - 8)) & 0xff;
          o = o + String.fromCharCode(c);
          bits -= 8;
        }
      }
    }

    if (bits > 0) {
      c = ((x << (8 - bits)) & 0xff) >> (8 - bits);

      if (c !== 0) {
        o = o + String.fromCharCode(c);
      }
    }

    return o;
  }

  // generate a 24-character base32-encoded string
  public static generateRandom() {
    const buffer = crypto.randomBytes(15);
    const base32 = Base32.encode(buffer.toString("hex"))
      .replace(/=/g, "")
      .substring(0, 24);
    return base32;
  }
}

export class Base32Hex {
  private static readonly base32HexChars = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
  private static readonly pad = "=";

  static encode(s: string): string {
    return Base32.encode(s);
  }

  static decode(s: string): string {
    return Base32.decode(s);
  }
}
