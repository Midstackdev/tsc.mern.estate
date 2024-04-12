export class Http {
  private static async jsonFetch({
    url,
    method,
    body,
    headers,
    options,
  }: Record<string, any>) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(headers && { ...headers }),
        },
        ...(body && { body: JSON.stringify(body) }),
        ...(options && { ...options }),
      });
      if (!res.ok) {
        return Promise.reject(res);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.log("Fetch Client Error" + error);
      throw error;
    }
  }

  public static post(
    url: string,
    headers: object,
    options: object,
    body: object
  ) {
    return this.jsonFetch({ url, method: "POST", body, headers, options });
  }

  public static get(url: string, headers: object, options: object) {
    return this.jsonFetch({ url, method: "GET", headers, options });
  }
  static delete() {}
  static retry() {}
}
