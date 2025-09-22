/**
 * Label Components Collection
 * 
 * A comprehensive collection of pre-configured label components that follow
 * the application's typography system. Each component represents a specific
 * text style with predetermined font sizes and weights.
 * 
 * Typography Scale:
 * - H1: Large headlines (24px)
 * - H2: Section headers (20px)
 * - H3: Subsection headers (18px)
 * - H4: Small headers (16px)
 * - BodyTitle: Emphasized body text (16px, bold)
 * - BodyLarge: Large body text (14px)
 * - Body: Regular body text (12px)
 * - BodySmall: Small body text (11px)
 * - BodyExtraSmall: Extra small text (10px)
 * 
 * @file src/components/labels/Labels.js
 * @version 1.0.0
 * 
 * @example
 * import { H1, H2, Body, BodyLarge } from '@components';
 * 
 * // Usage in component
 * <H1>Main Heading</H1>
 * <H2 style={{ color: COLOR_PRIMARY }}>Section Header</H2>
 * <Body>Regular paragraph content</Body>
 * <BodyLarge bold>Emphasized content</BodyLarge>
 */

import React from 'react';
import Label from '../label/Label';
import {
    FONT_SIZE_H1,
    FONT_SIZE_H2,
    FONT_SIZE_H3,
    FONT_SIZE_H4,
    FONT_SIZE_BODY_TITLE,
    FONT_SIZE_BODY_LARGE,
    FONT_SIZE_BODY_SMALL,
    FONT_SIZE_BODY,
    FONT_SIZE_BODY_EXTRA_SMALL,
} from '../../tools/constant';

// ===== HEADING COMPONENTS =====

/**
 * H1 - Primary heading component
 * Used for main page titles and primary content headers
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} H1 component
 */
export const H1 = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_H1} {...props}>
        {children}
    </Label>
);

/**
 * H2 - Secondary heading component
 * Used for section headers and important subheadings
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} H2 component
 */
export const H2 = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_H2} {...props}>
        {children}
    </Label>
);

/**
 * H3 - Tertiary heading component
 * Used for subsection headers and card titles
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} H3 component
 */
export const H3 = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_H3} {...props}>
        {children}
    </Label>
);

/**
 * H4 - Small heading component
 * Used for minor headers and emphasized labels
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} H4 component
 */
export const H4 = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_H4} {...props}>
        {children}
    </Label>
);

// ===== BODY TEXT COMPONENTS =====

/**
 * BodyTitle - Emphasized body text component
 * Used for highlighted content and important body text
 * Always renders as bold by default
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} BodyTitle component
 */
export const BodyTitle = ({ children, ...props }) => (
    <Label bold fontSize={FONT_SIZE_BODY_TITLE} {...props}>
        {children}
    </Label>
);

/**
 * BodyLarge - Large body text component
 * Used for introductory paragraphs and prominent body text
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} BodyLarge component
 */
export const BodyLarge = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_BODY_LARGE} {...props}>
        {children}
    </Label>
);

/**
 * Body - Standard body text component
 * Used for regular paragraph content and general text
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} Body component
 */
export const Body = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_BODY} {...props}>
        {children}
    </Label>
);

/**
 * BodySmall - Small body text component
 * Used for secondary information and caption text
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} BodySmall component
 */
export const BodySmall = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_BODY_SMALL} {...props}>
        {children}
    </Label>
);

/**
 * BodyExtraSmall - Extra small text component
 * Used for fine print, disclaimers, and minimal text
 * @param {Object} props - Component props
 * @param {React.ReactNode} children - Text content
 * @returns {React.ReactElement} BodyExtraSmall component
 */
export const BodyExtraSmall = ({ children, ...props }) => (
    <Label fontSize={FONT_SIZE_BODY_EXTRA_SMALL} {...props}>
        {children}
    </Label>
);

// ===== COMPONENT METADATA =====

/**
 * Typography component mapping for reference
 * Useful for dynamic component selection or documentation
 */
export const TYPOGRAPHY_COMPONENTS = {
    H1,
    H2,
    H3,
    H4,
    BodyTitle,
    BodyLarge,
    Body,
    BodySmall,
    BodyExtraSmall,
};

/**
 * Font size mapping for reference
 * Useful for consistent sizing across the application
 */
export const FONT_SIZES = {
    H1: FONT_SIZE_H1,
    H2: FONT_SIZE_H2,
    H3: FONT_SIZE_H3,
    H4: FONT_SIZE_H4,
    BodyTitle: FONT_SIZE_BODY_TITLE,
    BodyLarge: FONT_SIZE_BODY_LARGE,
    Body: FONT_SIZE_BODY,
    BodySmall: FONT_SIZE_BODY_SMALL,
    BodyExtraSmall: FONT_SIZE_BODY_EXTRA_SMALL,
};
