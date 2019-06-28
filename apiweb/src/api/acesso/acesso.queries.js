export const BUSCA_INFORMACOES_ESTABELECIMENTO_POR_ID = `
SELECT row_to_json(r) AS retorno 
FROM (
  SELECT
  	json_build_object(
  		'id', coalesce(epf.id_estabelecimento, epj.id_estabelecimento),
  		'data_nascimento', coalesce(epf.data_nascimento, epj.data_nascimento),
  		'sexo', coalesce(epf.sexo, epj.sexo),
  		'cpf_formatado', coalesce(f_formata_cpf(epf.cpf), f_formata_cpf(epj.cpf_socio)),
  		'email', coalesce(epf.email, epj.email),
  		'nome', coalesce(epf.nome, epj.nome_socio),
  		'nome_mae', coalesce(epf.nome_mae, epj.nome_mae)
  	) AS estabelecimento,
  	json_build_object(
	  	'ddi', t.ddi,
	  	'ddd', t.ddd,
	  	'numero', t.numero
  	) AS telefone,
  	json_build_object(
  		'bairro', endd.bairro,
  		'cep', endd.cep,
  		'complemento', endd.complemento,
  		'logradouro', endd.logradouro,
  		'numero', endd.numero,
  		'cidade', loc.nome,
  		'uf', locUf.sigla
  	) AS endereco
  FROM estabelecimento e
	LEFT JOIN estabelecimento_pessoa_fisica epf ON epf.id_estabelecimento = e.id
	LEFT JOIN estabelecimento_pessoa_juridica epj ON epj.id_estabelecimento = e.id
	INNER JOIN telefones_estabelecimento te ON te.id_estabelecimento = e.id AND te.ativo = 'ATIVO'
	INNER JOIN telefone t ON t.id = te.id_telefone
	INNER JOIN enderecos_estabelecimento ee ON ee.id_estabelecimento = e.id
  INNER JOIN endereco endd ON endd.id = ee.id_endereco
  INNER JOIN localidade loc ON loc.id = endd.localidade
  INNER JOIN uf locUf ON locUf.id = loc.id_uf
	WHERE e.id = $1
) r;`
export const UPDATE_PERFIL_CADASTRADO_ACESSO = `UPDATE perfil SET acesso_cadastro = 'SIM' WHERE id = (SELECT id_perfil FROM estabelecimento WHERE id = $1)`
export const INSERT_LOG_ERRO_RETORNO_ACESSO = `INSERT INTO acesso_logs (id_estabelecimento, result_code, json_retorno, tipo_erro) VALUES ($1, $2, $3, $4)`
export const BUSCA_DADOS_SOLICITAR_CARTAO_IDENTIFICADO_DO_ESTABELECIMENTO_POR_ID = `
	SELECT
		COALESCE(f_formata_cpf(epf.cpf), f_formata_cpf(epj.cpf_socio)) as cpf,
		e.tipo
	FROM estabelecimento e
	LEFT JOIN estabelecimento_pessoa_fisica epf ON epf.id_estabelecimento = e.id
	LEFT JOIN estabelecimento_pessoa_juridica epj ON epj.id_estabelecimento = e.id
	WHERE e.id = $1
`
export const BUSCA_TAXA_CARTAO_SOLICITADO = `
SELECT f_verifica_forma_pagamento_taxa_solicitacao_cartao($1) AS tipo_taxa
`
export const BUSCA_ACESSO_CADASTRO_PERFIL = `
SELECT acesso_cadastro FROM perfil WHERE id = $1
`
