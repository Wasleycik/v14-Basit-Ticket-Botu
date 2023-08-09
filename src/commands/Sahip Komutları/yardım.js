const {PermissionFlagsBits} = require("discord.js");
const config = require("../../../config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "yardım",
    usage:"yardım",
    aliases: ["help","yardm","helps"],
    execute: async (client, message, args, embed) => {
    if(!message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);

    let Komutlar = client.commands.filter(km => km.usage).map((commands) => `\`•\` ${config.prefix}${commands.usage}`).join("\n");

     message.reply({ embeds: [embed.setDescription(`
      **Botun Tüm Komutları Aşağıda Listelenmektedir.**
     ${Komutlar}
     `)] });

    }
}
