const {InteractionType, WebhookClient, Colors, ButtonStyle,PermissionsBitField, TextInputStyle, OAuth2Scopes, ChannelType, Client, ButtonBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder,Collection, SelectMenuBuilder, EmbedBuilder, GatewayIntentBits, Partials } = require("discord.js");
const moment = require("moment");
const Discord = require("discord.js");
const ms = require("ms");
const db = require("orio.db");
const client = global.client;
const config = require("../../../config")
const { generateFromMessages } = require("discord-html-transcripts");
module.exports = {
    name: "ticket",
    aliases: ["ticketdd"],
    usage:"ticket",
    category:"sahip",
execute: async (client, message, args, embed) => {
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
  

  let ticketembed = new EmbedBuilder()
  .setColor(`${config.replys.TicketEmbedColor || "Blue"}`)
  .setAuthor({ name: `${config.replys.TicketEmbedAuthor || "Ticket Sistemleri"}`,iconURL: message.guild.iconURL({ dynamic: true }) })
  .setDescription(`
  ${config.replys.TicketEmbedYazı || "Ticket Oluşturmak İçin Aşağıdaki Butonu Kullanabilirsiniz."}
`)

  const ticketrow = new ActionRowBuilder()
  .addComponents( 
  new ButtonBuilder().setCustomId("ticketbaslat").setLabel(`${config.replys.TicketButtonYazi}`).setStyle(`${config.replys.TicketButonRenk}`),
);

message.channel.send({embeds: [ticketembed],components: [ticketrow]})

    },
}

/*
client.on('interactionCreate', async interaction => {

  })
  */
