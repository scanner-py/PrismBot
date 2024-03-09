const { testServer } = require("../../../config.json");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const chalk = require("chalk");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client);
    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(chalk.red(`❌ Deleted command "${name}".`));
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });

          console.log(chalk.hex("#eb34e1")(`🔁 Edited command "${name}".`));
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            chalk.blue(
              `⏩ Skipping registering command "${name}" as it's set to delete.`
            )
          );
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(chalk.hex("#00FF00")(`✅ Registered command "${name}."`));
      }
    }
  } catch (error) {
    console.log(chalk.red(`There was an error: ${error}`));
  }
};
