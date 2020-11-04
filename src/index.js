/* eslint-disable react/jsx-props-no-spreading */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { createElement } from 'react';
import PropTypes from 'prop-types';
import { FormSection, reduxForm } from 'redux-form';
import { Form as SuiForm } from 'semantic-ui-react';
import memoize from 'fast-memoize';
import * as R from 'ramda';

const useReduxForm = memoize(({ layout, config }) => {
  if (!layout || !config) {
    throw new Error(
      'Could not create a redux form with empty layout or config',
    );
  }
  /* Header */
  const renderHeader = ({ items, style, css, className, formProps }) => (
    // TODO: Open wrapper for Header
    <div
      style={{ display: 'flex', marginBottom: 50, ...style }}
      css={css}
      className={className}
    >
      {items.map(({ id: itemKey, component, render, ...itemProps }) => {
        if (component) {
          return createElement(component, {
            key: itemKey,
            disabled: formProps.disabled,
            readonly: formProps.readonly,
            size: formProps.size,
            ...itemProps,
            formProps,
          });
        }
        if (render) {
          return (
            <div key={itemKey}>
              {render({
                disabled: formProps.disabled,
                readonly: formProps.readonly,
                size: formProps.size,
                ...itemProps,
                formProps,
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
  renderHeader.defaultProps = {
    style: null,
    css: null,
    className: '',
  };
  renderHeader.propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        component: PropTypes.elementType,
        /* Support inline render function */
        render: PropTypes.func,
      }),
    ).isRequired,
    style: PropTypes.object, // eslint-disable-line
    css: PropTypes.object, // eslint-disable-line
    className: PropTypes.string,
    formProps: PropTypes.object.isRequired, // eslint-disable-line
  };

  /* Section */
  const renderSection = ({ name: sectionName, rows, formProps }) =>
    (content =>
      sectionName ? (
        <FormSection name={sectionName}>{content}</FormSection>
      ) : (
        content
      ))(
      rows.map(({ id: rowKey, cols }) => (
        <div css={{ paddingBottom: '0.5em' }}>
          <SuiForm.Group
            key={rowKey}
            widths="equal"
            css={{ '&&.fields': { marginBottom: '0em' } }}
          >
            {cols.map(({ component, render, ...controlProps }) => {
              if (component) {
                return createElement(component, {
                  key: controlProps.id || controlProps.name,
                  disabled: formProps.disabled,
                  readonly: formProps.readonly,
                  size: formProps.size,
                  ...controlProps,
                  formProps: R.omit(['disabled', 'readonly', 'size'])(
                    formProps,
                  ),
                });
              }
              if (render) {
                return (
                  // FIXME Use material-ui Grid
                  // ? The element with prop colspan
                  // ? must be a direct child of SuiForm.Group
                  // ? for the layout to take effect.
                  // ? We have no choice but require
                  // ? user to supply the prop 'key' themselves
                  // <div key={controlProps.id || controlProps.name}>
                  render({
                    key: controlProps.id || controlProps.name,
                    disabled: formProps.disabled,
                    readonly: formProps.readonly,
                    size: formProps.size,
                    ...controlProps,
                    formProps: R.omit(['disabled', 'readonly', 'size'])(
                      formProps,
                    ),
                  })
                  // </div>
                );
              }
              throw new Error('Must provide either component or render');
            })}
          </SuiForm.Group>
        </div>
      )),
    );
  renderSection.defaultProps = {
    name: '',
    // render: null,
  };
  renderSection.propTypes = {
    // * If supplied, will create a wrapper in your redux store
    name: PropTypes.string,
    // render: PropTypes.func,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        cols: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            component: PropTypes.elementType,
            /* Support inline render function */
            render: PropTypes.func,
            inject: PropTypes.func,
          }),
        ).isRequired,
      }),
    ).isRequired,
    formProps: PropTypes.object.isRequired, // eslint-disable-line
  };

  /* Body */
  const renderBody = ({ css, className, sections, formProps }) => (
    <div css={css} className={className}>
      {sections.map(({ component, render, ...sectionProps }) => {
        if (component) {
          return createElement(
            component,
            {
              key: sectionProps.id || sectionProps.name,
              ...sectionProps,
              formProps,
            },
            renderSection({ ...sectionProps, formProps }),
          );
        }
        if (render) {
          return (
            <div key={sectionProps.id || sectionProps.name}>
              {render({
                ...sectionProps,
                formProps,
                children: renderSection({ ...sectionProps, formProps }),
              })}
            </div>
          );
        }
        return createElement(renderSection, {
          key: sectionProps.id || sectionProps.name,
          ...sectionProps,
          formProps,
        });
      })}
    </div>
  );
  renderBody.defaultProps = {
    css: null,
    className: '',
  };
  renderBody.propTypes = {
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        name: PropTypes.string.isRequired,
        title: PropTypes.string,
        rows: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
              .isRequired,
            cols: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string.isRequired,
              }),
            ).isRequired,
          }),
        ).isRequired,
      }),
    ).isRequired,
    formProps: PropTypes.object.isRequired, // eslint-disable-line
    css: PropTypes.object, // eslint-disable-line
    className: PropTypes.string,
  };

  /* Footer */
  const renderFooter = ({ items, style, css, className, formProps }) => (
    // TODO: Open wrapper for Header
    <div
      style={{ display: 'flex', marginTop: 50, ...style }}
      css={css}
      className={className}
    >
      {items.map(({ id: itemKey, component, render, ...itemProps }) => {
        if (component) {
          return createElement(component, {
            key: itemKey,
            disabled: formProps.disabled,
            readonly: formProps.readonly,
            size: formProps.size,
            ...itemProps,
            formProps,
          });
        }
        if (render) {
          return (
            <div key={itemKey}>
              {render({
                disabled: formProps.disabled,
                readonly: formProps.readonly,
                size: formProps.size,
                ...itemProps,
                formProps,
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
  renderFooter.defaultProps = {
    style: null,
    css: null,
    className: '',
  };
  renderFooter.propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
          .isRequired,
        component: PropTypes.elementType,
        /* Support inline render function */
        render: PropTypes.func,
      }),
    ).isRequired,
    style: PropTypes.object, // eslint-disable-line
    css: PropTypes.object, // eslint-disable-line
    className: PropTypes.string,
    formProps: PropTypes.object.isRequired, // eslint-disable-line
  };

  const form = ({
    handleSubmit,
    autoComplete,
    formProps: suiFormProps,
    style,
    className,
    ...formProps
  }) => {
    return (
      <SuiForm
        {...suiFormProps}
        style={style}
        className={className}
        autoComplete={autoComplete}
        onSubmit={e => {
          // TODO: Check if we this problem with Semantic-UI
          /* NOTE: This to prevent triggering submission of child form
              from triggering submission of parent form too, if any.
              In React, event propagates along the React hierarchy, not DOM.
              child <form> is not part of parent <SuiForm> DOM hierarchy
              created by material-ui's Modal, which probably uses React Portal.
              Ref: https://github.com/erikras/redux-form/issues/3701
            */
          e.stopPropagation();
          handleSubmit(e);
        }}
      >
        {layout.header &&
          renderHeader({
            formProps: {
              ...formProps,
              disabled: formProps.submitting || formProps.disabled,
            },
            ...layout.header,
          })}
        {layout.body &&
          renderBody({
            formProps: {
              ...formProps,
              disabled: formProps.submitting || formProps.disabled,
            },
            ...layout.body,
          })}
        {layout.footer &&
          renderFooter({
            formProps: {
              ...formProps,
              disabled: formProps.submitting || formProps.disabled,
            },
            ...layout.footer,
          })}
      </SuiForm>
    );
  };
  form.defaultProps = {
    autoComplete: 'off',
    size: null,
    formProps: {},
    style: null,
    className: '',
  };
  form.propTypes = {
    /* redux-form */
    handleSubmit: PropTypes.func.isRequired,
    /* direct */
    autoComplete: PropTypes.string,
    size: PropTypes.string,
    // eslint-disable-next-line
    formProps: PropTypes.object, // * props for SuiForm
    style: PropTypes.object, // eslint-disable-line
    className: PropTypes.string,
  };

  return reduxForm(config)(form);
});

export { default as Input } from './components/Input';
export { default as Password } from './components/Password';
export { default as Select } from './components/Select';
export { default as SelectGroup } from './components/SelectGroup';
export { default as DatePicker } from './components/DatePicker';
export { default as Mobile } from './components/Mobile';
export { default as Search } from './components/Search';
export { default as FileInput } from './components/FileInput';
export { default as ImageEditor } from './components/ImageEditor';
export default useReduxForm;
