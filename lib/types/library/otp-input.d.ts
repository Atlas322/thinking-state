import { type ReactNode } from "react";
export type OtpStatus = "idle" | "verifying" | "error" | "success";
export type OtpInputProps = {
    /** Number of boxes */
    length?: number;
    /** A small dash between the boxes – `true` puts it in the middle, a number after that many boxes */
    separator?: boolean | number;
    /** Digits only (numeric keyboard on phones); `false` allows letters too, shown in capitals */
    numeric?: boolean;
    /** The code – makes it controlled */
    value?: string;
    /** Starting code when uncontrolled */
    defaultValue?: string;
    onChange?: (code: string) => void;
    /** Called once the last box is filled – typed, pasted or autofilled */
    onComplete?: (code: string) => void;
    status?: OtpStatus;
    /** Shown below the boxes while `status` is "error" */
    errorMessage?: ReactNode;
    /** Clears the boxes shortly after an error, ready for the next try */
    clearOnError?: boolean;
    /** Text in the pill after a successful check */
    successLabel?: string;
    /** Shows "Resend code" below the boxes once the countdown is over */
    onResend?: () => void;
    /** Seconds until the code can be resent */
    resendIn?: number;
    /** Center the boxes and the lines below them */
    align?: "start" | "center";
    disabled?: boolean;
    autoFocus?: boolean;
    /** Accessible name of the field */
    label?: string;
    className?: string;
};
export declare function OtpInput({ length: lengthProp, separator, numeric, value, defaultValue, onChange, onComplete, status, errorMessage, clearOnError, successLabel, onResend, resendIn: resendInProp, align, disabled, autoFocus, label, className, }: OtpInputProps): React.JSX.Element;
import * as React from "react";
/** Working example; use the named OtpInput export in your application. */
export default function Demo(): React.JSX.Element;
