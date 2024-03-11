module.exports = (existingCommand, localCommand) => {
  // Function to compare choices between existing and local commands
  const areChoicesDifferent = (existingChoices, localChoices) => {
    // Loop through each local choice
    for (const localChoice of localChoices) {
      // Try to find a matching choice in existing options
      const existingChoice = existingChoices?.find(
        (choice) => choice.name === localChoice.name
      );

      // If no matching choice is found, there's a difference
      if (!existingChoice) {
        return true;
      }

      // If the values don't match, there's a difference
      if (localChoice.value !== existingChoice.value) {
        return true;
      }
    }

    // If no differences are found, return false
    return false;
  };

  // Function to compare options between existing and local commands
  const areOptionsDifferent = (existingOptions, localOptions) => {
    // Loop through each local option
    for (const localOption of localOptions) {
      // Try to find a matching option in existing options
      const existingOption = existingOptions?.find(
        (option) => option.name === localOption.name
      );

      // If no matching option is found, there's a difference
      if (!existingOption) {
        return true;
      }

      // Compare different properties of the options
      if (
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        (localOption.required || false) !== existingOption.required ||
        (localOption.choices?.length || 0) !==
        (existingOption.choices?.length || 0) ||
        areChoicesDifferent(localOption.choices || [], existingOption.choices || [])
      ) {
        return true;
      }
    }

    // If no differences are found, return false
    return false;
  };

  // Compare properties of the main commands
  if (
    existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options, localCommand.options || [])
  ) {
    return true;
  }

  // If no differences are found, return false
  return false;
};
