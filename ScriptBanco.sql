create extension if not exists "pgcrypto";
alter extension pgcrypto set schema public;

CREATE table usuario(
  id SERIAL not NULL,
  nome VARCHAR(255) NULL,
  email VARCHAR(100) NULL,
  senha VARCHAR(255) NULL,
  criado_em timestamp default NULL,
  device_token VARCHAR(255) NULL,
  PRIMARY KEY (id));
 
 insert into usuario(nome, email, senha, criado_em) values ('Paulo Weber', 'paulloweber@gmail.com', crypt('senha','senha'), current_date)
 insert into usuario(nome, email, senha, criado_em) values ('Alexandre Ferris', 'alexandreferris@gmail.com', crypt('senha','senha'), current_date)

 CREATE TABLE categoria(
  id SERIAL NOT null,
  descricao VARCHAR(50) NOT NULL,
  PRIMARY KEY (id));

 insert into categoria(descricao) values ('Casa')
 insert into categoria(descricao) values ('Saúde')
 insert into categoria(descricao) values ('Lazer')
 
 CREATE TABLE IF NOT EXISTS conta (
  id SERIAL NOT null,
  descricao VARCHAR(255) not NULL,
  valor_pagamento FLOAT null default 0.00,
  fixa BOOLEAN not NULL,
  quantidade_parcelas INT not null default 0,
  id_usuario INT NOT null references usuario(id),
  dia_cobranca INT not NULL,
  id_categoria INT NOT null references categoria(id),
  valor_variavel BOOLEAN not NULL,
  ativo BOOLEAN null default true,
  PRIMARY KEY (id));
  
 CREATE TABLE situacao_conta (
  id SERIAL NOT null,
  descricao VARCHAR(255) NOT NULL,
  PRIMARY KEY (id));
  
insert into situacao_conta (descricao) values ('PAGO');
insert into situacao_conta (descricao) values ('CANCELADO');
insert into situacao_conta (descricao) values ('PENDENTE');

 CREATE table historico_conta (
  id SERIAL NOT null,
  numero_parcela INT default 0,
  criado_em TIMESTAMP NULL,
  conta_id INT NOT NULL,
  data_vencimento DATE NULL,
  id_situacao INT NOT null references situacao_conta(id),
  valor_pago FLOAT null,
  data_pagamento DATE NULL,
  PRIMARY KEY (id))
  