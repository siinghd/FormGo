# FormGo

![npm version](https://badge.fury.io/js/FormGo.svg)

A simple, flexible, and powerful React form library, designed to help you build efficient and robust web forms.

## Features

- Easy-to-use API
- Built-in validation with custom rules or Zod schema
- Flexible error handling options
- Highly customizable


## Installation

```bash
npm install FormGo
```

or

```bash
yarn add FormGo
```

or

```bash
pnpm add FormGo
```

## Usage

Here's a simple example of a form that uses `FormGo`. The errors are injected into child components by default and can be displayed conditionally based on the `errors` object:

```jsx
import React from 'react';
import Form from 'FormGo';

function MyForm() {
  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {(props: any) => (
        <>
          <label htmlFor="name">Name:</label>
          <input name="name" required />
          {props.errors.name && <span>{props.errors.name}</span>}
          
          <label htmlFor="email">Email:</label>
          <input name="email" type="email" required />
          {props.errors.email && <span>{props.errors.email}</span>}
          
          <button type="submit">Submit</button>
        </>
      )}
    </Form>
  );
}

export default MyForm;
```

## API Reference

### `<Form />`

The `Form` component is where your form fields will live.

#### Props

- **onSubmit (data: any) => void**: Function called when the form is submitted.
- **validationRules? { [key: string]: ValidationRule }**: Optional custom validation rules.
- **customErrorMessages? { [key: string]: CustomErrorMessages }**: Optional custom error messages.
- **validationSchema? ZodSchema<ZodTypeAny>**: Optional Zod schema for validation.
- **onError? (errors: any) => void**: Optional function called when validation errors occur.
- **onFieldChange? (fieldName: string, fieldValue: any) => void**: Optional function called when a field changes.
- **onFormChange? (formData: any) => void**: Optional function called when any part of the form changes.

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
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    }
  }}
  customErrorMessages={{
    name: {
      required: "Name is required",
      minLength: "Name must be at least 2 characters",
    },
    email: {
      required: "Email is required",
      pattern: "Email format is invalid"
    }
  }}
>
  {/* ...form fields... */}
</Form>
```

### Zod Schema Validation:

```jsx
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2).max(30),
  email: z.string().email(),
});

<Form
  onSubmit={handleSubmit}
  validationSchema={userSchema}
>
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
      {/* ...form fields... */}
    </Form>
  );
}
```

## Contributing

We welcome contributions to `FormGo`!

## License

`FormGo` is [MIT licensed](./LICENSE).
