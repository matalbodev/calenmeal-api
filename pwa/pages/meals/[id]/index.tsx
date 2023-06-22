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

import { Show } from "../../../components/meal/Show";
import { PagedCollection } from "../../../types/collection";
import { Meal } from "../../../types/Meal";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getMeal = async (id: string | string[] | undefined) =>
  id ? await fetch<Meal>(`/meals/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: meal, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Meal> | undefined>(["meal", id], () => getMeal(id));
  const mealData = useMercure(meal, hubURL);

  if (!mealData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Meal ${mealData["@id"]}`}</title>
        </Head>
      </div>
      <Show meal={mealData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["meal", id], () => getMeal(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Meal>>("/meals");
  const paths = await getItemPaths(response, "meals", "/meals/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
