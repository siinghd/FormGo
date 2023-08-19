import { z } from 'zod';
import './App.css';
import Form from './Form';

function App() {
  const handleSubmit = (formData: any) => {
    console.log('Form data:', formData);
  };
  const userSchema = z.object({
    name: z.string().min(2).max(30),
    email: z.string().email(),
  });
  const handleError = (errors: any) => {
    console.log('Validation errors:', errors);
  };
  const onFieldChange = (f: any) => {
    console.log('asf:', f);
  };
  return (
    <Form
      onSubmit={handleSubmit}
      validationSchema={userSchema}
      onError={handleError}
      onFormChange={onFieldChange}
    >
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

export default App;
