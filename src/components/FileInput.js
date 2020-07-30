/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Input as SuiInput,
  Icon as SuiIcon,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import { Field, fieldPropTypes } from 'redux-form';

const FileInput = ({
  input: { name, value: file, onFocus, onChange, onBlur },
  meta: { touched, error, active },
  label,
  required,
  disabled,
  readonly,
  size,
  icon,
  iconPosition,
  colspan,
  inputProps,
  popupProps,
  accept,
}) => {
  const fileInputRef = useRef(null);

  return readonly ? null : (
    <SuiForm.Field
      error={touched && !!error}
      required={required}
      disabled={disabled}
      width={colspan}
    >
      {label && (
        <label htmlFor={name} css={{ whiteSpace: 'pre', color: 'red' }}>
          {label}
        </label>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onClick={e => {
          // * onChange is not fired when the same file is uploaded twice,
          // * so this clears the current file on click, to allow onChange to fire.
          // * There is no other React specific way of controlling file inputs
          e.target.value = '';
        }}
        onChange={e => {
          if (e.target.files?.[0]) {
            onChange(e.target.files?.[0]);
          }
          // * send undefined to keep existing value in redux-form
          onBlur();
        }}
        css={{ display: 'none' }}
      />
      <SuiPopup
        {...popupProps}
        trigger={
          // ? This wrapper is necessary for 'poppper' to work with '@emotion/core'
          <div>
            <SuiInput
              id={name}
              size={size}
              icon={!!icon}
              iconPosition={iconPosition}
              css={{
                '.ui.form .fields .field &.ui.input input, .ui.form .field &.ui.input input': {
                  width: '100%',
                },
                '& > input': { cursor: 'pointer' },
              }}
            >
              {icon && iconPosition === 'left' && <SuiIcon {...icon} />}
              <input
                {...inputProps}
                // * This is not a typo. It is DOM-related props
                // * https://reactjs.org/docs/dom-elements.html
                readOnly
                // * Default to empty string to ensure always in controlled mode
                value={file?.name || ''}
                // ? send undefined to keep existing value in redux-form
                onFocus={() => onFocus()}
                onClick={() => fileInputRef.current.click()}
              />
              {icon && iconPosition === 'right' && <SuiIcon {...icon} />}
            </SuiInput>
          </div>
        }
        content={error}
        style={{ opacity: !active && touched && !!error ? 0.7 : 0 }}
        inverted
      />
    </SuiForm.Field>
  );
};

FileInput.defaultProps = {
  label: '',
  disabled: false,
  readonly: false,
  size: null,
  icon: null,
  iconPosition: 'left',
  inputProps: {},
  popupProps: {},
  accept:
    'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf,.doc,.docx,.xml,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

FileInput.propTypes = {
  ...fieldPropTypes,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
  icon: PropTypes.shape({ className: PropTypes.string }),
  iconPosition: PropTypes.oneOf[('left', 'right')],
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string,
  }),
  popupProps: PropTypes.shape({
    size: PropTypes.string,
  }),
  accept: PropTypes.string,
};

export default props => <Field {...props} component={FileInput} />;
