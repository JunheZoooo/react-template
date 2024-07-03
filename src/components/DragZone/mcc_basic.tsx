import React, { CSSProperties, useCallback, useState } from 'react';
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { TextField, MenuItem, Button } from '@mui/material';
import { PostMCC } from '@/api/home-form';
import {ButtonType} from 'Components/Button/buttonHelpers';

interface BasicProps {
    className?: string;
    style?: CSSProperties;
    type?: ButtonType;
    active?: boolean;
    children?: string | React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const MCCBasic: React.FC<BasicProps> = (props) => {
    const [responseData, setResponseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [missingKeys, setMissingKeys] = useState<string[]>([]);
    const [missingKeyValues, setMissingKeyValues] = useState<string[]>([]);
    const [fieldValues, setFieldValues] = useState<{ [key: string]: string }>({});

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        PostMCC(formData)
            .then((response) => {
                console.log('File uploaded successfully:', response.data);
                setResponseData(response.data);
                setError(null);
                setMissingKeys([]);
                setMissingKeyValues([]);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                if (error.response && error.response.data) {
                    const data = error.response.data;
                    setMissingKeys(data.missing_keys || []);
                    setMissingKeyValues(data.missing_key_values || []);
                    setError(data.message || 'Error uploading file');
                } else {
                    setError('Error uploading file');
                }
            });
    }, []);

    const handleFieldChange = (key: string, value: string) => {
        setFieldValues(prevValues => ({ ...prevValues, [key]: value }));
    };

    const handleSubmit = () => {
        // 处理提交缺少的字段值
        console.log('Submitting missing values:', fieldValues);
        // 这里可以添加提交逻辑，例如再次发送请求到后端
    };

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({ onDrop });

    const files = acceptedFiles.map(file => (
        <li key={file.name}>
            {file.name} - {file.size} bytes
        </li>
    ));

    return (
        <section className="container" style={props.style}>
            <div {...getRootProps({ className: 'dropzone' }) as DropzoneRootProps}>
                <input {...getInputProps() as DropzoneInputProps} />
                <p>Drag and drop some files here, or click to select files</p>
            </div>
            <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside>
            {responseData && (
                <div>
                    <h4>Response Data</h4>
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
            {error && (
                <div>
                    <h4>Error</h4>
                    <p>{error}</p>
                    {missingKeys.length > 0 && (
                        <div>
                            <h5>Missing Foreign Keys:</h5>
                            <ul>
                                {missingKeys.map(key => (
                                    <li key={key}>{key}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {missingKeyValues.length > 0 && (
                        <div>
                            <h5>Missing Foreign Key Values:</h5>
                            <ul>
                                {missingKeyValues.map(key => (
                                    <li key={key}>
                                        {key}
                                        <TextField
                                            select
                                            label={`Select ${key}`}
                                            value={fieldValues[key] || ''}
                                            onChange={(e) => handleFieldChange(key, e.target.value)}
                                            fullWidth
                                            margin="normal"
                                        >
                                            <MenuItem value="Value1">Value1</MenuItem>
                                            <MenuItem value="Value2">Value2</MenuItem>
                                            <MenuItem value="Value3">Value3</MenuItem>
                                        </TextField>
                                    </li>
                                ))}
                            </ul>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit Missing Values
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default MCCBasic;
