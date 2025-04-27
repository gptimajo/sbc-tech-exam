"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState  } from "react";
import { FieldValues, useForm } from "react-hook-form";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, Input, InputLabel, styled } from "@mui/material";
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import React from "react";
import { setToast } from "../../../../slices/toastSlice";
import { useDispatch } from "react-redux";
import UploadFile from "@/app/components/upload-file";


export default function Recipe() {
  const { id } = useParams();
  const router = useRouter();

  const dispatch = useDispatch();

  const [,setRecipeError] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { register, handleSubmit, formState: {errors}, reset } = useForm();

  const isNew = id === 'new';

  useEffect(() => {
    if(!isNew && id) {
      fetch(`https://680b406dd5075a76d98a61b3.mockapi.io/recipes/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const formData = {...data};
          delete formData.createdAt;
          delete formData.id;

          setImagePreview(formData.image);

          reset(formData);
        })
        .catch(() => setRecipeError("Error fetching recipe"));
    }
  },[id, isNew, reset]);

  const onSubmit = async (data: FieldValues) => {
    setSubmitting(true);

    const formData = {...data};
    if(isNew) {
      delete formData.id;

      const uploadImageData = new FormData();
      uploadImageData.append('file', data.file[0]);

      const uploadedFile = await fetch(`/upload`, {
        method: 'POST',
        body: uploadImageData
      }).then((response) => response.json()).catch(() => {
        setRecipeError("Error uploading image");
        return null;
      });

      if(!uploadedFile) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { file, ...updatedFormData} = formData;

      updatedFormData.image = uploadedFile.data;

      await fetch(`https://680b406dd5075a76d98a61b3.mockapi.io/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFormData)
      })
      .then((response) => response.json())
      .then(data => {
        router.push(`/recipe/${data.id}`);
      });

    }
    else {
      console.log('update',{formData})

      if(formData.file && formData.file.length > 0) {
        const uploadImageData = new FormData();
        uploadImageData.append('file', formData.file[0]);

        const uploadedFile = await fetch(`/upload`, {
          method: 'POST',
          body: uploadImageData
        }).then((response) => response.json()).catch(() => {
          setRecipeError("Error uploading image");
          return null;
        });

        if(!uploadedFile) {
          return;
        }

        formData.image = uploadedFile.data;
        delete formData.file;
      }

      await fetch(`https://680b406dd5075a76d98a61b3.mockapi.io/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then((response) => response.json())
      .then(data => {
        router.push(`/recipe/${data.id}`);
      });

    }
    setSubmitting(false)
  };

  const handleDelete = () => {
    if(id) {
      fetch(`https://680b406dd5075a76d98a61b3.mockapi.io/recipes/${id}`, {
        method: 'DELETE',
      })
      .then(() => {
        dispatch(setToast("Recipe has been deleted."))
        setConfirmDelete(false);
        router.push('/');
      })
      .catch(() => setRecipeError("Error deleting recipe"));
    }
  };


  return (<React.Fragment>
    <FormContainer>
      <Grid container spacing={2} style={{padding: '10px'}}>
            <Grid size={3}>
              <Sidebar>
                <SidebarItem>
                  <BackButton onClick={() => router.push('/')} size="large" startIcon={<ArrowBackIosOutlinedIcon />}>Back</BackButton>
                  <UploadFile file={imagePreview} inputProps={register("file",{ required: isNew?"Recipe image is required": false,})} formError={errors.file ? errors.file.message : undefined} />
                </SidebarItem>
              </Sidebar>
            </Grid>
            <Grid size={9}>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <FormControl sx={{ mb: 2}}>
                    <InputLabel htmlFor="form-name" shrink={true}>Your Name</InputLabel>
                    <Input id="form-name"  {...register("name",{ required:"Your name is required", })} />
                    {errors.name && <span className="text-red-500">{`${errors.name.message}`}</span>}
                  </FormControl>
                  <FormControl sx={{ mb: 2}}>
                    <InputLabel htmlFor="form-email" shrink={true}>Email Address</InputLabel>
                    <Input id="form-email" type="email" {...register("email",{ required:"Email Address is required", })} />
                    {errors.email && <span className="text-red-500">{`${errors.email.message}`}</span>}
                  </FormControl>
                  <FormControl sx={{ mb: 2}}>
                    <InputLabel htmlFor="form-title" shrink={true}>Title</InputLabel>
                    <Input id="form-title" type="text" {...register("title",{ required:"Title is required", })} />
                    {errors.title && <span className="text-red-500">{`${errors.title.message}`}</span>}
                  </FormControl>
                  <FormControl sx={{ mb: 2}}>
                    <InputLabel htmlFor="form-description" shrink={true}>Description</InputLabel>
                    <Input id="form-description" type="text" {...register("description",{ required:"Description is required", })} />
                    {errors.description && <span className="text-red-500">{`${errors.description.message}`}</span>}
                  </FormControl>
                  <FormControl sx={{ mb: 2}}>
                    <InputLabel htmlFor="form-ingredients" shrink={true}>Ingredients</InputLabel>
                    <Input id="form-ingredients" type="text" multiline={true}  minRows={5} {...register("ingredients",{ required:"Ingredients is required", })} />
                    {errors.ingredients && <span className="text-red-500">{`${errors.ingredients.message}`}</span>}
                  </FormControl>
                  <FormControl sx={{ mb: 2}}>
                    <InputLabel htmlFor="form-instructions" shrink={true}>Instructions</InputLabel>
                    <Input id="form-instructions" type="text" multiline={true} minRows={5} {...register("instructions",{ required:"Instructions is required", })} />
                    {errors.instructions && <span className="text-red-500">{`${errors.instructions.message}`}</span>}
                  </FormControl>
                  <Box className="flex flex-row gap-4" sx={{justifyContent: 'flex-end'}}>
                  {!isNew && <Button type="submit" variant="contained" color="error" onClick={()=>setConfirmDelete(true)}>Delete</Button>}
                  <Button type="submit" variant="contained" disabled={submitting}>Save</Button>
                  </Box>
                </form>
            </Grid>
        </Grid>
      </FormContainer>
      <Dialog
        fullScreen={false}
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Confirm delete recipe?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to delete this recipe. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
}

const Sidebar = styled('div')(() => ({
  width: '100%',
  maxWidth: '350px',
  margin: '0 auto',
}));

const SidebarItem = styled('div')(() => ({
  marginBottom: '10px',
}));

const BackButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black,
}));

const FormContainer = styled('div')(() => ({
  paddingTop: '20px',
}));