/*
export const AUTH_LOGIN = `SELECT 
                             id,
                             tipo, 
                             status_perfil, 
                             plataforma, 
                             versao,
                             criado_em, 
                             atualizado_em 
                          FROM parciom_app.perfil 
													WHERE codigo = $1 AND senha = crypt($2, senha) AND status_perfil = 'AUTORIZADO'`
export const UPDATE_PERFIL_SENHA = `UPDATE parciom_app.perfil SET senha = $1, hash_senha = $2  WHERE id = $3 RETURNING *`
export const UPDATE_PERFIL_HASH = 'UPDATE parciom_app.perfil SET hash_senha = $1 WHERE id = $2 RETURNING *'
export const SELECT_PERFIL_HASH = 'SELECT * FROM parciom_app.perfil WHERE hash_senha = $1'
export const UPDATE_PERFIL = 'UPDATE parciom_app.perfil SET codigo = $1, senha = $2, tipo = $3, status_perfil = $4, plataforma = $5, versao = $6, versao_app = $7 WHERE id = $8 RETURNING *'
export const SELECT_ESTABELECIMENTO_FISICA = `
select row_to_json(r) as retorno 
FROM (
  SELECT row_to_json(epf.*) as estabelecimento_pessoa_fisica,
         row_to_json(t2.*)  as telefone,
         row_to_json(cp.*)  as conta,
				row_to_json(est.*) as estabelecimento,
         json_build_object('id', p.id,'tipo',p.tipo::tipo_perfil,'conta',p.codigo) as perfil
  FROM estabelecimento_pessoa_fisica epf
  INNER JOIN estabelecimento e ON epf.id_estabelecimento = e.id
  INNER JOIN perfil p ON e.id_perfil = p.id
  inner join conta_pagamento cp on  cp.id_perfil = p.id
  INNER JOIN telefones_estabelecimento t ON e.id = t.id_estabelecimento
  INNER JOIN telefone t2 ON t.id_telefone = t2.id
INNER JOIN estabelecimento est on est.id = epf.id_estabelecimento
  WHERE p.id = $1 and t.ativo = 'ATIVO'
) r;
`
export const SELECT_ESTABELECIMENTO_JURIDICA = `
select row_to_json(r) as retorno 
FROM (
SELECT row_to_json(epj.*) as estabelecimento_pessoa_juridica,
       row_to_json(t2.*)  as telefone,
                row_to_json(cp.*)  as conta,
                row_to_json(est.*) as estabelecimento,
                json_build_object('id', p.id,'tipo',p.tipo::tipo_perfil,'conta',p.codigo) as perfil,
                json_build_object('nome_empresa', e.dados_receita ->> 'nome') as nome_empresa
FROM estabelecimento_pessoa_juridica epj
INNER JOIN estabelecimento e ON epj.id_estabelecimento = e.id
INNER JOIN perfil p ON e.id_perfil = p.id
inner join conta_pagamento cp on  cp.id_perfil = p.id
INNER JOIN telefones_estabelecimento t ON e.id = t.id_estabelecimento
   INNER JOIN telefone t2 ON t.id_telefone = t2.id
   INNER JOIN estabelecimento est on est.id = epj.id_estabelecimento
   WHERE p.id = $1 and t.ativo = 'ATIVO'
) r;
`
export const SELECT_PERFIL_ID = 'SELECT * FROM parciom_app.perfil WHERE id = $1'
export const UPDATE_PERFIL_STATUS = 'UPDATE perfil SET status_perfil = $1 WHERE id = $2'
export const UPDATE_PERFIL_APARELHO = 'UPDATE perfil SET id_aparelho = $1, plataforma = $2 WHERE id = $3 RETURNING *'
export const UPDATE_PERFIL_APARELHO_DESVINCULA = 'UPDATE perfil SET id_aparelho = NULL WHERE id = $1 RETURNING *'
export const AUTH_VALIDACAO_PERFIL = `SELECT 
                             id,
                             tipo, 
                             status_perfil, 
                             plataforma, 
                             versao,
                             criado_em, 
                             atualizado_em 
                          FROM parciom_app.perfil 
                          WHERE codigo = $1 AND senha = crypt($2, senha)`
*/
