const pool = require("../database/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transport = require('../email/index');
const { SECRET, USER_EMAIL } = require("../config/config");

module.exports = {
  cadastraUsuario: async (req, res) => {
    // Recebendo as variáveis "userName", "email", "senha", "confirmaSenha" do body.
    let { userName, email, senha, confirmaSenha, tipo } = req.body;

    // Verificando se todos os campos estão preenchidos
    if (!userName || !email || !senha || !confirmaSenha || !tipo) {
      return res.status(400).json({ message: "Faltam dados." });
    }
    // Verificando a igualdade nos campos "senha" e "confirmaSenha".
    if (senha !== confirmaSenha) {
      return res.status(400).json({ message: "As senhas não são iguais." });
    }
    // Verificando se todos os dados inseridos são do tipo string.
    if (
      typeof userName !== "string" ||
      typeof email !== "string" ||
      typeof senha !== "string" ||
      typeof confirmaSenha !== "string" ||
      typeof tipo !== "string"
    ) {
      return res
        .status(400)
        .json({ message: "Todos os dados devem ser do tipo String." });
    }
    // Verificando se quantidade de caracteres inseridos está entre o mínimo e o máximo pedido.
    if (
      senha.length < 8 ||
      senha.length > 20 ||
      userName.length > 50 ||
      userName.length < 3 ||
      email.length > 255
    ) {
      return res
        .status(400)
        .json({
          message:
            "Quantidade de caracteres errada. (userName): min. 3, max. 50; (email): max. 255; (senha): min. 8, max. 20.",
        });
    }

    try {
      // Verificando se já existe algum usuário com o nome ou email inserido.
      const queryConfereUsuario =
        "SELECT * FROM usuarios WHERE userName = ? OR email = ?";
      const [responseVerifica] = await pool.query(queryConfereUsuario, [
        userName,
        email,
      ]);
      if (responseVerifica.length !== 0) {
        return res
          .status(400)
          .json({ message: "Esse usuário ou email já existe." });
      }

      // Retirando espaços em branco do começo e do fim dos dados
      userName = userName.trim();
      email = email.trim();
      senha = senha.trim();
      tipo = tipo.trim();

      // Gerando o "Salt" do "Hash" da senha.
      const salt = await bcrypt.genSalt(12);
      // Gerando o "Hash" da senha, "Salt" e senha são parâmetros para a função.
      const senhaHash = await bcrypt.hash(senha, salt);

      // Inserindo um novo cadastro na tabela usuários.
      const queryCadastraUsuario =
        "INSERT INTO usuarios (userName, email, senha, tipo) VALUES (?,?,?,?)";
      await pool.query(queryCadastraUsuario, [
        userName,
        email,
        senhaHash,
        tipo
      ]);

      // Resposta ao cliente que seu usuário foi cadastrado.
      res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      // Tratamento de erros durante o "Try"
      console.log(error);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  },
  listarUsuarios: async (req, res) => {
    try {
      const queryListarUsuarios = "SELECT id, userName, email, tipo, ativado FROM usuarios";
      const [response] = pool.query(queryListarUsuarios);
      return res.status(200).json(response);
    } catch(error) {
      console.log(error);
      return res.status(500).json({ message: "Erro no servidor." })
    }
  },
  editarUsuario: async (req, res) => {
    const { tipo, ativado } = req.body;
    const { id } = req.params;
    if (!id || !tipo || !ativado) {
      return res.status(404).json({ message: "Todos os dados devem ser enviados! (id, tipo, ativado)" });
    }
    try {
      const queryEditaUsuario = "UPDATE usuarios SET tipo=?, ativado=? WHERE id=?";
      await pool.query(queryEditaUsuario, [tipo, ativado, id]);
      return res.status(200).json({ message: "Usuário editado com sucesso!" });
    } catch(error) {
      console.log(error);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  },
  excluirUsuario: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "O usuário deve ser informado! (id)" });
    }
    try {
      const queryExcluirUsuario = "DELETE FROM usuarios WHERE id=?";
      await pool.query(queryExcluirUsuario, [id]);
      return res.status(200).json({ message: "Usuário excluido com sucesso!" });
    } catch(error) {
      console.log(error);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  },
  login: async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "Faltam dados." });
    }

    try {
      const queryVerificaUsuario = "SELECT * FROM usuarios WHERE email = ?";
      const [response] = await pool.query(queryVerificaUsuario, [email]);

      if (response.length === 0) {
        return res.status(400).json({ message: "Email ou senha incorretos!" });
      }

      const senhaCorreta = await bcrypt.compare(senha, response[0].senha);

      if (!senhaCorreta) {
        return res.status(401).json({ message: "Email ou senha incorretos!" });
      }

      const token = jwt.sign({ email: response[0].email }, SECRET, {
        expiresIn: "24h",
      });

      const userIsAdmin = response[0].tipo === "admin";

      res.status(200).json({ token, userIsAdmin });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Erro no servidor." });
    }
  },
  esqueciSenha: async (req, res) => {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Um email deve ser enviado!" });
    }

    email = email.trim();

    const queryVerificaEmail = "SELECT * FROM usuarios WHERE email=?";
    try {
      const [response] = await pool.query(queryVerificaEmail, [email]);
      if (response.length !== 1) {
        return res.status(400).json({ message: "Email inválido!" });
      }

      const tokenSenha = jwt.sign({ email: response[0].email }, SECRET, {
        expiresIn: "300s"
      });

      const respEmail = await transport.sendMail({
        from: `Cantina Senai <${USER_EMAIL}>`,
        to: email,
        subject: "Recuperação de senha",
        text: `Olá, para trocar de senha, clique no link -> https://sistema.cantinasenai.com.br/trocar-senha?token=${tokenSenha}`,
      });

      return res.status(200).json(respEmail);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ocorreu um erro inesperado!" });
    }
  },
  trocarSenha: async (req, res) => {
    let { senha, confirmaSenha } = req.body;
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Acesso negado!" });
    }

    if (!senha || !confirmaSenha) {
      return res
        .status(400)
        .json({ message: "Todos os campos devem ser preenchidos!" });
    }
    if (senha !== confirmaSenha) {
      return res.status(400).json({ message: "As senhas não estão iguais!" });
    }
    if (senha.length < 8) {
      return res.status(400).json({ message: "A senha está muito pequena!" });
    }
    if (senha.length > 20) {
      return res.status(400).json({ message: "A senha está muito grande!" });
    }

    senha = senha.trim();
    
    try {
        jwt.verify(token, SECRET);
    } catch (e) {
        return res.status(400).json({ message: "Token inválido! Seu tempo expirou!" })
    }

    const { email } = jwt.decode(token);

    try {
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);

      const queryTrocaSenha = "UPDATE usuarios SET senha=? WHERE email=?";
      await pool.query(queryTrocaSenha, [senhaHash, email]);

      return res.status(200).json({ message: "Senha alterado com sucesso!" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Ocorreu um erro inesperado!" });
    }
  },
  verificaToken: async (req, res) => {
    return res.status(200).json({ message: true });
  },
};