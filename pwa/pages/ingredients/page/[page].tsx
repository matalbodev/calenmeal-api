import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getIngredients,
  getIngredientsPath,
} from "../../../components/ingredient/PageList";
import { PagedCollection } from "../../../types/collection";
import { Ingredient } from "../../../types/Ingredient";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    getIngredientsPath(page),
    getIngredients(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Ingredient>>("/ingredients");
  const paths = await getCollectionPaths(
    response,
    "ingredients",
    "/ingredients/page/[page]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
