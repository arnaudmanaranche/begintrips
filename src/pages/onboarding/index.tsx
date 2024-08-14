import clsx from "clsx";
import Head from "next/head";

import { Callout } from "@/components/Callout/Callout";
import { useOnboardingStore } from "@/stores/onboarding.store";
import { formatISO, isBefore, isPast } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

const steps = [1, 2, 3];

function Title({ children, rest }: { children: ReactNode }) {
  return (
    <motion.label
      layout
      animate={{ opacity: 1 }}
      {...rest}
      className={clsx("text-5xl text-primary-dark", poppins.className)}
    >
      {children}
    </motion.label>
  );
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const setDestination = useOnboardingStore((state) => state.setDestination);

  return (
    <>
      <Head>
        <title>Planner.so | Onboarding</title>
      </Head>
      <div className="max-w-screen-lg mx-auto mt-20">
        <div className="flex justify-between max-w-screen-md mx-auto divide-2 divide-primary-dark divide-solid">
          <AnimatePresence>
            {steps.map((step, index) => {
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  key={index + 1}
                  className={clsx(
                    "flex h-10 w-10 rounded-full justify-center items-center",
                    currentStep >= index && "bg-primary-light"
                  )}
                >
                  <div>{step}</div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <Layout step={currentStep} setStep={setCurrentStep}>
          <Steps step={currentStep} />
        </Layout>
      </div>
    </>
  );
}

function Layout({ step, setStep, children }) {
  const router = useRouter();
  const updateDays = useOnboardingStore((state) => state.updateDays);
  const journey = useOnboardingStore((state) => state.journey);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex flex-col justify-center">
      {hasError ? <Callout>You can't go back</Callout> : null}
      <div className="my-20">{children}</div>
      <div className="flex justify-center space-x-4">
        {step > 0 ? (
          <button
            className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            onClick={() => setStep((prev) => prev - 1)}
          >
            Prev
          </button>
        ) : null}
        {step === steps.length - 1 ? (
          <button
            className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            onClick={() => {
              updateDays();
              router.push("/journey/1");
            }}
          >
            Finish
          </button>
        ) : (
          <button
            className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
            onClick={() => {
              if (
                step === 1 &&
                (isPast(journey.startDate) ||
                  isPast(journey.endDate) ||
                  isBefore(journey.endDate, journey.startDate))
              ) {
                setHasError(true);
              } else {
                setHasError(false);
                setStep((prev) => prev + 1);
              }
            }}
            disabled={step === 0 && !journey.location}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

function Steps({ step }) {
  switch (step) {
    case 0:
      return <Step1 />;
    case 1:
      return <Step2 />;
    case 2:
      return <Step3 />;
    default:
      return <div>Step 4</div>;
  }
}

function Step1() {
  const setDestination = useOnboardingStore((state) => state.setDestination);
  const journey = useOnboardingStore((state) => state.journey);

  return (
    <div className="flex justify-center flex-col items-center space-y-4">
      <Title htmlFor="cities">Where do you go ?</Title>
      <select
        name="cities"
        id="cities"
        onChange={(e) => setDestination(e.target.value)}
        defaultValue={journey.location}
      >
        <option value="">Please choose a city</option>
        <option value="new-york">New York</option>
        <option value="london">London</option>
        <option value="paris">Paris</option>
      </select>
    </div>
  );
}

function Step2() {
  const setFrom = useOnboardingStore((state) => state.setFrom);
  const setTo = useOnboardingStore((state) => state.setTo);
  const journey = useOnboardingStore((state) => state.journey);

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <Title>When do you plan to go to ?</Title>

      <div className="flex space-x-4">
        <label htmlFor="start">Start date:</label>
        <input
          onChange={(e) => setFrom(e.target.value)}
          type="date"
          defaultValue={formatISO(new Date(journey.startDate), {
            representation: "date",
          })}
          id="start"
          name="trip-start"
        />
      </div>
      <div className="flex space-x-4">
        <label htmlFor="back">Back date:</label>
        <input
          onChange={(e) => setTo(e.target.value)}
          defaultValue={formatISO(new Date(journey.endDate), {
            representation: "date",
          })}
          type="date"
          id="back"
          name="trip-end"
        />
      </div>
    </div>
  );
}

function Step3() {
  const budget = useOnboardingStore((state) => state.budget);
  const setBudget = useOnboardingStore((state) => state.setBudget);
  const router = useRouter();
  const updateDays = useOnboardingStore((state) => state.updateDays);

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <Title>What is your budget ?</Title>
      <input
        defaultValue={budget}
        onChange={(e) => setBudget(parseInt(e.target.value))}
      />
      <p
        onClick={() => {
          updateDays();
          setBudget(0);
          router.push("/journey/1");
        }}
        className="text-sm text-gray-500"
      >
        I don't have a budget yet
      </p>
    </div>
  );
}
