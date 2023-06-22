import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Ingredient } from "../../types/Ingredient";

interface Props {
  ingredient?: Ingredient;
}

interface SaveParams {
  values: Ingredient;
}

interface DeleteParams {
  id: string;
}

const saveIngredient = async ({ values }: SaveParams) =>
  await fetch<Ingredient>(!values["@id"] ? "/ingredients" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteIngredient = async (id: string) =>
  await fetch<Ingredient>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ ingredient }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Ingredient> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveIngredient(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Ingredient> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteIngredient(id), {
    onSuccess: () => {
      router.push("/ingredients");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!ingredient || !ingredient["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: ingredient["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/ingredients"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {ingredient
          ? `Edit Ingredient ${ingredient["@id"]}`
          : `Create Ingredient`}
      </h1>
      <Formik
        initialValues={
          ingredient
            ? {
                ...ingredient,
              }
            : new Ingredient()
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
                router.push("/ingredients");
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
                htmlFor="ingredient_name"
              >
                name
              </label>
              <input
                name="name"
                id="ingredient_name"
                value={values.name ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.name && touched.name ? "border-red-500" : ""
                }`}
                aria-invalid={errors.name && touched.name ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="name"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="ingredient_calories_per_100g"
              >
                calories_per_100g
              </label>
              <input
                name="calories_per_100g"
                id="ingredient_calories_per_100g"
                value={values.calories_per_100g ?? ""}
                type="number"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.calories_per_100g && touched.calories_per_100g
                    ? "border-red-500"
                    : ""
                }`}
                aria-invalid={
                  errors.calories_per_100g && touched.calories_per_100g
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="calories_per_100g"
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
        {ingredient && (
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
