import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Button as SuiButton,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import { Field } from 'redux-form';
import * as R from 'ramda';

import './SelectGroup.scss';

const defaultLabelStyle = {
  fontWeight: 400,
  fontSize: '0.85em',
  opacity: 0.6,
  marginTop: '1em',
};

const SelectGroup = ({ name, ...props }) => {
  const render = useCallback(
    ({ readonly, size, ...fieldProps }) => {
      const renderView = () => {
        const {
          input: {
            value: { options, selected },
          },
          id,
          label,
          colspan,
          compact,
        } = fieldProps;

        if (!R.is(Array, options)) {
          throw new Error(
            `Field ${name}. Expected options as an array but found: ${options}`,
          );
        }

        return (
          <SuiForm.Field width={colspan}>
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
            <SuiButton.Group toggle fluid compact={compact} size={size}>
              {options.map(({ key, value, text }) => (
                <SuiButton
                  key={key}
                  type="button"
                  active={value === selected}
                  className="readonly"
                >
                  {text}
                </SuiButton>
              ))}
            </SuiButton.Group>
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
          colspan,
          compact,
          required,
          disabled,
          popupProps,
        } = fieldProps;

        if (!options?.length) {
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
            <SuiPopup
              {...popupProps}
              trigger={
                <SuiButton.Group toggle fluid compact={compact} size={size}>
                  {options.map(({ key, value, text }) => (
                    <SuiButton
                      key={key}
                      type="button"
                      active={value === selected}
                      onClick={() => onChange({ options, selected: value })}
                    >
                      {text}
                    </SuiButton>
                  ))}
                </SuiButton.Group>
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

SelectGroup.defaultProps = {
  id: '',
  label: '',
  disabled: false,
  readonly: false,
  size: null,
  popupProps: {},
};

SelectGroup.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
  popupProps: PropTypes.shape({
    size: PropTypes.string,
  }),
};

export default SelectGroup;
