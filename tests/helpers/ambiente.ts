class HelperAmbiente {
  private bancos: string[];
  private usuariosDev: string[];

  constructor () {
    this.bancos = [
      "40.114.117.247"
    ];

    this.usuariosDev = [
      "dev"
    ];
  }

  ambienteProducao () {
    if (process.env.NODE_ENV === "production") {
      console.warn("Variável de ambiente NODE_ENV configurada para produção.");
      return true;
    }

    return false;
  }

  bancoLocalEmProducao () {
    const ip = this.bancos.find(banco => {
      return (banco === process.env.DB_HOST);
    });

    const usuarioDev = this.usuariosDev.find(usuario => {
      return (process.env.DB_USERNAME === usuario);
    });

    if (ip) console.warn("Base de dados em produção.");
    if (!usuarioDev) console.warn("Usuário da base de dados em produção.");

    return (ip || (!usuarioDev));
  }

  emProducao () {
    return (this.ambienteProducao() || this.bancoLocalEmProducao());
  }
}

 export default HelperAmbiente;
