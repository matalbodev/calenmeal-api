import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/ingredientinmeal/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create IngredientInMeal</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
