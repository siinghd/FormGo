import { z } from 'zod';
import './App.css';
import Form from './Form';
import { useRef } from 'react';

function App() {
  const formRef = useRef<{ resetForm: () => void }>(null);
  const handleSubmit = (formData: any) => {
    console.log('Form data:', formData);
    console.log('Form ref:', formRef.current);
    formRef.current?.resetForm();
  };
  const userSchema = z.object({
    userinfo: z.object({
      name: z.string().min(2).max(30),
    }),
    email: z.string().email(),
  });
  const handleError = (errors: any) => {
    console.log('Validation errors:', errors);
  };
  const onFieldChange = (f: any) => {
    console.log('asf:', f);
  };
  return (
    <div className="App">
      <Form
        key={1}
        ref={formRef}
        onSubmit={handleSubmit}
        // validationSchema={userSchema}
        validationRules={{
          userinfo: {
            name: {
              required: true,
              minLength: 10,
            },
          },
          email: {
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
          },
        }}
        customErrorMessages={{
          userinfo: {
            name: {
              required: 'Name is required',
              minLength: 'Name must be at least 10 characters',
            },
          },
          email: {
            required: 'Email is required',
            pattern: 'Email is invalid',
          },
        }}
        onError={handleError}
        onFormChange={onFieldChange}
        className="form"
        defaultValues={{ name: 'John', email: 'john@example.com' }}
      >
        {(props: any) => (
          <>
            <label htmlFor="name">Name:</label>
            <input
              name="userinfo.name"
              required
              defaultValue={props.defaultValues.name}
            />
            {props.errors.userinfo?.name && (
              <span>{props.errors.userinfo?.name}</span>
            )}

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
    </div>
  );
}

export default App;
