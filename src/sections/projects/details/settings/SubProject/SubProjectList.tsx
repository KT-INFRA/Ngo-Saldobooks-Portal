import { Grid, List, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import Avatar from 'components/@extended/Avatar';
import { Bezier } from 'iconsax-react';
import React, { memo } from 'react';

function SubProjectList({ subProjects = [], loading }: { subProjects: any[]; loading: boolean }) {
  if (loading) {
    return (
      <List>
        <Grid container xs={12}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6}>
              <ListItem>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: 'grey.300',
                      width: 40,
                      height: 40,
                      variant: 'rounded'
                    }}
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                  </Avatar>
                  <Stack spacing={0}>
                    <Typography variant="subtitle1">
                      <Skeleton width="100px" />
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Skeleton width="200px" />
                    </Typography>
                  </Stack>
                </Stack>
              </ListItem>
            </Grid>
          ))}
        </Grid>
      </List>
    );
  }
  return (
    <List>
      <Grid container xs={12}>
        {[...subProjects].map((project) => {
          return (
            <Grid item xs={12} md={6}>
              <ListItem>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    alt="k"
                    sx={{
                      color: 'primary'
                    }}
                    size="lg"
                    variant="rounded"
                  >
                    <Bezier variant="Outline" />
                  </Avatar>
                  <Stack spacing={0}>
                    <Typography variant="subtitle1">{project.sub_project?.project_code}</Typography>
                    <Typography color="text.secondary">{String(project.sub_project?.title).substring(0, 40) + '...'}</Typography>
                  </Stack>
                </Stack>
              </ListItem>
            </Grid>
          );
        })}
      </Grid>
    </List>
  );
}

export default memo(SubProjectList);
