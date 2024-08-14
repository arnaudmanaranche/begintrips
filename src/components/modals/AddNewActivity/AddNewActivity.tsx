import { useOnboardingStore } from "@/stores/onboarding.store";
import { faker } from "@faker-js/faker";

import { ExpenseCategoryEnum } from "@/types/expense";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";

const steps = ["Select category", "Fill information"];

export const expenses = [
  { name: "Hotel", category: "hotel", emoji: "🛏️" },
  { name: "Transport", category: "transport", emoji: "🚌" },
  { name: "Concert", category: "concert", emoji: "🎵" },
  { name: "Restaurant", category: "restaurant", emoji: "🍲" },
  { name: "Sport", category: "sport", emoji: "🏀" },
  { name: "Musuem", category: "musuem", emoji: "🕌" },
];

function AddNewActivityView({ step, setStep }) {
  const [category, setCategory] = useState<ExpenseCategoryEnum | string>("");
  const updateJourney = useOnboardingStore((state) => state.updateJourney);
  const journey = useOnboardingStore((state) => state.journey);
  const [day, setDay] = useState<string>("");

  switch (step) {
    case "Select category":
      return (
        <>
          <div className="grid grid-cols-4 gap-5 mt-5">
            {expenses.map((expense) => (
              <div
                key={expense.name}
                className="border-[1px] flex flex-col items-center rounded-lg hover:bg-slate-200 p-4 cursor-pointer transition-colors"
                onClick={() => {
                  setCategory(expense.category);
                  setStep("Fill information");
                }}
              >
                {expense.emoji}
                <span>{expense.name}</span>
              </div>
            ))}
          </div>
          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </>
      );
    default:
      return (
        <div className="flex flex-col">
          <input type="text" placeholder="Name" />
          <input type="text" placeholder="Amount" />
          <select onChange={(e) => setDay(e.target.value)}>
            <option>Select a day</option>
            {journey.days.map((day) => (
              <option key={day.date.toString()}>
                {day.date.toDateString()}
              </option>
            ))}
          </select>
          <Dialog.Close asChild>
            <button
              onClick={() => {
                updateJourney({
                  name: faker.word.adjective(),
                  category,
                  amount: faker.finance.amount(),
                  startDate: new Date(day),
                  endDate: new Date(),
                  location: "",
                });
              }}
            >
              Add expense
            </button>
          </Dialog.Close>
        </div>
      );
  }
}

export function AddNewActivity() {
  const [step, setStep] = useState<keyof typeof steps>("Select category");
  const journey = useOnboardingStore((state) => state.journey);
  const budget = useOnboardingStore((state) => state.budget);
  const cbudget = journey.days.reduce((acc, day) => {
    return (
      acc +
      day.expenses.reduce((acc, expense) => {
        return acc + Number(expense.amount);
      }, 0)
    );
  }, 0);

  return (
    <>
      <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />

      <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[650px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
          Add a new activity
        </Dialog.Title>
        {cbudget > budget ? (
          <div className="bg-warning-light p-2 rounded-lg flex justify-center items-center space-x-2">
            <ExclamationTriangleIcon />
            <span>You are over budget</span>
          </div>
        ) : null}
        <AddNewActivityView step={step} setStep={setStep} />
      </Dialog.Content>
    </>
  );
}
