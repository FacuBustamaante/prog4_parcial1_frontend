import type { ReactNode, MouseEventHandler } from 'react';

export interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  subtitle?: string;
}

export interface FormModalProps extends ModalProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
}

export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  message?: string;
}
