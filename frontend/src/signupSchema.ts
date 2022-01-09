// import yup library used for validation of form fields
import * as yup from 'yup'

// check required fields and generate individual error messages
export const signUpSchema = yup.object().shape({
  name: yup.string().required('Täyttäminen on pakollista'),
  login: yup.string().required('Täyttäminen on pakollista'),
  password: yup.string().required('Täyttäminen on pakollista')
})

// export type that exactly matches schema above
export type SignUpType = yup.InferType<typeof signUpSchema>
