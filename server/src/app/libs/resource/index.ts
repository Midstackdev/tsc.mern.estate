import { DelegatesToResource } from "./DelegatesToResource";

export class Resource extends DelegatesToResource {
  constructor(public object: any, public wrap = false) {
    super(object);

    return this.instantiate();
  }

  private instantiate() {
    const data = this.toArray();

    if (this.wrap) {
      return {
        data,
      };
    }

    return data;
  }

  static collection(array: any, wrap = false) {
    array = array || [];
    const collection = array.data ? array.data : array;

    const data = collection.map((item: any) => new this(item, false));

    if (array.data) {
      return Object.assign({}, array, {
        data,
      });
    }

    if (wrap) {
      return {
        data,
      };
    }

    return data;
  }

  toArray() {
    return Object.assign({}, this.resource);
  }
}
