import { Expense } from "./types/expense";
import { groupedExpenses } from "./utils";

describe("groupedExpenses", () => {
  beforeAll(() => {
    // Set the locale to be used by date-fns
    // This is required for the tests to pass
    // See https://github.com/date-fns/date-fns/issues/1337
    jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
  });
  it("should group expenses by category", () => {
    const expenses: Expense[] = [
      {
        name: "Concert",
        amount: 10,
        category: "concert",
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        name: "Restaurant 1",
        amount: 10,
        category: "restaurant",
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        name: "Restaurant",
        amount: 20,
        category: "restaurant",
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    const grouped = groupedExpenses({ expenses });

    expect(grouped).toEqual({
      concert: [
        {
          name: "Concert",
          amount: 10,
          category: "concert",
          startDate: new Date(),
          endDate: new Date(),
        },
      ],
      restaurant: [
        {
          name: "Restaurant 1",
          amount: 10,
          category: "restaurant",
          startDate: new Date(),
          endDate: new Date(),
        },
        {
          name: "Restaurant",
          amount: 20,
          category: "restaurant",
          startDate: new Date(),
          endDate: new Date(),
        },
      ],
    });
  });
});
