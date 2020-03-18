/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Input as SuiInput,
  Icon as SuiIcon,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import { Field } from 'redux-form';

const Input = ({ name, ...props }) => {
  const render = useCallback(
    ({ readonly, size, ...fieldProps }) => {
      const renderView = () => {
        const {
          input: { value },
          id,
          label,
          hidden,
          icon,
          iconPosition,
          colspan,
          inputProps,
        } = fieldProps;

        return (
          <SuiForm.Field
            width={colspan}
            style={{ visibility: hidden ? 'hidden' : 'visible' }}
          >
            {label && (
              <label htmlFor={id || name} style={{ whiteSpace: 'pre' }}>
                {label}
              </label>
            )}
            <SuiInput
              id={id || name}
              // * Default to empty string to ensure always in controlled mode
              value={value || ''}
              readonly={readonly}
              size={size}
              icon={!!icon}
              iconPosition={icon && iconPosition}
              css={{
                '.ui.form .fields .field &.ui.input input, .ui.form .field &.ui.input input': {
                  width: '100%',
                },
              }}
            >
              {icon && iconPosition === 'left' && <SuiIcon {...icon} />}
              <input {...inputProps} />
              {icon && iconPosition === 'right' && <SuiIcon {...icon} />}
            </SuiInput>
          </SuiForm.Field>
        );
      };

      const renderEdit = () => {
        const {
          input,
          meta: { touched, error, active },
          id,
          label,
          required,
          disabled,
          hidden,
          icon,
          iconPosition,
          colspan,
          inputProps,
        } = fieldProps;

        return (
          <SuiForm.Field
            error={touched && !!error}
            required={required}
            disabled={disabled}
            width={colspan}
            style={{ visibility: hidden ? 'hidden' : 'visible' }}
          >
            {label && (
              <label htmlFor={id || name} style={{ whiteSpace: 'pre' }}>
                {label}
              </label>
            )}
            <SuiPopup
              trigger={
                // ? This wrapper is necessary for 'poppper' to work with '@emotion/core'
                <div>
                  <SuiInput
                    id={id || name}
                    size={size}
                    icon={!!icon}
                    iconPosition={icon && iconPosition}
                    css={{
                      '.ui.form .fields .field &.ui.input input, .ui.form .field &.ui.input input': {
                        width: '100%',
                      },
                    }}
                  >
                    {icon && iconPosition === 'left' && <SuiIcon {...icon} />}
                    <input
                      {...inputProps}
                      {...input}
                      // * Default to empty string to ensure always in controlled mode
                      value={input.value || ''}
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

      return readonly ? renderView() : renderEdit();
    },
    [name],
  );

  return <Field {...props} name={name} component={render} />;
};

Input.defaultProps = {
  id: '',
  label: '',
  disabled: false,
  readonly: false,
  size: null, // ? no supply means 'medium' in semantic-ui
  icon: null,
  iconPosition: 'left',
  inputProps: {},
};

Input.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
};

export default Input;
