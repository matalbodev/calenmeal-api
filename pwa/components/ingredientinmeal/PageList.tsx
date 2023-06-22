import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { IngredientInMeal } from "../../types/IngredientInMeal";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getIngredientInMealsPath = (
  page?: string | string[] | undefined
) => `/ingredient_in_meals${typeof page === "string" ? `?page=${page}` : ""}`;
export const getIngredientInMeals =
  (page?: string | string[] | undefined) => async () =>
    await fetch<PagedCollection<IngredientInMeal>>(
      getIngredientInMealsPath(page)
    );
const getPagePath = (path: string) =>
  `/ingredientinmeals/page/${parsePage("ingredient_in_meals", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: ingredientinmeals, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<IngredientInMeal>> | undefined>(
      getIngredientInMealsPath(page),
      getIngredientInMeals(page)
    );
  const collection = useMercure(ingredientinmeals, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>IngredientInMeal List</title>
        </Head>
      </div>
      <List ingredientinmeals={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
