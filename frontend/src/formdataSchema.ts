// import yup library used for validation of form fields
import * as yup from 'yup'

// check required fields and generate individual error messages
export const formdataSchema = yup.object().shape({
  metrictype: yup.string().required('form.message.mandatory'),
  metricvalue: yup.number().required('form.message.mandatory').transform(value => (isNaN(value) ? undefined : value)).test(
    'values should be validated',
    'form.message.validation',
    function (value) {
      if (this.parent.metrictype === 'temperature') {
        return !value || (value >= -50 && value <= 100)
      }
      if (this.parent.metrictype === 'rainfall') {
        return !value || (value >= 0 && value <= 500)
      }
      if (this.parent.metrictype === 'ph') {
        return !value || (value >= 0 && value <= 14)
      }
      return false
    }
  )
})

// export type that exactly matches schema above
export type FormdataType = yup.InferType<typeof formdataSchema>
