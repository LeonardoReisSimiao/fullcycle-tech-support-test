### Dúvidas conceituais

Abaixo você verá 3 dúvidas conceituais, com suas palavras responda cada uma delas.

> Aconselhamos que utilize a ferramenta [Gist do Github](https://gist.github.com/) para cada resposta.

- 1 - Estou assistindo as aulas sobre o GraphQL e percebi que para obter a categoria de cada curso o sistema executa uma consulta no banco para retornar a categoria vinculada ao curso.

  Se tivéssemos 20 cursos sendo retornados na listagem e pedíssemos a categoria deles, o sistema iria realizar muitas consultas ao banco para retornar a resposta.

  Queria saber qual seria uma saída para evitar esse número de consultas ao banco.

Resposta: https://gist.github.com/LeonardoReisSimiao/ee6a8791c651357e234d6447e3d8993d

- 2 - Fiquei com dúvida de qual seria a melhor forma de fazer, seguindo os princípios de DDD e Clean Arch.

  Por exemplo, em uma entidade Pedidos, onde tenha um relacionamento com Cliente, qual melhor forma de retornar no UseCase de busca (search) dos pedidos os dados de Pedido e Clientes junto.

  Vi alguns exemplos no fórum, onde é feito o find de Pedido e depois o find de Cliente, porém desta forma é executado em transações separadas no banco de dados, isso não seria um problema de performance ? Principalmente neste meu caso onde seria uma listagem, que para cada Pedido teria que buscar qual o cliente relacionado.

Resposta: https://gist.github.com/LeonardoReisSimiao/7a5ef478c1baa1dfbb95baff6ab18bab

- 3 - Aprendemos que no DDD a relação entre agregados é feita apenas pelo seu Id.

  Dessa forma, qual a estratégia para hidratar os dados de um agregado referenciado para disponibilizar para o frontend exibir para o usuário? Para o caso de exibir a lista de itens do pedido com os dados do produto em questão. Por exemplo, cada item com o nome do produto, referência, foto etc?

  Ainda seguindo nesta mesma linha, quando temos uma lista de pedidos a faturar, sendo exibida para o time de logística por exemplo: os pedidos já são carregados com os dados do cliente, seus itens e dados dos produtos? Ainda que os itens não sejam exibidos nesta lista?

  E por último, ainda nessa linha, para fazer reports e dashboards, devemos usar outra estratégia que não passe pelo DDD e aja direto na base de dados para montar os resultados e indicadores?

Resposta: https://gist.github.com/LeonardoReisSimiao/990a8c776cbb5322835a7ea26b51fc09
