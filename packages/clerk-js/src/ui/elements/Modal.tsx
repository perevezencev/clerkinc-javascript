import React from 'react';

import { descriptors, Flex } from '../customizables';
import { usePopover, useSafeLayoutEffect, useScrollLock } from '../hooks';
import { animations, mqu, ThemableCssProp } from '../styledSystem';
import { Portal } from './Portal';

type ModalProps = React.PropsWithChildren<{
  handleOpen?: () => void;
  handleClose?: () => void;
  contentSx?: ThemableCssProp;
  containerSx?: ThemableCssProp;
}>;

export const Modal = (props: ModalProps) => {
  const { handleClose, handleOpen, contentSx, containerSx } = props;
  const { floating, isOpen } = usePopover({ defaultOpen: true, autoUpdate: false, bubbles: false });
  const { disableScroll, enableScroll } = useScrollLock(document.body);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    floating(containerRef.current);
    containerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      handleClose?.();
    } else {
      handleOpen?.();
    }
  }, [isOpen]);

  useSafeLayoutEffect(() => {
    disableScroll();
    return () => enableScroll();
  });

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <Flex
        aria-hidden
        elementDescriptor={descriptors.modalBackdrop}
        sx={[
          t => ({
            animation: `${animations.fadeIn} 150ms ${t.transitionTiming.$common}`,
            zIndex: t.zIndices.$modal,
            backgroundColor: t.colors.$modalBackdrop,
            // ...common.centeredFlex(),
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'auto',
            width: '100vw',
            height: ['100vh', '-webkit-fill-available'],
            position: 'fixed',
            left: 0,
            top: 0,
          }),
          containerSx,
        ]}
      >
        <Flex
          elementDescriptor={descriptors.modalContent}
          ref={containerRef}
          aria-modal='true'
          tabIndex={0}
          role='dialog'
          sx={[
            t => ({
              outline: 0,
              animation: `${animations.modalSlideAndFade} 180ms ${t.transitionTiming.$easeOut}`,
              margin: `${t.space.$16} 0`,
              [mqu.sm]: {
                margin: `${t.space.$10} 0`,
              },
            }),
            contentSx,
          ]}
        >
          {props.children}
        </Flex>
      </Flex>
    </Portal>
  );
};
