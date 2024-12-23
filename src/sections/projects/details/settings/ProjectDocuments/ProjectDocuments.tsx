import React, { useState, useEffect } from 'react';
import { Grid, InputLabel, TextField, Button, Box, Typography, Card, CardContent, Dialog, DialogContent, IconButton } from '@mui/material';
import { useTheme } from '@mui/material';
import MainCard from 'components/MainCard';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import { useCreateProjectUpload, userprojectupload } from 'api/project';
import { formateProjectDocumentPayload } from './utils';
import { jwtDecode } from 'jwt-decode';
import { CloseCircle } from 'iconsax-react';

const FilePicker = ({ file, setFile }: { file: File | null; setFile: (file: File | null) => void }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    return (
        <Box
            sx={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f8f8f8',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                    backgroundColor: '#f2f2f2'
                },
            }}
        >
            <input
                type="file"
                onChange={handleFileChange}
                style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                }}
                aria-label="File Upload"
            />
            {file ? (
                <Typography variant="body1" color="text.primary">
                    {file.name}
                </Typography>
            ) : (
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 , height: '70px' , marginTop: '40px'}}>
                    Drop files here or click to upload
                </Typography>
            )}
        </Box>
    );
};


const FileDisplay = ({ document }: { document: any }) => {
    const [open, setOpen] = useState(false);
    let fileUrl = '';
    let fileType = '';

    try {
        const decoded = jwtDecode<{ path: string }>(document.encrypt_file);
        fileUrl = decoded?.path || '';

        if (fileUrl) {
            const extensionMatch = fileUrl.match(/\.([a-zA-Z0-9]+)$/);
            fileType = extensionMatch ? extensionMatch[1].toLowerCase() : '';
        }
    } catch (error) {
        console.error('Error decoding file URL:', error);
    }

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return 'https://img.icons8.com/color/200/pdf--v1.png';
            case 'xlsx':
            case 'xls':
                return 'https://img.icons8.com/color/200/microsoft-excel-2019.png';
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return fileUrl;
            default:
                return 'https://img.icons8.com/ios/50/file--v1.png';
        }
    };

    const fileIcon = getFileIcon(fileType);

    const handleThumbnailClick = () => {
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType)) {
            setOpen(true);
        }
    };

    return (
        <>
            <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={handleThumbnailClick}>
                <CardContent>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            {fileUrl ? (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <img
                                        src={fileIcon}
                                        alt="File Thumbnail"
                                        style={{ maxWidth: '60px', maxHeight: '60px', borderRadius: '5px' }}
                                    />
                                </a>
                            ) : (
                                <Typography variant="body2" color="error">
                                    Invalid file
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs>
                            <Typography variant="subtitle1" sx={{ fontSize: '14px' }}>
                                {document.description}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <IconButton onClick={() => setOpen(false)} style={{ position: 'absolute', top: 8, right: 8 }}>
                        <CloseCircle variant="Bold" />
                    </IconButton>
                    <img src={fileUrl} alt="Full Preview" style={{ width: '100%', borderRadius: '5px' }} />
                </DialogContent>
            </Dialog>
        </>
    );
};
function UploadForm() {
    const theme = useTheme();
    const [file, setFile] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const { projectId } = useGetProjectDetailsContext();
    const { updateProjectExstension, isLoading } = useCreateProjectUpload();
    const { data: documents, refetch } = userprojectupload(projectId);

    useEffect(() => {
        console.log('Documents Data:', documents);
    }, [documents]);

    const handleSubmit = async () => {
        if (!description.trim()) {
            alert('Please enter a title.');
            return;
        }

        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        try {
            const payload = await formateProjectDocumentPayload(
                { description, extensionFiles: [file] },
                projectId
            );

            await updateProjectExstension(payload);
            await refetch();

            setDescription('');
            setFile(null);
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    return (
        <Grid container>
            <Grid item xs={12} sx={{ marginLeft: '20px', marginTop: '26px' }}>
                <MainCard title="Project Documents" border={true}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={4}>
                            <InputLabel sx={{ mb: 1 }}>Title</InputLabel>
                            <TextField
                                id="description"
                                fullWidth
                                variant="outlined"
                                placeholder="Enter Title"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={12}>
                            <FilePicker file={file} setFile={setFile} />
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                sx={{
                                    marginTop: theme.spacing(1),
                                    padding: '10px 30px'
                                }}
                            >
                                Upload
                            </Button>
                        </Grid>
                    </Grid>
                    <Box mt={4}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            Uploaded Files
                        </Typography>
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                Height: '250px',
                            }}
                        >
                            {documents && documents.data && documents.data.length > 0 ? (
                                documents.data.map((doc: any) => (
                                    <Grid item xs={12} sm={6} md={3} key={doc.id} sx={{ height: '130px', width: '200px' }}>
                                        <FileDisplay document={doc} />
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        No files uploaded yet.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                </MainCard>


            </Grid>
        </Grid>
    );
}


export default UploadForm;
