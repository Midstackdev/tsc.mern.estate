import { Resource } from "../../libs/resource";

export class UserResource extends Resource {
  // We need to ensure that the values from the databse has initial values set
  _id!: string;
  name!: string;
  firstname!: string;
  lastname!: string;
  createdAt!: Date;
  email!: string;

  toArray() {
    return {
      id: this._id.toString(),
      name: this.name ?? `${this.firstname} ${this.lastname}`,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}
