export const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "var(--tw-select-bg)", // Dropdown background
    borderColor: "var(--tw-select-border)", // Border
    borderRadius: "0.5rem",
    color: "var(--tw-select-text)", // Text color
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--tw-select-border)", // Border on hover
    },
    // minHeight: "45px",
    // height: "45px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--tw-select-bg)", // Dropdown menu background
    border: "1px solid var(--tw-select-border)", // Dropdown menu border
    borderRadius: "0.5rem",
    zIndex: 999,
    overflowY: "auto",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "var(--tw-select-hover-bg)" // Focused option background
      : "var(--tw-select-bg)", // Default background
    color: state.isFocused
      ? "var(--tw-select-hover-text)" // Focused text color
      : "var(--tw-select-text)", // Default text color
    "&:active": {
      backgroundColor: "var(--tw-select-hover-bg)", // Active option background
    },

  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--tw-select-hover-bg)", // Background for selected items
    color: "var(--tw-select-hover-text)", // Text color for selected items
    borderRadius: "0.25rem",
    padding: "0.1rem 0.4rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "var(--tw-select-hover-text)", // Label text color for selected items
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--tw-select-hover-text)",
    "&:hover": {
      backgroundColor: "var(--tw-select-border)", // Hover state for remove button
      color: "var(--tw-select-text)",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "var(--tw-select-text)", // Placeholder text color
  }),
  input: (base) => ({
    ...base,
    color: "var(--tw-select-text)", // Input text color
  }),
  singleValue: (base) => ({
    ...base,
    color: "var(--tw-select-text)", // Single value text color
  }),
  indicatorsContainer: (base) => ({
    ...base,
    color: "var(--tw-select-text)", // Dropdown indicator color
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "var(--tw-select-text)", // Dropdown indicator color
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "var(--tw-select-text)", // Clear indicator color
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "var(--tw-select-text)", // No options message color
  }),
};
