import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Container } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useMutation } from 'urql';
import InputField from '../components/InputField';

// interface registerProps {}

const REG_MUT = `
  mutation register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      errors {
        field
        message
      }
      user {
        id
        username
        joinedAt
      }
    }
  }
`;

const Register = () => {
  const [, register] = useMutation(REG_MUT);

  return (
    <Container maxW="lg" mt="10" p="5" shadow="lg" borderRadius="md">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values) => {
          const res = await register(values);
          console.log(res);
        }}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <InputField
              name="username"
              placeholder="Username"
              type="text"
              label="Username"
              mb="5"
            />
            <InputField
              name="password"
              placeholder="Password"
              type="password"
              label="Password"
            />
            <Button
              isLoading={isSubmitting}
              type="submit"
              colorScheme="blue"
              mt="3"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default Register;
