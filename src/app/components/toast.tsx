"use client";
import React from "react";
import { Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearToast, selectToast } from "../../../slices/toastSlice";

export default function Toast(){
    const dispatch = useDispatch();

    const toastMessage = useSelector(selectToast);

    const handleClose = () => {
        dispatch(clearToast())
    };

    if(!toastMessage){
        return <React.Fragment />;
    }

    return (
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={true}
        autoHideDuration={6000}
        onClose={handleClose}
        message={toastMessage}
      />);
}