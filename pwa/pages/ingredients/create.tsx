import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/ingredient/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Ingredient</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
