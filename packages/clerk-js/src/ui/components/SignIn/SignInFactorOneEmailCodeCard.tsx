import { EmailCodeFactor } from '@clerk/types';
import React from 'react';

import { useEnvironment } from '../../contexts';
import { Flow, localizationKeys } from '../../customizables';
import { SignInFactorOneCodeCard, SignInFactorOneCodeForm } from './SignInFactorOneCodeForm';

type SignInFactorOneEmailCodeCardProps = SignInFactorOneCodeCard & { factor: EmailCodeFactor };

export const SignInFactorOneEmailCodeCard = (props: SignInFactorOneEmailCodeCardProps) => {
  const { applicationName } = useEnvironment().displayConfig;

  return (
    <Flow.Part part='emailCode'>
      <SignInFactorOneCodeForm
        {...props}
        cardTitle={localizationKeys('signIn.emailCode.title')}
        cardSubtitle={localizationKeys('signIn.emailCode.subtitle', { applicationName })}
        formTitle={localizationKeys('signIn.emailCode.formTitle')}
        formSubtitle={localizationKeys('signIn.emailCode.formSubtitle')}
        resendButton={localizationKeys('signIn.emailCode.resendButton')}
      />
    </Flow.Part>
  );
};
