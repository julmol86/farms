// import yup library used for validation of form fields
import * as yup from 'yup'

// check required fields and generate individual error messages

export const signInSchema = yup.object().shape({
  login: yup.string().required('Täyttäminen on pakollista'),
  password: yup.string().required('Täyttäminen on pakollista')
})

// export type that exactly matches schema above
export type SignInType = yup.InferType<typeof signInSchema>
