import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

export const DropzoneContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

export function StyledDropzone(props: any) {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      props.onDrop(acceptedFiles[0]);
    }
  });
  return (
    <div className="container">
      <DropzoneContainer {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
        <input {...getInputProps()} />
        {props.ratio ? (
          <p>
            Click or move the image there {' '}
            <b>{props.ratio.join(', ')}</b>
          </p>
        ) : (
          <p>Click or move the image there</p>
        )}
      </DropzoneContainer>
    </div>
  );
}
