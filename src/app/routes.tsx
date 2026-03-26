import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { ExpenseTracker } from "./components/ExpenseTracker";
import { InvestmentTracker } from "./components/InvestmentTracker";
import { RenovationTracker } from "./components/RenovationTracker";
import { MortgageTracker } from "./components/MortgageTracker";
import { Settings } from "./components/Settings";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "expenses", Component: ExpenseTracker },
      { path: "investments", Component: InvestmentTracker },
      { path: "renovation", Component: RenovationTracker },
      { path: "mortgage", Component: MortgageTracker },
      { path: "settings", Component: Settings },
    ],
  },
]);
