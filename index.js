const { EmbedBuilder,Partials, resolveColor, Client, Collection, GatewayIntentBits, ActivityType,OAuth2Scopes } = require("discord.js");
const config = require("./config")
const client = global.client = new Client({
  intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent],
    scopes:[
    OAuth2Scopes.Bot,
    OAuth2Scopes.ApplicationsCommands
  ],partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember,
    Partials.ThreadMember,
    Partials.GuildScheduledEvent
  ],
    presence: {
      activities: [{
        name: config && config.botDurum.length > 0 ? config.botDurum : "Beş Was Here",
        type: ActivityType.Streaming,
        url:"https://www.twitch.tv/"
      }],
      status: 'dnd'
    }
  });
const { readdir } = require("fs");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();

readdir("./src/commands/", (err, files) => {
    if (err) console.error(err)
    files.forEach(f => {
        readdir("./src/commands/" + f, (err2, files2) => {
            if (err2) console.log(err2)
            files2.forEach(file => {
                let prop = require(`./src/commands/${f}/` + file);
                console.log(`🧮 [COMMANDS] ${prop.name} Yüklendi!`);
                commands.set(prop.name, prop);
                prop.aliases.forEach(alias => { aliases.set(alias, prop.name); });
            });
        });
    });
});


readdir("./src/events", (err, files) => {
    if (err) return console.error(err);
    files.filter((file) => file.endsWith(".js")).forEach((file) => {
        let prop = require(`./src/events/${file}`);
        if (!prop.conf) return;
        client.on(prop.conf.name, prop);
        console.log(`📚 [EVENTS] ${prop.conf.name} Yüklendi!`);
    });
});


Collection.prototype.array = function () { return [...this.values()] }

const {emitWarning} = process;
process.emitWarning = (warning, ...args) => {
if (args[0] === 'ExperimentalWarning') {return;}
if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {return;}
return emitWarning(warning, ...args);
};

Promise.prototype.sil = function (time) {
if (this) this.then(s => {
      if (s.deletable) {
        setTimeout(async () => {
          s.delete().catch(e => { });
        }, time * 1000)
      }
    });
  };


client.login(config.token).then(() => 
console.log(`🟢 ${client.user.tag} Başarıyla Giriş Yaptı!`)
).catch((err) => console.log(`🔴 Bot Giriş Yapamadı / Sebep: ${err}`));