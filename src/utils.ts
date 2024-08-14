import { Expense } from "./types/expense";

export const groupedExpenses = ({ expenses }: { expenses: Expense[] }) => {
  const expensesByCategory: Record<string, Expense[]> = {};

  expenses.forEach((expense) => {
    if (!expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] = [];
    }

    expensesByCategory[expense.category].push(expense);
  });

  return expensesByCategory;
};
