import * as React from "react";
/** Independent implementation. No affectUI Pro source is included. */
export type StepperValues = {
    name: string;
    url: string;
    invites: string[];
    plan: string;
};
export type StepperFormProps = {
    initialValues?: Partial<StepperValues>;
    initialStep?: number;
    step?: number;
    onStepChange?: (step: number) => void;
    submitLabel?: string;
    submittingLabel?: string;
    onComplete?: (values: StepperValues) => void | Promise<void>;
    className?: string;
};
export declare function StepperForm({ initialValues, initialStep, step: stepIn, onStepChange, submitLabel, submittingLabel, onComplete, className, }: StepperFormProps): React.JSX.Element;
export default StepperForm;
