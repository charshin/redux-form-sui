import PropTypes from 'prop-types';
import { Field, fieldPropTypes } from 'redux-form';
import { Form as SuiForm, Popup as SuiPopup } from 'semantic-ui-react';
import { ImageEditor as ShImageEditor } from 'snaphunt-ui';

const ImageEditor = ({
  input,
  meta: { touched, error, active },
  label,
  required,
  circular,
  deletable,
  placeholder,
  outputFormat,
  disabled,
  readonly,
  colspan,
}) =>
  readonly ? null : (
    <SuiForm.Field
      error={touched && !!error}
      required={required}
      disabled={disabled}
      width={colspan}
    >
      {label && (
        <label htmlFor={name} style={{ whiteSpace: 'pre' }}>
          {label}
        </label>
      )}
      <SuiPopup
        trigger={
          // ? This wrapper is necessary for 'poppper' to work with '@emotion/core'
          <div>
            <ShImageEditor
              id={name}
              circular={circular}
              deletable={deletable}
              outputFormat={outputFormat}
              placeholder={placeholder}
              error={touched && !!error}
              disabled={disabled}
              {...input}
            />
          </div>
        }
        content={error}
        style={{ opacity: !active && touched && !!error ? 0.7 : 0 }}
        inverted
      />
    </SuiForm.Field>
  );

ImageEditor.defaultProps = {
  label: '',
  required: false,
  circular: false,
  deletable: true,
  outputFormat: 'base64',
  disabled: false,
  readonly: false,
};

ImageEditor.propTypes = {
  ...fieldPropTypes,
  label: PropTypes.string,
  required: PropTypes.bool,
  circular: PropTypes.bool,
  deletable: PropTypes.bool,
  placeholder: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    borderRadius: PropTypes.number,
    dimmerButtonSize: PropTypes.number,
    size: PropTypes.number,
    icon: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  outputFormat: PropTypes.oneOf(['file', 'base64']),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default (props) => <Field {...props} component={ImageEditor} />;
