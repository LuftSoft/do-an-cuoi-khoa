import { FormHelperText } from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
import type { FC } from 'react';

import type { InputFieldProps } from './types';

import { Small } from 'components/abstract/Typography';
import { rubik } from 'theme/typography';

const ReactQuill = dynamic(
  () => import('react-quill'),
  { ssr: false }, // This will make the module skip server-side rendering.
);

const modules = {
  toolbar: { container: '#toolbar' },
};

const formats = ['size', 'bold', 'italic', 'underline', 'list', 'bullet'];

type QuillEditorProps = {
  commonInputProps: InputFieldProps['commonInputProps'];
};

const FormikQuillEditor: FC<QuillEditorProps> = ({ commonInputProps }) => {
  const { label, name, disabled } = commonInputProps;
  const { touched, errors, setFieldValue, values, setFieldTouched } =
    useFormikContext<any>();

  return (
    <>
      <Small
        display='block'
        mb={1}
        textAlign='left'
        fontWeight='600'
        color='grey.700'
        fontSize='14px'
      >
        {label}
      </Small>
      <Box
        sx={{
          '& *': {
            fontFamily: `SVN-Rubik, ${rubik.style.fontFamily} !important`,
          },
        }}
      >
        <div id='toolbar'>
          <select value='' className='ql-size'>
            <option value='small'>Nhỏ</option>
            <option value=''>Bình thường</option>
            <option value='large'>Tiêu đề vừa</option>
            <option value='huge'>Tiêu đề lớn</option>
          </select>

          <button className='ql-bold' />
          <button className='ql-italic' />
          <button className='ql-underline' />

          <button className='ql-list' value='ordered' />
          <button className='ql-list' value='bullet' />
        </div>
        <ReactQuill
          className={disabled ? 'readonly' : ''}
          readOnly={disabled}
          modules={modules}
          formats={formats}
          theme='snow'
          value={values[name]}
          onChange={(value) => setFieldValue(name, value)}
          onBlur={() => setFieldTouched(name, true)}
        />
        <FormHelperText
          className='Mui-error'
          sx={{
            ml: '12px',
          }}
        >
          {(touched[name] && errors[name]) as string}
        </FormHelperText>
      </Box>
    </>
  );
};

export default FormikQuillEditor;
