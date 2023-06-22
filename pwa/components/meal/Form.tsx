import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Meal } from "../../types/Meal";

interface Props {
  meal?: Meal;
}

interface SaveParams {
  values: Meal;
}

interface DeleteParams {
  id: string;
}

const saveMeal = async ({ values }: SaveParams) =>
  await fetch<Meal>(!values["@id"] ? "/meals" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteMeal = async (id: string) =>
  await fetch<Meal>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ meal }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Meal> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveMeal(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Meal> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteMeal(id), {
    onSuccess: () => {
      router.push("/meals");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!meal || !meal["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: meal["@id"] });
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl mt-4">
      <Link
        href="/meals"
        className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
      >
        {`< Back to list`}
      </Link>
      <h1 className="text-3xl my-2">
        {meal ? `Edit Meal ${meal["@id"]}` : `Create Meal`}
      </h1>
      <Formik
        initialValues={
          meal
            ? {
                ...meal,
              }
            : new Meal()
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
                router.push("/meals");
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
                htmlFor="meal_name"
              >
                name
              </label>
              <input
                name="name"
                id="meal_name"
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
                htmlFor="meal_mealTime"
              >
                mealTime
              </label>
              <input
                name="mealTime"
                id="meal_mealTime"
                value={values.mealTime ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.mealTime && touched.mealTime ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.mealTime && touched.mealTime ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="mealTime"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="meal_date"
              >
                date
              </label>
              <input
                name="date"
                id="meal_date"
                value={values.date?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.date && touched.date ? "border-red-500" : ""
                }`}
                aria-invalid={errors.date && touched.date ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="date"
              />
            </div>
            <div className="mb-2">
              <label
                className="text-gray-700 block text-sm font-bold"
                htmlFor="meal_image"
              >
                image
              </label>
              <input
                name="image"
                id="meal_image"
                value={values.image ?? ""}
                type="text"
                placeholder=""
                className={`mt-1 block w-full ${
                  errors.image && touched.image ? "border-red-500" : ""
                }`}
                aria-invalid={
                  errors.image && touched.image ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="text-xs text-red-500 pt-1"
                component="div"
                name="image"
              />
            </div>
            <div className="mb-2">
              <div className="text-gray-700 block text-sm font-bold">
                ingredients
              </div>
              <FieldArray
                name="ingredients"
                render={(arrayHelpers) => (
                  <div className="mb-2" id="meal_ingredients">
                    {values.ingredients && values.ingredients.length > 0 ? (
                      values.ingredients.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`ingredients.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
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
        {meal && (
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
