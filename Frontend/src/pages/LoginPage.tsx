import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Paper, Avatar, Typography, TextField, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LoginDto } from '../models/loginDto';
import CustomTextFieldComponent from '../components/CustomTextFieldComponent';
import PinInput from 'react-pin-input';
import { TwoStepLoginDto } from '../models/twoStepLoginDto';



const validationSchema = Yup.object({
  email: Yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta zorunludur'),
  password: Yup.string().required('Şifre zorunludur'),
});

const LoginPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setSubmitted(true);
      login();
    },
  });

  useEffect(() => {
    authContext.currentUser?.isTwoFactorEnabled && setStep(2) 
  }, [authContext.currentUser?.isTwoFactorEnabled])

  const login = async () => {
    const loginDto: LoginDto = {
      email: formik.values.email,
      password: formik.values.password
    }
    await authContext.login(loginDto);
  }

  const verify2FA = async () => {
    const dto: TwoStepLoginDto = {
      email: authContext.currentUser!.email,
      code: code
    }
    await authContext.verifyTwoFactorAuth(dto)
  }


  const renderStep1 = () => {
    return (
      <>
        <Typography component="h1" variant="h5" mt={1}>
          Giriş Yap
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: '100%', marginTop: 16 }}>
          <CustomTextFieldComponent formik={formik} fieldName="email" label="E-posta" />
          <CustomTextFieldComponent formik={formik} fieldName="password" label="Şifre" type="password" />
          <Typography variant="body2" style={{ marginTop: "1rem", justifyContent: "flex-end" }}>
            Hesabın yok mu?{' '}
            <MuiLink style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
              color="primary">
              Kayıt Ol
            </MuiLink>
          </Typography>
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: 16 }}>
            Giriş Yap
          </Button>
        </form>
      </>
    )
  }

  const renderStep2 = () => {
    return (
      <>
        <Typography component="h1" variant="h5" mt={1}>
          İki Aşamalı Doğrulama
        </Typography>
        <Typography component="p" mt={1}>
          Lütfen kimliğinizi doğrulamak için doğrulama kodunu girin.
        </Typography>
        <PinInput
          length={6}
          initialValue=""
          onChange={(value, index) => { setCode(value) }}
          type="numeric"
          inputMode="number"
          style={{ padding: '1rem' }}
          inputStyle={{ borderColor: 'black', borderRadius: "2rem", width:"2.1rem",height:"2.2rem" }}
          inputFocusStyle={{ borderColor: '#1976D2' }}
          onComplete={(value, index) => { }}
          autoSelect={true}
          regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        />
        <Button fullWidth variant="contained" color="primary" style={{ marginTop: 16 }} onClick={verify2FA}>
          Onayla
        </Button>
      </>
    )
  }

  return (
    <Container component="main" style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', width: "100%"
    }}>
      <LockOutlinedIcon fontSize={"large"} />
      {step == 1 && renderStep1()}
      {step == 2 && renderStep2()}
    </Container >
  );
};

export default LoginPage;