import { Item } from "./item";

export class IngredientInMeal implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public quantity?: number,
    public ingredient?: string
  ) {
    this["@id"] = _id;
  }
}
