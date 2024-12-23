// material-ui
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import { DropzopType } from 'config';

// assets
import UploadExcel from 'assets/images/upload/excel.svg';

type FileType = File & {
  path: string;
  size: number;
};

export default function FilePickerPlaceholder({ type, file }: { type?: DropzopType; file: FileType }) {
  const name = file ? file.path : 'Drag & Drop or Select file';
  const size = file ? file.size : 0;
  return (
    <>
      {type !== DropzopType.STANDARD && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <CardMedia component="img" image={UploadExcel} sx={{ width: 100 }} />
          <Stack sx={{ p: 3 }} spacing={1}>
            <Typography variant="subtitle1">{String(name)}</Typography>
            {!size ? (
              <Typography color="secondary">
                Drop files here or click&nbsp;
                <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                  browse
                </Typography>
              </Typography>
            ) : (
              <Typography color="secondary">{Math.round(size / 1024)} KB</Typography>
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
}
