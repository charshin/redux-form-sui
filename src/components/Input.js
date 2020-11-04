/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Input as SuiInput,
  Icon as SuiIcon,
  Popup as SuiPopup,
  Header as SuiHeader,
} from 'semantic-ui-react';
import { Field } from 'redux-form';

const defaultLabelStyle = {
  fontWeight: 400,
  fontSize: '0.85em',
  opacity: 0.6,
  marginTop: '1em',
};

const Input = ({ name, ...props }) => {
  const render = useCallback(
    ({ readonly, size, ...fieldProps }) => {
      const renderView = () => {
        const {
          input: { value },
          id,
          label,
          sublabel,
          hidden,
          icon,
          iconPosition,
          colspan,
          inputProps,
          sublabelProps,
        } = fieldProps;

        return (
          <SuiForm.Field
            width={colspan}
            // ! TODO: add animation so the form doesn't jump when showing and hiding component
            style={{ display: hidden ? 'none' : 'initial' }}
          >
            {label && (
              <label
                htmlFor={id || name}
                style={{
                  whiteSpace: 'pre',
                  ...(typeof label === 'string' && defaultLabelStyle),
                }}
              >
                {typeof label === 'string'
                  ? label
                  : typeof label === 'function'
                  ? label({ style: defaultLabelStyle })
                  : null}
              </label>
            )}
            {sublabel && (
              <SuiHeader
                {...sublabelProps}
                subheader={sublabel}
                size={size}
                css={{
                  '&.ui.header': { margin: '0px 0px 5px 0px' },
                  '&.ui.header .sub.header': {
                    color: sublabelProps?.color,
                    fontSize: sublabelProps?.fontSize,
                  },
                }}
              />
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
          sublabel,
          required,
          disabled,
          hidden,
          icon,
          iconPosition,
          colspan,
          inputProps,
          popupProps,
          sublabelProps,
        } = fieldProps;

        return (
          <SuiForm.Field
            error={touched && !!error}
            required={required}
            disabled={disabled}
            width={colspan}
            // ! TODO: add animation so the form doesn't jump when showing and hiding component
            style={{ display: hidden ? 'none' : 'initial' }}
          >
            {label && (
              <label
                htmlFor={id || name}
                style={{
                  whiteSpace: 'pre',
                  ...(typeof label === 'string' && defaultLabelStyle),
                }}
              >
                {typeof label === 'string'
                  ? label
                  : typeof label === 'function'
                  ? label({ style: defaultLabelStyle })
                  : null}
              </label>
            )}
            {sublabel && (
              <SuiHeader
                {...sublabelProps}
                subheader={sublabel}
                size={size}
                css={{
                  '&.ui.header': { margin: '0px 0px 5px 0px' },
                  '&.ui.header .sub.header': {
                    color: sublabelProps?.color,
                    fontSize: sublabelProps?.fontSize,
                  },
                }}
              />
            )}
            <SuiPopup
              {...popupProps}
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
  hidden: false,
  size: null, // ? no supply means 'medium' in semantic-ui
  icon: null,
  iconPosition: 'left',
  inputProps: {},
  popupProps: {},
  sublabelProps: {},
  sublabel: null,
};

Input.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
  hidden: PropTypes.bool,
  icon: PropTypes.shape({ className: PropTypes.string }),
  iconPosition: PropTypes.oneOf[('left', 'right')],
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string,
  }),
  popupProps: PropTypes.shape({
    size: PropTypes.string,
  }),
  sublabel: PropTypes.string,
  sublabelProps: PropTypes.shape({
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    color: PropTypes.string,
  }),
};

export default Input;
