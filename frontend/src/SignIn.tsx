import React from 'react'

// import library for form making
import { useForm } from 'react-hook-form'

// import yup library used for validation of form fields
import { yupResolver } from '@hookform/resolvers/yup'
import { signInSchema, SignInType } from './signinSchema'

// import individual components used in this form from bootstrap
import Button from 'react-bootstrap/Button'

import Form from 'react-bootstrap/Form'

import { useTranslation } from 'react-i18next'

const SignIn = () => {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signInSchema)
  })
  const onSubmitFunc = async (data: SignInType) => {
    reset()
  }

  // UI form visible to user in browser
  return (
      <Form onSubmit={handleSubmit(onSubmitFunc)}>
        <h2>{t('signin.title')}</h2>
        <br />

        <Form.Group className="mb-3 col-lg-3 col-md-6">
          <Form.Label>{t('signin.login')} *</Form.Label>
          <Form.Control {...register('login')} type="text" className={`form-control ${errors.login ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.login?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-lg-3 col-md-6">
          <Form.Label>{t('signin.password')} * </Form.Label>
          <Form.Control {...register('password')} type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.password?.message}
          </Form.Text>
        </Form.Group>

        <Button variant="success" type="submit">
        {t('signin.button')}
        </Button>
      </Form>
  )
}

export default SignIn
