const {InteractionType, WebhookClient, Colors, ButtonStyle, TextInputStyle, OAuth2Scopes, PermissionsBitField, ChannelType, Client, ButtonBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder,Collection, SelectMenuBuilder, EmbedBuilder, GatewayIntentBits, Partials } = require("discord.js");
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

    const button1 = new ButtonBuilder()
    .setCustomId("ticketolustur")
    .setLabel("Ticket Talebi Oluştur")
    .setStyle(1)

    const row = new ActionRowBuilder()
    .addComponents(button1)

message.channel.send({components: [row]})

    },
}

///////--------- TİCKET KISMI ---------///////
client.on('interactionCreate', async interaction => {
  const db = require("orio.db");
  let ticketyetkilisi = db.get(`ticket-yetkilisi`)
  let ticketlog = db.get(`ticket-log`)
  if (!ticketlog) return;

/// Talep Oluştur Kısmı
const ticketmodal = new ModalBuilder()
.setCustomId('form')
.setTitle('Destek Ticket')
  const a1 = new TextInputBuilder()
  .setCustomId('sebep')
  .setLabel('Destek Açma Sebebiniz?')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(2)
  .setMaxLength(500)
  .setPlaceholder('Lütfen Destek Açma Sebebinizi Yazınız.')
  .setRequired(true)
  const row = new ActionRowBuilder().addComponents(a1);
  ticketmodal.addComponents(row);

	if(interaction.customId === "ticketolustur"){
            if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id+'-ticket')){
                return interaction.reply({
                    content: 'Zaten bir açık biletiniz var!',
                    ephemeral: true
                })
            }
    await interaction.showModal(ticketmodal);
	}

          if(interaction.customId === "form") {
const sebep = interaction.fields.getTextInputValue('sebep')
if(interaction.guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === "Ticket-Destek")){
            interaction.guild.channels.create({
            name: `talep-${interaction.user.username}`,
            topic: interaction.user.id+'-ticket',
            type: Discord.ChannelType.GuildText,
            parent: interaction.guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === "Ticket-Destek"),

              permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: ticketyetkilisi,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                }
            ]
          })


                .then((channel2)=>{
const embed = new Discord.EmbedBuilder()
.setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
.setColor("Red")
interaction.reply({embeds: [embed], ephemeral: true})
const embed2 = new Discord.EmbedBuilder()
.setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
.setDescription(`
🧸 **Talep Açan :** ${interaction.user}
⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
📄 **Açılış Sebebi :** \`${sebep}\`
`)
.setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
.setColor("Green")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Sesli Destek Oluştur")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("sesliticketoluştur")
.setEmoji("<:Voice_Virtual:1028018710432186368>"),
new ButtonBuilder()
.setLabel("Kullanıcı Ekle")
.setStyle("Success")
.setCustomId("ticketkullaniciekle"),
new ButtonBuilder()
.setLabel("Kullanıcı Çıkar")
.setStyle("Danger")
.setCustomId("çıkar"),
new Discord.ButtonBuilder()
.setLabel("Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("ticketcikisyap")
.setEmoji("❌")
)
db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: sebep})
channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [row]}).then(a => { a.pin()})
})
}else{
const parent = await interaction.guild.channels.create({ name: 'Ticket-Destek', type: ChannelType.GuildCategory });
            interaction.guild.channels.create({
            name: `talep-${interaction.user.username}`,
            topic: interaction.user.id+'-ticket',
            type: Discord.ChannelType.GuildText,
            parent: interaction.guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === "Ticket-Destek"),

              permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: ticketyetkilisi,
                    allow: [Discord.PermissionsBitField.Flags.ViewChannel]
                }
            ]
          })


                .then((channel2)=>{
const embed = new Discord.EmbedBuilder()
.setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
.setColor("Red")
interaction.reply({embeds: [embed], ephemeral: true})
const embed2 = new Discord.EmbedBuilder()
.setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
.setDescription(`
🧸 **Talep Açan :** ${interaction.user}
⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
📄 **Açılış Sebebi :** \`${sebep}\`
`)
.setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
.setColor("Green")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Sesli Destek Oluştur")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("sesliticketoluştur")
.setEmoji("<:Voice_Virtual:1028018710432186368>"),
new ButtonBuilder()
.setLabel("Kullanıcı Ekle")
.setStyle("Success")
.setCustomId("ticketkullaniciekle"),
new ButtonBuilder()
.setLabel("Kullanıcı Çıkar")
.setStyle("Danger")
.setCustomId("çıkar"),
new Discord.ButtonBuilder()
.setLabel("Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("ticketcikisyap")
.setEmoji("❌")
)
db.delete(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: sebep})
db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: sebep})
channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [row]}).then(a => { a.pin()})
})
}}
/// Talep Oluştur Bitiş

/// Talepte Sesli Kanal Oluştur Kısmı

if(interaction.customId === "sesliticketoluştur") {
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let usır = ticket.sahip
let zaman = ticket.date
let tag = ticket.tag
let sebep = ticket.sebep
let date = `<t:${Math.floor(zaman /1000)}:R>`
let avatar = client.users.cache.get(usır)
const embed = new Discord.EmbedBuilder()
.setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
.setDescription(`
🧸 **Talep Açan :** <@${usır}>
⏱ **Talep Açılış Tarihi :** ${date}
📄 **Açılış Sebebi :** \`${sebep}\`
`)
.setFooter({text: `Talep Açan: ${tag}`, iconURL: avatar.displayAvatarURL({})})
.setColor("Green")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("ticketseslisil")
.setEmoji("🔇"),
new ButtonBuilder()
.setLabel("Kullanıcı Ekle")
.setStyle("Success")
.setCustomId("ticketkullaniciekle"),
new ButtonBuilder()
.setLabel("Kullanıcı Çıkar")
.setStyle("Danger")
.setCustomId("çıkar"),
new Discord.ButtonBuilder()
.setLabel("Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("ticketcikisyap")
.setEmoji("❌")
)
let ad = interaction.channel.name
let id = interaction.channel.id
interaction.guild.channels.create({
name: ad, 
type: Discord.ChannelType.GuildVoice, 
parent: interaction.guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === "Ticket-Destek")
}).then((sesli) => {
interaction.update({embeds: [embed], components: [row]})
db.set(`sesli_${id}`, sesli.id)
})
}
/// Talepte Sesli Kanal Oluştur Bitiş

/// Talepte Oluşturulan Sesli Kanalı Sil Kısmı

if(interaction.customId === "ticketseslisil") {
  let id = interaction.channel.id
let sesli = db.fetch(`sesli_${id}`)
interaction.guild.channels.delete(sesli)
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let usır = ticket.sahip
let zaman = ticket.date
let sebep = ticket.sebep
let tag = ticket.tag
let date = `<t:${Math.floor(zaman /1000)}:R>`
let avatar = client.users.cache.get(usır)
const embed = new Discord.EmbedBuilder()
.setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
.setDescription(`
🧸 **Talep Açan :** <@${usır}>
⏱ **Talep Açılış Tarihi :** ${date}
📄 **Açılış Sebebi :** \`${sebep}\`
`)
.setFooter({text: `Talep Açan: ${tag}`, iconURL: avatar.displayAvatarURL({})})
.setColor("Green")
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setLabel("Sesli Destek Oluştur")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("olustur")
.setEmoji("<:Voice_Virtual:1028018710432186368>"),
new ButtonBuilder()
.setLabel("Kullanıcı Ekle")
.setStyle("Success")
.setCustomId("ticketkullaniciekle"),
new ButtonBuilder()
.setLabel("Kullanıcı Çıkar")
.setStyle("Danger")
.setCustomId("çıkar"),
new Discord.ButtonBuilder()
.setLabel("Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("ticketcikisyap")
.setEmoji("❌")
)
interaction.update({embeds: [embed], components: [row]})
}
/// Talepte Oluşturulan Sesli Kanalı Sil Bitiş

/// Talepten Çıkış Yapma Kısmı
if(interaction.customId === "ticketcikisyap") {
const ticketkapatrow = new Discord.ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setLabel("Geri Aç")
.setStyle("Success")
.setCustomId("geriticketac"),
new Discord.ButtonBuilder()
.setLabel("Kapat")
.setStyle(Discord.ButtonStyle.Success)
.setCustomId("ticketsil")
.setEmoji("❌")
)
if(db.fetch(`sesli_${interaction.channel.id}`)){
  let id = interaction.channel.id
let sesli = db.fetch(`sesli_${id}`)
interaction.guild.channels.delete(sesli)
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let kullanici = ticket.sahip
                channel.permissionOverwrites.create(
                  kullanici, {ViewChannel: false}
                  
                  )
const embed = new Discord.EmbedBuilder()
.setDescription(`
${interaction.user} Talebi Kapattı Lütfen Talebi Kontrol Ediniz.
`)
.setColor("Green")
channel.send({embeds: [embed], components: [ticketkapatrow]})
}else{
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let kullanici = ticket.sahip
channel.permissionOverwrites.create(
kullanici, {ViewChannel: false}
)
const embed = new Discord.EmbedBuilder()
.setDescription(`
${interaction.user} **Talebi Çıkış Yaptı. Lütfen Talebi Kontrol Edip Gerekli İşlemleri Yapınız.**
`)
.setColor("Green")
channel.send({embeds: [embed], components: [ticketkapatrow]})
}
}
/// Talepten Çıkış Yapma Bitiş

/// Kapatılan Talebi Geri Açma Kısmı
if(interaction.customId === "geriticketac") {
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let eklenecekkullanıcı = ticket.sahip
channel.permissionOverwrites.create(
eklenecekkullanıcı, {ViewChannel: true}                 
)
}
/// Kapatılan Talebi Geri Açma Bitiş

/// Talebi Kapatma Kısmı
if(interaction.customId === "ticketsil") {
interaction.channel.messages.fetch().then(async messages => {
if(db.fetch(`sesli_${interaction.channel.id}`)){
  let id = interaction.channel.id
let sesli = db.fetch(`sesli_${id}`)
interaction.guild.channels.delete(sesli)
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let kullanici = ticket.sahip
let sebep = ticket.sebep
let zaman = ticket.date
const embed = new Discord.EmbedBuilder()
.setAuthor({name: interaction.user.tag+" Kişisinin kapattığı talebin verileri.", iconURL:  interaction.user.avatarURL({dynamic: true})})
.setDescription(`
\`•\` **Talep Açan :** <@${kullanici}>
\`•\` **Açılış Sebebi :** \`${sebep}\`
\`•\` **Talep Açılış Tarihi :** <t:${Math.floor(zaman /1000)}:R>
\`•\` **Talep Kapatılma Tarihi :** <t:${Math.floor(Date.now() / 1000)}:R>
`)
.setColor("Random")
.setFooter({text: "Kanalda Yazılan Mesajlar Aşağıda Html Dosyası Olarak Belirtilmiştir."})

let messagesToDelete = [];

const messages = await channel.messages.fetch();

messages.each((message) => {
  messagesToDelete.unshift(message);
});

const transcript = await generateFromMessages(messagesToDelete, channel);

client.channels.cache.get(ticketlog).send({embeds: [embed]})
client.channels.cache.get(ticketlog).send({ files: [transcript]})
channel.delete()
}
else
{
let channel = interaction.channel
let ticket = db.fetch(`ticket_${channel.id}`)
let kullanici = ticket.sahip
let sebep = ticket.sebep
let zaman = ticket.date
let date = `<t:${Math.floor(zaman /1000)}:R>`
const embed = new Discord.EmbedBuilder()
.setAuthor({name: interaction.user.tag+" Kişisinin kapattığı talebin verileri.", iconURL:  interaction.user.avatarURL({dynamic: true})})
.setDescription(`
\`•\` **Talep Açan :** <@${kullanici}>
\`•\` **Açılış Sebebi :** \`${sebep}\`
\`•\` **Talep Açılış Tarihi :** <t:${Math.floor(zaman /1000)}:R>
\`•\` **Talep Kapatılma Tarihi :** <t:${Math.floor(Date.now() / 1000)}:R>
`)
.setColor("Random")
.setFooter({text: "Kanalda Yazılan Mesajlar Aşağıda Html Dosyası Olarak Belirtilmiştir."})

    let messagesToDelete = [];

    const messages = await channel.messages.fetch();
  
    messages.each((message) => {
      messagesToDelete.unshift(message);
    });
  
    const transcript = await generateFromMessages(messagesToDelete, channel);

client.channels.cache.get(ticketlog).send({embeds: [embed]})
client.channels.cache.get(ticketlog).send({ files: [transcript]})
channel.delete()
}
})
}
/// Talebi Kapatma Bitiş

/// Tickete Kullanıcı Ekle Kısmı
const ticketüyeeklemodal = new ModalBuilder()
.setCustomId('ticketeklemenu')
.setTitle('Kullanıcı Ekle!')
  const e = new TextInputBuilder()
  .setCustomId('ticketuyeid')
  .setLabel('Kullanıcı ID')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(10)
  .setPlaceholder('Eklemek istediğiniz kullanıcı ID girin.')
  .setRequired(true)
  const row2 = new ActionRowBuilder().addComponents(e); 
  ticketüyeeklemodal.addComponents(row2);

if(interaction.customId === "ticketkullaniciekle"){
  await interaction.showModal(ticketüyeeklemodal);
}

if (interaction.customId === 'ticketeklemenu') {
const id = interaction.fields.getTextInputValue('ticketuyeid')
const channel = interaction.channel
  channel.permissionOverwrites.create(id, {ViewChannel: true})
  interaction.reply({content: `<@${id}> Adlı Kullanıcı Başarıyla Destek Talebine Eklendi!`, ephemeral: true})
}
/// Tickete Kullanıcı Ekle Kısmı Bitiş

/// Ticketen Kullanıcı Çıkar Kısmı
const ticketuyeçikarmodal = new ModalBuilder()
.setCustomId('ticketuyeçıkar')
.setTitle('Kullanıcı Çıkar!')
  const a = new TextInputBuilder()
  .setCustomId('ticketcikarid')
  .setLabel('Kullanıcı ID')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(10)
  .setPlaceholder('Çıkarmak istediğiniz kullanıcı ID girin.')
  .setRequired(true)
  const row3 = new ActionRowBuilder().addComponents(a);
  ticketuyeçikarmodal.addComponents(row3);

	if(interaction.customId === "çıkar"){
    await interaction.showModal(ticketuyeçikarmodal);
	}

if (interaction.customId === 'ticketuyeçıkar') {
const id = interaction.fields.getTextInputValue('ticketcikarid')
const channel = interaction.channel
  channel.permissionOverwrites.create(id, {ViewChannel: false})
  interaction.reply({content: `<@${id}> Adlı Kullanıcı Başarıyla Destek Talebinden Çıkarıldı!`, ephemeral: true})
}
/// Ticketen Kullanıcı Çıkar Kısmı Bitiş
})

///////--------- TİCKET KISMI BİTİŞ ---------///////