// @vitest-environment jsdom
// A component on a landing page must never move the page by itself (site home v32 jumped 750 px on
// load: IntegrationPicker scrolled its selected row into view, and scrollIntoView scrolls every ancestor).
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import IntegrationPickerDemo from "./library/integration-picker";

afterEach(cleanup);

describe("components do not scroll the page on mount", () => {
  it("IntegrationPicker keeps its selected row in view without scrollIntoView", () => {
    const spy = vi.fn();
    Element.prototype.scrollIntoView = spy;
    render(<IntegrationPickerDemo />);
    expect(spy).not.toHaveBeenCalled();
  });
});
