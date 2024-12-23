import { Stack } from '@mui/material';
import { ReactFilesPreview } from 'react-files-preview';
import 'react-files-preview/dist/style.css';
function Step5() {
  return (
    <Stack>
      <ReactFilesPreview
        accept="image/*,.pdf"
        width={'basis-full'}
        height={'h-full'}
        allowEditing={true}
        downloadFile={true}
        getFiles={(files) => {
          // console.log(files);
        }}
        showSliderCount
      />
    </Stack>
  );
}

export default Step5;
