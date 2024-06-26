import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Paper, Avatar, Typography, TextField, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomTextFieldComponent from '../components/CustomTextFieldComponent';
import { RegisterDto } from '../models/registerDto';
import BaseService from '../services/_base.service';



const validationSchema = Yup.object({
  fullName: Yup.string().required('Ad alanı zorunludur'),
  email: Yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta zorunludur'),
  password: Yup.string().required('Şifre zorunludur'),
});


const RegisterPage = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitted(true);
      await register();
    },
  });

  const register = async () => {
    const registerDto: RegisterDto = {
      fullName: formik.values.fullName,
      email: formik.values.email,
      password: formik.values.password,
    }
    await BaseService.register(registerDto).then(res => {
      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
    }).catch(err => {
      toast.error(err.response.data?.message ?? "Kayıt sırasında bir hata meydana geldi");
    })
  }


  return (
    <Container component="main" style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', width: "100%"
    }}>
      <LockOutlinedIcon fontSize={"large"} />
      <Typography component="h1" variant="h5" mt={1}>
        Kayıt Ol
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ width: '100%', marginTop: 16 }}>
        <CustomTextFieldComponent formik={formik} fieldName='fullName' label='Ad Soyad' />
        <CustomTextFieldComponent formik={formik} fieldName='email' label='E-posta' />
        <CustomTextFieldComponent formik={formik} fieldName='password' label='Şifre' type='password' />
        <Typography variant="body2" style={{ marginTop: '1rem', justifyContent: 'flex-end' }}>
          Zaten bir hesabın var mı?{' '}
          <MuiLink style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
            color="primary">
            Giriş Yap
          </MuiLink>
        </Typography>
        <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: 16 }}>
          Kayıt Ol
        </Button>
      </form>
    </Container>
  );
};

export default RegisterPage;
