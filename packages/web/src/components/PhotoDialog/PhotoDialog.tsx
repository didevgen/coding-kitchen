// @ts-ignore
import { useMutation } from '@apollo/client';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { CREATE_POST } from '../../graphql/mutations/post';
import { StyledDropzone } from './Dropzone';

const EditorContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export interface ImageDialogProps {
  setOpen: (state: boolean) => void;
  open: boolean;
  downloadLink?: string;
  ratio?: string[];
  params: {
    uuid: string;
  };
}

const ImageContainer = styled.div`
  max-width: 720px;
  align-self: center;
`;
const StyledImage = styled.img`
  max-width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function NewPhoto({ uuid }) {
  const [open, setOpen] = useState(false);

  return (
    <ButtonContainer>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Create Post
      </Button>
      <PhotoDialog setOpen={setOpen} open={open} params={{ uuid }} />
    </ButtonContainer>
  );
}

export function PhotoDialog({ setOpen, open, params, downloadLink, ratio }: ImageDialogProps) {
  const [createPost] = useMutation(CREATE_POST);
  const [image, setImage] = useState<any>(null);
  const [name, setName] = useState<any>('');
  const [previewUrl, setPreviewUrl] = useState(downloadLink);

  useEffect(() => {
    if (open) {
      setPreviewUrl(downloadLink);
    }
    // eslint-disable-next-line
  }, [open]);
  const handleClose = () => {
    setTimeout(() => {
      setImage(undefined);
      setPreviewUrl(undefined);
    }, 200);
    setName(null);
    setOpen(false);
  };

  const handleDrop = (dropped: any) => {
    setImage(dropped);
    const reader = new FileReader();
    reader.readAsDataURL(dropped);

    reader.onloadend = e => {
      setPreviewUrl(reader.result as string);
    };
  };

  const onSave = async () => {
    await createPost({
      variables: {
        postData: {
          description: name
        },
        image
      }
    });
    handleClose();
  };
  return (
    <Dialog open={open} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={'md'}>
      <DialogTitle id="form-dialog-title">Add image</DialogTitle>
      <DialogContent>
        {!previewUrl && <StyledDropzone onDrop={handleDrop} ratio={ratio} />}
        {previewUrl && (
          <Fragment>
            <EditorContainer>
              <ImageContainer>
                <StyledImage src={previewUrl} />
              </ImageContainer>
              <div>
                <TextField
                  label="Description"
                  margin="normal"
                  multiline
                  rows={3}
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                  }}
                  fullWidth={true}
                  variant="outlined"
                />
              </div>
            </EditorContainer>
          </Fragment>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button variant="contained" disabled={!image || !name} onClick={onSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
