import { z } from 'zod';
import './App.css';
import Form from './Form';
import { useRef } from 'react';

function App() {
  const formRef = useRef<{ resetForm: () => void; submit: () => void }>(null);
  const handleSubmit = (formData: any) => {
    console.log('Form data:', formData);
    console.log('Form ref:', formRef.current);

    formRef.current?.resetForm();
  };
  const handleSubmitBtn = () => {
    formRef.current?.submit();
  };
  const userSchema = z.object({
    name: z.string().min(2).max(30),
    email: z.string().email(),
  });
  const handleError = (errors: any) => {
    console.log('Validation errors:', errors);
  };
  // const onFieldChange = (f: any) => {
  //   console.log('asf:', f);
  // };
  return (
    <div className="App">
      <Form
        key={1}
        ref={formRef}
        onSubmit={handleSubmit}
        validationSchema={userSchema}
        onError={handleError}
        // onFormChange={onFieldChange}
        className="form"
        defaultValues={{ name: 'John', email: 'john@example.com' }}
      >
        {(props: any) => (
          <>
            <label htmlFor="name">Name:</label>
            <input
              name="name"
              required
              defaultValue={props.defaultValues.name}
            />
            {props.errors.name && <span>{props.errors.name}</span>}

            <label htmlFor="email">Email:</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={props.defaultValues.email}
            />
            {props.errors.email && <span>{props.errors.email}</span>}

            <button onClick={handleSubmitBtn}>Submit</button>
          </>
        )}
      </Form>
    </div>
  );
}

export default App;
