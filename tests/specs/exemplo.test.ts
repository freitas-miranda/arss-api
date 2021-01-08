import HelperMensagens from "@helpers/mensagens";
import Exemplo from "@models/exemplo";
import HelperAmbiente from "@tests/helpers/ambiente";
import axios from "axios";
import { expect } from "chai";
import faker from "faker/locale/pt_BR";
import { fn } from "sequelize";

const msg = new HelperMensagens("Exemplo");

describe("Teste no controle 'exemplo'", function () {
  const rotas = [
    { metodo: "post", url: "/salvar" },
    { metodo: "put", url: "/editar" },
    { metodo: "delete", url: "/apagar" }
  ];

  before (async function () {
    this.helperAmbiente = new HelperAmbiente();

    this.requisicao = axios.create({
      baseURL: `${process.env.APP_HOST}:${process.env.APP_PORT}/api/exemplo`
    });
  });

  it("deve falhar devido a requisição não possuir login", async function () {
    for (let i = 0; i < rotas.length; i++) {
      let resposta;

      try {
        resposta = await this.requisicao({
          method: rotas[i].metodo,
          url: rotas[i].url
        });
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(500);
      expect(resposta.data.erro).to.equal(msg.semLogin);
    }
  });

  describe("Requisições", function () {
    describe("Método 'listar'", function () {
      it("deve listar registros", async function () {
        let resposta: any;

        try {
          resposta = await this.requisicao.get("/listar");
        } catch (e) {
          resposta = e.response;
        }

        expect(resposta.status).to.equal(200);
        expect(resposta.data.registros).to.be.an("array");
        expect(resposta.data.model).to.be.an("array");

        if (resposta.data.registros.length > 0) {
          expect(resposta.data.registros[0].id).to.be.a("number");
          expect(resposta.data.registros[0].descricao).to.be.a("string");
          expect(resposta.data.registros[0].statusCodigo).to.be.a("number");
          expect(resposta.data.registros[0].status).to.be.a("string");
        }

        if (resposta.data.model.length > 0) {
          expect(resposta.data.model[0].id).to.be.a("number");
          expect(resposta.data.model[0].descricao).to.be.a("string");
          expect(resposta.data.model[0].status).to.be.a("number");
        }
      });
    });
  });

  describe("Método 'exibir'", function () {
    it("deve falhar por não encontrar registro para exibir", async function () {
      let resposta: any;

      try {
        resposta = await this.requisicao.get("/exibir/0");
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(500);
      expect(resposta.data.erro).to.be.an("string");
      expect(resposta.data.erro).to.equal(msg.naoEncontradoParaExibir);
    });

    it("deve exibir um registro", async function () {
      let resposta: any;

      const reg = await Exemplo.findOne({
        order: fn("RAND")
      });

      if (!reg) {
        this.skip();
      }

      try {
        resposta = await this.requisicao.get(`/exibir/${reg.id}`);
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(200);
      expect(resposta.data.id).to.be.an("number");
      expect(resposta.data.descricao).to.be.an("string");
      expect(resposta.data.statusCodigo).to.be.an("number");
      expect(resposta.data.status).to.be.an("string");
    });
  });

  describe("Método 'salvar'", function () {
    it("deve falhar pois há campos não informados", async function () {
      let resposta: any;

      try {
        resposta = await this.requisicao.post("/salvar", {
          login: "TEST"
        });
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(500);
      expect(resposta.data.erro).to.be.an("object");
      expect(resposta.data.erro).to.have.all.keys(
        "descricao",
        "status"
      );

      Object.keys(resposta.data.erro).map((chave) => {
        expect(resposta.data.erro[chave]).to.be.an("array");
      });
    });

    it("deve salvar um registro com sucesso", async function () {
      let resposta: any;

      try {
        resposta = await this.requisicao.post("/salvar", {
          login: "TEST",
          descricao: faker.random.words(3).toUpperCase(),
          status: faker.random.arrayElement([0, 1])
        });
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(200);
      expect(resposta.data.id).to.be.an("number");
      expect(resposta.data.mensagem).to.be.an("string");
      expect(resposta.data.mensagem).to.equal(msg.sucessoAoSalvar);
    });
  });

  describe("Método 'editar'", function () {
    it("deve falhar por não encontrar registro para editar", async function () {
      let resposta: any;

      try {
        resposta = await this.requisicao.put("/editar", {
          login: "TEST",
          id: 0,
          descricao: faker.random.words(3).toUpperCase(),
          status: faker.random.arrayElement([0, 1])
        });
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(500);
      expect(resposta.data.erro).to.be.an("string");
      expect(resposta.data.erro).to.equal(msg.naoEncontradoParaEditar);
    });

    it("deve falhar pois há campos não informados", async function () {
      let resposta: any;

      try {
        resposta = await this.requisicao.put("/editar", {
          login: "TEST"
        });
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(500);
      expect(resposta.data.erro).to.be.an("object");
      expect(resposta.data.erro).to.have.all.keys(
        "id",
        "descricao",
        "status"
      );

      Object.keys(resposta.data.erro).map((chave) => {
        expect(resposta.data.erro[chave]).to.be.an("array");
      });
    });

    it("deve editar um registro com sucesso", async function () {
      let resposta: any;

      const reg = await Exemplo.findOne({
        order: fn("RAND")
      });

      if (!reg) {
        this.skip();
      }

      try {
        resposta = await this.requisicao.put("/editar", {
          login: "TEST",
          id: reg.id,
          descricao: faker.random.words(3).toUpperCase(),
          status: faker.random.arrayElement([0, 1])
        });
      } catch (e) {
        resposta = e.response;
        console.log(resposta);
      }

      expect(resposta.status).to.equal(200);
      expect(resposta.data.id).to.be.an("number");
      expect(resposta.data.mensagem).to.be.an("string");
      expect(resposta.data.mensagem).to.equal(msg.sucessoAoEditar);
    });
  });

  describe("Método 'apagar'", function () {
    it("deve falhar por não encontrar registro para excluir", async function () {
      let resposta: any;

      try {
        resposta = await this.requisicao.delete("/apagar/0", {
          data: {
            login: "TEST"
          }
        });
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(500);
      expect(resposta.data.erro).to.be.an("string");
      expect(resposta.data.erro).to.equal(msg.naoEncontradoParaApagar);
    });

    it("deve excluir um registro com sucesso", async function () {
      let resposta: any;

      const reg = await Exemplo.findOne({
        order: fn("RAND")
      });

      if (!reg) {
        this.skip();
      }

      try {
        resposta = await this.requisicao.delete(`/apagar/${reg.id}`, {
          data: {
            login: "TEST"
          }
        });
      } catch (e) {
        resposta = e.response;
      }

      expect(resposta.status).to.equal(200);
      expect(resposta.data.id).to.be.an("number");
      expect(resposta.data.mensagem).to.be.an("string");
      expect(resposta.data.mensagem).to.equal(msg.sucessoAoApagar);
    });
  });
});
