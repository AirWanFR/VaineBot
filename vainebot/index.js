const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');
const express = require('express');
require('dotenv').config();

const { Client, GatewayIntentBits, Collection, ActivityType, REST, Routes, Partials, EmbedBuilder } = require('discord.js');

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY; // Clé d'authentification pour l'API de synchronisation

// --- CONFIGURATION R1-D1 ---
const PREFIX = 'v!'; 
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();
let statusMessage = null;

// --- CONFIGURATION DES RÔLES (BITFIELD) ---
const ROLES_MAP = {
    1: "1285950633769439271",  // Potes
    2: "1285950633861447774",  // Famille
    4: "1285950633769439268",  // ETS2
    8: "1285950633861447776",  // VIP
    16: "1285950633769439270", // DEV
    32: "1285950633769439269",  // STREAM
    
    8192: "1461521349653565583" // Perrine
};

// --- FONCTION DE SYNCHRONISATION DES RÔLES ---
async function syncDiscordRoles(guildMember, userPerms) {
    if (!guildMember) return;
    for (const [bit, roleId] of Object.entries(ROLES_MAP)) {
        const hasPerm = (userPerms & parseInt(bit)) !== 0;
        const hasRole = guildMember.roles.cache.has(roleId);
        try {
            if (hasPerm && !hasRole) {
                await guildMember.roles.add(roleId);
                console.log(chalk.green(`[R1D1] + Rôle : ${roleId} -> ${guildMember.user.tag}`));
            } else if (!hasPerm && hasRole) {
                await guildMember.roles.remove(roleId);
                console.log(chalk.yellow(`[R1D1] - Rôle : ${roleId} -> ${guildMember.user.tag}`));
            }
        } catch (e) {
            console.error(chalk.red(`[R1D1] Erreur rôle (${roleId}): ${e.message}`));
        }
    }
}

// --- CHARGEMENT DES MODULES (Commandes & Événements) ---
console.log(chalk.blue('🔍 R1-D1 : Initialisation des modules...'));
const loadCommands = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadCommands(filePath);
    } else if (file.name.endsWith('.js')) {
      delete require.cache[require.resolve(filePath)];
      const command = require(filePath);
      if ('name' in command && 'execute' in command) {
        client.commands.set(command.name, command);
        console.log(chalk.green(`✅ Système chargé : ${command.name}`));
      }
    }
  }
};
loadCommands(path.join(__dirname, 'commands'));

const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  fs.readdirSync(eventsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const event = require(`./events/${file}`);
      if (event.name && typeof event.execute === 'function') {
        client.on(event.name, (...args) => event.execute(...args, client));
        console.log(chalk.cyan(`📌 Liaison établie : ${event.name}`));
      }
    }
  });
}

// --- SYSTÈME STATUS LIVE ---
async function updateLiveStatus() {
    const url = 'https://vainerac.fr';
    const channelId = '1461113654723219567'; 
    const channel = await client.channels.fetch(channelId).catch(() => null);
    if (!channel) return;

    let siteStatus = { label: '🔴 HORS-LIGNE', color: '#ff0000', emoji: '🚨', latency: '---' };
    try {
        const start = Date.now();
        await axios.get(url, { timeout: 5000 });
        siteStatus = { label: '🟢 OPÉRATIONNEL', color: '#00fbff', emoji: '🛰️', latency: `${Date.now() - start}ms` };
    } catch (e) { siteStatus.latency = 'Échec'; }

    const statusEmbed = new EmbedBuilder()
        .setColor(siteStatus.color)
        .setTitle(`${siteStatus.emoji} État du Réseau Vainerac`)
        .addFields(
            { name: 'Statut du Site', value: `\`${siteStatus.label}\``, inline: true },
            { name: 'Latence Web', value: `\`${siteStatus.latency}\``, inline: true },
            { name: 'Dernier Scan', value: `<t:${Math.floor(Date.now() / 1000)}:T>`, inline: true }
        )
        .setFooter({ text: 'R1-D1 Auto-Monitoring', iconURL: client.user.displayAvatarURL() });

    if (!statusMessage) {
        const messages = await channel.messages.fetch({ limit: 10 });
        statusMessage = messages.find(m => m.author.id === client.user.id);
        if (statusMessage) await statusMessage.edit({ embeds: [statusEmbed] }).catch(() => null);
        else statusMessage = await channel.send({ embeds: [statusEmbed] }).catch(() => null);
    } else {
        await statusMessage.edit({ embeds: [statusEmbed] }).catch(() => { statusMessage = null; });
    }
}

// --- ROUTES EXPRESS (Web & API) ---
app.get('/', (req, res) => {
    res.send(`<body style="background:#0f172a;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;text-align:center;"><div><h1>R1-D1 | Vainerac.fr</h1><p>Système de sécurité et d'authentification actif.</p></div></body>`);
});

app.get('/auth/link', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify&state=linking`;
    res.redirect(url);
});

app.get('/auth/login', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=identify&state=login`;
    res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) return res.redirect('https://vainerac.fr/login.php?error=no_code');

    try {
        // Échange du code contre un token d'accès
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REDIRECT_URI,
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        // Récupération des infos de l'utilisateur (@me)
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` }
        });

        const userData = userResponse.data;
        
        // Envoi d'un message de confirmation en MP (optionnel)
        const user = await client.users.fetch(userData.id);
        const embed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ text: 'R1-D1 Security', iconURL: client.user.displayAvatarURL() });

        if (state === 'linking') {
            embed.setColor('#10b981').setTitle('🔗 Liaison réussie').setDescription(`Compte **${userData.username}** lié avec succès.`);
        } else {
            embed.setColor('#8b5cf6').setTitle('🚀 Connexion Vainerac').setDescription(`Ravi de vous revoir, **${userData.username}**.`);
        }

        await user.send({ embeds: [embed] }).catch(() => console.log(chalk.yellow("MP bloqués.")));

        // Redirection vers ton site PHP pour mettre à jour la BDD
        res.redirect(`https://vainerac.fr/login.php?discord_auth_success=1&discord_id=${userData.id}&discord_user=${encodeURIComponent(userData.username)}&discord_avatar=${userData.avatar}&state=${state}`);

    } catch (e) {
        console.error(chalk.red("Erreur callback : " + e.message));
        res.redirect("https://vainerac.fr/login.php?error=auth_failed");
    }
});

// --- ACTIVITÉS & PRÉSENCE ---
const activities = [
  { name: "VaineBot, paré au lancement !", type: ActivityType.Custom },
  { name: "VaineBot au rapport !", type: ActivityType.Custom },
  { name: "VaineBot | v!help", type: ActivityType.Playing }
];
let activityIndex = 0;

// --- INITIALISATION READY ---
client.once('clientReady', (c) => {
  console.log(chalk.bold.magenta(`\n[R1-D1] Connecté. Bonjour Erwan.\n`));

  setInterval(() => {
    client.user.setPresence({ activities: [activities[activityIndex]], status: 'online' });
    activityIndex = (activityIndex + 1) % activities.length;
  }, 10000);

  updateLiveStatus();
  setInterval(updateLiveStatus, 60000);

  // API de synchronisation pour le Panel Admin
  app.get('/api/sync', async (req, res) => {
      const { discord_id, perms, key } = req.query;
      if (key !== "BddPassword") return res.status(403).send("Accès refusé");
      try {
          const guild = await client.guilds.fetch(process.env.GUILD_ID);
          const member = await guild.members.fetch(discord_id).catch(() => null);
          if (!member) return res.status(404).send("Membre introuvable");
          await syncDiscordRoles(member, parseInt(perms));
          res.send("OK");
      } catch (e) { res.status(500).send("Erreur"); }
  });

  app.listen(PORT, '0.0.0.0', () => {
      console.log(chalk.cyan(`📊 API & Auth actives sur le port ${PORT}`));
  });

  // Déploiement Slash Commands
  const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
  const slashCommands = client.commands.map(cmd => ({
      name: cmd.name,
      description: cmd.description || 'Module R1-D1',
      options: cmd.options || []
  }));

  (async () => {
    try {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: slashCommands });
      console.log(chalk.green('✅ Protocoles Slash synchronisés.'));
    } catch (error) { console.error(chalk.red('❌ Erreur de déploiement Slash.')); }
  })();
});

// --- GESTION DES MESSAGES (PRÉFIXE) ---
client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandName === 'shutdown' || commandName === 'off') {
    if (message.author.id !== "1282797720934813838") return;
    await message.reply("🔌 **R1-D1 se déconnecte.** Au revoir, Erwan.");
    process.exit();
  }

  const command = client.commands.get(commandName);
  if (command) {
    try { await command.execute(message, args, client); } 
    catch (err) { message.reply('❌ Erreur d\'exécution du module.'); }
  }
});

// --- GESTION DES INTERACTIONS (SLASH) ---
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    try { 
      await command.execute(interaction, [], client); 
    } catch (error) { 
      await interaction.reply({ content: '❌ Erreur critique.', flags: [64] }).catch(() => null); 
    }
  }
});

client.login(process.env.BOT_TOKEN);