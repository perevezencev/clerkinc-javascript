import { OrganizationResource } from '@clerk/types';
import React from 'react';

import { Plus, SwitchArrows } from '../../../ui/icons';
import {
  useCoreOrganization,
  useCoreOrganizationList,
  useCoreUser,
  useOrganizationSwitcherContext,
} from '../../contexts';
import { Box, Button, Icon, localizationKeys } from '../../customizables';
import { Action, Actions, OrganizationPreview, PersonalWorkspacePreview } from '../../elements';
import { useCardState } from '../../elements/contexts';
import { common, PropsOfComponent } from '../../styledSystem';

type OrganizationActionListProps = {
  onCreateOrganizationClick: React.MouseEventHandler;
  onPersonalWorkspaceClick: React.MouseEventHandler;
  onOrganizationClick: (org: OrganizationResource) => unknown;
};

export const OrganizationActionList = (props: OrganizationActionListProps) => {
  const { onCreateOrganizationClick, onPersonalWorkspaceClick, onOrganizationClick } = props;
  const { organizationList } = useCoreOrganizationList();
  const { organization: currentOrg } = useCoreOrganization();
  const user = useCoreUser();
  const { hidePersonal } = useOrganizationSwitcherContext();

  const otherOrgs = (organizationList || []).map(e => e.organization).filter(o => o.id !== currentOrg?.id);

  const createOrganizationButton = (
    <Action
      icon={Plus}
      label={localizationKeys('organizationSwitcher.action__createOrganization')}
      onClick={onCreateOrganizationClick}
    />
  );

  return (
    <Actions
      sx={t => ({
        backgroundColor: t.colors.$blackAlpha20,
        border: `${t.borders.$normal} ${t.colors.$blackAlpha200}`,
        borderRight: 0,
        borderLeft: 0,
        paddingBottom: t.space.$2,
        gap: 2,
      })}
    >
      {currentOrg && !hidePersonal && (
        <Actions
          sx={t => ({
            borderBottom: `${t.borders.$normal} ${t.colors.$blackAlpha200}`,
            padding: `${t.space.$2} 0`,
          })}
        >
          <PreviewButton
            block
            onClick={onPersonalWorkspaceClick}
          >
            <PersonalWorkspacePreview
              gap={3}
              user={{ profileImageUrl: user.profileImageUrl }}
              size='sm'
              title={localizationKeys('organizationSwitcher.personalWorkspace')}
            />
          </PreviewButton>
        </Actions>
      )}
      <Box
        sx={t => ({
          paddingTop: t.space.$2,
          maxHeight: `calc(3 * ${t.sizes.$12} + ${t.space.$2})`,
          overflowY: 'auto',
          ...common.unstyledScrollbar(t),
        })}
      >
        {otherOrgs.map(organization => (
          <PreviewButton
            block
            sx={t => ({
              height: t.space.$12,
            })}
            key={organization.id}
            onClick={() => onOrganizationClick(organization)}
          >
            <OrganizationPreview
              gap={3}
              organization={organization}
              size='sm'
            />
          </PreviewButton>
        ))}
      </Box>
      {createOrganizationButton}
    </Actions>
  );
};

const PreviewButton = (props: PropsOfComponent<typeof Button>) => {
  const { sx, children, ...rest } = props;
  const card = useCardState();

  return (
    <Button
      variant='ghost'
      colorScheme='neutral'
      focusRing={false}
      isDisabled={card.isLoading}
      sx={[
        t => ({
          minHeight: 'unset',
          borderRadius: 0,
          justifyContent: 'space-between',
          padding: `${t.space.$2} ${t.space.$6}`,
          ':hover > svg': {
            visibility: 'initial',
          },
        }),
        sx,
      ]}
      {...rest}
    >
      {children}
      <Icon
        icon={SwitchArrows}
        sx={t => ({ color: t.colors.$blackAlpha500, marginLeft: t.space.$2, visibility: 'hidden' })}
      />
    </Button>
  );
};
