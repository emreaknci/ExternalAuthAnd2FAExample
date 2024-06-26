import React, { useContext, useEffect, useState } from 'react'
import BaseService from '../services/_base.service'
import { Container, Typography, List, ListItem, ListItemText, Alert, TextField, Button, Link } from '@mui/material';
import { EnableTwoFactorAuthDto } from '../models/enableTwoFactorAuthDto';
import QRCode from 'react-qr-code';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const TwoFactorAuthPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [enable2FAuthDto, setEnable2FAuthDto] = useState<EnableTwoFactorAuthDto>();
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerificationCodeChange = (event: any) => {
    setVerificationCode(event.target.value);
    setEnable2FAuthDto((prevState) => ({ ...prevState!, code: event.target.value }));
  };

  const enable2FA = async (event: any) => {
    setSubmitted(true)
    event.preventDefault();
    if (verificationCode.length != 6) {
      toast.dismiss()
      toast.warning("Lütfen 6 haneli kodu giriniz")
      setSubmitted(false)
      return;
    }
    BaseService.enable2FAuth(enable2FAuthDto!).then(res => {
      console.log(res)
      const updatedUser = {
        ...authContext.currentUser!,
        isTwoFactorEnabled: true
      };
      authContext.setCurrentUser(updatedUser);
      toast.success("2FA Etkinleştirildi")
      navigate("/")
    }).catch(err => {
      console.log(err)
      toast.warning("2FA Etkinleştirilirken bir hata oluştu")
    }).finally(() => {
      setSubmitted(false)
    })
  };

  useEffect(() => {console.log(submitted)
    BaseService.generate2FAuthQR().then((res) => {
      const data = res.data as EnableTwoFactorAuthDto;
      setEnable2FAuthDto(data);
    }).catch((err) => {
      console.log(err)
    });
  }, [submitted])

  return (
    <Container component="main" >
      <Typography variant="h4" gutterBottom>
        İki Aşamalı Doğrulamayı Etkinleştir
      </Typography>
      <Typography paragraph>
        Kimlik doğrulama uygulamasını kullanmak için aşağıdaki adımları izleyin:
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            1.  Microsoft Authenticator veya Google Authenticator
            gibi iki faktörlü bir kimlik doğrulama uygulamasını indirin.
          </ListItemText>
        </ListItem>
        {enable2FAuthDto && <>
          <ListItem>
            <ListItemText>
              2. Aşağıdaki QR kodunu tarayın veya  <b>{enable2FAuthDto.secretKey}</b> bu anahtarı
              iki faktörlü kimlik doğrulama uygulamanıza girin.
            </ListItemText>
          </ListItem>
          <ListItem>
            <QRCode value={enable2FAuthDto.authenticatorUri} size={200} />
          </ListItem>
        </>}
        <ListItem>
          <ListItemText>
            3. QR kodunu taradığınızda veya yukarıdaki anahtarı girdiğinizde,
            iki faktörlü kimlik doğrulama uygulamanız size benzersiz bir kod sağlayacaktır.
            Kodu aşağıdaki onay kutusuna girin.
          </ListItemText>
        </ListItem>
      </List>
      <form onSubmit={enable2FA}>
        <TextField
          label="Doğrulama Kodu"
          variant="standard"
          fullWidth
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          autoComplete="off"
          margin="normal"
        />
        <Button type="submit" fullWidth variant="text" color="primary">
          Onayla
        </Button>
      </form>
    </Container>
  );
}

export default TwoFactorAuthPage
