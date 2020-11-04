/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Dropdown as SuiDropdown,
  Popup as SuiPopup,
  Header as SuiHeader,
} from 'semantic-ui-react';
import { Field } from 'redux-form';
import * as R from 'ramda';

import './Select.scss';

const defaultLabelStyle = {
  fontWeight: 400,
  fontSize: '0.85em',
  opacity: 0.6,
  marginTop: '1em',
};

const Select = ({ name, ...props }) => {
  const render = useCallback(
    ({ readonly, size, ...fieldProps }) => {
      const renderView = () => {
        const {
          input: {
            value: { options, selected },
          },
          id,
          label,
          sublabel,
          hidden,
          colspan,
          dropdownProps,
          sublabelProps,
        } = fieldProps;

        if (!options?.length) {
          throw new Error(
            `Field ${name}. Expected options as an array but found: ${options}`,
          );
        }

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
            <SuiDropdown
              {...dropdownProps}
              id={id || name}
              // * Default to empty string to ensure always in controlled mode
              value={selected || ''}
              options={options}
              selection
              open={false}
              className={`readonly ${size}`}
            />
          </SuiForm.Field>
        );
      };

      const renderEdit = () => {
        const {
          input: {
            value: { options, selected },
            onFocus,
            onChange,
            onBlur,
          },
          meta: { touched, error, active },
          id,
          label,
          sublabel,
          required,
          disabled,
          hidden,
          colspan,
          dropdownProps,
          sublabelProps,
          popupProps,
        } = fieldProps;

        if (!R.is(Array, options)) {
          throw new Error(
            `Field ${name}. Expected options as an array but found: ${options}`,
          );
        }

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
                <SuiDropdown
                  {...dropdownProps}
                  id={id || name}
                  options={options}
                  // * Default to empty string to ensure always in controlled mode
                  value={selected || ''}
                  onFocus={onFocus}
                  onChange={(_, { value }) =>
                    onChange({ options, selected: value })
                  }
                  // * send undefined to keep existing value in redux-form
                  onBlur={() => onBlur()}
                  selection
                  search // ? size only takes effect when this is supplied
                  className={size}
                />
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

Select.defaultProps = {
  id: '',
  label: '',
  disabled: false,
  readonly: false,
  size: null,
  popupProps: {},
  sublabelProps: {},
  sublabel: null,
  hidden: false,
};

Select.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
  popupProps: PropTypes.shape({
    size: PropTypes.string,
  }),
  sublabel: PropTypes.string,
  hidden: PropTypes.bool,
  sublabelProps: PropTypes.shape({
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    color: PropTypes.string,
  }),
};

export default Select;
