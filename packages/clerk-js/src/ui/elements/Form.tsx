import { createContextAndHook } from '@clerk/shared';
import React from 'react';

import { Button, descriptors, Flex, Form as FormPrim, localizationKeys } from '../customizables';
import { useLoadingStatus } from '../hooks';
import { PropsOfComponent } from '../styledSystem';
import { useCardState } from './contexts';
import { FormControl } from './FormControl';

const [FormState, useFormState] = createContextAndHook<{ isLoading: boolean; isDisabled: boolean }>('FormState');

type FormProps = PropsOfComponent<typeof FormPrim>;

const FormRoot = (props: FormProps): JSX.Element => {
  const card = useCardState();
  const status = useLoadingStatus();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    e.stopPropagation();
    if (!props.onSubmit) {
      return;
    }
    try {
      card.setLoading();
      status.setLoading();
      await props.onSubmit(e);
    } finally {
      card.setIdle();
      status.setIdle();
    }
  };

  const value = React.useMemo(() => {
    return { value: { isLoading: status.isLoading, isDisabled: card.isLoading || status.isLoading } };
  }, [card.isLoading, status.isLoading]);

  return (
    <FormState.Provider value={value}>
      <FormPrim
        elementDescriptor={descriptors.form}
        gap={4}
        {...props}
        onSubmit={onSubmit}
      >
        {/*
        We add a submit button as the first element of the form as a workaround to support
        submitting the form via hitting enter on a field, without explicitly adding type=submit
        to the other buttons, to avoid conflicts with css resets like tailwind's.
        This button needs to always be the first element of the form.
        */}
        <button
          type='submit'
          aria-hidden
          style={{ display: 'none' }}
        />
        {props.children}
      </FormPrim>
    </FormState.Provider>
  );
};

const FormSubmit = (props: PropsOfComponent<typeof Button>) => {
  const { isLoading, isDisabled } = useFormState();
  return (
    <>
      <Button
        elementDescriptor={descriptors.formButtonPrimary}
        block
        textVariant='buttonExtraSmallBold'
        isLoading={isLoading}
        isDisabled={isDisabled}
        type='submit'
        {...props}
        localizationKey={props.localizationKey || localizationKeys('formButtonPrimary')}
      />
    </>
  );
};

const FormReset = (props: PropsOfComponent<typeof Button>) => {
  const { isLoading, isDisabled } = useFormState();
  return (
    <>
      <Button
        elementDescriptor={descriptors.formButtonReset}
        block
        variant='ghost'
        textVariant='buttonExtraSmallBold'
        type='reset'
        isDisabled={isLoading || isDisabled}
        {...props}
      />
    </>
  );
};

const FormControlRow = (props: React.PropsWithChildren<any>) => {
  return (
    <Flex
      elementDescriptor={descriptors.formFieldRow}
      justify='between'
      gap={4}
      {...props}
    />
  );
};

export const Form = {
  Root: FormRoot,
  ControlRow: FormControlRow,
  Control: FormControl,
  SubmitButton: FormSubmit,
  ResetButton: FormReset,
};
