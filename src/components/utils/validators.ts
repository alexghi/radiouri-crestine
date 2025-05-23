import * as yup from 'yup';

const newsletterValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

export { newsletterValidationSchema };
