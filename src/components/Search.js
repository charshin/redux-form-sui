/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form as SuiForm,
  Search as SuiSearch,
  Popup as SuiPopup,
} from 'semantic-ui-react';
import { Field, fieldPropTypes } from 'redux-form';
import debounce from 'lodash/debounce';
import { findByProp } from 'kickass-utilities';
import * as R from 'ramda';

// const renderView = () => {
//   const {
//     input: { value },
//     id,
//     label,
//     hidden,
//     colspan,
//   } = props;

//   return (
//     <SuiForm.Field width={colspan} style={{ opacity: hidden ? 0 : 1 }}>
//       <label htmlFor={id || name} style={{ whiteSpace: 'pre' }}>
//         {label}
//       </label>
//       <SuiInput
//         id={id || name}
//         value={value}
//         readonly={readonly}
//         size={size}
//       />
//     </SuiForm.Field>
//   );
// };

const defaultLabelStyle = {
  fontWeight: 400,
  fontSize: '0.85em',
  opacity: 0.6,
  marginTop: '1em',
};

const Search = ({
  // TODO Do this for other controls too: no need id, input.name should be unique
  input: { name, value, onFocus, onChange, onBlur },
  meta: { touched, error, active },
  label,
  required,
  disabled,
  readonly,
  size,
  colspan,
  searchProps,
  resultsPanel,
  search,
  filter,
  autoTrigger,
  triggerDelay,
  onSelect,
  popupProps,
}) => {
  const [loading, setLoading] = useState(null);

  const allResultsRef = useRef([]);

  const debouncedTrigger = useCallback(
    debounce(async v => {
      if (filter) {
        if (!v?.search) {
          // * Find all results
          setLoading(true);
          const found = await search(v?.search);
          allResultsRef.current = found;
          onChange({ ...v, found });
          setLoading(false);
        } else {
          const found = R.filter(filter(v?.search))(allResultsRef.current);
          onChange({ ...v, found });
        }
      } else {
        if (!v?.search) {
          // ? If user ever needs to find all results,
          // ? then they should provide 'filter' for performance purposes.
          return;
        }
        setLoading(true);
        const found = await search(v?.search);
        onChange({ ...v, found });
        setLoading(false);
      }
    }, triggerDelay),
    [search, triggerDelay],
  );

  useEffect(() => {
    if (filter) {
      // * Pre-fill all results for filtering
      debouncedTrigger({ search: '' });
      debouncedTrigger.flush();
    }
  }, []);

  return readonly ? null : (
    <SuiForm.Field
      error={touched && !!error}
      required={required}
      disabled={disabled}
      width={colspan}
    >
      {label && (
        <label
          htmlFor={name}
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
          // ? This wrapper is necessary for 'poppper' to work with '@emotion/core'
          <div>
            <SuiSearch
              {...searchProps}
              // * Enable seeing all results for filter mode
              {...(filter && { minCharacters: 0 })}
              css={{
                '&.ui.search > .results': {
                  ...resultsPanel,
                  overflow: 'auto',
                },
              }}
              id={name}
              loading={loading}
              size={size}
              // * Default to empty string to ensure always in controlled mode
              value={value?.search || ''}
              results={value?.found}
              onResultSelect={(_, { result }) => onSelect?.(result)}
              onFocus={() => onFocus(value)}
              onSearchChange={(_, { value: searchValue }) => {
                if (loading) {
                  return;
                }
                onChange({ ...value, search: searchValue });
                if (autoTrigger) {
                  debouncedTrigger({ ...value, search: searchValue });
                }
              }}
              onBlur={() => onBlur(value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  debouncedTrigger(value);
                  debouncedTrigger.flush();
                }
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

Search.defaultProps = {
  label: '',
  disabled: false,
  readonly: false,
  size: null,
  searchProps: {},
  resultsPanel: {
    width: 'auto',
    maxHeight: 200,
  },
  filter: null,
  autoTrigger: true,
  triggerDelay: 500,
  popupProps: {},
};

Search.propTypes = {
  ...fieldPropTypes,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  size: PropTypes.string,
  searchProps: PropTypes.shape({
    placeholder: PropTypes.string,
    noResultsMessage: PropTypes.string,
  }),
  resultsPanel: PropTypes.shape({
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxHeight: PropTypes.number,
  }),
  search: PropTypes.func.isRequired,
  filter: PropTypes.func, // * For local filtering if any
  autoTrigger: PropTypes.bool,
  triggerDelay: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  popupProps: PropTypes.shape({
    size: PropTypes.string,
  }),
};

export default props => <Field {...props} component={Search} />;
