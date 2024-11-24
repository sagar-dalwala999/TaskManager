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
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--tw-select-bg)", // Dropdown menu background
    border: "1px solid var(--tw-select-border)", // Dropdown menu border
    borderRadius: "0.5rem",
    zIndex: 999,
    overflow: "hidden",
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
    padding: "0.2rem 0.4rem",
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
};
