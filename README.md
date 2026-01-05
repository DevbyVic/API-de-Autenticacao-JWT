API-de-Autenticacao-JWT
Sistema de autenticação JWT feito em node.js, express.js e mongoDB;

O fluxo de autorização com JWT
OS JSON Web Tokens tem um fluxo simples e que é constituído de algumas etapas, iniciando na autenticação

Usuário é autenticado no sistema;
É enviado um JSON Web Token para o usuário;
A cada requisição o token deve ser enviado também;
O token é validado, e se for válido o usuário obtém a resposta protegida por autorização;
Os passos 4 e 5 se repetem n vezes, até o usuário para de usar o sistema;
