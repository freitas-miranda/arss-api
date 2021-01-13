export default (nome: string, link: string) => {
  return `
  <!DOCTYPE html> <html lang="pt-br">

  <head>
      <meta name="viewport" content="width=device-width">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Confirmação de E-mail</title>
      <style>
          @media only screen and (max-width: 620px) {
              table[class=body] h1 {
                  font-size: 28px !important;
                  margin-bottom: 10px !important;
              }
              table[class=body] p,
              table[class=body] ul,
              table[class=body] ol,
              table[class=body] td,
              table[class=body] span,
              table[class=body] a {
                  font-size: 16px !important;
              }
              table[class=body] .wrapper,
              table[class=body] .article {
                  padding: 10px !important;
              }
              table[class=body] .content {
                  padding: 0 !important;
              }
              table[class=body] .container {
                  padding: 0 !important;
                  width: 100% !important;
              }
              table[class=body] .main {
                  border-left-width: 0 !important;
                  border-radius: 0 !important;
                  border-right-width: 0 !important;
              }
              table[class=body] .btn table {
                  width: 100% !important;
              }
              table[class=body] .btn a {
                  width: 100% !important;
              }
              table[class=body] .img-responsive {
                  height: auto !important;
                  max-width: 100% !important;
                  width: auto !important;
              }
          }

          @media all {
              .ExternalClass {
                  width: 100%;
              }
              .ExternalClass,
              .ExternalClass p,
              .ExternalClass span,
              .ExternalClass font,
              .ExternalClass td,
              .ExternalClass div {
                  line-height: 100%;
              }
              .apple-link a {
                  color: inherit !important;
                  font-family: inherit !important;
                  font-size: inherit !important;
                  font-weight: inherit !important;
                  line-height: inherit !important;
                  text-decoration: none !important;
              }
              #MessageViewBody a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-family: inherit;
                  font-weight: inherit;
                  line-height: inherit;
              }
              .btn-primary table td:hover {
                  opacity: 0.6 !important;
              }
              .btn-primary a:hover {
                  opacity: 0.6 !important;
                  opacity: 0.6 !important;
              }
          }
      </style>
  </head>

  <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; width: 100%;" width="100%" bgcolor="#f6f6f6">
          <tr>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
              <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto;" width="580" valign="top">
                  <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
                      <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">
                          <tr>
                              <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px; padding-bottom: 0px;" valign="top">
                                  <div class="logo" style="margin-bottom: 30px; text-align: center;">
                                      <img class="logo-imagem" draggable="false" src="cid:logoSuperior" style="border: none; -ms-interpolation-mode: bicubic; max-width: 200px; height: 100px;" height="100">
                                  </div>
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                                      <tr>
                                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px; text-align: center;">Olá ${nome},</p>
                                              <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px; text-align: center;">Para completar o seu cadastro clique no botão abaixo.</p>
                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; margin-bottom: 10px; margin-top: 20px; width: 100%;" width="100%">
                                                  <tbody>
                                                      <tr>
                                                          <td align="center" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                                  <tbody>
                                                                      <tr>
                                                                          <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #66ACB7;" valign="top" align="center" bgcolor="#66ACB7"> <a href="${link}" target="_blank" style="border: solid 1px #66ACB7; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #66ACB7; border-color: #66ACB7; color: #ffffff;">Confirmar Cadastro</a> </td>
                                                                      </tr>
                                                                  </tbody>
                                                              </table>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>

                                          </td>
                                      </tr>
                                  </table>
                                  <div class="duvidas" style="text-align: center;">
                                      <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Caso possua dúvidas, entre em contato respondendo este e-mail.</p>
                                  </div>
                              </td>
                          </tr>
                      </table>

                      <div class="footer" style="clear: both; margin-top: 10px; width: 100%; text-align: center;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                              <tr>
                                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;" valign="top" align="center">
                                      <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;"><a href="https://www.arss.link/">ARSS - AR Sistema de Saúde</a></span>
                                  </td>
                              </tr>
                          </table>
                      </div>
                  </div>
              </td>
              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
          </tr>
      </table>
  </body>
  </html>`;
};
