// ** React Imports
import { forwardRef, Fragment, useEffect, useImperativeHandle, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled, useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
import FileUploadWapper from '../../styles/file-upload'
import { Chip } from '@mui/material'

import { IMG_ENDPOINT } from 'src/AppConfig'
import { toast } from 'react-hot-toast'

interface FileProp {
    name: string
    type: string
    size: number
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
    width: 48,
    height: 48,
    marginBottom: theme.spacing(8.75)
}))

const GlbFileUpload = (props: any) => {
    // ** State
    const [files, setFiles] = useState<File[]>([])
    let imagePath = `${IMG_ENDPOINT}/${props.imageFile}`

    async function createFile(fileUrl: string) {
        const response = await fetch(IMG_ENDPOINT + "/" + props.imagePath);
        const extension = fileUrl.split(".").pop();
        const data = await response.blob();
        const metadata = {
            type: (extension === "glb" ? "model/gltf-binary" : "")
        };
        const segments = fileUrl.split('/');
        const imageName = segments.pop() || segments.pop(); // Handle potential trailing slash

        const file = new File([data], imageName || "", metadata);
        const filesArray = [file];
        setFiles(filesArray);

        // ... do something with the file or return it
    }

    useEffect(() => {
        if (props.imageFile && props.imageFile != null) {
            //File Exists
            createFile(props.imageFile as string)
        }
    }, [props.imageFile])

    // ** Hooks
    const theme = useTheme()
    const { getRootProps, getInputProps } = useDropzone({
        maxSize: 5000000,
        accept: {
            'model/gltf-binary': ['.glb'],
            'model/gltf+json': ['.gltf'],
        },
        multiple: false,
        disabled: props?.disabled ? props?.disabled : false,
        onDrop: (acceptedFiles: File[]) => {
            setFiles(acceptedFiles.map((file: File) => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })))
            if (props.onDrop) { props.onDrop(acceptedFiles[0]); }
        },
        onDropRejected: () => {
            toast.error('You can only upload maximum size of 5 MB.', {
                duration: 2000,
            })
        }
    })

    useEffect(() => {
        if (props?.imageValue) {
            if (files.length !== 0) {
                props?.imageValue('0')
            } else {
                props?.imageValue('1')
            }
        }
    }, [files, props?.imageValue])

    const renderFilePreview = (file: any) => {
        if (file.path === undefined) {
            return <img width={38} height={38} alt={file.name} src={`${imagePath}`} />
        }
        imagePath = "";
        if (file.type.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
        } else {
            return <Icon icon='tabler:file-description' />
        }
    }


    const handleRemoveFile = (file: FileProp) => {

        imagePath = ""
        const uploadedFiles = files
        const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
        setFiles([...filtered])
        if (filtered.length === 0) {
            toast.error("Please Upload Image", {
                position: "top-center"
            })
        }
        if (props.onDrop) { props.onDrop([...filtered]); }
    }

    const img = files.map((file: FileProp) => (
        <div className="image_main_div">
            <div className='image_inner_div'>
                <div className='image_div'>{renderFilePreview(file)}</div>
                <div style={{ display: 'block' }}>
                    <div className='content_main_div'>{file.name}</div>
                    <div className='image_div'>
                        {Math.round(file.size / 100) / 10 > 1000
                            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                            : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                    </div>
                </div>
            </div>
            <div className='remove_image_div'>
                <IconButton onClick={() => handleRemoveFile(file)} disabled={props.disabled}>
                    <Icon icon='tabler:x' fontSize={20} />
                </IconButton>
            </div>
        </div>
    ))

    const handleRemoveAllFiles = () => {
        setFiles([])
        if (props.onDrop) { props.onDrop(); }
    }

    useEffect(() => {
        if (props.onClick == '0') {
            handleRemoveAllFiles()
        }
    }, [props.onClick])

    return (
        <FileUploadWapper>
            <Fragment>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>

                        <Icon icon='tabler:file-upload' width={60} />
                        <Typography sx={{ mb: 2.5 }}>
                            Drop files here or click to upload.
                        </Typography>
                    </Box>
                </div>
                {files.length ? (
                    <Fragment>
                        <List>{img}</List>
                        <div className='buttons'>
                            <Button color='error' variant='outlined' disabled={props.disabled} onClick={handleRemoveAllFiles}>
                                Remove
                            </Button>
                        </div>
                    </Fragment>
                ) : null}

            </Fragment>
        </FileUploadWapper>
    )
}

export default GlbFileUpload
