# FormGo

![npm version](https://badge.fury.io/js/formgo.svg)

A simple and flexible React form library, designed to help you build efficient and robust web forms.

## Features

- Easy-to-use API
- Built-in validation with custom rules or Zod schema
- Flexible error handling options
- Highly customizable

## Installation

```bash
npm install formgo
```

or

```bash
yarn add formgo
```

or

```bash
pnpm add formgo
```

## Usage

Here's a simple example of a form that uses `FormGo`. The errors and defaultValues are injected into child components by default and can be displayed conditionally based on the `errors` and `defaultValues` objects:

```jsx
import React from 'react';
import Form from 'formgo';

function MyForm() {
  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validationRules={{
        name: {
          required: true,
          minLength: 2,
          maxLength: 30,
        },
        email: {
          required: true,
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
      }}
      customErrorMessages={{
        name: {
          required: 'Name is required',
          minLength: 'Name must be at least 2 characters',
        },
        email: {
          required: 'Email is required',
          pattern: 'Email format is invalid',
        },
      }}
      defaultValues={{ name: 'John', email: 'john@example.com' }}
    >
      {(props: any) => (
        <>
          <label htmlFor="name">Name:</label>
          <input name="name" required defaultValue={props.defaultValues.name} />
          {props.errors.name && <span>{props.errors.name}</span>}

          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={props.defaultValues.email}
          />
          {props.errors.email && <span>{props.errors.email}</span>}

          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}

export default MyForm;
```
#### Note on the `name` attribute in form fields

For `FormGo` to function correctly and gather form data, it's essential to assign a `name` attribute to every form field. This attribute helps the library identify and capture the value of each field upon form submission.

In the examples provided, you'll notice the `name` attribute being used:

```jsx
<input name="name" required />
```

```jsx
<input name="email" type="email" required />
```

Ensure that every form field in your `FormGo` forms has a unique `name` attribute, as this is pivotal for the correct operation of the library.

## API Reference

### `<Form />`

The `Form` component is the heart of your form. It can optionally accept a `ref` to provide a method to reset the form.

#### Props

- **onSubmit (data: any) => void**: Function called when the form is submitted.
- **validationRules? { [key: string]: ValidationRule }**: Optional custom validation rules. Zod schema is prioritized over this if both are provided.
- **customErrorMessages? { [key: string]: CustomErrorMessages }**: Optional custom error messages.
- **validationSchema? ZodSchema<ZodTypeAny>**: Optional Zod schema for validation.
- **onError? (errors: any) => void**: Optional function called when validation errors occur.
- **onFieldChange? (fieldName: string, fieldValue: any) => void**: Optional function called when a field changes.
- **onFormChange? (formData: any) => void**: Optional function called when any part of the form changes.
- **className? string**: Optional class name to be added to the form element.
- **style? React.CSSProperties**: Optional inline styles to be applied to the form element.
- **defaultValues? Record<string, any>**: Optional object containing default values for form fields.
- **onEnterSubmit? boolean**: Optional onEnterSubmit prop, let you enable or disable form submission when the user presses the Enter key. By default, this prop is set to true.

#### Ref

When a `ref` is passed to the `Form` component, it provides the following method:

- **resetForm(): void**: Method to reset the form to its initial state. It clears all field values and validation errors.

##### Example of using `ref` to reset the form:

```jsx
import React, { useRef } from 'react';
import Form from 'formgo';

function MyForm() {
  const formRef = useRef<{ resetForm: () => void }>(null);

  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
  };

  const handleReset = () => {
    formRef.current?.resetForm();
  };

  return (
    <>
      <Form ref={formRef} onSubmit={handleSubmit}>
        {/* ... */}
      </Form>
      <button onClick={handleReset}>Reset Form</button>
    </>
  );
}

export default MyForm;
```
## Validation

`FormGo` supports powerful validation. Use custom validation rules with optional custom error messages or a Zod schema:

### Custom Validation Rules with Custom Error Messages:

```jsx
<Form
  onSubmit={handleSubmit}
  validationRules={{
    name: {
      required: true,
      minLength: 2,
      maxLength: 30,
    },
    email: {
      required: true,
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  }}
  customErrorMessages={{
    name: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
    },
    email: {
      required: 'Email is required',
      pattern: 'Email format is invalid',
    },
  }}
>
  {/* ...form fields... */}
</Form>
```

### Zod Schema Validation:

```jsx
import { z } from 'zod';
import Form from 'formgo';

const userSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email(),
});

<Form onSubmit={handleSubmit} validationSchema={userSchema}>
  {/* ...form fields... */}
</Form>;
```

## Nested Fields Support

`FormGo` now supports deeply nested objects for form validation. You can define validation rules and custom error messages for nested fields. The nesting can go multiple levels deep.

### Example of Nested Fields with Custom Validation Rules:

```jsx
<Form
  onSubmit={handleSubmit}
  validationRules={{
    userinfo: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 30,
      },
      address: {
        street: {
          required: true
        },
        postal: {
          code: {
            required: true
          }
        }
      }
    }
  }}
  customErrorMessages={{
    userinfo: {
      name: {
        required: 'Name is required',
        minLength: 'Name must be at least 2 characters',
      },
      address: {
        street: {
          required: 'Street is required'
        },
        postal: {
          code: {
            required: 'Postal code is required'
          }
        }
      }
    }
  }}
  defaultValues={{ userinfo: { name: 'John', address: { street: '123 Main St', postal: { code: '12345' } } } }}
>
  {(props: any) => (
    <>
      <label htmlFor="userinfo.name">Name:</label>
      <input name="userinfo.name" required defaultValue={props.defaultValues.userinfo.name} />
      {props.errors.userinfo?.name && <span>{props.errors.userinfo.name}</span>}

      <label htmlFor="userinfo.address.street">Street:</label>
      <input name="userinfo.address.street" required defaultValue={props.defaultValues.userinfo.address.street} />
      {props.errors.userinfo?.address?.street && <span>{props.errors.userinfo.address.street}</span>}

      {/* ... More fields ... */}
      
      <button type="submit">Submit</button>
    </>
  )}
</Form>
```

### Accessing Nested Errors:

When using nested fields, you can access the nested errors in the `errors` object in your child component function.

```jsx
{props.errors.userinfo?.name && <span>{props.errors.userinfo.name}</span>}
{props.errors.userinfo?.address?.street && <span>{props.errors.userinfo.address.street}</span>}
```

### Zod Schema Support for Nested Fields:

If you are using Zod for validation, nested validation is also supported.

```jsx
import { z } from 'zod';

const userSchema = z.object({
  userinfo: z.object({
    name: z.string().min(2).max(30),
    address: z.object({
      street: z.string(),
      postal: z.object({
        code: z.string()
      })
    })
  })
});

<Form onSubmit={handleSubmit} validationSchema={userSchema}>
  {/* ...form fields... */}
</Form>
```
## Error Handling

By default, the `errors` object is injected into child components. If you want more control over error handling, use the `onError` prop:

```jsx
function MyForm() {
  const handleError = (errors) => {
    console.log('Validation errors:', errors);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validationSchema={userSchema}
      onError={handleError}
    >
      <label htmlFor="name">Name:</label>
      <input name="name" required />

      <label htmlFor="email">Email:</label>
      <input name="email" type="email" required />

      <button type="submit">Submit</button>
    </Form>
  );
}
```


### Using Children as a Function

When you utilize the children of the `Form` component as a function, it allows you to access both `errors` and `defaultValues` as arguments to that function. This is especially useful when you want to initialize your form fields with some default values:

```jsx
<Form
  onSubmit={handleSubmit}
  defaultValues={{ name: 'John', email: 'john@example.com' }}
>
  {(props: any) => (
    <>
      <label htmlFor="name">Name:</label>
      <input name="name" required defaultValue={props.defaultValues.name} />
      {props.errors.name && <span>{props.errors.name}</span>}

      <label htmlFor="email">Email:</label>
      <input
        name="email"
        type="email"
        required
        defaultValue={props.defaultValues.email}
      />
      {props.errors.email && <span>{props.errors.email}</span>}

      <button type="submit">Submit</button>
    </>
  )}
</Form>
```

### Using children not as a function

If you don't use the children as a function i.e

```jsx
<Form onSubmit={handleSubmit} defaultValues={{ name: 'John', email: 'john@example.com' }}>
  <>
    <label htmlFor="name">Name:</label>
    <input name="name" required />

    <label htmlFor="email">Email:</label>
    <input name="email" type="email" required />

    <button type="submit">Submit</button>
  </>
</Form>
```

In this scenario, you won't have access to the `defaultValues` prop directly in the form fields. To initialize fields with default values, you would need to use the function approach.

---

## Contributing

Your contributions to `FormGo` are welcome!

## License

`FormGo` is [MIT licensed](./LICENSE).
