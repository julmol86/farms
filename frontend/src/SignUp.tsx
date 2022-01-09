import React from 'react'

// import library for form making
import { useForm } from 'react-hook-form'

// import yup library used for validation of form fields
import { yupResolver } from '@hookform/resolvers/yup'
import { signUpSchema, SignUpType } from './signupSchema'

// import individual components used in this form from bootstrap
import Button from 'react-bootstrap/Button'

import Form from 'react-bootstrap/Form'

import { useTranslation } from 'react-i18next'

const SignUp = () => {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signUpSchema)
  })
  const onSubmitFunc = async (data: SignUpType) => {
    reset()
  }

  // UI form visible to user in browser
  return (
      <Form onSubmit={handleSubmit(onSubmitFunc)}>
        <h2>{t('signup.title')}</h2>
        <br />

        <Form.Group className="mb-3">
          <Form.Label>{t('signup.name')} *</Form.Label>
          <Form.Control {...register('name')} type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.name?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('signup.login')} *</Form.Label>
          <Form.Control {...register('login')} type="text" className={`form-control ${errors.login ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.login?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t('signup.password')} * </Form.Label>
          <Form.Control {...register('password')} type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.password?.message}
          </Form.Text>
        </Form.Group>

        <Button variant="success" type="submit">
        {t('signup.button')}
        </Button>
      </Form>
  )
}

export default SignUp
