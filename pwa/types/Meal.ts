import { Item } from "./item";

export class Meal implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public mealTime?: string,
    public date?: Date,
    public image?: string,
    public ingredients?: string[]
  ) {
    this["@id"] = _id;
  }
}
