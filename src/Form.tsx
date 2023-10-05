import React, {
  useState,
  ReactElement,
  FormEvent,
  ChangeEvent,
  ReactNode,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { ZodTypeAny } from 'zod';

// todo improve types

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
  validationRules?: { [key: string]: ValidationRule };
  customErrorMessages?: { [key: string]: CustomErrorMessages };
  validationSchema?: ZodTypeAny;
  onError?: (errors: any) => void;
  onFieldChange?: (fieldName: string, fieldValue: any) => void;
  onFormChange?: (formData: any) => void;
  className?: string;
  style?: React.CSSProperties;
  children:
    | ((props: {
        errors: Record<string, string>;
        defaultValues: Record<string, any>;
      }) => ReactNode)
    | ReactElement
    | ReactElement[];
  defaultValues?: Record<string, any>;
}

const Form = forwardRef<{ resetForm: () => void; submit: () => void }, Props>(
  (
    {
      onSubmit,
      validationRules = {},
      customErrorMessages = {},
      validationSchema,
      onError,
      onFieldChange,
      onFormChange,
      className,
      style,
      children,
      defaultValues = {},
    },
    ref:
      | React.Ref<{ resetForm: () => void; submit: () => void }>
      | null
      | undefined
  ) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (
      name: string,
      value: any,
      rules: ValidationRule,
      messages: CustomErrorMessages = {}
    ) => {
      if (rules.required && !value) {
        return messages.required || 'This field is required';
      }
      if (rules.minLength && value.length < rules.minLength) {
        return (
          messages.minLength || `Must be at least ${rules.minLength} characters`
        );
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return (
          messages.maxLength ||
          `Must be no more than ${rules.maxLength} characters`
        );
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return messages.pattern || 'Invalid format';
      }
      return null;
    };

    const handleInputChange = (event: ChangeEvent<HTMLFormElement>) => {
      const formElement = event.currentTarget;
      const changedField = event.target;
      const fieldName = changedField.name;
      const fieldValue = changedField.value;

      if (onFieldChange) {
        onFieldChange(fieldName, fieldValue);
      }

      if (onFormChange) {
        const data = new FormData(formElement);
        const formDataObject: Record<string, any> = {};
        data.forEach((value, key) => {
          formDataObject[key] = value;
        });

        onFormChange(formDataObject);
      }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const formDataObject: Record<string, any> = {};
      const newErrors: Record<string, string> = {};

      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });

      if (validationSchema) {
        const result = validationSchema.safeParse(formDataObject);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            newErrors[issue.path[0]] = issue.message;
          });
        }
      } else {
        Object.keys(validationRules).forEach((field) => {
          const error = validateField(
            field,
            formDataObject[field],
            validationRules[field],
            customErrorMessages[field]
          );
          if (error) {
            newErrors[field] = error;
          }
        });
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        if (onError) {
          onError(newErrors);
        }
        return;
      }

      setErrors({});
      onSubmit(formDataObject);
    };

    const resetForm = () => {
      if (formRef.current) {
        setErrors({});
        formRef.current.reset();
      }
    };
    const manualSubmit = () => {
      if (formRef.current) {
        const event = new Event('submit', {
          bubbles: true,
          cancelable: true,
        });
        formRef.current.dispatchEvent(event);
      }
    };
    useImperativeHandle(ref, () => ({
      resetForm,
      submit: manualSubmit,
    }));
    return (
      <form
        ref={formRef}
        onInput={onFieldChange || onFormChange ? handleInputChange : undefined}
        onSubmit={handleSubmit}
        className={className}
        style={style}
      >
        {typeof children === 'function'
          ? children({ errors, defaultValues })
          : children}
      </form>
    );
  }
);

export default Form;
