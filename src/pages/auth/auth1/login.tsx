// material-ui
import Grid from '@mui/material/Grid';
// project-imports
import LoginIcon from 'components/logo/LoginIcon';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <LoginIcon />
        </Grid>
        <Grid item xs={12}>
          <AuthLogin forgot="" />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
