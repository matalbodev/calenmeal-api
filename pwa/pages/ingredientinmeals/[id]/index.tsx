import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/ingredientinmeal/Show";
import { PagedCollection } from "../../../types/collection";
import { IngredientInMeal } from "../../../types/IngredientInMeal";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getIngredientInMeal = async (id: string | string[] | undefined) =>
  id
    ? await fetch<IngredientInMeal>(`/ingredient_in_meals/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: ingredientinmeal, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<IngredientInMeal> | undefined>(
    ["ingredientinmeal", id],
    () => getIngredientInMeal(id)
  );
  const ingredientinmealData = useMercure(ingredientinmeal, hubURL);

  if (!ingredientinmealData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show IngredientInMeal ${ingredientinmealData["@id"]}`}</title>
        </Head>
      </div>
      <Show ingredientinmeal={ingredientinmealData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["ingredientinmeal", id], () =>
    getIngredientInMeal(id)
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
  const paths = await getItemPaths(
    response,
    "ingredient_in_meals",
    "/ingredientinmeals/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
