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

import { Show } from "../../../components/ingredient/Show";
import { PagedCollection } from "../../../types/collection";
import { Ingredient } from "../../../types/Ingredient";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getIngredient = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Ingredient>(`/ingredients/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: ingredient, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Ingredient> | undefined>(["ingredient", id], () =>
    getIngredient(id)
  );
  const ingredientData = useMercure(ingredient, hubURL);

  if (!ingredientData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Ingredient ${ingredientData["@id"]}`}</title>
        </Head>
      </div>
      <Show ingredient={ingredientData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["ingredient", id], () => getIngredient(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Ingredient>>("/ingredients");
  const paths = await getItemPaths(
    response,
    "ingredients",
    "/ingredients/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
