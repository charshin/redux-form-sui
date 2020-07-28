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
              <label htmlFor={id || name} style={{ whiteSpace: 'pre' }}>
                {label}
              </label>
            )}
            {sublabel && (
              <SuiHeader
                sublabel={sublabel}
                size={size}
                css={{ '&.ui.header': { margin: '0em 0em 0.28571429rem 0em' } }}
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
              <label htmlFor={id || name} style={{ whiteSpace: 'pre' }}>
                {label}
              </label>
            )}
            {sublabel && (
              <SuiHeader
                sublabel={sublabel}
                size={size}
                css={{ '&.ui.header': { margin: '0em 0em 0.28571429rem 0em' } }}
              />
            )}
            <SuiPopup
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
};

Select.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
};

export default Select;
