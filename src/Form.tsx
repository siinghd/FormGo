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
  [key: string]: ValidationRule | boolean | number | RegExp | undefined;
}

interface CustomErrorMessages {
  required?: string;
  minLength?: string;
  maxLength?: string;
  pattern?: string;
  [key: string]: CustomErrorMessages | string | undefined;
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
  onEnterSubmit?: boolean;
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
      onEnterSubmit = true,
    },
    ref:
      | React.Ref<{ resetForm: () => void; submit: () => void }>
      | null
      | undefined
  ) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const unflattenErrors = (
      errors: Record<string, string>
    ): Record<string, any> => {
      const unflattened: Record<string, any> = {};

      for (const [flatKey, message] of Object.entries(errors)) {
        const keys = flatKey.split('.');
        keys.reduce((nested, key, index) => {
          if (index === keys.length - 1) {
            nested[key] = message;
          } else {
            nested[key] = nested[key] || {};
          }
          return nested[key];
        }, unflattened);
      }

      return unflattened;
    };
    const createNestedObject = (
      obj: Record<string, any>,
      keys: string[],
      value: any
    ) => {
      const lastKey = keys.pop();
      keys.reduce((r, k) => (r[k] = r[k] || {}), obj)[lastKey!] = value;
    };

    const validateField = (
      name: string,
      value: any,
      rules: ValidationRule,
      messages: CustomErrorMessages = {},
      parentName = ''
    ) => {
      let error = null;

      if (rules.required && !value) {
        error = messages.required || 'This field is required';
      } else if (rules.minLength && value?.length < rules.minLength) {
        error =
          messages.minLength ||
          `Must be at least ${rules.minLength} characters`;
      } else if (rules.maxLength && value?.length > rules.maxLength) {
        error =
          messages.maxLength ||
          `Must be no more than ${rules.maxLength} characters`;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        error = messages.pattern || 'Invalid format';
      }

      if (error) {
        return { [parentName ? `${parentName}.${name}` : name]: error };
      }

      // Handle nested validation dynamically
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const nestedErrors: Record<string, any> = {};
        for (const [key, nestedValue] of Object.entries(value)) {
          const nestedRules = rules[key] as ValidationRule;
          const nestedMessages = messages[key] as CustomErrorMessages;
          const nestedError = validateField(
            key,
            nestedValue,
            nestedRules || {},
            nestedMessages || {},
            parentName ? `${parentName}.${name}` : name
          );
          if (nestedError) {
            Object.assign(nestedErrors, nestedError);
          }
        }
        return Object.keys(nestedErrors).length ? nestedErrors : null;
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
          if (key.includes('.')) {
            createNestedObject(formDataObject, key.split('.'), value);
          } else {
            formDataObject[key] = value;
          }
        });

        onFormChange(formDataObject);
      }
    };

    const handleSubmit = (
      event: FormEvent<HTMLFormElement> | Record<string, any>
    ) => {
      let formDataObject: Record<string, any> = {};
      const newErrors: Record<string, string> = {};

      if (event instanceof Event || event.nativeEvent instanceof Event) {
        event.preventDefault();
        if (event.currentTarget instanceof HTMLFormElement) {
          const formData = new FormData(event.currentTarget);
          formData.forEach((value, key) => {
            if (key.includes('.')) {
              createNestedObject(formDataObject, key.split('.'), value);
            } else {
              formDataObject[key] = value;
            }
          });
        }
      } else {
        formDataObject = event;
      }

      if (validationSchema) {
        const result = validationSchema.safeParse(formDataObject);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            newErrors[issue.path.join('.')] = issue.message;
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
            Object.assign(newErrors, error);
          }
        });
      }

      if (Object.keys(newErrors).length > 0) {
        const nestedErrors = unflattenErrors(newErrors);
        setErrors(nestedErrors);
        if (onError) {
          onError(nestedErrors);
        }
        return;
      }
      if (Object.keys(errors).length > 0) {
        setErrors({});
      }
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
    const handleKeyPress = (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (onEnterSubmit && event.key === 'Enter') {
        event.preventDefault(); // Prevent default behavior like submitting the form
        if (formRef.current !== null) {
          // Null check here
          const formElement = formRef.current;
          const formData = new FormData(formElement);
          const formDataObject: Record<string, any> = {};
          formData.forEach((value, key) => {
            if (key.includes('.')) {
              createNestedObject(formDataObject, key.split('.'), value);
            } else {
              formDataObject[key] = value;
            }
          });
          handleSubmit(formDataObject);
        }
      }
    };
    return (
      <form
        ref={formRef}
        onInput={onFieldChange || onFormChange ? handleInputChange : undefined}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyPress}
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
