import React, { useState } from 'react';
import { Grid, Typography, Box, Button } from '@mui/material';
import MainCard from 'components/MainCard';
import { useCreateProjectUpload, userprojectupload } from 'api/project';
import { useGetProjectDetailsContext } from 'pages/projects/utils';
import LoadingButton from 'components/@extended/LoadingButton';
import { FormikHelpers, useFormik } from 'formik';
import { useMemo } from 'react';
import { TextField } from '@mui/material';
import { ReactFilesPreview } from 'sections/projects/add-project/FilePicker/ReactFilesPreview';
import { InputLabel } from '@mui/material';
import { Stack } from '@mui/material';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import * as Yup from 'yup';
import { documentInitialValues, formateProjectDocumentPayload, IDocumentsInitialValuesProps } from './utils';
interface Document {
    description: string;
    pdfLink: string;
}

export default function ProjectDocuments() {
    const { projectId } = useGetProjectDetailsContext();
    const { data, loading } = userprojectupload(projectId);
    const { updateProjectExstension, isLoading: isUpdatingProject } = useCreateProjectUpload();
    const updateProjectExtension = async (
        values: IDocumentsInitialValuesProps,
        { resetForm, setFieldValue }: FormikHelpers<IDocumentsInitialValuesProps>
    ) => {
        const formatedValues = await formateProjectDocumentPayload(values, projectId);
        await updateProjectExstension(formatedValues, {
            onSuccess(response) {
                if (response?.data?.result) {
                    // Success response
                    openSnackbar({
                        open: true,
                        message: response?.data?.message,
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        }
                    } as SnackbarProps);
                    resetForm();
                } else if (Array.isArray(response?.data) && response?.data?.length > 0) {
                    // Handling validation errors
                    const errorMessages = response?.data?.map((err) => err.msg).join(', ');
                    openSnackbar({
                        open: true,
                        message: errorMessages,
                        anchorOrigin: { vertical: 'top', horizontal: 'right' },
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        }
                    } as SnackbarProps);
                }
            },
            onError(error: any) {
                var errorMessage = error.message;
                if (Array.isArray(error)) {
                    errorMessage = error[0].msg;
                } else {
                    errorMessage = 'An error occurred while updating the project.';
                }
                openSnackbar({
                    open: true,
                    message: errorMessage,
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    }
                } as SnackbarProps);
            }
        });
    };
    const { getFieldProps, setFieldValue, values, errors, touched, handleSubmit } = useFormik<IDocumentsInitialValuesProps>({
        initialValues: documentInitialValues,
        validateOnMount: false,
        validationSchema: Yup.object().shape({
            extDuration: Yup.number().required('Extension Duration is required').min(1, 'Please enter a valid Extension Duration')
        }),
        onSubmit: updateProjectExtension
    });
    const files = useMemo(() => values.extensionFiles, [values]);

    const documents: Document[] = [
        {
            description:
                'Project Plan Document of Leverage our Salesforce and Certinia (FinancialForce) consulting services for seamless implementation or enhancing your existing solutions. We empower your business to:',
            pdfLink: '/path-to-project-plan.pdf',
        },
        {
            description:
                'Requirements Specification Document of detailed system and functional requirements for implementation.',
            pdfLink: '/path-to-requirements.pdf',
        },
        {
            description:
                'Final Report of Leverage our Salesforce and Certinia consulting services for seamless implementation.',
            pdfLink: '/path-to-final-report.pdf',
        },
        {
            description:
                'Project Plan Document of Leverage our Salesforce and Certinia (FinancialForce) consulting services for seamless implementation or enhancing your existing solutions. We empower your business to:',
            pdfLink: '/path-to-project-plan.pdf',
        },
        {
            description:
                'Requirements Specification Document of detailed system and functional requirements for implementation.',
            pdfLink: '/path-to-requirements.pdf',
        },
        {
            description:
                'Final Report of Leverage our Salesforce and Certinia consulting services for seamless implementation.',
            pdfLink: '/path-to-final-report.pdf',
        },
    ];

    return (
        <Grid item xs={12}>
            <MainCard
                title="View Project Documents"
                secondary={
                    <LoadingButton onClick={() => handleSubmit()} size="large" sx={{ margin: 0 }} loading={isUpdatingProject} variant="contained">
                        Update
                    </LoadingButton>
                }>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Stack sx={{ flex: 1 }} spacing={1}>
                            <InputLabel htmlFor="extDuration">Description</InputLabel>
                            <TextField
                                fullWidth
                                id="approvalReference"
                                placeholder="Enter Description"
                                {...getFieldProps('approvalReference')}
                                // error={Boolean(touched.approvalReference && errors.approvalReference)}
                                // helperText={touched.approvalReference && errors.approvalReference}
                            />
                        </Stack>
                    </Grid>
                </Grid>

                <Grid container py={3}>
                    <ReactFilesPreview
                        files={files}
                        getFiles={(files) => {
                            setFieldValue('extensionFiles', files);
                        }}
                    />
                </Grid>
                {/* <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        View Documents
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => console.log('Add Document')}
                    >
                        Add Document
                    </Button>
                </Box> */}

                <Grid container spacing={2}>
                    {documents.map((doc, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Box
                                sx={{
                                    display: 'flex', // Horizontal layout
                                    alignItems: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: 1,
                                    padding: 2,
                                    backgroundColor: '#f5f5f5',
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <a href={doc.pdfLink} target="_blank" rel="noopener noreferrer">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 60,
                                            height: 60,
                                            backgroundColor: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: 1,
                                            marginRight: 2, // Space between icon and description
                                        }}
                                    >
                                        <img
                                            width={40}
                                            src="https://img.icons8.com/color/200/pdf--v1.png"
                                            alt="PDF icon"
                                        />
                                    </Box>
                                </a>

                                <DescriptionWithToggle description={doc.description} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </MainCard>
        </Grid>
    );
}

interface DescriptionWithToggleProps {
    description: string;
}

function DescriptionWithToggle({ description }: DescriptionWithToggleProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded((prev) => !prev);
    };

    const truncatedDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;

    return (
        <Box
            sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordWrap: 'break-word',
                cursor: 'pointer',
            }}
            onClick={toggleDescription}
        >
            <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                    height: isExpanded ? 'auto' : '50px', // Dynamic height adjustment
                    transition: 'height 0.3s ease',
                }}
            >
                {isExpanded ? description : truncatedDescription}
            </Typography>
        </Box>
    );
}
