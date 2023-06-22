import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getMeals,
  getMealsPath,
} from "../../../components/meal/PageList";
import { PagedCollection } from "../../../types/collection";
import { Meal } from "../../../types/Meal";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getMealsPath(page), getMeals(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Meal>>("/meals");
  const paths = await getCollectionPaths(
    response,
    "meals",
    "/meals/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
