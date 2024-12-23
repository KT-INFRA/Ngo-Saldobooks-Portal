import { Grid } from '@mui/material';
import 'react-files-preview/dist/style.css';
import { ReactFilesPreview } from './FilePicker/ReactFilesPreview';
import { useFormikContext } from 'formik';
import { InitialValues } from './utils';
function Step4() {
  const { values, setFieldValue } = useFormikContext<InitialValues>();
  // async function fetchFile(url: string) {
  //   const response = await fetch(url);
  //   console.log(response);
  //   var filename = url.split('/').pop();
  //   const blob = await response.blob();
  //   const mimeType = response.headers.get('Content-Type');
  //   var mime = `${mimeType}`.split('/').pop();
  //   if (!filename) {
  //     filename = (Math.random() * 10000).toString() + '.' + mime;
  //   }
  //   return new File([blob], `${filename}`, {
  //     type: `${mimeType}`
  //   });
  // }

  return (
    <Grid container mb={5} p={2}>
      <ReactFilesPreview
        accept="image/*,.pdf"
        files={values?.projectFiles}
        getFiles={(files) => setFieldValue('projectFiles', files)}
        allowEditing={true}
        onChange={(f) => console.log('onChange', f.target.files)}
        onDrop={(f) => console.log('onDrop', f.dataTransfer.files)}
      />
    </Grid>
  );
}

export default Step4;
