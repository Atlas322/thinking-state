import { type ComponentPropsWithRef, type ReactNode } from "react";
export type SwitchProps = Omit<ComponentPropsWithRef<"input">, "type" | "size" | "role"> & {
    /** Shown next to the switch; clicking it toggles */
    label?: ReactNode;
    /** A quiet second line under the label */
    description?: ReactNode;
    /** start: the switch before the text · end: after it, across the row – the settings look */
    placement?: "start" | "end";
    /** sm 16 · md 20 high */
    size?: "sm" | "md";
};
export declare function Switch({ label, description, placement, size, className, id, disabled, ref, "aria-describedby": describedBy, ...rest }: SwitchProps): import("react").JSX.Element;
/** Working example; use the named Switch export in your application. */
export default function Demo(): import("react").JSX.Element;
