/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Icon as SuiIcon,
  Dropdown as SuiDropdown,
  Input as SuiInput,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import { Fields } from 'redux-form';
import * as R from 'ramda';

const Mobile = ({
  name,
  label,
  required,
  disabled,
  readonly,
  size,
  icon,
  iconPosition,
  colspan,
  dropdownProps,
  inputProps,
  ...props
}) => {
  const {
    [name]: { countryCode, number },
  } = props;

  const touched = number.meta.touched;
  const error = number.meta.error;
  const active = number.meta.active;

  return readonly ? null : (
    <SuiForm.Field
      error={touched && !!error}
      required={required}
      disabled={disabled}
      width={colspan}
    >
      {label && <label htmlFor={number.input.name}>{label}</label>}
      <SuiPopup
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
                '&.ui[class*="left icon"].input > input': {
                  // TODO Must be dynamic,
                  // relative to the combined size of
                  // the icon & the dropdown on the left
                  paddingLeft: '170px !important',
                },
              }}
            >
              {icon && iconPosition === 'left' && <SuiIcon {...icon} />}
              <SuiDropdown
                {...dropdownProps}
                options={countryCode.input.value?.options || []}
                // * Default to empty string to ensure always in controlled mode
                value={countryCode.input.value?.selected || ''}
                onFocus={countryCode.input.onFocus}
                onChange={(_, { value }) =>
                  countryCode.input.onChange({
                    options: countryCode.input.value?.options,
                    selected: value,
                  })
                }
                // * send undefined to keep existing value in redux-form
                onBlur={() => countryCode.input.onBlur()}
                search
                css={{
                  '&.ui.search': {
                    position: 'absolute',
                    top: '32%',
                    // TODO Must be dynamic,
                    // relative to the size of the icon on the left,
                    // also aligned with the placeholder of the control above
                    left: '2.67142857em',
                    // ? This will cause haywire for the dropdown
                    // transform: 'translateY(-50%)',
                  },
                }}
              />
              <input
                {...inputProps}
                {...number.input}
                // * Default to empty string to ensure always in controlled mode
                value={number.input.value || ''}
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

Mobile.defaultProps = {
  label: '',
  disabled: false,
  readonly: false,
  size: null,
  icon: null,
  iconPosition: 'left',
  colspan: null,
  dropdownProps: {},
  inputProps: {},
};

Mobile.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
  icon: PropTypes.shape({
    className: PropTypes.string.isRequired,
  }),
  iconPosition: PropTypes.oneOf[('left', 'right')],
  colspan: PropTypes.number,
  dropdownProps: PropTypes.shape({
    placeholder: PropTypes.string,
  }),
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string,
  }),
};

export default props => (
  <Fields
    {...props}
    names={[`${props.name}.countryCode`, `${props.name}.number`]}
    component={Mobile}
  />
);
