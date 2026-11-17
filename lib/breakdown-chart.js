import { B } from "./chunks/breakdown-chart-Zy4yxOg5.js";
const breakdownChartDemo = {};
const CATS = ["Түлш", "Цалин", "Засвар үйлчилгээ", "Агуулахын түрээс", "Бусад"];
const SEP = [268, 280, 54, 60, 52], OCT = [312, 285, 96, 60, 47];
const breakdownChartFinanceDemo = {
  title: "Зардлын бүтэц",
  records: CATS.flatMap((c, i) => [{ category: c, month: "9-р сар", amount: SEP[i] }, { category: c, month: "10-р сар", amount: OCT[i] }]),
  dimensions: [
    { key: "category", label: "Ангилал", values: CATS },
    { key: "month", label: "Сар", values: ["9-р сар", "10-р сар"], colors: { "9-р сар": "var(--ts-series-1)", "10-р сар": "var(--ts-series-2)" } }
  ],
  measures: [{ key: "amount", label: "Зардал", unit: "сая ₮", field: "amount" }],
  defaultMeasure: "amount",
  defaultSlice: "category",
  defaultSegment: "month"
};
export {
  B as BreakdownChart,
  breakdownChartDemo,
  breakdownChartFinanceDemo
};
//# sourceMappingURL=breakdown-chart.js.map
