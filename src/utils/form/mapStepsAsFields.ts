import { FormStep } from "~/types/form";
import { Field } from "~/types/fields";

export const mapStepsAsFields = (steps: FormStep[]) =>
    steps
        .map((step, _stepIndex) =>
            step.fields.map((field: Field) => ({
                ...field,
                _stepIndex,
                ...(step.root && { _stepRoot: step.root }),
            })),
        )
        .flat();
