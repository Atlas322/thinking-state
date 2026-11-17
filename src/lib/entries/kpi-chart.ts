// @inai/thinking-state/kpi-chart — one component per entry, so a page loads only what it mounts (screens.23).
export * from "../../library/kpi-chart";
/** No props: the component draws its own built-in ac.me demo. */
export const kPIChartDemo = {};

import type { KPIChartProps } from "../../library/kpi-chart";
/** Role demo · finance (ac.me Cargo): money in and out over six months — the same numbers as the FinanceReport demo. */
export const kPIChartFinanceDemo: KPIChartProps = {
  title: "Орох ба гарах мөнгө · сая ₮",
  value: "1 615 сая",
  delta: 230,
  labels: ["5-р", "6-р", "7-р", "8-р", "9-р", "10-р"],
  tooltipLabels: ["5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар"],
  series: [
    { label: "Орох мөнгө", color: "var(--ts-series-1)", values: [980, 1040, 1110, 1150, 1180, 1240] },
    { label: "Гарах мөнгө", color: "var(--ts-series-2)", values: [760, 780, 820, 850, 890, 1010] },
  ],
  footer: "ac.me Cargo · мөнгөн үлдэгдэл, 10-р сарын эцэст",
};
