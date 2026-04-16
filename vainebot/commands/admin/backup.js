const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'backup',
  description: 'Génère une archive sécurisée du code source (Admin uniquement)',
  async execute(ctx, args, client) {
    // Sécurité : Uniquement toi
    if (ctx.user?.id !== "1282797720934813838" && ctx.author?.id !== "1282797720934813838") {
      return ctx.reply({ content: "❌ Accès restreint. Seul Erwan peut déclencher une sauvegarde.", ephemeral: true });
    }

    const msg = ctx.reply ? await ctx.reply("📦 Initialisation de la sauvegarde...") : await ctx.channel.send("📦 Initialisation...");

    try {
      const zip = new AdmZip();
      const backupName = `backup-${Date.now()}.zip`;
      const rootDir = path.resolve(__dirname, '../');

      // Ajoute les fichiers importants mais ignore les dossiers lourds
      const files = fs.readdirSync(rootDir);
      files.forEach(file => {
        const filePath = path.join(rootDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          // On ignore node_modules et .git
          if (file !== 'node_modules' && file !== '.git') {
            zip.addLocalFolder(filePath, file);
          }
        } else {
          zip.addLocalFile(filePath);
        }
      });

      const buffer = zip.toBuffer();
      const attachment = new AttachmentBuilder(buffer, { name: backupName });

      const successEmbed = new EmbedBuilder()
        .setColor('#00fbff')
        .setTitle('🗄️ Sauvegarde Terminée')
        .setDescription(`Le code source de **R1-D1** a été compressé avec succès.`)
        .addFields({ name: 'Fichier', value: `\`${backupName}\`` })
        .setTimestamp();

      await ctx.channel.send({ embeds: [successEmbed], files: [attachment] });

    } catch (error) {
      console.error(error);
      const errorMsg = "❌ Erreur lors de la compression.";
      ctx.editReply ? await ctx.editReply(errorMsg) : await ctx.channel.send(errorMsg);
    }
  }
};