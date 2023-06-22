import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/meal/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Meal</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
