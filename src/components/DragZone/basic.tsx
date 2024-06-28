// import React, {CSSProperties} from 'react';
// import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
// import type {ButtonType} from 'Components/Button/buttonHelpers';
//
// interface BasicProps {
//     className?: string;
//     style?: CSSProperties;
//     type?: ButtonType;
//     active?: boolean;
//     children?: string | React.ReactNode;
//     onClick?: React.MouseEventHandler<HTMLAnchorElement>;
// }
//
// const Basic: React.FC<BasicProps> = (props) => {
//     const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
//     const files = acceptedFiles.map(file => (
//         <li key={file.name}>
//             {file.name} - {file.size} bytes
//         </li>
//     ));
//     return (
//         <section className="container">
//             <div {...getRootProps({ className: 'dropzone' }) as DropzoneRootProps}>
//                 <input {...getInputProps() as DropzoneInputProps} />
//                 <p>Drag n drop some files here, or click to select files</p >
//             </div>
//             <aside>
//                 <h4>Files</h4>
//                 <ul>{files}</ul>
//             </aside>
//         </section>
//     );
// };
//
// export default Basic;
import React, { CSSProperties, useCallback, useState } from 'react';
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import axios from 'axios';
import type { ButtonType } from 'Components/Button/buttonHelpers';

interface BasicProps {
    className?: string;
    style?: CSSProperties;
    type?: ButtonType;
    active?: boolean;
    children?: string | React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const Basic: React.FC<BasicProps> = (props) => {
    const [responseData, setResponseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [missingKeys, setMissingKeys] = useState<string[]>([]);
    const [missingKeyValues, setMissingKeyValues] = useState<string[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        // 发送文件到后端
        axios.post('http://127.0.0.1:8001/upload_table7', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            console.log('File uploaded successfully:', response.data);
            setResponseData(response.data.data); // 假设后端返回的数据包含在 data 字段中
            setError(null);
            setMissingKeys([]);
            setMissingKeyValues([]);
        }).catch(error => {
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
                                    <li key={key}>{key}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Basic;
