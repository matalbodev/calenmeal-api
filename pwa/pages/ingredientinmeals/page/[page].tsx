import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getIngredientInMeals,
  getIngredientInMealsPath,
} from "../../../components/ingredientinmeal/PageList";
import { PagedCollection } from "../../../types/collection";
import { IngredientInMeal } from "../../../types/IngredientInMeal";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getIngredientInMealsPath(page),
    getIngredientInMeals(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<IngredientInMeal>>(
    "/ingredient_in_meals"
  );
  const paths = await getCollectionPaths(
    response,
    "ingredient_in_meals",
    "/ingredientinmeals/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
