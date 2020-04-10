/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  TextArea as SuiTextArea,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import { Field, fieldPropTypes } from 'redux-form';

const TextArea = ({
  name,
  readonly,
  input,
  meta: { touched, error, active },
  label,
  required,
  disabled,
  hidden,
  colspan,
  textareaProps,
}) => {
  return readonly ? (
    <SuiForm.Field
      width={colspan}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
    >
      {label && (
        <label htmlFor={name} style={{ whiteSpace: 'pre' }}>
          {label}
        </label>
      )}
      <SuiTextArea
        {...textareaProps}
        id={name}
        // * Default to empty string to ensure always in controlled mode
        value={input?.value || ''}
        readOnly={readonly}
        css={{
          '.ui.form textarea&': {
            ...(textareaProps?.resize && {
              resize: textareaProps.resize,
            }),
          },
        }}
      />
    </SuiForm.Field>
  ) : (
    <SuiForm.Field
      error={touched && !!error}
      required={required}
      disabled={disabled}
      width={colspan}
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
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
            <SuiTextArea
              {...textareaProps}
              {...input}
              id={name}
              // * Default to empty string to ensure always in controlled mode
              value={input?.value || ''}
              css={{
                '.ui.form textarea&': {
                  ...(textareaProps?.resize && {
                    resize: textareaProps.resize,
                  }),
                },
              }}
            />
          </div>
        }
        content={error}
        style={{ opacity: !active && touched && !!error ? 0.7 : 0 }}
        inverted
      />
    </SuiForm.Field>
  );
};

TextArea.defaultProps = {
  label: '',
  disabled: false,
  readonly: false,
  textareaProps: {},
};

TextArea.propTypes = {
  ...fieldPropTypes,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  textareaProps: PropTypes.shape({
    placeholder: PropTypes.string,
    resize: PropTypes.string,
    rows: PropTypes.number,
  }),
};

export default props => <Field {...props} component={TextArea} />;
