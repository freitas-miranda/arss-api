import Helper from "@base/helper";
import PessoaTelefone from "@models/pessoa_telefone";
import Telefone from "@models/telefone";

class HelperPessoa extends Helper {
  private pessoaId: number;
  private tr: any;

  constructor (pessoaId: number, transaction: any) {
    super ();
    this.pessoaId = pessoaId;
    this.tr = transaction;
  }

  private async telefoneAtual (pessoaTelefoneId: any): Promise<any> {
    return this.dbOperacoes.selectRow(`
      SELECT pessoa_telefone.id as relacionamentoId
           , pessoa_telefone.telefone_id as telefoneId
           , pessoa_telefone.pessoa_id as pessoaId
           , CONCAT(telefone.ddd, telefone.numero) as numero
           , telefone.tipo
        FROM pessoa_telefone
       INNER JOIN telefone
          ON telefone.deleted_at IS NULL
         AND telefone.id = pessoa_telefone.telefone_id
       WHERE pessoa_telefone.id = :pessoaTelefoneId;
    `, {
      replacements: {
        pessoaTelefoneId: pessoaTelefoneId,
    }});
  }

  async atualizarTelefone (telefone: any): Promise<any> {
    if (!telefone.numero) return;

    // Se já possui telefone cadastrado
    if (telefone.pessoaTelefoneId) {
      const telefoneAtual = await this.telefoneAtual(telefone.pessoaTelefoneId);

      // Sem alteração no telefone!
      if (telefoneAtual.numero == telefone.numero &&
          telefoneAtual.tipo == telefone.tipo) return;

      // Remover relacionamento antigo
      const relacionamentoAntigo = await PessoaTelefone.findByPk(telefoneAtual.relacionamentoId);
      await relacionamentoAntigo.destroy({ transaction: this.tr });

      // Remover telefone antigo
      const telefoneAntigo = await Telefone.findByPk(telefoneAtual.telefoneId);
      await telefoneAntigo.destroy({ transaction: this.tr });
    }

    // Registrar um novo telefone
    const telefoneNovo = await Telefone.create({
      ddd: telefone.numero.slice(0, 2),
      numero: telefone.numero.slice(2),
      tipo: telefone.tipo
    }, { transaction: this.tr });

    // Relacionar o novo telefone
    const relacionamentoNovo =  await PessoaTelefone.create({
      pessoaId: this.pessoaId,
      telefoneId: telefoneNovo.id
    }, { transaction: this.tr });

    return {
      telefoneId: telefoneNovo.id,
      pessoaTelefoneId: relacionamentoNovo.id
    }

  }
}

export default HelperPessoa;
