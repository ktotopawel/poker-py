import { Description, Field, Input, Label } from '@headlessui/react';
import { useField } from 'formik';
import * as React from 'react';
import clsx from 'clsx';

interface IInputField extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  description?: string;
  name: string;
  placeholder?: string;
  type: 'text' | 'number';
}

const InputField = ({ label, description, name, type, placeholder, ...props }: IInputField) => {
  const [field, meta] = useField({ name, ...props });

  return (
    <Field className={'flex flex-col justify-start gap-2'}>
      <div className="gap-1">
        <Label>{label}</Label>
        {description && (
          <Description className={'text-sm text-muted w-full'}>{description}</Description>
        )}
      </div>
      <Input
        {...field}
        {...props}
        className={clsx('border-2 border-gray-600/20 rounded-lg px-2 py-1 w-full', {
          'border-danger': meta.error && meta.touched,
          'appearance-none': type === 'number',
        })}
        placeholder={placeholder}
      />
    </Field>
  );
};

export default InputField;
