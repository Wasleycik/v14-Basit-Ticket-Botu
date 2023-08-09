const { EmbedBuilder,Partials, resolveColor, Client, Collection, GatewayIntentBits, ActivityType,OAuth2Scopes } = require("discord.js");

//Ticket İçin Gerekli Olanlar
const { StringSelectMenuBuilder,PermissionsBitField,ChannelType,ActionRowBuilder,ButtonStyle,ModalBuilder,TextInputStyle,ButtonBuilder,Modal,TextInputBuilder} = require("discord.js");
const config = require("./config");
const Discord = require("discord.js");
const db = require("orio.db");
const { generateFromMessages } = require("discord-html-transcripts");

const ticketyetkilisi = db.get(`ticket-yetkilisi`)
const ticketlog = db.get(`ticket-log`)
if (!ticketlog) return;
const tckbuttonsebep1 = `${config.replys.TicketSebep1 || "Sunucunuzda Satın Alma İşlemi Yapmak İstiyorum."}`;
const tckbuttonsebep2 = `${config.replys.TicketSebep2 || "Sunucunuzda Reklam Verdirmek İstiyorum."}`;
const tckbuttonsebep3 = `${config.replys.TicketSebep3 || "Sunucunuzda Rol Veya Özel Kanal Açtırtmak İstiyorum."}`;
//Ticket İçin Gerekli Olanlar Bitiş

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
        name: config.botDurum,
        type: ActivityType.Streaming,
        url: "https://www.youtube.com/watch?v=qmpzPtaa3vc"
      }],
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

/* TİCKET SİSTEMİ BURADAN BAŞLIYOR*/

/* TİCKET SİSTEMİ İÇİN BUTONLAR VE SELECTLER*/
    const tckolstrow11 = new ActionRowBuilder()
    .addComponents( 
    new ButtonBuilder().setCustomId("tcbuton1").setLabel("1").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("tcbuton2").setLabel("2").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("tcbuton3").setLabel("3").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("tcbuton4").setLabel("4").setStyle(ButtonStyle.Secondary),
  );

  const tckolstrow = new ActionRowBuilder()
  .addComponents(
      new StringSelectMenuBuilder()
          .setCustomId('ccc')
          .setPlaceholder(`Lütfen Bir Sebep Seçiniz!`)
          .addOptions([
              { label: `${config.replys.TicketSebep1 || "Sebep Belirtilmemiş"}`, value: 'tcbuton1', emoji: '🔶'},
              { label: `${config.replys.TicketSebep2 || "Sebep Belirtilmemiş"}`, value: 'tcbuton2', emoji: '🔶'},
              { label: `${config.replys.TicketSebep3 || "Sebep Belirtilmemiş"}`, value: 'tcbuton3', emoji: '🔶'},
              { label: `Diğer`, description: 'Farklı Bir Sebebbiniz Var İse Kullanabilirsiniz.', value: 'tcbuton4', emoji: '🔶'},
           ]),
  );

  const ticketscmrow = new Discord.ActionRowBuilder()
  .addComponents(
  new ButtonBuilder()
  .setLabel("Kullanıcı Ekle")
  .setCustomId("ticketkullaniciekle")
  .setStyle("Success")
  .setEmoji("😁"),
  new ButtonBuilder()
  .setCustomId("çıkar")
  .setLabel("Kullanıcı Çıkar")
  .setStyle("Danger")
  .setEmoji("☠️"),
  new Discord.ButtonBuilder()
  .setLabel("Kapat")
  .setStyle(Discord.ButtonStyle.Secondary)
  .setCustomId("ticketcikisyap")
  .setEmoji("❎")
  )

  const ytekibirowwrow = new Discord.ActionRowBuilder()
  .addComponents(
  new Discord.ButtonBuilder()
  .setLabel("Yetkili Ekibi")
  .setStyle(Discord.ButtonStyle.Success)
  .setCustomId("ytekişbirsd")
  .setEmoji("🤓")
  .setDisabled(true),
  )

// Selectler
  const tckselecteow = new ActionRowBuilder()
  .addComponents(
      new StringSelectMenuBuilder()
          .setCustomId('mute')
          .setPlaceholder(`Diğer Seçenekler?`)
          .addOptions([
              { label: 'Sesli Destek Oluştur', description: 'Sesli Şekilde Destek Verebilirsiniz.', value: 'sesliticketoluştur', emoji: '<:Voice_Virtual:1028018710432186368>'},
           ]),
  );
  const tckselecteow1 = new ActionRowBuilder()
  .addComponents(
      new StringSelectMenuBuilder()
          .setCustomId('mute')
          .setPlaceholder(`Diğer Seçenekler?`)
          .addOptions([
              { label: 'Sesli Kanalı Sil/Kapat', description: 'Oluşturulan Sesli Kanalı Silersiniz.', value: 'ticketseslisil', emoji: '🔇'},
           ]),
  );
/* TİCKET SİSTEMİ İÇİN BUTONLAR VE SELECTLER BİTİŞ*/

/* TİCKET SELECT MENÜ KISMI BİTİŞ */
client.on('interactionCreate', async interaction => {
  if (!interaction.isSelectMenu()) return;
    /// Sebep 1 Seçim Kısmıı
    if(interaction.values[0] === "tcbuton1") {
      // Kanal Oluşturan Kısım
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
                }).then((channel2)=>{
                  // Kanal Oluşturan Kısım Bitiş
                  // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı
      const embed = new Discord.EmbedBuilder()
      .setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
      .setColor("Red")
      interaction.reply({embeds: [embed], ephemeral: true})
// Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı bitiş
// Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı
      const embed2 = new Discord.EmbedBuilder()
      .setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
      .setDescription(`
      🧸 **Talep Açan :** ${interaction.user} - (\`${interaction.user.id}\`)
      ⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
      📄 **Açılış Sebebi :** \`${tckbuttonsebep1}\`
      `)
      .setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
      .setColor("Green")
// Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
      // Ticket Bilgilerini Databaseye Kaydetme
      db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep1})
      // Ticket Bilgilerini Databaseye Kaydetme Bitiş
      // Ticket Kanalına embed Mesaj Atma
      channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
      channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
      // Ticket Kanalına embed Mesaj Atma Bitiş
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
                }).then((channel2)=>{
                  // Kanal Oluşturan Kısım Bitiş
                  // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı
                  const embed = new Discord.EmbedBuilder()
                  .setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
                  .setColor("Red")
                  interaction.reply({embeds: [embed], ephemeral: true})
          // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı bitiş
          // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı
                  const embed2 = new Discord.EmbedBuilder()
                  .setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
                  .setDescription(`
                  🧸 **Talep Açan :** ${interaction.user} - (\`${interaction.user.id}\`)
                  ⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
                  📄 **Açılış Sebebi :** \`${tckbuttonsebep1}\`
                  `)
                  .setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
                  .setColor("Green")
          // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
          // Yetkililerin Ve Kullanıcıların Kullanabileceği Butonlar
                  const tckselecteow = new ActionRowBuilder()
                  .addComponents(
                      new StringSelectMenuBuilder()
                          .setCustomId('mute')
                          .setPlaceholder(`Diğer Seçenekler?`)
                          .addOptions([
                              { label: 'Sesli Destek Oluştur', description: 'Sesli Şekilde Destek Verebilirsiniz.', value: 'sesliticketoluştur', emoji: '<:Voice_Virtual:1028018710432186368>'},
                           ]),
                  );

                  // Yetkililerin Ve Kullanıcıların Kullanabileceği Butonlarbitiş
                  // Ticket Bilgilerini Databaseye Kaydetme
                  db.delete(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep1})
                  db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep1})
                  // Ticket Bilgilerini Databaseye Kaydetme Bitiş
                  // Ticket Kanalına embed Mesaj Atma
                  channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
                  channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
                  // Ticket Kanalına embed Mesaj Atma Bitiş
      })
      }}
      /// Sebep 1 Seçim Kısmı Bitiş

/* ---------------------------------------------------------*/

          /// Sebep 2 Seçim Kısmıı
    if(interaction.values[0] === "tcbuton2") {
      // Kanal Oluşturan Kısım
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
                }).then((channel2)=>{
                  // Kanal Oluşturan Kısım Bitiş
                  // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı
      const embed = new Discord.EmbedBuilder()
      .setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
      .setColor("Red")
      interaction.reply({embeds: [embed], ephemeral: true})
// Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı bitiş
// Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı
      const embed2 = new Discord.EmbedBuilder()
      .setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
      .setDescription(`
      🧸 **Talep Açan :** ${interaction.user} - (\`${interaction.user.id}\`)
      ⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
      📄 **Açılış Sebebi :** \`${tckbuttonsebep2}\`
      `)
      .setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
      .setColor("Green")
// Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
      // Ticket Bilgilerini Databaseye Kaydetme
      db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep2})
      // Ticket Bilgilerini Databaseye Kaydetme Bitiş
      // Ticket Kanalına embed Mesaj Atma
      channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
      channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
      // Ticket Kanalına embed Mesaj Atma Bitiş
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
                }).then((channel2)=>{
                  // Kanal Oluşturan Kısım Bitiş
                  // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı
                  const embed = new Discord.EmbedBuilder()
                  .setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
                  .setColor("Red")
                  interaction.reply({embeds: [embed], ephemeral: true})
          // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı bitiş
          // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı
                  const embed2 = new Discord.EmbedBuilder()
                  .setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
                  .setDescription(`
                  🧸 **Talep Açan :** ${interaction.user} - (\`${interaction.user.id}\`)
                  ⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
                  📄 **Açılış Sebebi :** \`${tckbuttonsebep2}\`
                  `)
                  .setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
                  .setColor("Green")
          // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
          // Yetkililerin Ve Kullanıcıların Kullanabileceği Butonlar
                  const tckselecteow = new ActionRowBuilder()
                  .addComponents(
                      new StringSelectMenuBuilder()
                          .setCustomId('mute')
                          .setPlaceholder(`Diğer Seçenekler?`)
                          .addOptions([
                              { label: 'Sesli Destek Oluştur', description: 'Sesli Şekilde Destek Verebilirsiniz.', value: 'sesliticketoluştur', emoji: '<:Voice_Virtual:1028018710432186368>'},
                           ]),
                  );

                  // Yetkililerin Ve Kullanıcıların Kullanabileceği Butonlarbitiş
                  // Ticket Bilgilerini Databaseye Kaydetme
                  db.delete(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep2})
                  db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep2})
                  // Ticket Bilgilerini Databaseye Kaydetme Bitiş
                  // Ticket Kanalına embed Mesaj Atma
                  channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
                  channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
                  // Ticket Kanalına embed Mesaj Atma Bitiş
      })
      }}
      /// Sebep 2 Seçim Kısmı Bitiş

      /* ---------------------------------------------------------*/

          /// Sebep 3 Seçim Kısmıı
    if(interaction.values[0] === "tcbuton3") {
      // Kanal Oluşturan Kısım
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
                }).then((channel2)=>{
                  // Kanal Oluşturan Kısım Bitiş
                  // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı
      const embed = new Discord.EmbedBuilder()
      .setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
      .setColor("Red")
      interaction.reply({embeds: [embed], ephemeral: true})
// Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı bitiş
// Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı
      const embed2 = new Discord.EmbedBuilder()
      .setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
      .setDescription(`
      🧸 **Talep Açan :** ${interaction.user} - (\`${interaction.user.id}\`)
      ⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
      📄 **Açılış Sebebi :** \`${tckbuttonsebep3}\`
      `)
      .setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
      .setColor("Green")
// Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
      // Ticket Bilgilerini Databaseye Kaydetme
      db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep3})
      // Ticket Bilgilerini Databaseye Kaydetme Bitiş
      // Ticket Kanalına embed Mesaj Atma
      channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
      channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
      // Ticket Kanalına embed Mesaj Atma Bitiş
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
                }).then((channel2)=>{
                  // Kanal Oluşturan Kısım Bitiş
                  // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı
                  const embed = new Discord.EmbedBuilder()
                  .setDescription("Başarıyla Destek Talebin. <#"+channel2.id+"> Kanalında Oluşturuldu.")
                  .setColor("Red")
                  interaction.reply({embeds: [embed], ephemeral: true})
          // Kanalı Oluşturduğunda Kullanıcıya Özel Kanal Oluşturuldu Mesajı bitiş
          // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı
                  const embed2 = new Discord.EmbedBuilder()
                  .setAuthor({name: "Yeni Destek Talebi Geldi!", iconURL: interaction.guild.iconURL({dynamic: true})})
                  .setDescription(`
                  🧸 **Talep Açan :** ${interaction.user} - (\`${interaction.user.id}\`)
                  ⏱ **Talep Açılış Tarihi :** <t:${Math.floor(Date.now() /1000)}:R>
                  📄 **Açılış Sebebi :** \`${tckbuttonsebep3}\`
                  `)
                  .setFooter({text: `Talep Açan: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({dynamic: true})})
                  .setColor("Green")
          // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
          // Yetkililerin Ve Kullanıcıların Kullanabileceği Butonlar
                  const tckselecteow = new ActionRowBuilder()
                  .addComponents(
                      new StringSelectMenuBuilder()
                          .setCustomId('mute')
                          .setPlaceholder(`Diğer Seçenekler?`)
                          .addOptions([
                              { label: 'Sesli Destek Oluştur', description: 'Sesli Şekilde Destek Verebilirsiniz.', value: 'sesliticketoluştur', emoji: '<:Voice_Virtual:1028018710432186368>'},
                           ]),
                  );

                  // Yetkililerin Ve Kullanıcıların Kullanabileceği Butonlarbitiş
                  // Ticket Bilgilerini Databaseye Kaydetme
                  db.delete(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep3})
                  db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: tckbuttonsebep3})
                  // Ticket Bilgilerini Databaseye Kaydetme Bitiş
                  // Ticket Kanalına embed Mesaj Atma
                  channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
                  channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
                  // Ticket Kanalına embed Mesaj Atma Bitiş
      })
      }}
      /// Sebep 3 Seçim Kısmı Bitiş

      /* ---------------------------------------------------------*/
      
/// Diğer Talep Seçenekleri Kısmı İçin Modal
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

    if(interaction.values[0] === "tcbuton4"){
    await interaction.showModal(ticketmodal);
    }

/// Diğer Talep Seçenekleri Kısmı İçin Modal Bitiş
/// Talepte Sesli Kanal Oluştur Kısmı
if(interaction.values[0] === "sesliticketoluştur") {
  if (!interaction.isSelectMenu()) return;
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content:"Yeterli yetkin bulunmuyor!", ephemeral: true})
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
📄 **Açılış Sebebi :** \`${sebep || "Malesef Onu Söyleyemiyoruz"}\`
`)
.setFooter({text: `Talep Açan: ${tag}`, iconURL: avatar.displayAvatarURL({})})
.setColor("Green")
let ad = interaction.channel.name
let id = interaction.channel.id
interaction.guild.channels.create({
name: ad, 
type: Discord.ChannelType.GuildVoice, 
parent: interaction.guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && c.name === "Ticket-Destek")
}).then((sesli) => {
interaction.update({embeds: [embed], components: [ticketscmrow,tckselecteow1]})
db.set(`sesli_${id}`, sesli.id)
})
}
/// Talepte Sesli Kanal Oluştur Bitiş

/// Talepte Oluşturulan Sesli Kanalı Sil Kısmı

if(interaction.values[0] === "ticketseslisil") {
  if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content:"Yeterli yetkin bulunmuyor!", ephemeral: true})
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
📄 **Açılış Sebebi :** \`${sebep || "Malesef Onu Söyleyemiyoruz"}\`
`)
.setFooter({text: `Talep Açan: ${tag}`, iconURL: avatar.displayAvatarURL({})})
.setColor("Green")

interaction.update({embeds: [embed], components: [ticketscmrow,tckselecteow]})
}
/// Talepte Oluşturulan Sesli Kanalı Sil Bitiş
})
/* TİCKET SELECT MENÜ KISMI BİTİŞ */
/* TİCKET BUTONLARLA ALAKALI KISIM */
client.on('interactionCreate', async interaction => {

      //Butonlardan Ticket Sebep Seçim Kısmı
      if(interaction.customId === "ticketbaslat") {
        if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id+'-ticket')){
            return interaction.reply({
                content: 'Zaten Açık Durumda Bir Adet Biletiniz Var!',
                ephemeral: true
            })
        }

    let tckoltrembed = new EmbedBuilder().setColor("#2f3136")
    .setDescription(`
    ${interaction.user}, Lütfen Aşağıdaki Butonlardan Yapmak İstediğiniz İşlemi Seçiniz.

    \`DİKKAT!!\`
    **Ticket Açma Sebebiniz Aşağıdakilerden Birisi Deil İse Lütfen \`Diğer\` Seçeneğini Kullanınız.**
    `);
    await interaction.reply({ embeds: [tckoltrembed],components: [tckolstrow], ephemeral: true})
    }
    //Butonlardan Ticket Sebep Seçim Kısmı
/// Diğer Talep Seçenekleri Kısmı
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
                  // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
                // Ticket Bilgilerini Databaseye Kaydetme
      db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: sebep})
            // Ticket Bilgilerini Databaseye Kaydetme Bitiş
            // Ticket Kanalına embed Mesaj Atma
            channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
            channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
            // Ticket Kanalına embed Mesaj Atma Bitiş
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
                }).then((channel2)=>{
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
                  // Ticket Açılınca Yetkilileri Bilgilendirmek İçin Embed Kısmı bitiş
      // Ticket Bilgilerini Databaseye Kaydetme
      db.delete(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: sebep})
      db.set(`ticket_${channel2.id}`, {sahip: interaction.user.id, date: Date.now(), tag: interaction.user.tag, sebep: sebep})
      // Ticket Bilgilerini Databaseye Kaydetme Bitiş
      // Ticket Kanalına embed Mesaj Atma
      channel2.send({content: `${interaction.user} <@&${ticketyetkilisi}>`, embeds: [embed2], components: [ticketscmrow,tckselecteow]}).then(a => { a.pin()})
      channel2.send({content: `${interaction.user} Lütfen Kurallara Göre Davranalım Eğerki, Kural İhlali Yapacak Olursanız Cezai İşlemleriniz Buna Göre Uygulanacaktır.`,components: [ytekibirowwrow]})
      // Ticket Kanalına embed Mesaj Atma Bitiş
      })
      }}
      /// Diğer Talep Seçenekleri Kısmı Bitiş

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
  .setStyle(Discord.ButtonStyle.Danger)
  .setCustomId("ticketsil")
  .setEmoji("❎"),
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
  ${interaction.user} **Talebten Çıkış Yaptı Lütfen Talebi Kontrol Edip Kapatınız.**
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
  ${interaction.user} **Talebten Çıkış Yaptı Lütfen Talebi Kontrol Edip Kapatınız.**
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
/* TİCKET BUTONLARLA ALAKALI KISIM BİTİŞ */

/* TİCKET SİSTEMİ BURADA BİTİYOR*/


/* BURADAN sONRAKİ ESKİ KISIM iSTER DÜZENLE İSTE SİL KAFANA GÖRE */
/*
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
*/
