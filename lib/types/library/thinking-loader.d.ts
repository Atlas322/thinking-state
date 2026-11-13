export type ThinkingLoaderProps = {
    /** Labels to walk through, one after another */
    phases?: string[];
    /** Time per phase, in ms */
    interval?: number;
    /** Show a specific phase instead of advancing on a timer – e.g. from your stream events */
    phase?: number;
    /** Start over after the last phase instead of holding it */
    loop?: boolean;
    /** Finished: the spinner turns into a check and the label into doneLabel */
    done?: boolean;
    /** Label once done – a string, or a function that gets the seconds since the loader started */
    doneLabel?: string | ((seconds: number) => string);
    size?: "sm" | "md";
    /** "pill" = bordered capsule, "plain" = just the spinner and the label, e.g. inside a chat bubble */
    variant?: "pill" | "plain";
    className?: string;
};
export declare function ThinkingLoader({ phases: phasesProp, interval: intervalProp, phase, loop, done, doneLabel, size, variant, className, }: ThinkingLoaderProps): import("react").JSX.Element;
/** Working example; use the named ThinkingLoader export in your application. */
export default function Demo(): import("react").JSX.Element;
