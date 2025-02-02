import React from 'react';

import { useWizard, Wizard } from '../../common';
import { useCoreUser } from '../../contexts';
import { LocalizationKey, localizationKeys, Text } from '../../customizables';
import { ContentPage, Form, FormButtons, SuccessPage, useCardState, withCardStateProvider } from '../../elements';
import { useEnabledThirdPartyProviders } from '../../hooks';
import { useRouter } from '../../router';
import { handleError } from '../../utils';
import { UserProfileBreadcrumbs } from './UserProfileNavbar';

export const RemoveEmailPage = () => {
  const user = useCoreUser();
  const { id } = useRouter().params;
  const ref = React.useRef(user.emailAddresses.find(e => e.id === id));

  if (!ref.current) {
    return null;
  }

  return (
    <RemoveResourcePage
      title={localizationKeys('userProfile.emailAddressPage.removeResource.title')}
      messageLine1={localizationKeys('userProfile.emailAddressPage.removeResource.messageLine1', {
        identifier: ref.current.emailAddress,
      })}
      messageLine2={localizationKeys('userProfile.emailAddressPage.removeResource.messageLine2')}
      successMessage={localizationKeys('userProfile.emailAddressPage.removeResource.successMessage', {
        emailAddress: ref.current.emailAddress,
      })}
      deleteResource={() => Promise.resolve(ref.current?.destroy())}
    />
  );
};

export const RemovePhonePage = () => {
  const user = useCoreUser();
  const { id } = useRouter().params;
  const ref = React.useRef(user.phoneNumbers.find(e => e.id === id));

  if (!ref.current) {
    return null;
  }

  return (
    <RemoveResourcePage
      title={localizationKeys('userProfile.phoneNumberPage.removeResource.title')}
      messageLine1={localizationKeys('userProfile.phoneNumberPage.removeResource.messageLine1', {
        identifier: ref.current.phoneNumber,
      })}
      messageLine2={localizationKeys('userProfile.phoneNumberPage.removeResource.messageLine2')}
      successMessage={localizationKeys('userProfile.phoneNumberPage.removeResource.successMessage', {
        phoneNumber: ref.current.phoneNumber,
      })}
      deleteResource={() => Promise.resolve(ref.current?.destroy())}
    />
  );
};

export const RemoveConnectedAccountPage = () => {
  const user = useCoreUser();
  const { id } = useRouter().params;
  const ref = React.useRef(user.externalAccounts.find(e => e.id === id));
  const { providerToDisplayData } = useEnabledThirdPartyProviders();

  if (!ref.current) {
    return null;
  }

  return (
    <RemoveResourcePage
      title={localizationKeys('userProfile.connectedAccountPage.removeResource.title')}
      messageLine1={localizationKeys('userProfile.connectedAccountPage.removeResource.messageLine1', {
        identifier: providerToDisplayData[ref.current.provider]?.name,
      })}
      messageLine2={localizationKeys('userProfile.connectedAccountPage.removeResource.messageLine2')}
      successMessage={localizationKeys('userProfile.connectedAccountPage.removeResource.successMessage', {
        connectedAccount: providerToDisplayData[ref.current.provider]?.name,
      })}
      deleteResource={() => Promise.resolve(ref.current?.destroy())}
    />
  );
};

export const RemoveWeb3WalletPage = () => {
  const user = useCoreUser();
  const { id } = useRouter().params;
  const ref = React.useRef(user.web3Wallets.find(e => e.id === id));

  if (!ref.current) {
    return null;
  }

  return (
    <RemoveResourcePage
      title={localizationKeys('userProfile.web3WalletPage.removeResource.title')}
      messageLine1={localizationKeys('userProfile.web3WalletPage.removeResource.messageLine1', {
        identifier: ref.current.web3Wallet,
      })}
      messageLine2={localizationKeys('userProfile.web3WalletPage.removeResource.messageLine2')}
      successMessage={localizationKeys('userProfile.web3WalletPage.removeResource.successMessage', {
        web3Wallet: ref.current.web3Wallet,
      })}
      deleteResource={() => Promise.resolve(ref.current?.destroy())}
    />
  );
};

export const RemoveMfaPhoneCodePage = () => {
  const user = useCoreUser();
  const { id } = useRouter().params;
  // TODO: This logic will need to change when we add more 2fa methods
  const ref = React.useRef(user.phoneNumbers.find(e => e.id === id));

  if (!ref.current) {
    return null;
  }

  return (
    <RemoveResourcePage
      title={localizationKeys('userProfile.mfaPhoneCodePage.removeResource.title')}
      messageLine1={localizationKeys('userProfile.mfaPhoneCodePage.removeResource.messageLine1', {
        identifier: ref.current.phoneNumber,
      })}
      messageLine2={localizationKeys('userProfile.mfaPhoneCodePage.removeResource.messageLine2')}
      successMessage={localizationKeys('userProfile.mfaPhoneCodePage.removeResource.successMessage', {
        mfaPhoneCode: ref.current.phoneNumber,
      })}
      deleteResource={() => Promise.resolve(ref.current?.setReservedForSecondFactor({ reserved: false }))}
    />
  );
};

export const RemoveMfaTOTPPage = () => {
  const user = useCoreUser();
  return (
    <RemoveResourcePage
      title={localizationKeys('userProfile.mfaTOTPPage.removeResource.title')}
      messageLine1={localizationKeys('userProfile.mfaTOTPPage.removeResource.messageLine1')}
      messageLine2={localizationKeys('userProfile.mfaTOTPPage.removeResource.messageLine2')}
      successMessage={localizationKeys('userProfile.mfaTOTPPage.removeResource.successMessage')}
      deleteResource={user.disableTOTP}
    />
  );
};

type RemovePageProps = {
  title: LocalizationKey;
  messageLine1: LocalizationKey;
  messageLine2: LocalizationKey;
  successMessage: LocalizationKey;
  deleteResource: () => Promise<any>;
};

const RemoveResourcePage = withCardStateProvider((props: RemovePageProps) => {
  const { title, messageLine1, messageLine2, successMessage, deleteResource } = props;
  const wizard = useWizard();
  const card = useCardState();

  const handleSubmit = async () => {
    try {
      await deleteResource().then(() => wizard.nextStep());
    } catch (e) {
      handleError(e, [], card.setError);
    }
  };

  return (
    <Wizard {...wizard.props}>
      <ContentPage
        headerTitle={title}
        Breadcrumbs={UserProfileBreadcrumbs}
      >
        <Form.Root onSubmit={handleSubmit}>
          <Text
            localizationKey={messageLine1}
            variant='regularRegular'
          />
          <Text
            localizationKey={messageLine2}
            variant='regularRegular'
          />
          <FormButtons colorScheme={'danger'} />
        </Form.Root>
      </ContentPage>
      <SuccessPage
        title={title}
        text={successMessage}
        Breadcrumbs={UserProfileBreadcrumbs}
      />
    </Wizard>
  );
});
