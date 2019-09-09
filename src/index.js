/* eslint-disable react/jsx-props-no-spreading */
import { createElement } from 'react';
import PropTypes from 'prop-types';
import { FormSection, reduxForm } from 'redux-form';
import { Container as SuiContainer, Form as SuiForm } from 'semantic-ui-react';
import memoize from 'fast-memoize';

const useReduxForm = memoize(({ layout, config }) => {
  if (!layout || !config) {
    throw new Error(
      'Could not create a redux form with empty layout or config',
    );
  }
  /* Header */
  const renderHeader = ({ items, style, className, formProps }) => (
    <div
      style={{ display: 'flex', marginBottom: 20, ...style }}
      className={className}
    >
      {items.map(({ id: itemKey, component, render, ...itemProps }) => {
        if (component) {
          return createElement(component, {
            key: itemKey,
            ...formProps,
            ...itemProps,
          });
        }
        if (render) {
          return (
            <div key={itemKey}>{render({ ...formProps, ...itemProps })}</div>
          );
        }
        return null;
      })}
    </div>
  );
  renderHeader.defaultProps = {
    style: null,
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
    className: PropTypes.string,
    formProps: PropTypes.object.isRequired, // eslint-disable-line
  };

  /* Section */
  const renderSection = ({ name: sectionName, rows }) =>
    (content =>
      sectionName ? (
        <FormSection name={sectionName}>{content}</FormSection>
      ) : (
        content
      ))(
      rows.map(({ id: rowKey, cols }) => (
        <SuiForm.Group key={rowKey} widths="equal">
          {cols.map(({ component, render, ...controlProps }) => {
            if (component) {
              return createElement(component, {
                key: controlProps.id || controlProps.name,
                ...controlProps,
              });
            }
            if (render) {
              return (
                <div key={controlProps.id || controlProps.name}>
                  {render({ ...controlProps })}
                </div>
              );
            }
            throw new Error('Must provide either component or render');
          })}
        </SuiForm.Group>
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
  };

  /* Body */
  const renderBody = ({ sections, formProps }) =>
    sections.map(({ id: sectionKey, ...sectionProps }) =>
      createElement(renderSection, {
        key: sectionKey,
        ...formProps,
        ...sectionProps,
      }),
    );
  renderBody.defaultProps = {};
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
  };

  /* Footer */
  const renderFooter = ({ items, style, className, formProps }) => (
    <div
      style={{ display: 'flex', marginBottom: 20, ...style }}
      className={className}
    >
      {items.map(({ id: itemKey, component, render, ...itemProps }) => {
        if (component) {
          return createElement(component, {
            key: itemKey,
            ...formProps,
            ...itemProps,
          });
        }
        if (render) {
          return (
            <div key={itemKey}>{render({ ...formProps, ...itemProps })}</div>
          );
        }
        return null;
      })}
    </div>
  );
  renderFooter.defaultProps = {
    style: null,
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
    className: PropTypes.string,
    formProps: PropTypes.object.isRequired, // eslint-disable-line
  };

  const form = ({ handleSubmit, autoComplete, ...formProps }) => {
    return (
      <SuiContainer>
        <SuiForm
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
          {renderHeader({ ...layout.header, formProps })}
          {renderBody({ ...layout.body, formProps })}
          {renderFooter({ ...layout.footer, formProps })}
        </SuiForm>
      </SuiContainer>
    );
  };
  form.defaultProps = {
    autoComplete: 'off',
  };
  form.propTypes = {
    /* redux-form */
    handleSubmit: PropTypes.func.isRequired,
    /* direct */
    autoComplete: PropTypes.string,
  };

  return reduxForm(config)(form);
});

export { default as Input } from './components/Input';
export { default as Select } from './components/Select';
export { default as SelectGroup } from './components/SelectGroup';
export { default as DatePicker } from './components/DatePicker';
export default useReduxForm;