import React, { useContext } from 'react'

// import library for form making
import { useForm } from 'react-hook-form'

// import yup library used for validation of form fields
import { yupResolver } from '@hookform/resolvers/yup'
import { signInSchema, SignInType } from './signinSchema'

// notification library imports
import { toast } from 'react-toastify'

// import individual components used in this form from bootstrap
import Button from 'react-bootstrap/Button'

import Form from 'react-bootstrap/Form'

import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserContext } from './UserContext'

const SignIn = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setUserData } = useContext(UserContext)
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signInSchema)
  })
  const onSubmitFunc = async (data: SignInType) => {
    try {
      const resp = await axios.post(
        'http://localhost:8091/signin',
        data
      )

      if (resp.data?.loggedIn) {
        // set up user data context at this stage
        setUserData(resp.data)

        reset()
        toast.success(t('login.success'), {
          position: 'top-center'
        })
        navigate('/farmdata')
      } else {
        toast.error(t('login.reject'), {
          position: 'top-center'
        })
      }
    } catch (e) {
      console.log(e)
    }
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
            {t(errors.login?.message)}
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3 col-lg-3 col-md-6">
          <Form.Label>{t('signin.password')} * </Form.Label>
          <Form.Control {...register('password')} type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
          <Form.Text className="invalid-feedback">
            {t(errors.password?.message)}
          </Form.Text>
        </Form.Group>

        <Button variant="success" type="submit">
        {t('signin.button')}
        </Button>
      </Form>
  )
}

export default SignIn
