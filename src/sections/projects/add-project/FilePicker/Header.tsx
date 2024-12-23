import { Button } from '@mui/material';
import { Add } from 'iconsax-react';
import { ChangeEventHandler, useRef } from 'react';

const Header = (props: {
  id: string;
  fileData: File[];
  disabled: boolean | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  handleImage: ChangeEventHandler<HTMLInputElement>;
  multiple: boolean | undefined;
  accept: string | undefined;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => ref?.current?.click()} variant="contained" color="primary" startIcon={<Add />}>
        <input
          ref={ref}
          id={props.id}
          disabled={props.disabled}
          type="file"
          onChange={(e) => {
            props.handleImage(e);
            if (props.onChange) {
              props.onChange(e);
            }
          }}
          style={{ display: 'none' }}
          multiple={props.multiple ?? true}
          accept={props.accept ?? ''}
        />
        Add More
      </Button>
    </>
  );
};

export default Header;
