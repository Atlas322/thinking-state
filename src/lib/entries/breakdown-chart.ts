// @inai/thinking-state/breakdown-chart — one component per entry, so a page loads only what it mounts (screens.23).
export * from "../../library/breakdown-chart";
/** No props: the component draws its own built-in ac.me demo. */
export const breakdownChartDemo = {};

import type { BreakdownChartProps } from "../../library/breakdown-chart";
const CATS = ["Түлш", "Цалин", "Засвар үйлчилгээ", "Агуулахын түрээс", "Бусад"];
const SEP = [268, 280, 54, 60, 52], OCT = [312, 285, 96, 60, 47]; // сая ₮; October adds up to 800, as in the FinanceReport demo
/** Role demo · finance (ac.me Cargo): where the month's costs went, against the month before. */
export const breakdownChartFinanceDemo: BreakdownChartProps = {
  title: "Зардлын бүтэц",
  records: CATS.flatMap((c, i) => [{ category: c, month: "9-р сар", amount: SEP[i] }, { category: c, month: "10-р сар", amount: OCT[i] }]),
  dimensions: [
    { key: "category", label: "Ангилал", values: CATS },
    { key: "month", label: "Сар", values: ["9-р сар", "10-р сар"], colors: { "9-р сар": "var(--ts-series-1)", "10-р сар": "var(--ts-series-2)" } },
  ],
  measures: [{ key: "amount", label: "Зардал", unit: "сая ₮", field: "amount" }],
  defaultMeasure: "amount",
  defaultSlice: "category",
  defaultSegment: "month",
};
