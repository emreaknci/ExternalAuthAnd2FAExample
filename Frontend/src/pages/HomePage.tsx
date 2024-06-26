import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseService from '../services/_base.service';
import { toast } from 'react-toastify';

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();


  const disable2FA = () => {
    BaseService.disable2FAuth().then(() => {
      const updatedUser = {
        ...authContext.currentUser!,
        isTwoFactorEnabled: false 
      };
      authContext.setCurrentUser(updatedUser);
      toast.success("2FA İptal Edildi")
    }).catch(() => {
      toast.warning("2FA İptal Edilirken bir hata oluştu")
    })
  }

  return (
    <>
      <Box  >
        {authContext.isAuthenticated && authContext.currentUser ? (
          <>
            <Typography variant="h5" component="h2" gutterBottom>
              Kullanıcı Bilgileri
            </Typography>
            <Typography variant="body1"><strong>Ad Soyad:</strong> {authContext.currentUser.fullName}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {authContext.currentUser.email}</Typography>
            <Typography variant="body1"><strong>İki Aşamalı Doğrulama:</strong> {authContext.currentUser.isTwoFactorEnabled ? 'Evet' : 'Hayır'}</Typography>
            <br />
            <Button
              variant="contained"
              color={authContext.currentUser!.isTwoFactorEnabled ? "error" : "primary"}
              onClick={() => {
                if (authContext.currentUser!.isTwoFactorEnabled) {
                  disable2FA()
                } else {
                  navigate("enable-2fa")
                }
              }}
            >
              {authContext.currentUser.isTwoFactorEnabled ? 'İki Aşamalı Doğrulamayı İptal Et' : 'İki Aşamalı Doğrulamayı Etkinleştir'}
            </Button>
          </>
        ) : (
          <Typography variant="body1">Hoşgeldiniz</Typography>
        )}
      </Box>
    </>
  )
}

export default HomePage