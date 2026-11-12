import type { AutoScript } from "./motion/autoplay";

/**
 * Catalog preview stories (2026-11-13): the scripted "user" that plays on a
 * component that is otherwise still (see motion/autoplay.tsx). Each story is
 * ≥4 states and ends inside 5 s. Targets are roles / classes of the component.
 */
const opt = (nth: number) => ({ sel: '[role="option"]', nth });
export const autoplayScripts: Record<string, AutoScript> = {
  button: [{ wait: 700 }, { click: { sel: "button", text: "Хуулах", nth: 1 }, wait: 900 }, { click: { sel: "button", text: "Холбоос хуулах" }, wait: 900 }, { hover: { sel: "button", text: "Үргэлжлүүлэх" }, wait: 800 }, { click: { sel: "button", text: "Файл байршуулах" }, wait: 900 }],
  checkbox: [{ wait: 600 }, { click: { sel: "input[type=checkbox]", nth: 0 }, wait: 800 }, { click: { sel: "input[type=checkbox]", nth: 1 }, wait: 800 }, { click: { sel: "input[type=checkbox]", nth: 2 }, wait: 800 }, { click: { sel: "input[type=checkbox]", nth: 3 }, wait: 800 }],
  switch: [{ wait: 600 }, { click: { sel: "input[type=checkbox]", nth: 1 }, wait: 900 }, { click: { sel: "input[type=checkbox]", nth: 0 }, wait: 900 }, { click: { sel: "input[type=checkbox]", nth: 2 }, wait: 900 }, { click: { sel: "input[type=checkbox]", nth: 1 }, wait: 800 }],
  "text-field": [{ wait: 500 }, { type: { target: "input[type=text]", text: "Нүүдэл студи" }, wait: 1100 }, { type: { target: "input[type=email]", text: "sara@nuudel.mn" }, wait: 1200 }, { click: { sel: "button", text: "Нууц үг харах" }, wait: 800 }, { click: { sel: "button", text: "Хуулах" }, wait: 800 }],
  "text-area": [{ wait: 500 }, { type: { target: "textarea", text: "" }, wait: 200 }, { type: { target: { sel: "textarea", nth: 1 }, text: "Эхлээд урсгалыг, дараа нь тайланг харъя" }, wait: 2200 }, { click: "button.ui-tac__expand", wait: 1000 }],
  select: [{ wait: 500 }, { click: { sel: "button[role=combobox]", nth: 0 }, wait: 800 }, { click: opt(1), wait: 900 }, { click: { sel: "button[role=combobox]", nth: 1 }, wait: 800 }, { click: opt(2), wait: 900 }],
  combobox: [{ wait: 500 }, { click: "input[role=combobox]", wait: 700 }, { type: { target: "input[role=combobox]", text: "Са" }, wait: 900 }, { click: opt(0), wait: 900 }, { type: { target: "input[role=combobox]", text: "Бат" }, wait: 1000 }],
  "segmented-control": [{ wait: 500 }, { click: { sel: "button[role=radio]", nth: 1 }, wait: 800 }, { click: { sel: "button[role=radio]", nth: 2 }, wait: 800 }, { click: { sel: "button[role=radio]", nth: 5 }, wait: 800 }, { click: { sel: "button[role=radio]", nth: 8 }, wait: 800 }],
  "date-range-picker": [{ wait: 500 }, { click: "button.drp-trigger", wait: 1000 }, { click: { sel: "[role=gridcell] button, button[data-day]", nth: 6 }, wait: 900 }, { click: { sel: "[role=gridcell] button, button[data-day]", nth: 12 }, wait: 900 }, { click: "button.drp-trigger", wait: 700 }],
  "filter-menu": [{ wait: 500 }, { click: { sel: "button.ui-fmc__option", nth: 0 }, wait: 800 }, { click: { sel: "button.ui-fmc__option", nth: 2 }, wait: 800 }, { click: { sel: "button.ui-fmc__option", nth: 4 }, wait: 800 }, { click: "button.ui-fmc__clear", wait: 900 }],
  "tag-input": [{ wait: 500 }, { type: { target: "input.ui-tagc__input", text: "sara@acme.com" }, wait: 1300 }, { key: { target: "input.ui-tagc__input", key: "Enter" }, wait: 900 }, { type: { target: "input.ui-tagc__input", text: "bat@acme.com" }, wait: 1100 }, { key: { target: "input.ui-tagc__input", key: "Enter" }, wait: 800 }],
  "reaction-bar": [{ wait: 500 }, { click: { sel: "button.ui-rbc__btn", nth: 0 }, wait: 800 }, { click: { sel: "button.ui-rbc__btn", nth: 2 }, wait: 800 }, { click: { sel: "button.ui-rbc__btn", nth: 1 }, wait: 800 }, { click: { sel: "button.ui-rbc__btn", nth: 3 }, wait: 800 }],
  "command-menu": [{ wait: 500 }, { type: { target: "input[role=combobox]", text: "имэйл" }, wait: 1000 }, { key: { target: "input[role=combobox]", key: "ArrowDown" }, wait: 700 }, { type: { target: "input[role=combobox]", text: "" }, wait: 700 }, { key: { target: "input[role=combobox]", key: "ArrowDown" }, wait: 700 }],
  "profile-menu": [{ wait: 500 }, { hover: { sel: "button.ui-pmc__item", nth: 0 }, wait: 800 }, { hover: { sel: "button.ui-pmc__item", nth: 1 }, wait: 800 }, { click: "button.ui-pmc__next", wait: 1000 }, { hover: { sel: "button.ui-pmc__item", nth: 2 }, wait: 800 }],
  "stepper-form": [{ wait: 500 }, { type: { target: "input.sf-input", text: "Нүүдэл студи" }, wait: 1100 }, { click: "button.sf-btn", wait: 1000 }, { click: "button.sf-btn", wait: 1000 }, { click: "button.sf-btn", wait: 900 }],
};
