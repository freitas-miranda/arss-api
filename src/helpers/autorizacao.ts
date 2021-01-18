import server from "@config/server";
import pathtoRegexp from "path-to-regexp";
import { QueryTypes } from "sequelize";

class HelperAutorizacao {
  private conexao: any;

  constructor () {
    this.conexao = server.database.connection();
  }

  // Verifica se a url está cadastrada para o perfil do usuário. Método utilizado
  // como middleware para verificar o acesso do usuário a determinadas rotas do sistema.
  async possuiAcessoUrl (usuario: string, urlBase: string, url: string): Promise<boolean> {
    const query = ` SELECT rota.id,
                           rota.descricao,
                           rota.icone,
                           rota.url,
                           rota.nivel,
                           rota.pai
                      FROM rota
                     INNER
                      JOIN perfil_rota
                        ON perfil_rota.deleted_at IS NULL
                       AND perfil_rota.rota_id = rota.id
                     INNER
                      JOIN perfil
                        ON perfil.deleted_at IS NULL
                       AND perfil.id = perfil_rota.perfil_id
                     INNER
                      JOIN usuario_perfil
                        ON usuario_perfil.deleted_at IS NULL
                       AND usuario_perfil.perfil_id = perfil.id
                       AND usuario_perfil.usuario_id = :usuario
                     WHERE rota.deleted_at IS NULL
                       AND rota.tipo = :tipo
                       AND rota.url LIKE :url
                     GROUP
                        BY rota.id,
                           rota.descricao,
                           rota.icone,
                           rota.url,
                           rota.nivel,
                           rota.pai`;

    const menus = await this.conexao.query(query, {
      replacements: {
        usuario: usuario,
        tipo: 4, // Rota do tipo requisição.
        url: urlBase + "%"
      },
      type: QueryTypes.SELECT
    });

    if (menus.length === 0) return false;
    else {
      return menus.find((menu: any) => {
        const regex = pathtoRegexp(menu.url);

        return !!regex.exec(urlBase + url);
      });
    }
  }

  async usuarioAutorizado (_autenticacao: any, _rotina: number): Promise<any> {
    return true;
  }
}

export default HelperAutorizacao;
