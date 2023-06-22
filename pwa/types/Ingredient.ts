import { Item } from "./item";

export class Ingredient implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public calories_per_100g?: number
  ) {
    this["@id"] = _id;
  }
}
