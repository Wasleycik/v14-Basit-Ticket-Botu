const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, OAuth2Scopes, Partials, resolveColor, Client, Collection, GatewayIntentBits, SelectMenuBuilder, ActivityType, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");
const db = require("orio.db");
const config = require("../../../config")
module.exports = {
    name: "setup",
    aliases: ["setup"],
    usage:"setup",
    category:"sahip",
execute: async (client, message, args, embed) => {
        if(!message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        let secim = args[0];
        let ticketyt = await db.get("ticket-yetkilisi");
        let ticketlog = await db.get("ticket-log");


    let stupkurulumlar = new EmbedBuilder()
    .setColor("Blue")
    .setAuthor({ name: `Setup System`,iconURL: message.guild.iconURL({ dynamic: true }) })
    .setDescription(`

    __**Kurulumlar**__

[\`ID: 1\`] **Ticket Yetkilisi** : ${ticketyt ? `<@&${ticketyt}>` : "Bulunmamakta"}

[\`ID: 2\`] **Ticket Log** : ${ticketlog ? `<#${ticketlog}>` : "Bulunmamakta"}

__**Setup Sistemi Kullanım**__

.setup 1 @yetkilirol / id

.setup 2 #kanal / id

\`Kurulumlarda Belirtilen Idler Üzerinden İşlem Yapılmaktadır.\`
`)

        if (!secim) return msg = await message.reply({ embeds: [stupkurulumlar] })

          if (secim == "1") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("five-family-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${config.prefix}setup 6 @rol**` })
                db.set("ticket-yetkilisi", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            

        } else if (secim == "2") {
            let channel = message.mentions.channels.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("ticket-log")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!channel) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${config.prefix}setup 8 #chat-kanal**` })
            db.set("ticket-log", channel.id)
            message.reply({ content: `> **✅ Başarılı!**\n> **${channel} (\`${channel.name}\`) Başarıyla Eklendi!**` })

        } else{ return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${config.prefix}setup <ID> @rol/#kanal/tag**` }) }
    }
}

