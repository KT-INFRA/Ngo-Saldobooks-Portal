// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project-imports
import ProjectCard from './ProjectCard';

interface Props {
  title: string;
}

// ==============================|| SKELETON - EMPTY STATE ||============================== //

export default function EmptyProjectCard({ title }: Props) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box
          sx={{
            p: { xs: 2.5, sm: 6 },
            height: `calc(100vh - 100px)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'transparent'
          }}
        >
          <Grid container direction="column" justifyContent="center" alignItems="center">
            <Grid item>
              <Box sx={{ ml: -9, mb: { xs: -8, sm: -5 } }}>
                <Box sx={{ position: 'relative' }}>
                  <ProjectCard />
                </Box>
                <Box sx={{ position: 'relative', top: -120, left: 72 }}>
                  <ProjectCard />
                  <Typography mt={2} align="center" variant="subtitle1">
                    {title}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
