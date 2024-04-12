import React from 'react';

export type InputChangeEventHandler = React.ChangeEvent<HTMLInputElement>;
export type TextareaChangeEventHandler = React.ChangeEvent<HTMLTextAreaElement>;
export type SelectChangeEvent = React.ChangeEventHandler<HTMLSelectElement>;
export type ButtonEvent = React.MouseEvent<HTMLButtonElement>;
export type FormEvent = React.FormEvent<HTMLFormElement>;

export type AppError = {
  type: string;
  message?: string;
  status?: number;
};
