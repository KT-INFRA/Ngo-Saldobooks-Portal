import React, { useContext, useEffect, useRef } from 'react';
import FilePreview from './FilePreview';
import Header from './Header';
import { Props } from './interface';
import { FileContext } from './FileContext';
import { Box, Grid, Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import Dropzone from './Dropzone';
import { Add } from 'iconsax-react';

export const Main: React.FC<Props> = ({
  id,
  files = [],
  url,
  downloadFile,
  removeFile,
  showFileSize = false,
  showSliderCount,
  allowEditing,
  multiple,
  accept,
  maxFileSize,
  maxFiles,
  rounded,
  height,
  disabled,
  onChange,
  onRemove,
  onError,
  getFiles,
  onDrop
}) => {
  const fileData = useContext(FileContext).state.fileData;
  const inputId = id ?? `fileInput-${Date.now()}`;
  const insideInputRef = useRef<HTMLInputElement>(null);

  const { dispatch } = useContext(FileContext);

  const checkErrors = (files: File[]) => {
    let hasError = false;
    if (maxFiles && (fileData.length + files.length > maxFiles || files.length > maxFiles)) {
      hasError = true;
      if (onError) {
        onError(new Error(`Max ${maxFiles} files are allowed to be selected`));
      }
      throw new Error(`Max ${maxFiles} files are allowed to be selected`);
    }

    if (maxFileSize) {
      files.forEach((file: File) => {
        if (file.size > maxFileSize) {
          hasError = true;
          if (onError) {
            onError(new Error(`File size limit exceeded: ${file.name}`));
          }
          throw new Error(`File size limit exceeded: ${file.name}`);
        }
      });
    }

    return hasError;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (url) {
          const imageFileTypes = [
            { type: 'image/jpeg', ext: '.jpg' },
            { type: 'image/jpg', ext: '.jpg' },
            { type: 'image/png', ext: '.png' },
            { type: 'image/gif', ext: 'gif' },
            { type: 'image/tiff', ext: '.tiff' },
            { type: 'image/svg', ext: '.svg' }
          ];

          const response = await fetch(url);
          const blob = await response.blob();

          let fileExt = null;
          const filteredName = imageFileTypes.filter((fileType) => fileType.type === blob.type);
          if (filteredName.length > 0) {
            fileExt = filteredName[0].ext;
          }

          const file = new File([blob], 'file' + (fileExt ?? '.img'), {
            type: blob.type
          });

          dispatch({ type: 'STORE_FILE_DATA', payload: { files: [file] } });
        }
      } catch (err) {
        if (err instanceof Error) {
          if (onError) {
            onError(err);
          }
          throw err;
        }
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (files && files.length > 0) {
      if (!checkErrors(files)) {
        dispatch({ type: 'STORE_FILE_DATA', payload: { files: files } });
      }
    } else {
      dispatch({ type: 'RESET_FILE' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    dispatch({
      type: 'SET_COMPONENT_STATE',
      payload: {
        downloadFile: downloadFile !== undefined ? downloadFile : true,
        removeFile: removeFile !== undefined ? removeFile : true,
        showFileSize: showFileSize !== undefined ? showFileSize : true,
        showSliderCount: showSliderCount !== undefined ? showSliderCount : true,
        rounded: rounded !== undefined ? rounded : true,
        disabled: disabled ?? false,
        allowEditing: allowEditing ?? false
      }
    });
  }, [downloadFile, removeFile, showFileSize, showSliderCount, rounded, disabled, allowEditing, dispatch]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);

    if (!checkErrors(files)) {
      dispatch({ type: 'APPEND_FILE_DATA', payload: { files: files } });
    }
  };

  const remove = (file: File) => {
    dispatch({ type: 'REMOVE_FILE_DATA', payload: file });
    if (onRemove) {
      onRemove(file);
    }
  };

  useEffect(() => {
    if (getFiles) {
      getFiles(fileData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileData]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);

    if (files && files.length > 0) {
      if (!checkErrors(files)) {
        dispatch({ type: 'APPEND_FILE_DATA', payload: { files: files } });
        onDrop && onDrop(event);
      }
    }
  };

  return (
    <Grid xs={12} md={12}>
      <MainCard
        content={false}
        title={`Attachments: ${fileData.length}`}
        secondary={
          fileData.length > 0 ? (
            <Header
              id={inputId}
              fileData={fileData}
              multiple={multiple}
              disabled={disabled}
              accept={accept}
              onChange={onChange}
              handleImage={handleImage}
            />
          ) : null
        }
      >
        <Dropzone
          handleDragOver={disabled ? undefined : handleDragOver}
          handleDragLeave={disabled ? undefined : handleDragLeave}
          handleDrop={disabled ? undefined : handleDrop}
          height={height}
          fileData={fileData}
          disabled={disabled}
          key={''}
        >
          <Grid container spacing={3} md={12} xs={12}>
            {files?.length > 0 ? (
              <>
                {[...files]?.map((file, idx) => {
                  return <FilePreview remove={remove} file={file} index={idx} />;
                })}
                <Grid item sm={4} xs={12} md={3} sx={{ height: 'auto' }}>
                  <MainCard
                    content={false}
                    style={{
                      height: '100%',
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: 'secondary.main'
                    }}
                  >
                    <Box
                      sx={{
                        p: 1,
                        color: 'secondary.main',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          color: 'primary.main',
                          backgroundColor: 'primary.lighter'
                        }
                        // backgroundColor: 'primary.lighter',
                      }}
                      onClick={() => insideInputRef?.current?.click()}
                    >
                      <>
                        <Add size={30} />
                        <input
                          id={inputId}
                          ref={insideInputRef}
                          disabled={disabled}
                          type="file"
                          onChange={(e) => {
                            handleImage(e);
                            if (onChange) {
                              onChange(e);
                            }
                          }}
                          accept={accept ?? ''}
                          style={{ display: 'none' }}
                        />
                      </>
                    </Box>
                  </MainCard>
                </Grid>
              </>
            ) : (
              <Grid xs={12} md={12}>
                <Typography
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }}
                >
                  <label
                    htmlFor={inputId}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}
                  >
                    Drop files here, or click to browse files
                    <input
                      id={inputId}
                      disabled={disabled}
                      type="file"
                      onChange={(e) => {
                        handleImage(e);
                        if (onChange) {
                          onChange(e);
                        }
                      }}
                      multiple={multiple ?? true}
                      accept={accept ?? ''}
                      style={{ display: 'none' }}
                    />
                  </label>
                </Typography>
              </Grid>
            )}
          </Grid>
        </Dropzone>
      </MainCard>
    </Grid>
  );
};
