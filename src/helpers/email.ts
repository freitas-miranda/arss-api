import fs from "fs";
import nodemailer from "nodemailer";
import path from "path";

class HelperEmail {

  async enviar (email: string, assunto: string, template: string) {
    try {
      const transportador = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const opcoes = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: assunto,
        html: template,
        attachments: [{
          filename: "logo.png",
          path: `data:image/png;base64,${fs.readFileSync(path.join(path.resolve("./"), "/src/assets/logo.png")).toString("base64")}`,
          cid: "logoSuperior"
        }]
      };

      await transportador.sendMail(opcoes);
    } catch (error) {
      throw new Error("Falha ao enviar o e-mail!");
    }
  }
}

export default HelperEmail;
