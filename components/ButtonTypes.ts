export const ButtonVariant = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SECONDARY_WHITE: 'secondary-white',
  LIGHT: 'light',
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonSize = {
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
} as const;
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

export const ButtonShadow = {
  NONE: 'none',
  SMALL: 'sm',
  LARGE: 'lg',
} as const;
export type ButtonShadow = (typeof ButtonShadow)[keyof typeof ButtonShadow];
