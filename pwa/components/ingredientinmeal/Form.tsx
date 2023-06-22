import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { IngredientInMeal } from "../../types/IngredientInMeal";

interface Props {
  ingredientinmeal?: IngredientInMeal;
}

interface SaveParams {
  values: IngredientInMeal;
}

interface DeleteParams {
  id: string;
}

const saveIngredientInMeal = async ({ values }: SaveParams) =>
  await fetch<IngredientInMeal>(
    !values["@id"] ? "/ingredient_in_meals" : values["@id"],
    {
      method: !values["@id"] ? "POST" : "PUT",
      body: JSON.stringify(values),
    }
  );

const deleteIngredientInMeal = async (id: string) =>
  await fetch<IngredientInMeal>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ ingredientinmeal }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<IngredientInMeal> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveIngredientInMeal(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<IngredientInMeal> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteIngredientInMeal(id), {
    onSuccess: () => {
      router.push("/ingredientinmeals");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!ingredientinmeal || !ingredientinmeal["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: ingredientinmeal["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/ingredientinmeals"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {ingredientinmeal
          ? `Edit IngredientInMeal ${ingredientinmeal["@id"]}`
          : `Create IngredientInMeal`}
      </h1>
      <Formik
        initialValues={
          ingredientinmeal
            ? {
                ...ingredientinmeal,
              }
            : new IngredientInMeal()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/ingredient_in_meals");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="shadow-md p-4" onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="ingredientinmeal_quantity"
              >
                quantity
              </label>
              <input
                name="quantity"
                id="ingredientinmeal_quantity"
                value={values.quantity ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.quantity && touched.quantity ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.quantity && touched.quantity ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="quantity"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="ingredientinmeal_ingredient"
              >
                ingredient
              </label>
              <input
                name="ingredient"
                id="ingredientinmeal_ingredient"
                value={values.ingredient ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.ingredient && touched.ingredient
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.ingredient && touched.ingredient ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="ingredient"
              />
            </div>
            {status && status.msg && (
              <div
                className={`border px-4 py-3 my-4 rounded ${
                  status.isValid
                    ? "text-cyan-700 border-cyan-500 bg-cyan-200/50"
                    : "text-red-700 border-red-400 bg-red-100"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="inline-block mt-2 bg-cyan-500 hover:bg-cyan-700 text-sm text-white font-bold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <div className="flex space-x-2 mt-4 justify-end">
        {ingredientinmeal && (
          <button
            className="inline-block mt-2 border-2 border-red-400 hover:border-red-700 hover:text-red-700 text-sm text-red-400 font-bold py-2 px-4 rounded"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
