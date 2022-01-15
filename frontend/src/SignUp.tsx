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
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signUpSchema)
  })
  const onSubmitFunc = async (data: SignUpType) => {
    try {
      await axios.post(
        'http://localhost:8091/createfarm',
        data
      )
      reset()
      navigate('/signin')
    } catch (e) {
      console.log(e)
    }
  }

  // UI form visible to user in browser
  return (
      <Form onSubmit={handleSubmit(onSubmitFunc)}>
        <h2>{t('signup.title')}</h2>
        <br />

        <Form.Group className="mb-3 col-lg-3 col-md-6">
          <Form.Label>{t('signup.name')} *</Form.Label>
          <Form.Control {...register('name')} type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.name?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-3">
          <Form.Label>{t('signup.longitude')}</Form.Label>
          <Form.Control {...register('longitude')} type="text" className={`form-control ${errors.longitude ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.longitude?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-3">
          <Form.Label>{t('signup.latitude')}</Form.Label>
          <Form.Control {...register('latitude')} type="text" className={`form-control ${errors.latitude ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.latitude?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-lg-3 col-md-6">
          <Form.Label>{t('signup.login')} *</Form.Label>
          <Form.Control {...register('login')} type="text" className={`form-control ${errors.login ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {errors.login?.message}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-lg-3 col-md-6">
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
