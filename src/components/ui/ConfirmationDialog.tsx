import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Language } from '../../types';
import { getUIText } from '../../utils/language';
import './ConfirmationDialog.css';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  language: Language;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  language
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="confirmation-dialog-container" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="dialog-backdrop" />
        </Transition.Child>

        <div className="dialog-wrapper">
          <div className="dialog-container">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="dialog-panel">
                <Dialog.Title as="h3" className="dialog-title">
                  {title}
                </Dialog.Title>
                <div className="dialog-content">
                  <p className="dialog-message">
                    {message}
                  </p>
                </div>

                <div className="dialog-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={onClose}
                  >
                    {cancelText ?? getUIText('cancel', language)}
                  </button>
                  <button
                    type="button"
                    className="btn-confirm"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    {confirmText ?? getUIText('confirm', language)}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationDialog;
