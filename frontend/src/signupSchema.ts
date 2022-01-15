// import yup library used for validation of form fields
import * as yup from 'yup'

// check required fields and generate individual error messages
export const signUpSchema = yup.object().shape({
  name: yup.string().required('form.message.mandatory'),
  longitude: yup.number().notRequired().transform(value => (isNaN(value) ? undefined : value)),
  latitude: yup.number().notRequired().transform(value => (isNaN(value) ? undefined : value)),
  login: yup.string().required('form.message.mandatory'),
  password: yup.string().required('form.message.mandatory')
})

// export type that exactly matches schema above
export type SignUpType = yup.InferType<typeof signUpSchema>
