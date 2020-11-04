/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Header as SuiHeader,
  Icon as SuiIcon,
  Input as SuiInput,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import { Field, fieldPropTypes } from 'redux-form';

const defaultLabelStyle = {
  fontWeight: 400,
  fontSize: '0.85em',
  opacity: 0.6,
  marginTop: '1em',
};

const Password = ({
  input,
  meta: { touched, error, active },
  label,
  required,
  disabled,
  readonly,
  size,
  icon,
  colspan,
  inputProps,
  onForgot,
  popupProps,
  ...props
}) => {
  const [peek, setPeek] = useState(false);

  return readonly ? null : (
    <SuiForm.Field
      error={touched && !!error}
      required={required}
      disabled={disabled}
      width={colspan}
    >
      {label && (
        <label
          htmlFor={input.name}
          style={{
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
      <SuiPopup
        {...popupProps}
        trigger={
          // ? This wrapper is necessary for 'poppper' to work with '@emotion/core'
          <div>
            <SuiInput
              id={input.name}
              size={size}
              icon={!!icon}
              iconPosition="left"
              css={{
                '.ui.form .fields .field &.ui.input input, .ui.form .field &.ui.input input': {
                  width: '100%',
                  paddingRight: `${onForgot ? 70 : 45}px !important`,
                },
                '&.ui[class*="left icon"].input > i.icon:last-child': {
                  left: 'auto',
                  right: 1,
                },
              }}
            >
              {icon && <SuiIcon {...icon} />}
              <input
                {...inputProps}
                {...input}
                // * Default to empty string to ensure always in controlled mode
                value={input.value || ''}
                type={peek ? 'text' : 'password'}
                autoComplete="new-password"
              />
              {onForgot ? (
                <SuiHeader
                  subheader="Forgot?"
                  size="tiny"
                  css={{
                    position: 'absolute',
                    top: '50%',
                    right: 15,
                    transform: 'translateY(-50%)',
                    margin: '0px !important',
                    cursor: 'pointer',
                    '& > .sub.header:hover': {
                      color: 'gray',
                    },
                  }}
                  onClick={onForgot}
                />
              ) : (
                <SuiIcon
                  name={peek ? 'eye slash' : 'eye'}
                  link
                  onClick={() => setPeek(!peek)}
                />
              )}
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

Password.defaultProps = {
  label: '',
  disabled: false,
  readonly: false,
  size: null,
  icon: null,
  colspan: null,
  inputProps: {},
  onForgot: null,
  popupProps: {},
};

Password.propTypes = {
  ...fieldPropTypes,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
  icon: PropTypes.shape({
    className: PropTypes.string.isRequired,
  }),
  colspan: PropTypes.number,
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string,
  }),
  popupProps: PropTypes.shape({
    size: PropTypes.string,
  }),
  onForgot: PropTypes.func,
};

export default props => <Field {...props} component={Password} />;
