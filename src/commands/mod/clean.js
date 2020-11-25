const { getGuildById } = require("../../utils/functions");
const BaseEmbed = require("../../modules/BaseEmbed");

module.exports = {
  name: "clean",
  description: "Deletes a bulk of specified messages.",
  usage: "clean [limit] [option]",
  aliases: ["purge", "clear", "prune"],
  category: "mod",
  options: [
    "link",
    "invite",
    "bots",
    "you",
    "me",
    "upload",
    "user:user "
  ],
  memberPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["MANAGE_MESSAGES"],
 async execute(bot, message, args) {

    const lang = await bot.getGuildLang(message.guild.id);
    const guild = await getGuildById(message.guild.id);
    const limit = 50 
    const filter = null

    let messages = await message.channel.messages.fetch({ limit: 100 });

    function getFilter(message, filter, user) {
      switch (filter) {
        case 'link': {
          return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
        }
  
        case 'invite': {
          return mes => /(https?:\/\/)?(www\.)?(discord\.(com|gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(mes.content);
        }
  
        case 'bots': {
          return mes => mes.author.bot;
        }
  
        case 'you': {
          return mes => mes.author.id === this.client.user.id;
        }
  
        case 'me': {
          return mes => mes.author.id === message.author.id;
        }
  
        case 'upload': {
          return mes => mes.attachments.size > 0;
        }
  
        case 'user': {
          return mes => mes.author.id === user.id;
        }
  
        default: {
          return () => true;
        }
      }
    }

    if (filter) {
			const user = typeof filter !== 'string' ? filter : null;
			const type = typeof filter === 'string' ? filter : 'user';

			messages = messages.filter(getFilter(message, type, user));
		}

		messages = messages.array().slice(0, limit);

    await message.channel.bulkDelete(messages);
    
    message.channel.send(lang.MOD.CLEAN.replace("{messages}", messages.length).replace("{filter}", filter === null ? 'everyone' : filter))

  },
};
