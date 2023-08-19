import React, { ReactElement, ReactNode } from 'react';
import { ZodSchema, ZodTypeAny } from 'zod';
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
    validationSchema?: ZodSchema<ZodTypeAny>;
    onError?: (errors: any) => void;
    onFieldChange?: (fieldName: string, fieldValue: any) => void;
    onFormChange?: (formData: any) => void;
    children: ((props: {
        errors: Record<string, string>;
    }) => ReactNode) | ReactElement | ReactElement[];
}
declare const Form: React.FC<Props>;
export default Form;
