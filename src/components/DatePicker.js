import { PureComponent, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Input as SuiInput,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import ReactDatePicker from 'react-datepicker';
import { Field } from 'redux-form';

import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.scss';

class CustomInput extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    fieldProps: PropTypes.shape({
      input: PropTypes.shape({
        onFocus: PropTypes.func.isRequired,
        onBlur: PropTypes.func.isRequired,
      }).isRequired,
      meta: PropTypes.shape({
        touched: PropTypes.bool.isRequired,
        error: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
      }).isRequired,
      readonly: PropTypes.bool,
      placeholder: PropTypes.string,
      size: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { value, onClick, fieldProps } = this.props;
    const {
      input: { onFocus, onBlur },
      meta: { touched, error, active },
      readonly,
      placeholder,
      size,
    } = fieldProps;

    return (
      <SuiPopup
        trigger={
          <SuiInput
            fluid
            icon="calendar"
            placeholder={placeholder}
            value={value}
            onFocus={() => {
              if (!readonly) {
                onFocus?.();
                onClick?.();
              }
            }}
            onBlur={() => {
              if (!readonly) {
                onBlur?.(); // * send undefined to keep existing value in redux-form
              }
            }}
            readonly={readonly}
            size={size}
          />
        }
        content={error}
        style={{ opacity: !active && touched && !!error ? 0.7 : 0 }}
        inverted
      />
    );
  }
}

const DatePicker = ({ name, ...props }) => {
  const render = useCallback(
    fieldProps => {
      const { readonly } = fieldProps;

      const renderView = () => {
        const {
          input: { value },
          id,
          label,
          placeholder,
          colspan,
          datePickerProps,
        } = fieldProps;

        return (
          <SuiForm.Field width={colspan}>
            {label && (
              <label htmlFor={id || name} style={{ whiteSpace: 'pre' }}>
                {label}
              </label>
            )}
            <ReactDatePicker
              id={id || name}
              selected={value}
              customInput={<CustomInput fieldProps={fieldProps} />}
              placeholderText={placeholder}
              readonly={readonly}
              {...datePickerProps}
            />
          </SuiForm.Field>
        );
      };

      const renderEdit = () => {
        const {
          input: { value, onChange },
          meta: { touched, error },
          id,
          label,
          placeholder,
          required,
          disabled,
          colspan,
          datePickerProps,
        } = fieldProps;

        return (
          <SuiForm.Field
            error={touched && !!error}
            required={required}
            disabled={disabled}
            width={colspan}
          >
            {label && (
              <label htmlFor={id || name} style={{ whiteSpace: 'pre' }}>
                {label}
              </label>
            )}
            <ReactDatePicker
              id={id || name}
              selected={value}
              onChange={onChange}
              customInput={<CustomInput fieldProps={fieldProps} />}
              placeholderText={placeholder}
              {...datePickerProps}
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

DatePicker.defaultProps = {
  id: '',
  label: '',
  disabled: false,
  readonly: false,
  size: null,
};

DatePicker.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
};

export default DatePicker;
