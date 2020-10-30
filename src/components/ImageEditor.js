import PropTypes from 'prop-types';
import { Field, fieldPropTypes } from 'redux-form';
import { Form as SuiForm, Popup as SuiPopup } from 'semantic-ui-react';
import { ImageEditor as ShImageEditor } from 'snaphunt-ui';
import * as R from 'ramda';

const defaultLabelStyles = {
  fontWeight: 400,
  fontSize: '0.85em',
  opacity: 0.6,
  marginTop: '1em',
};

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
  popupProps,
  labelStyle,
}) =>
  readonly ? null : (
    <SuiForm.Field
      error={touched && !!error}
      required={required}
      disabled={disabled}
      width={colspan}
    >
      {label && (
        <label
          htmlFor={name}
          style={{ whiteSpace: 'pre', ...R.merge(defaultLabelStyles, labelStyle) }}
        >
          {label}
        </label>
      )}
      <SuiPopup
        {...popupProps}
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
  popupProps: {},
  labelStyle: {},
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
  popupProps: PropTypes.shape({
    size: PropTypes.string,
  }),
  labelStyle: PropTypes.shape({
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    marginTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    opacity: PropTypes.number,
    fontWeight: PropTypes.number,
  }),
};

export default props => <Field {...props} component={ImageEditor} />;
