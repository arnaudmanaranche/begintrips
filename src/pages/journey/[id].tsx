import "whatwg-fetch";

import { CircularProgress } from "@/components/CircleProgress/CircleProgress";
import * as Dialog from "@radix-ui/react-dialog";
import { CaretRightIcon, Cross2Icon } from "@radix-ui/react-icons";

import { ExpenseLabel } from "@/components/ExpenseLabel/ExpenseLabel";
import { AddNewActivity } from "@/components/modals/AddNewActivity/AddNewActivity";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { Expense } from "@/types/expense";
import { groupedExpenses } from "@/utils";
import clsx from "clsx";
import { addDays, differenceInDays, format } from "date-fns";
import { Poppins } from "next/font/google";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Map from "react-map-gl";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

export default function Journey() {
  const journey = useOnboardingStore((state) => state.journey);
  const budget = useOnboardingStore((state) => state.budget);
  const setBudget = useOnboardingStore((state) => state.setBudget);
  const removeExpense = useOnboardingStore((state) => state.removeExpense);
  const expensess = groupedExpenses({
    expenses: journey.days.flatMap((day) => day.expenses),
  });
  const result2 = differenceInDays(journey.startDate, new Date());

  const [photos, setPhotos] = useState(
    "https://images.unsplash.com/photo-1497033901579-ae6c1fad6313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDMzMjB8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjM1NjI1Nzd8&ixlib=rb-4.0.3&q=80&w=1080"
  );

  // useEffect(() => {
  //   async function fetchData() {
  //     await unsplash.photos
  //       .getRandom({
  //         query: "new york",
  //         orientation: "landscape",
  //         count: 1,
  //       })
  //       .then((response) => {
  //         setPhotos(response.response[0].urls.regular);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }

  //   fetchData();
  // }, []);

  return (
    <Dialog.Root>
      <Head>
        <title>Planner.so | New York</title>
      </Head>
      <nav className="pt-6 px-10 flex justify-between">
        <div className="bg-white rounded-2xl p-4">Planner.so</div>
        <div className="bg-white rounded-2xl p-4">AM</div>
      </nav>
      <div className="relative h-screen pt-6 px-10">
        <div className="flex space-x-4">
          <div className="flex flex-col flex-1">
            <div className="bg-white border-2 p-4 rounded-2xl min-h-[800px]">
              <div className="min-h-[400px] relative">
                <Image
                  className="rounded-2xl"
                  src={photos}
                  alt="photo"
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute flex-col left-4 bottom-4 rounded-2xl min-h-[130px] bg-white flex w-[400px] p-4 drop-shadow-md">
                  <p className={clsx(poppins.className, "text-xl")}>
                    Traveling to {journey.location}
                  </p>
                  <span>
                    {format(journey.startDate, "dd LLL")} -{" "}
                    {format(journey.endDate, "dd LLL")}
                  </span>
                  <Map
                    mapboxAccessToken="pk.eyJ1IjoieHVyaWdvcnJpIiwiYSI6ImNsenNrejlxbjI3M2wyanM4MHBwc3hyeTIifQ.yiavISPSvWUmVGrcyJYp_g"
                    initialViewState={{
                      longitude: -74.006,
                      latitude: 40.7128,
                      zoom: 8,
                    }}
                    style={{ width: 350, height: 120 }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <h2 className={clsx(poppins.className, "text-3xl")}>
                  Upcoming schedule
                </h2>
                <div className="space-y-4 max-h-60 overflow-y-scroll">
                  {journey.days.map((j, index) => {
                    const date = addDays(journey.startDate, index);

                    return (
                      <div key={index} className="space-y-2">
                        <p>
                          Day {index + 1} - {format(date, "EEEE dd LLLL")}
                        </p>
                        <ul>
                          {j.expenses.map((expense) => (
                            <div
                              key={expense.name}
                              className="flex justify-between"
                            >
                              <div className="flex space-x-2 items-center">
                                <p className="text-lg">{expense.name}</p>
                                <ExpenseLabel
                                  expenseCategory={expense.category}
                                />
                              </div>
                              <span onClick={() => removeExpense(expense)}>
                                <Cross2Icon />
                              </span>
                            </div>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 space-y-4">
            <div
              className={clsx(
                poppins.className,
                "bg-white border-2 p-4 rounded-2xl flex flex-col justify-center space-y-3"
              )}
            >
              <h1 className="text-5xl text-black text-center leading-snug">
                {result2} days to go, <br />
                Arnaud
              </h1>

              <Dialog.Trigger
                asChild
                className="flex justify-center mx-auto space-x-2"
              >
                <div>
                  <input
                    type="text"
                    placeholder="I want to..."
                    className=" border-2 rounded-2xl text-black max-w-sm p-2"
                  />
                  <button className="bg-blue-500 text-white rounded-2xl w-10 h-10 flex justify-center items-center p-2">
                    <CaretRightIcon height={20} width={20} />
                  </button>
                </div>
              </Dialog.Trigger>
            </div>
            <div className="bg-white border-2 p-4 rounded-2xl space-y-3">
              <h2 className={clsx(poppins.className, "text-3xl")}>My budget</h2>
              <div className="flex flex-col space-y-3">
                {budget === 0 ? (
                  <div>
                    <p className="text-sm text-gray-500">
                      You don't have a budget yet.
                    </p>
                    <span>Set up a budget</span>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setBudget(parseInt(e.target.budget.value));
                      }}
                    >
                      <input type="number" placeholder="Budget" id="budget" />
                      <button type="submit">Set</button>
                    </form>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <CircularProgress />
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className={clsx(poppins.className, "text-2xl")}>
                    Expenses
                  </h2>
                  {Object.keys(expensess).length === 0 ? (
                    <p>No expenses yet</p>
                  ) : (
                    <ul>
                      {Object.entries(expensess).map(([category, expenses]) => (
                        <div key={category} className="flex justify-between">
                          <h2>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </h2>
                          <ul className="flex flex-col items-end">
                            {expenses.map((expense: Expense, index: number) => (
                              <li key={index}>
                                {expense.name}: ${expense.amount}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="flex">
            <div className="bg-white border-2 p-2 rounded-2xl flex-1">
              <h2>Weather</h2>
              <div className="flex mt-4 space-x-4">
                <div>
                  <p>Sunny</p>
                </div>
                <div>
                  <p>Sunny</p>
                </div>
                <div>
                  <p>Sunny</p>
                </div>
                <div>
                  <p>Sunny</p>
                </div>
                <div>
                  <p>Sunny</p>
                </div>
                <div>
                  <p>Sunny</p>
                </div>
              </div>
            </div>
          </div> */}
            {/* <div className="flex">
            <div className="bg-white border-2 p-2 rounded-2xl">
              <h2>My todolist</h2>
            </div>
            <div className="bg-white border-2 p-2 rounded-2xl">
              <h2>My documents</h2>
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <Dialog.Portal>
        <AddNewActivity />
      </Dialog.Portal>
    </Dialog.Root>
  );
}
