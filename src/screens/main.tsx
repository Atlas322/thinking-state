// Preview page for the app screens: /screens.html?s=chat&theme=night&v=sidebar&still=1
import * as React from "react";
import { createRoot } from "react-dom/client";
import "../lib/tokens.css";
import { AppScreen, SCREENS, type ScreenKey, type ScreenTheme, type WindowVariant } from "./app-screens";
import { acmeDemo } from "./acme";

const q = new URLSearchParams(location.search);
function Preview() {
  const [screen, setScreen] = React.useState<ScreenKey>((SCREENS as string[]).includes(q.get("s") ?? "") ? (q.get("s") as ScreenKey) : "chat");
  return (
    <AppScreen
      screen={screen}
      onSelect={setScreen}
      data={acmeDemo}
      theme={(q.get("theme") as ScreenTheme) ?? "day"}
      variant={(q.get("v") as WindowVariant) ?? "tabs"}
      still={q.get("still") === "1"}
    />
  );
}
createRoot(document.getElementById("root")!).render(<Preview />);
