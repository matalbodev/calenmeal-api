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

import { Form } from "../../../components/ingredient/Form";
import { PagedCollection } from "../../../types/collection";
import { Ingredient } from "../../../types/Ingredient";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";

const getIngredient = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Ingredient>(`/ingredients/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: ingredient } = {} } = useQuery<
    FetchResponse<Ingredient> | undefined
  >(["ingredient", id], () => getIngredient(id));

  if (!ingredient) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{ingredient && `Edit Ingredient ${ingredient["@id"]}`}</title>
        </Head>
      </div>
      <Form ingredient={ingredient} />
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
    "/ingredients/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
