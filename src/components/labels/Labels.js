import React from 'react';
import Label from '../label/Label';
import {
  FONT_SIZE_H1, FONT_SIZE_H2, FONT_SIZE_H3, FONT_SIZE_H4,
  FONT_SIZE_BODY_TITLE, FONT_SIZE_BODY_LARGE, FONT_SIZE_BODY_SMALL,
  FONT_SIZE_BODY, FONT_SIZE_BODY_EXTRA_SMALL,
} from '../../tools/constant';

export const H1 = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_H1} {...props}>
    {children}
  </Label>
);

export const H2 = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_H2} {...props}>
    {children}
  </Label>
);

export const H3 = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_H3} {...props}>
    {children}
  </Label>
);

export const H4 = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_H4} {...props}>
    {children}
  </Label>
);

export const BodyTitle = ({ children, ...props }) => (
  <Label bold fontSize={FONT_SIZE_BODY_TITLE} {...props}>
    {children}
  </Label>
);

export const BodyLarge = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_BODY_LARGE} {...props}>
    {children}
  </Label>
);

export const BodyExtraSmall = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_BODY_EXTRA_SMALL} {...props}>
    {children}
  </Label>
);

export const BodySmall = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_BODY_SMALL} {...props}>
    {children}
  </Label>
);

export const Body = ({ children, ...props }) => (
  <Label fontSize={FONT_SIZE_BODY} {...props}>
    {children}
  </Label>
);
