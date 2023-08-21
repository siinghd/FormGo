import React, { ReactElement, ReactNode } from 'react';
import { ZodTypeAny } from 'zod';
interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}
interface CustomErrorMessages {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
}
interface Props {
    onSubmit: (data: any) => void;
    validationRules?: {
        [key: string]: ValidationRule;
    };
    customErrorMessages?: {
        [key: string]: CustomErrorMessages;
    };
    validationSchema?: ZodTypeAny;
    onError?: (errors: any) => void;
    onFieldChange?: (fieldName: string, fieldValue: any) => void;
    onFormChange?: (formData: any) => void;
    className?: string;
    style?: React.CSSProperties;
    children: ((props: {
        errors: Record<string, string>;
        defaultValues: Record<string, any>;
    }) => ReactNode) | ReactElement | ReactElement[];
    defaultValues?: Record<string, any>;
}
declare const Form: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<{
    resetForm: () => void;
}>>;
export default Form;
