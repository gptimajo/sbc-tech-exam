"use client";
import { useEffect, useState } from "react";
import { styled } from "@mui/material";


interface UploadFileProps {
    file?: string|File;
    inputProps: React.InputHTMLAttributes<HTMLInputElement>;
    formError?: string;
}

export default function UploadFile({inputProps, file, formError}:UploadFileProps) {
    const [selectedFile, setSelectedFile] = useState<string|File|null>(file ?? null);
    const [fileUploadError, setFileUploadError] = useState<string>('');

    useEffect(() => {
        setFileUploadError(formError ?? '');
    }, [formError]);

    useEffect(() => {
        if (file) {
            setSelectedFile(file);
        }
    }, [file]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setFileUploadError('File size exceeds 10MB');
            } else {
                setFileUploadError('');
            }

            setSelectedFile(selectedFile);
        }
    };

    return (
        <UploadFileContainer>
            <UploadFileInput type="file" accept="image/*" {...inputProps} onChange={handleFileChange}  />
            <UploadFilePreview src={selectedFile ? (typeof selectedFile === 'string' ? file : URL.createObjectURL(selectedFile)) : '/placeholder.png'} alt="Upload Recipe image" title="Click to upload a recipe image"  />
            {fileUploadError && <UploadErrorText style={{color: 'red'}}>{fileUploadError}</UploadErrorText>}
        </UploadFileContainer>
    );

};

const UploadFileContainer = styled('div')(() => ({
    position: 'relative',
    width: '100%',
    maxWidth: '250px',
    height: '250px',
    margin: '10px auto 30px',
    borderRadius: '10px',
}));

const UploadFileInput = styled('input')(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
}));

const UploadFilePreview = styled('img')(() => ({
    width: '100%',
    height: '100%',
    borderRadius: '10px',
    objectFit: 'cover',
}));

const UploadErrorText = styled('span')(() => ({
    color: 'red',
    position: 'absolute',
    bottom: -25,
    right: 0,
    left: 0,
    textAlign: 'center',
}));