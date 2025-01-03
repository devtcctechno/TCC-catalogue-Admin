import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React from 'react'

const Editor = ({ value, onChange }: any) => {
    
    const uploadImage = async (file: File | null) => {
        try {
            if (!file) {
                throw new Error('File is null or undefined')
            }

            const reader = new FileReader()
            reader.readAsDataURL(file)

            return new Promise<{ default?: string; error?: { message: string } }>((resolve, reject) => {
                reader.onload = (event: ProgressEvent<FileReader>) => {
                    const base64String = 'data:' + file.type + ';base64,' + (event?.target?.result as string)?.split(',')[1]

                    if (base64String) {
                        resolve({ default: base64String })
                    } else {
                        reject({ error: { message: 'Failed to read base64 data' } })
                    }
                }

                reader.onerror = () => {
                    reject({ error: { message: 'Failed to upload image: FileReader error' } })
                }
            })
        } catch (error) {
            return { error: { message: 'Failed to upload image' } }
        }
    }

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                data={value === null || value === undefined ? "<p></p>" : value}
                onChange={(event, editor) => {
                    const data = editor?.getData()
                    onChange(data)
                }}
                onReady={editor => {
                    editor.plugins.get('FileRepository').createUploadAdapter = (loader: { file: any }) => {
                        return {
                            upload: async () => {
                                const file = await loader.file
                                const { default: imageUrl, error } = await uploadImage(file)

                                if (error) {
                                    throw new Error(error.message)
                                }

                                return {
                                    default: imageUrl
                                }
                            }
                        }
                    }
                    editor.editing.view.document.on('drop', (event, data) => {
                        // Handle drop event here
                    })
                }}
                config={{
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'bold',
                            '|',
                            'italic',
                            '|',
                            'bulletedList',
                            '|',
                            'numberedList',
                            '|',
                            'blockQuote',
                            '|',
                            'insertTable',
                            '|',
                            'removeFormat',
                            '|',
                            'selectAll',
                            '|',
                            'link',
                            '|',
                            'imageUpload',
                            '|',
                            'mediaEmbed',
                            '|',
                            'undo',
                            'redo'
                        ],
                        shouldNotGroupWhenFull: true
                    },
                    language: 'en',
                    image: {
                        toolbar: [
                            'imageTextAlternative',
                            '|',
                            'imageStyle:alignBlockLeft',
                            'imageStyle:alignCenter',
                            'imageStyle:alignBlockRight',
                            '|',
                            'imageResize'
                        ],
                        styles: {
                            options: ['full', 'alignBlockLeft', 'alignCenter', 'alignBlockRight']
                        }
                    },

                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                    },
                    mediaEmbed: { previewsInData: true }
                }}
            />
        </>
    )
}

export default Editor
