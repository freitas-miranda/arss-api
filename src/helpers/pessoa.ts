import Helper from "@base/helper";
import Email from "@models/email";
import Endereco from "@models/endereco";
import PessoaEmail from "@models/pessoa_email";
import PessoaEndereco from "@models/pessoa_endereco";
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
    };
  }

  private async emailAtual (pessoaEmailId: any): Promise<any> {
    return this.dbOperacoes.selectRow(`
      SELECT pessoa_email.id as relacionamentoId
           , pessoa_email.email_id as emailId
           , pessoa_email.pessoa_id as pessoaId
           , email.email
        FROM pessoa_email
       INNER JOIN email
          ON email.deleted_at IS NULL
         AND email.id = pessoa_email.email_id
       WHERE pessoa_email.id = :pessoaEmailId;
    `, {
      replacements: {
        pessoaEmailId: pessoaEmailId,
    }});
  }

  async atualizarEmail (email: any): Promise<any> {
    if (!email.email) return;

    // Se já possui email cadastrado
    if (email.pessoaEmailId) {
      const emailAtual = await this.emailAtual(email.pessoaEmailId);

      // Sem alteração no email!
      if (emailAtual.email == email.email) return;

      // Remover relacionamento antigo
      const relacionamentoAntigo = await PessoaEmail.findByPk(emailAtual.relacionamentoId);
      await relacionamentoAntigo.destroy({ transaction: this.tr });

      // Remover email antigo
      const emailAntigo = await Email.findByPk(emailAtual.emailId);
      await emailAntigo.destroy({ transaction: this.tr });
    }

    // Registrar um novo email
    const emailNovo = await Email.create({
      email: email.email
    }, { transaction: this.tr });

    // Relacionar o novo email
    const relacionamentoNovo =  await PessoaEmail.create({
      pessoaId: this.pessoaId,
      emailId: emailNovo.id
    }, { transaction: this.tr });

    return {
      emailId: emailNovo.id,
      pessoaEmailId: relacionamentoNovo.id
    };
  }

  private async enderecoAtual (pessoaEnderecoId: any): Promise<any> {
    return this.dbOperacoes.selectRow(`
      SELECT pessoa_endereco.id as relacionamentoId
           , pessoa_endereco.endereco_id as enderecoId
           , pessoa_endereco.pessoa_id as pessoaId
           , endereco.logradouro
           , endereco.numero
           , endereco.bairro
           , endereco.cep
           , endereco.cidade
           , endereco.uf
        FROM pessoa_endereco
       INNER JOIN endereco
          ON endereco.deleted_at IS NULL
         AND endereco.id = pessoa_endereco.endereco_id
       WHERE pessoa_endereco.id = :pessoaEnderecoId;
    `, {
      replacements: {
        pessoaEnderecoId: pessoaEnderecoId,
    }});
  }

  async atualizarEndereco (endereco: any): Promise<any> {
    if (!endereco.logradouro) return;

    // Se já possui endereco cadastrado
    if (endereco.pessoaEnderecoId) {
      const enderecoAtual = await this.enderecoAtual(endereco.pessoaEnderecoId);

      // Sem alteração no endereco!
      if (enderecoAtual.logradouro == endereco.logradouro &&
          enderecoAtual.numero == endereco.numero &&
          enderecoAtual.bairro == endereco.bairro &&
          enderecoAtual.cep == endereco.cep &&
          enderecoAtual.cidade == endereco.cidade &&
          enderecoAtual.uf == endereco.uf) return;

      // Remover relacionamento antigo
      const relacionamentoAntigo = await PessoaEndereco.findByPk(enderecoAtual.relacionamentoId);
      await relacionamentoAntigo.destroy({ transaction: this.tr });

      // Remover endereco antigo
      const enderecoAntigo = await Endereco.findByPk(enderecoAtual.enderecoId);
      await enderecoAntigo.destroy({ transaction: this.tr });
    }

    // Registrar um novo endereco
    const enderecoNovo = await Endereco.create({
      logradouro: endereco.logradouro,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cep: endereco.cep,
      cidade: endereco.cidade,
      uf: endereco.uf
    }, { transaction: this.tr });

    // Relacionar o novo endereco
    const relacionamentoNovo =  await PessoaEndereco.create({
      pessoaId: this.pessoaId,
      enderecoId: enderecoNovo.id
    }, { transaction: this.tr });

    return {
      enderecoId: enderecoNovo.id,
      pessoaEnderecoId: relacionamentoNovo.id
    };
  }

}

export default HelperPessoa;
