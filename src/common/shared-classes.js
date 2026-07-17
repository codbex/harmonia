// Class groups repeated across many components. Sharing one literal keeps the
// bundle small: identical strings already collapse to a single CSS rule, so
// the duplication cost is purely in the JS output.

// Disabled state for wrappers around a native input.
export const disabledInputClasses = ['has-[input:disabled]:pointer-events-none', 'has-[input:disabled]:cursor-not-allowed', 'has-[input:disabled]:opacity-disabled'];

// Disabled state applied directly on an interactive control. Form controls
// spread this and add 'disabled:cursor-not-allowed' on top.
export const disabledControlClasses = ['disabled:pointer-events-none', 'disabled:opacity-disabled'];

// Invalid state applied directly on a form control (input, textarea, button).
export const invalidControlClasses = [
  'aria-invalid:ring-negative/20',
  'dark:aria-invalid:ring-negative/40',
  'aria-invalid:border-negative',
  'user-invalid:ring-negative/20!',
  'dark:user-invalid:ring-negative/40!',
  'user-invalid:border-negative!',
  '[[data-validate=immediate]_&:invalid]:ring-negative/20!',
  'dark:[[data-validate=immediate]_&:invalid]:ring-negative/40!',
  '[[data-validate=immediate]_&:invalid]:border-negative!',
];

// Invalid state for wrappers around a native input: explicit aria-invalid and
// the data-validate="immediate" live-validation mode.
export const invalidInputClasses = [
  'has-[input[aria-invalid=true]]:ring-negative/20',
  'has-[input[aria-invalid=true]]:border-negative',
  'dark:has-[input[aria-invalid=true]]:ring-negative/40',
  '[[data-validate=immediate]_&:has(input:invalid)]:ring-negative/20',
  '[[data-validate=immediate]_&:has(input:invalid)]:border-negative',
  'dark:[[data-validate=immediate]_&:has(input:invalid)]:ring-negative/40',
];

// Invalid state driven by the browser's :user-invalid on the inner input.
export const userInvalidInputClasses = ['has-[input:user-invalid]:ring-negative/20', 'has-[input:user-invalid]:border-negative', 'dark:has-[input:user-invalid]:ring-negative/40'];

// Wrapper blocks shared by the picker inputs (date, datetime, month, week).
export const pickerWrapperClasses = [
  'overflow-hidden',
  'border-input',
  'flex',
  'items-center',
  'transition-[color,box-shadow]',
  'motion-reduce:transition-none',
  'duration-200',
  'outline-none',
  'pl-3',
  'min-w-0',
  ...disabledInputClasses,
  'has-[input[readonly]]:bg-muted',
];

// The in-table variant of the picker wrapper (inset ring instead of border).
export const pickerCellWrapperClasses = [
  'size-full',
  'h-10',
  'has-[input:focus-visible]:inset-ring-ring/50',
  'has-[input:focus-visible]:inset-ring-[calc(var(--spacing)*0.75)]',
  'has-[input[aria-invalid=true]]:inset-ring-negative/20',
  'dark:has-[input[aria-invalid=true]]:inset-ring-negative/40',
  'has-[input:user-invalid]:inset-ring-negative/20!',
  'dark:has-[input:user-invalid]:inset-ring-negative/40!',
  '[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/20!',
  'dark:[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/40!',
];

// The standalone-field variant of the picker wrapper.
export const pickerFieldWrapperClasses = [
  'w-full',
  'rounded-control',
  'border',
  'bg-input-inner',
  'shadow-input',
  'has-[input:focus-visible]:border-ring',
  'has-[input:focus-visible]:ring-ring/50',
  'has-[input:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
  ...invalidInputClasses,
  ...userInvalidInputClasses,
];
