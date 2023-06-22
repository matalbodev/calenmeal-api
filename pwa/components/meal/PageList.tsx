import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Meal } from "../../types/Meal";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getMealsPath = (page?: string | string[] | undefined) =>
  `/meals${typeof page === "string" ? `?page=${page}` : ""}`;
export const getMeals = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Meal>>(getMealsPath(page));
const getPagePath = (path: string) => `/meals/page/${parsePage("meals", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: meals, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Meal>> | undefined
  >(getMealsPath(page), getMeals(page));
  const collection = useMercure(meals, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Meal List</title>
        </Head>
      </div>
      <List meals={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
