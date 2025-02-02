import React from 'react';

import { PrintableComponent, usePrintable } from '../../common';
import { useCoreUser, useEnvironment } from '../../contexts';
import { Button, Col, Flex, Grid, Heading, LocalizationKey, Text } from '../../customizables';
import { useClipboard } from '../../hooks';
import { mqu } from '../../styledSystem';
import { getIdentifier } from '../../utils';
import { MfaBackupCodeTile } from './MfaBackupCodeTile';

type MfaBackupCodeListProps = {
  subtitle: LocalizationKey;
  backupCodes?: string[];
};

export const MfaBackupCodeList = (props: MfaBackupCodeListProps) => {
  const { subtitle, backupCodes } = props;
  const { applicationName } = useEnvironment().displayConfig;
  const user = useCoreUser();
  const { print, printableProps } = usePrintable();
  const { onCopy, hasCopied } = useClipboard(backupCodes?.join(',') || '');
  const userIdentifier = getIdentifier(user);

  const onDownloadTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob([txtFileContent(backupCodes, applicationName, userIdentifier)], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${applicationName}_backup_codes.txt`;
    document.body.appendChild(element);
    element.click();
  };

  if (!backupCodes) {
    return null;
  }

  return (
    <>
      <Col gap={1}>
        <Text
          localizationKey={'Backup codes'}
          variant='regularMedium'
        />
        <Text
          localizationKey={subtitle}
          variant='smallRegular'
          colorScheme='neutral'
        />
      </Col>
      <Grid
        gap={2}
        sx={t => ({
          gridTemplateColumns: `repeat(5, minmax(${t.sizes.$12}, 1fr))`,
          [mqu.sm]: {
            gridTemplateColumns: `repeat(2, minmax(${t.sizes.$12}, 1fr))`,
          },
        })}
      >
        {backupCodes.map((code, i) => (
          <MfaBackupCodeTile
            key={i}
            code={code}
          />
        ))}
      </Grid>

      <Flex gap={6}>
        <Button
          variant='link'
          colorScheme='primary'
          onClick={onCopy}
        >
          {!hasCopied ? 'Copy all' : 'Copied!'}
        </Button>

        <Button
          variant='link'
          colorScheme='primary'
          onClick={onDownloadTxtFile}
        >
          Download .txt
        </Button>

        <Button
          variant='link'
          colorScheme='primary'
          onClick={print}
        >
          Print
        </Button>
      </Flex>

      <PrintableComponent {...printableProps}>
        <Heading>
          Your backup codes for {applicationName} account {userIdentifier}:
        </Heading>
        <Col gap={2}>
          {backupCodes.map((code, i) => (
            <MfaBackupCodeTile
              key={i}
              code={code}
            />
          ))}
        </Col>
      </PrintableComponent>
    </>
  );
};

function txtFileContent(backupCodes: string[] | undefined, applicationName: string, userIdentifier: string): string {
  const sanitizedBackupCodes = backupCodes?.join('\n');
  return `These are your backup codes for ${applicationName} account ${userIdentifier}.\nStore them securely and keep them secret. Each code can only be used once.\n\n${sanitizedBackupCodes}`;
}
